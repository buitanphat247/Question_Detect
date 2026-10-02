class QuickCaptureController {
  constructor({ notifier, action } = {}) {
    this.notifier = notifier;
    this.action = action || (globalThis.MessageActions?.TRIGGER_QUICK_CAPTURE_UPLOAD || 'TRIGGER_M_CAPTURE_UPLOAD');
  }

  trigger() {
    try {
      chrome.runtime.sendMessage({ action: this.action }, response => {
        const result = chrome.runtime.lastError
          ? { success: false, error: chrome.runtime.lastError.message }
          : response;
        this.notifier?.notify(result);
      });
    } catch (error) {
      this.notifier?.notify({ success: false, error: error?.message || 'message_failed' });
    }
  }
}

globalThis.QuickCaptureController = QuickCaptureController;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuickCaptureController };
}
