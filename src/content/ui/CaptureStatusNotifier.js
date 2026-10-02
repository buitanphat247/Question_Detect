class CaptureStatusNotifier {
  notify(result) {
    const message = this.getMessage(result);
    if (!message || typeof document === 'undefined') return;

    const previous = document.getElementById('qa-capture-status');
    if (previous) previous.remove();

    const toast = document.createElement('div');
    toast.id = 'qa-capture-status';
    toast.setAttribute('role', 'status');
    toast.textContent = message.text;
    Object.assign(toast.style, {
      position: 'fixed', right: '16px', bottom: '16px', zIndex: '2147483647',
      maxWidth: 'min(360px, calc(100vw - 32px))', padding: '10px 12px', borderRadius: '6px',
      color: '#ffffff', background: message.type === 'success' ? '#157347' : '#9f1239',
      font: '14px/1.35 system-ui, sans-serif', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.22)'
    });
    document.documentElement.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  getMessage(result) {
    if (result?.success) return { type: 'success', text: 'Screenshot uploaded successfully.' };
    if (result?.reason === 'in_progress') return { type: 'error', text: 'A screenshot upload is already in progress.' };
    if (result?.reason === 'image_too_large') return { type: 'error', text: 'Screenshot is larger than the configured upload limit.' };
    if (result?.reason === 'disabled') return { type: 'error', text: 'Screenshot upload is disabled in configuration.' };
    if (result?.error === 'upload_timeout') return { type: 'error', text: 'Screenshot upload timed out.' };
    if (result?.status === 401 || result?.status === 403) return { type: 'error', text: 'Storage rejected the upload. Check Supabase policy.' };
    if (result?.status === 404) return { type: 'error', text: 'Screenshot bucket was not found.' };
    return { type: 'error', text: 'Screenshot capture or upload failed.' };
  }
}

globalThis.CaptureStatusNotifier = CaptureStatusNotifier;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CaptureStatusNotifier };
}
