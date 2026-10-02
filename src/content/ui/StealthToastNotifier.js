class StealthToastNotifier {
  // Keep the notification API available without injecting a bottom-corner popup.
  static show() {
    return undefined;
  }
}

globalThis.StealthToastNotifier = StealthToastNotifier;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StealthToastNotifier };
}
