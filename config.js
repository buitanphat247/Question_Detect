// SILENT STEALTH MODE: Vô hiệu hóa toàn bộ console để DevTools luôn sạch sẽ 100%
if (typeof console !== 'undefined') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.error = () => {};
}

// =========================================================================
// CONFIGURATION SYSTEM (ĐỒNG BỘ TỰ ĐỘNG TỪ .ENV)
// Tự động sinh bởi sync_env.js vào lúc: 21:42:06 10/9/2026
// =========================================================================

const APP_CONFIG = {
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
  KEY4U_API_KEY: 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5'
};

function isReasoningEnabled() {
  return APP_CONFIG.ENABLE_REASONING !== false;
}

function getReasoningEffort() {
  return APP_CONFIG.REASONING_EFFORT || 'high';
}

function isSupabaseCacheEnabled() {
  return APP_CONFIG.ENABLE_SUPABASE_CACHE === true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG,
    isReasoningEnabled,
    getReasoningEffort,
    isSupabaseCacheEnabled
  };
}

if (typeof globalThis !== 'undefined') {
  globalThis.APP_CONFIG = APP_CONFIG;
  globalThis.isReasoningEnabled = isReasoningEnabled;
  globalThis.getReasoningEffort = getReasoningEffort;
  globalThis.isSupabaseCacheEnabled = isSupabaseCacheEnabled;
}
