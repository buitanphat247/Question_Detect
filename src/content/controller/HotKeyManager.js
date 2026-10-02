class HotKeyManager {
  constructor({ onSingleSolve, onContinuousSolve, onStartSnip, onStop, onQuickCapture } = {}) {
    this.onSingleSolve = onSingleSolve || (() => {});
    this.onContinuousSolve = onContinuousSolve || (() => {});
    this.onStartSnip = onStartSnip || (() => {});
    this.onStop = onStop || (() => {});
    this.onQuickCapture = onQuickCapture || (() => {});
  }

  register() {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e) => {
      const isEsc = e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27;
      if (isEsc) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        this.onStop();
        return;
      }

      const target = e.target;
      const isTyping = target && (
        (target.tagName === 'INPUT' && !['radio', 'checkbox', 'button', 'submit', 'image', 'reset'].includes((target.type || '').toLowerCase())) ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.getAttribute?.('contenteditable') === 'true'
      );

      // Phím N (hoặc Alt+H): Giải câu đơn lẻ
      const isKeyN = (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'n' || e.key === 'N' || e.code === 'KeyN') && !isTyping);
      const isAltH = (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'h' || e.key === 'H' || e.code === 'KeyH' || e.key === 'n' || e.key === 'N' || e.code === 'KeyN'));
      if (isKeyN || isAltH) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        this.onSingleSolve();
        return;
      }

      // Alt+K: Tự động giải liên tiếp
      const isAltK = (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK'));
      if (isAltK) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        this.onContinuousSolve();
        return;
      }

      // Phím M: Chụp màn hình và upload nhanh Supabase Storage
      const isKeyM = (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'm' || e.key === 'M' || e.code === 'KeyM') && !isTyping);
      if (isKeyM) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        this.onQuickCapture();
        return;
      }

      // Phím Y hoặc Alt+Y: Cắt vùng ảnh chọn để giải AI Vision
      const isKeyY = (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'y' || e.key === 'Y' || e.code === 'KeyY') && !isTyping);
      const isAltY = (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'y' || e.key === 'Y' || e.code === 'KeyY'));
      if (isKeyY || isAltY) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation?.();
        this.onStartSnip();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true, passive: false });
  }
}

globalThis.HotKeyManager = HotKeyManager;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HotKeyManager };
}
