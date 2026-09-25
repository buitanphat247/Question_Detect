// SILENT STEALTH MODE: Vô hiệu hóa toàn bộ console để DevTools luôn sạch sẽ 100%
if (typeof console !== 'undefined') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.error = () => {};
}

// =========================================================================
// CONFIGURATION SYSTEM (ĐỒNG BỘ TỰ ĐỘNG TỪ .ENV)
// Tự động sinh bởi sync_env.js vào lúc: 15:12:57 25/9/2026
// =========================================================================

var APP_CONFIG = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG) ? APP_CONFIG : {
  // 1. REASONING / SUY LUẬN SÂU
  ENABLE_REASONING: true,            // true = BẬT suy luận sâu, false = TẮT
  REASONING_EFFORT: 'high',          // 'high' | 'medium' | 'low'

  // 2. SUPABASE CACHE / NGÂN HÀNG CÂU HỎI
  ENABLE_SUPABASE_CACHE: false,       // true = BẬT cache Supabase, false = TẮT
  SUPABASE_URL: 'https://aacpvpfkqhwlltwjjiag.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM',

  // 3. AI MODELS & API KEY
  DEFAULT_MODEL: 'claude-opus-4-8',
  CONSENSUS_MODEL: 'gemini-3.5-flash',
  DETECT_MODEL: 'gemini-3.5-flash',
  KEY4U_API_KEY: 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5',

  // 4. HUMAN-LIKE READING DEBOUNCE / CHỐNG CHỌN QUÁ NHANH
  ENABLE_HUMAN_DELAY: true,          // true = BẬT độ trễ đọc tự nhiên theo số chữ, false = TẮT
  HUMAN_DELAY_MS_PER_WORD: 50,       // ~50ms mỗi từ (Mô phỏng đọc & suy ngẫm thực tế)
  HUMAN_DELAY_MIN_MS: 2800,          // Độ trễ tối thiểu (2.8s cho câu ngắn)
  HUMAN_DELAY_MAX_MS: 15000           // Độ trễ tối đa (15.0s cho bài đọc dài)
};

var isReasoningEnabled = (typeof isReasoningEnabled === 'function') ? isReasoningEnabled : function () {
  return typeof APP_CONFIG !== 'undefined' && APP_CONFIG.ENABLE_REASONING !== false;
};

var getReasoningEffort = (typeof getReasoningEffort === 'function') ? getReasoningEffort : function () {
  return (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.REASONING_EFFORT) || 'high';
};

var isSupabaseCacheEnabled = (typeof isSupabaseCacheEnabled === 'function') ? isSupabaseCacheEnabled : function () {
  return typeof APP_CONFIG !== 'undefined' && APP_CONFIG.ENABLE_SUPABASE_CACHE === true;
};

var isHumanDelayEnabled = (typeof isHumanDelayEnabled === 'function') ? isHumanDelayEnabled : function () {
  return typeof APP_CONFIG !== 'undefined' && APP_CONFIG.ENABLE_HUMAN_DELAY !== false;
};

var getHumanDelaySettings = (typeof getHumanDelaySettings === 'function') ? getHumanDelaySettings : function () {
  return {
    enabled: typeof APP_CONFIG !== 'undefined' ? APP_CONFIG.ENABLE_HUMAN_DELAY !== false : true,
    msPerWord: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.HUMAN_DELAY_MS_PER_WORD) || 25,
    minMs: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.HUMAN_DELAY_MIN_MS) || 1200,
    maxMs: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.HUMAN_DELAY_MAX_MS) || 6000
  };
};

if (typeof globalThis !== 'undefined') {
  globalThis.APP_CONFIG = APP_CONFIG;
  globalThis.isReasoningEnabled = isReasoningEnabled;
  globalThis.getReasoningEffort = getReasoningEffort;
  globalThis.isSupabaseCacheEnabled = isSupabaseCacheEnabled;
  globalThis.isHumanDelayEnabled = isHumanDelayEnabled;
  globalThis.getHumanDelaySettings = getHumanDelaySettings;
}

if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
  window.isReasoningEnabled = isReasoningEnabled;
  window.getReasoningEffort = getReasoningEffort;
  window.isSupabaseCacheEnabled = isSupabaseCacheEnabled;
  window.isHumanDelayEnabled = isHumanDelayEnabled;
  window.getHumanDelaySettings = getHumanDelaySettings;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG,
    isReasoningEnabled,
    getReasoningEffort,
    isSupabaseCacheEnabled,
    isHumanDelayEnabled,
    getHumanDelaySettings
  };
}
