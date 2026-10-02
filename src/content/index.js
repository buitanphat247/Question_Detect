/**
 * Q&A Detector & AI Auto Solver - Content Script Entry Point
 * Tự động quét và giải đề thi trắc nghiệm bằng AI đa model và auto-click trên web.
 */

(function initContentApp() {
  if (globalThis.__qaContentAppInitialized) return;
  globalThis.__qaContentAppInitialized = true;

  // SILENT STEALTH MODE: Vô hiệu hóa toàn bộ console trong content script để DevTools luôn sạch sẽ 100%
  if (typeof console !== 'undefined') {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.error = () => {};
  }

  // Khởi tạo các thành phần
  const snipOverlay = new StealthSnipOverlay();
  const solverEngine = new ConsensusSolverEngine({
    primaryModel: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.DEFAULT_MODEL) || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash'),
    consensusModel: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.CONSENSUS_MODEL) || (typeof CONSENSUS_MODEL !== 'undefined' ? CONSENSUS_MODEL : 'gemini-3.7-flash'),
    defaultApiKey: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.KEY4U_API_KEY) || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '')
  });

  const solveRunner = new ContinuousSolveRunner({
    solverEngine: solverEngine,
    onAutoAdvance: () => {
      MoodleNavigationHandler.clickNextPageButton();
    }
  });

  const quickCapture = new QuickCaptureController({
    notifier: new CaptureStatusNotifier(),
    action: globalThis.MessageActions?.TRIGGER_QUICK_CAPTURE_UPLOAD || 'TRIGGER_M_CAPTURE_UPLOAD'
  });

  // Đăng ký phím tắt toàn cục
  const hotKeyManager = new HotKeyManager({
    onSingleSolve: () => solveRunner.solveSingle(),
    onContinuousSolve: () => solveRunner.solveContinuous(),
    onStartSnip: () => snipOverlay.start(),
    onStop: () => {
      solveRunner.stop();
      snipOverlay.stop();
    },
    onQuickCapture: () => quickCapture.trigger()
  });
  hotKeyManager.register();

  // Lắng nghe Message từ Background Service Worker & Popup
  if (typeof chrome !== 'undefined' && chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const actions = globalThis.MessageActions || {};

      if (request.action === (actions.SCAN_QUESTIONS || 'SCAN_QUESTIONS')) {
        try {
          const results = ExamDomScanner.scanAll() || [];
          sendResponse({
            success: true,
            data: results,
            count: results.length,
            stats: ExamDomScanner.buildExtractionStats(results),
            url: window.location.href
          });
        } catch (err) {
          sendResponse({ success: false, error: err.message });
        }
      } else if (request.action === (actions.AUTO_SELECT_ANSWER || 'AUTO_SELECT_ANSWER')) {
        const ok = DomAnswerClicker.autoSelectAnswerOnPage(request.qaId, request.key, request.optionText);
        sendResponse({ success: ok });
      } else if (request.action === (actions.TRIGGER_SINGLE_SOLVE || 'TRIGGER_SINGLE_SOLVE')) {
        solveRunner.solveSingle();
        sendResponse({ success: true });
      } else if (request.action === (actions.TRIGGER_CONTINUOUS_SOLVE || 'TRIGGER_CONTINUOUS_SOLVE') || request.action === (actions.TRIGGER_AUTO_SOLVE || 'TRIGGER_AUTO_SOLVE')) {
        solveRunner.solveContinuous();
        sendResponse({ success: true });
      } else if (request.action === (actions.STOP_AUTO_SOLVE || 'STOP_AUTO_SOLVE')) {
        solveRunner.stop();
        snipOverlay.stop();
        sendResponse({ success: true });
      } else if (request.action === (actions.START_STEALTH_SNIP || 'START_STEALTH_SNIP')) {
        snipOverlay.start();
        sendResponse({ success: true });
      } else if (request.action === (actions.APPLY_CAPTURE_SOLVE_RESULTS || 'APPLY_CAPTURE_SOLVE_RESULTS')) {
        DomAnswerClicker.applyCaptureSolveResults(request.data);
        sendResponse({ success: true });
      }
      return true;
    });
  }

  // Tự động phục hồi khi gặp trang lỗi Moodle
  MoodleNavigationHandler.handleMoodleErrorPageAutoRecover();

  // Tự động giải tiếp nếu đang bật chế độ Auto Advance
  if (solveRunner.isAutoAdvanceEnabled()) {
    setTimeout(() => {
      if (!solveRunner.isSolvingProcess) {
        solveRunner.solveContinuous();
      }
    }, 900);
  }
})();
