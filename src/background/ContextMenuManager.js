class ContextMenuManager {
  constructor({ onTriggerAction } = {}) {
    this.onTriggerAction = onTriggerAction || (() => {});
  }

  setupMenus() {
    if (typeof chrome === 'undefined' || !chrome.contextMenus) return;
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'qa-menu-root',
        title: 'Language Translate',
        contexts: ['all']
      });
      chrome.contextMenus.create({
        parentId: 'qa-menu-root',
        id: 'qa-capture-solve',
        title: 'Dịch vùng ảnh chọn (Phím Y)',
        contexts: ['all']
      });
      chrome.contextMenus.create({
        parentId: 'qa-menu-root',
        id: 'qa-solve-single',
        title: 'Dịch đoạn văn bản này (Phím N)',
        contexts: ['all']
      });
      chrome.contextMenus.create({
        parentId: 'qa-menu-root',
        id: 'qa-solve-continuous',
        title: 'Tự động dịch toàn bộ trang (Alt + K)',
        contexts: ['all']
      });
    });
  }

  registerListeners() {
    if (typeof chrome === 'undefined' || !chrome.contextMenus) return;
    chrome.runtime?.onInstalled?.addListener(() => this.setupMenus());
    chrome.runtime?.onStartup?.addListener(() => this.setupMenus());
    this.setupMenus();

    chrome.contextMenus.onClicked.addListener(async (info, tab) => {
      if (!tab || !tab.id) return;
      if (info.menuItemId === 'qa-capture-solve') {
        this.onTriggerAction(tab, 'START_STEALTH_SNIP');
      } else if (info.menuItemId === 'qa-solve-single') {
        this.onTriggerAction(tab, 'TRIGGER_SINGLE_SOLVE');
      } else if (info.menuItemId === 'qa-solve-continuous') {
        this.onTriggerAction(tab, 'TRIGGER_CONTINUOUS_SOLVE');
      }
    });
  }
}

globalThis.ContextMenuManager = ContextMenuManager;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContextMenuManager };
}
