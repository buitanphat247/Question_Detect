class StealthToastNotifier {
  static show(message, type = 'info', duration = 2200) {
    if (typeof document === 'undefined') return;

    const existing = document.getElementById('qa-stealth-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'qa-stealth-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;

    const bg = type === 'success' ? 'rgba(21, 115, 71, 0.92)' :
               type === 'error' ? 'rgba(159, 18, 57, 0.92)' :
               'rgba(15, 23, 42, 0.88)';

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '2147483647',
      maxWidth: 'min(380px, calc(100vw - 40px))',
      padding: '8px 14px',
      borderRadius: '8px',
      color: '#ffffff',
      background: bg,
      font: '13px/1.4 system-ui, -apple-system, sans-serif',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      backdropFilter: 'blur(4px)',
      pointerEvents: 'none',
      transition: 'opacity 0.25s ease'
    });

    (document.fullscreenElement || document.body || document.documentElement).appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }
}

globalThis.StealthToastNotifier = StealthToastNotifier;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StealthToastNotifier };
}
