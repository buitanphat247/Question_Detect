(function registerMessageActions(scope) {
  scope.MessageActions = Object.freeze({
    // Quick capture & Supabase storage
    TRIGGER_QUICK_CAPTURE_UPLOAD: 'TRIGGER_M_CAPTURE_UPLOAD',
    
    // Stealth snip & AI Vision solve
    START_STEALTH_SNIP: 'START_STEALTH_SNIP',
    TRIGGER_CROP_CAPTURE_SOLVE: 'TRIGGER_CROP_CAPTURE_SOLVE',
    TRIGGER_CAPTURE_SOLVE: 'TRIGGER_CAPTURE_SOLVE',
    APPLY_CAPTURE_SOLVE_RESULTS: 'APPLY_CAPTURE_SOLVE_RESULTS',

    // Solving triggers
    TRIGGER_SINGLE_SOLVE: 'TRIGGER_SINGLE_SOLVE',
    TRIGGER_CONTINUOUS_SOLVE: 'TRIGGER_CONTINUOUS_SOLVE',
    TRIGGER_AUTO_SOLVE: 'TRIGGER_AUTO_SOLVE',
    STOP_AUTO_SOLVE: 'STOP_AUTO_SOLVE',

    // Scanning & selection
    SCAN_QUESTIONS: 'SCAN_QUESTIONS',
    AUTO_SELECT_ANSWER: 'AUTO_SELECT_ANSWER',
    HIGHLIGHT_QUESTION: 'HIGHLIGHT_QUESTION',
    CLEAR_HIGHLIGHT: 'CLEAR_HIGHLIGHT',

    // Supabase cache & Key4U AI
    CHECK_SUPABASE_BATCH: 'CHECK_SUPABASE_BATCH',
    SAVE_SUPABASE_CACHE: 'SAVE_SUPABASE_CACHE',
    CALL_KEY4U_AI: 'CALL_KEY4U_AI'
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MessageActions: scope.MessageActions };
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
