class ScreenshotUploadService {
  constructor({ getConfig, getSupabaseConfig, timeoutMs = 15000 } = {}) {
    this.getConfig = getConfig || (() => ({}));
    this.getSupabaseConfig = getSupabaseConfig || (() => ({}));
    this.timeoutMs = timeoutMs;
    this.isInProgress = false;
  }

  async captureAndUpload(tabId) {
    const config = this.getConfig();
    if (config.ENABLE_SCREENSHOT_UPLOAD !== true) return { skipped: true, reason: 'disabled' };
    if (this.isInProgress) return { skipped: true, reason: 'in_progress' };

    this.isInProgress = true;
    try {
      const dataUrl = await this.captureVisibleTab(tabId);
      if (!dataUrl) return { success: false, error: 'capture_failed' };

      const imageBlob = await (await fetch(dataUrl)).blob();
      const maxBytes = Number(config.SCREENSHOT_UPLOAD_MAX_BYTES) || 6000000;
      if (!imageBlob.size || imageBlob.size > maxBytes) {
        return { skipped: true, reason: 'image_too_large', size: imageBlob.size, maxBytes };
      }
      return await this.upload(imageBlob, config);
    } catch (error) {
      return { success: false, error: error?.name === 'AbortError' ? 'upload_timeout' : (error?.message || 'upload_failed') };
    } finally {
      this.isInProgress = false;
    }
  }

  async captureVisibleTab(tabId) {
    const tab = tabId ? await chrome.tabs.get(tabId).catch(() => null) : null;
    const windowId = tab?.windowId || null;
    return new Promise(resolve => {
      chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg', quality: 90 }, image => {
        resolve(chrome.runtime.lastError ? null : image || null);
      });
    });
  }

  async upload(imageBlob, config) {
    const supabase = this.getSupabaseConfig();
    if (!supabase.URL || !supabase.ANON_KEY) return { success: false, error: 'storage_not_configured' };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const bucket = config.SCREENSHOT_UPLOAD_BUCKET || 'screenshots';
      const filePath = this.createFilePath();
      const response = await fetch(`${supabase.URL}/storage/v1/object/${encodeURIComponent(bucket)}/${filePath}`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          apikey: supabase.ANON_KEY,
          Authorization: `Bearer ${supabase.ANON_KEY}`,
          'Content-Type': imageBlob.type || 'image/jpeg',
          'x-upsert': 'false'
        },
        body: imageBlob
      });
      if (!response.ok) {
        return { success: false, status: response.status, error: (await response.text()).slice(0, 300) };
      }
      return { success: true, filePath, size: imageBlob.size };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  createFilePath() {
    const objectId = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return `captures/${new Date().toISOString().slice(0, 10)}/${objectId}.jpg`;
  }
}

globalThis.ScreenshotUploadService = ScreenshotUploadService;
