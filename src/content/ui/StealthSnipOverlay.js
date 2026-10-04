class StealthSnipOverlay {
  constructor() {
    this.isActive = false;
    this.overlay = null;
  }

  stop() {
    this.isActive = false;
    if (this.overlay) {
      try { this.overlay.remove(); } catch (e) {}
      this.overlay = null;
    }
    try {
      const leftovers = document.querySelectorAll('#__qa_stealth_snip_overlay');
      leftovers.forEach(el => el.remove());
    } catch (e) {}
  }

  start() {
    if (this.isActive) {
      this.stop();
      return;
    }

    this.isActive = true;
    StealthToastNotifier.show('Đã bật chế độ chụp: Kéo chuột chọn câu hỏi (ESC để hủy)', 'info', 2500);

    this.overlay = document.createElement('div');
    this.overlay.id = '__qa_stealth_snip_overlay';
    this.overlay.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      background: transparent !important;
      cursor: inherit !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      outline: none !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      pointer-events: auto !important;
    `;

    let isMouseDown = false;
    let startX = 0;
    let startY = 0;

    const onKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
        return;
      }
      if (e.altKey && (e.key === 'y' || e.key === 'Y' || e.code === 'KeyY')) {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
        return;
      }
    };

    const onMouseDown = (e) => {
      if (e.button !== 0 && e.button !== 2) {
        cleanup();
        return;
      }
      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const onContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseUp = (e) => {
      if (!isMouseDown) {
        cleanup();
        return;
      }
      isMouseDown = false;
      const endX = e.clientX;
      const endY = e.clientY;
      e.preventDefault();
      e.stopPropagation();

      const minX = Math.min(startX, endX);
      const maxX = Math.max(startX, endX);
      const minY = Math.min(startY, endY);
      const maxY = Math.max(startY, endY);

      const width = maxX - minX;
      const height = maxY - minY;

      cleanup();

      if (width < 10 || height < 10) return;

      try {
        const centerEl = document.elementFromPoint(minX + width / 2, minY + height / 2);
        window.__qaLastSnippedCard = centerEl ? centerEl.closest('.que, .yh-question-card, [class*="question-card"], [data-qa-id], [id^="question-"], [id^="q-"], tr, li, div') : null;
      } catch (err) {
        window.__qaLastSnippedCard = null;
      }

      const dpr = window.devicePixelRatio || 1;
      const cropRect = {
        x: Math.round(minX * dpr),
        y: Math.round(minY * dpr),
        width: Math.round(width * dpr),
        height: Math.round(height * dpr)
      };

      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        StealthToastNotifier.show('AI Vision đang giải ảnh đã chụp...', 'info', 3000);
        const action = globalThis.MessageActions?.TRIGGER_CROP_CAPTURE_SOLVE || 'TRIGGER_CROP_CAPTURE_SOLVE';
        chrome.runtime.sendMessage({
          action: action,
          rect: cropRect
        });
      }
    };

    const cleanup = () => {
      window.removeEventListener('keydown', onKeyDown, true);
      if (this.overlay) {
        this.overlay.removeEventListener('mousedown', onMouseDown, true);
        this.overlay.removeEventListener('mousemove', onMouseMove, true);
        this.overlay.removeEventListener('mouseup', onMouseUp, true);
        this.overlay.removeEventListener('contextmenu', onContextMenu, true);
      }
      this.stop();
    };

    window.addEventListener('keydown', onKeyDown, true);
    this.overlay.addEventListener('mousedown', onMouseDown, true);
    this.overlay.addEventListener('mousemove', onMouseMove, true);
    this.overlay.addEventListener('mouseup', onMouseUp, true);
    this.overlay.addEventListener('contextmenu', onContextMenu, true);

    (document.fullscreenElement || document.body || document.documentElement).appendChild(this.overlay);
  }
}

globalThis.StealthSnipOverlay = StealthSnipOverlay;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StealthSnipOverlay };
}
