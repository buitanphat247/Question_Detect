// SILENT STEALTH MODE: Vô hiệu hóa toàn bộ console để DevTools luôn sạch sẽ 100%
if (typeof console !== 'undefined') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.error = () => {};
}

// =========================================================================
// CONFIGURATION SYSTEM (ĐỒNG BỘ TỰ ĐỘNG TỪ .ENV)
// Tự động sinh bởi sync_env.js vào lúc: 08:49:44 2/10/2026
// =========================================================================

(function () {
  var config = {
    // 1. REASONING / SUY LUẬN SÂU
    ENABLE_REASONING: true,            // true = BẬT suy luận sâu, false = TẮT
    REASONING_EFFORT: 'high',          // 'high' | 'medium' | 'low'

    // 2. SUPABASE CACHE / NGÂN HÀNG CÂU HỎI
    ENABLE_SUPABASE_CACHE: false,       // true = BẬT cache Supabase, false = TẮT
    SUPABASE_URL: 'https://aacpvpfkqhwlltwjjiag.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM',

    ENABLE_SCREENSHOT_UPLOAD: true,
    SCREENSHOT_UPLOAD_BUCKET: 'screenshots',
    SCREENSHOT_UPLOAD_MAX_BYTES: 6000000,

    // 3. AI MODELS & API KEY
    DEFAULT_MODEL: 'claude-opus-4-8',
    CONSENSUS_MODEL: 'gemini-3.5-flash',
    DETECT_MODEL: 'gemini-3.5-flash',
    KEY4U_API_KEY: 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5'
  };

  var reasoningHelper = function () {
    return (typeof globalThis.APP_CONFIG !== 'undefined' && globalThis.APP_CONFIG.ENABLE_REASONING !== false);
  };

  var effortHelper = function () {
    return (typeof globalThis.APP_CONFIG !== 'undefined' && globalThis.APP_CONFIG.REASONING_EFFORT) || 'high';
  };

  var cacheHelper = function () {
    return (typeof globalThis.APP_CONFIG !== 'undefined' && globalThis.APP_CONFIG.ENABLE_SUPABASE_CACHE === true);
  };

  if (typeof globalThis !== 'undefined') {
    globalThis.APP_CONFIG = config;
    globalThis.isReasoningEnabled = reasoningHelper;
    globalThis.getReasoningEffort = effortHelper;
    globalThis.isSupabaseCacheEnabled = cacheHelper;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      APP_CONFIG: config,
      isReasoningEnabled: reasoningHelper,
      getReasoningEffort: effortHelper,
      isSupabaseCacheEnabled: cacheHelper
    };
  }
})();

var APP_CONFIG = (typeof globalThis !== 'undefined') ? globalThis.APP_CONFIG : undefined;
var isReasoningEnabled = (typeof globalThis !== 'undefined') ? globalThis.isReasoningEnabled : undefined;
var getReasoningEffort = (typeof globalThis !== 'undefined') ? globalThis.getReasoningEffort : undefined;
var isSupabaseCacheEnabled = (typeof globalThis !== 'undefined') ? globalThis.isSupabaseCacheEnabled : undefined;
