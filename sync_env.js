const fs = require('fs');
const path = require('path');

function parseEnv(envContent) {
  const result = {};
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      result[key] = val;
    }
  }
  return result;
}

function sync() {
  const envPath = path.resolve(__dirname, '.env');
  const configPath = path.resolve(__dirname, 'config.js');

  if (!fs.existsSync(envPath)) {
    console.log('Không tìm thấy file .env, giữ nguyên config.js mặc định.');
    return;
  }

  const envVars = parseEnv(fs.readFileSync(envPath, 'utf8'));

  const enableReasoning = envVars.ENABLE_REASONING ? envVars.ENABLE_REASONING.toLowerCase() === 'true' : true;
  const reasoningEffort = envVars.REASONING_EFFORT || 'high';
  const enableSupabase = envVars.ENABLE_SUPABASE_CACHE ? envVars.ENABLE_SUPABASE_CACHE.toLowerCase() === 'true' : true;
  const supabaseUrl = envVars.SUPABASE_URL || 'https://aacpvpfkqhwlltwjjiag.supabase.co';
  const supabaseAnonKey = envVars.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM';
  const defaultModel = envVars.DEFAULT_MODEL || 'claude-opus-4-8';
  const consensusModel = envVars.CONSENSUS_MODEL || 'gemini-3.5-flash';
  const detectModel = envVars.DETECT_MODEL || 'gemini-3.5-flash';
  const apiKey = envVars.KEY4U_API_KEY || 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5';

  const enableHumanDelay = envVars.ENABLE_HUMAN_DELAY ? envVars.ENABLE_HUMAN_DELAY.toLowerCase() === 'true' : true;
  const humanDelayMsPerWord = parseInt(envVars.HUMAN_DELAY_MS_PER_WORD || '50', 10);
  const humanDelayMinMs = parseInt(envVars.HUMAN_DELAY_MIN_MS || '2800', 10);
  const humanDelayMaxMs = parseInt(envVars.HUMAN_DELAY_MAX_MS || '15000', 10);

  const newConfigContent = `// SILENT STEALTH MODE: Vô hiệu hóa toàn bộ console để DevTools luôn sạch sẽ 100%
if (typeof console !== 'undefined') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.error = () => {};
}

// =========================================================================
// CONFIGURATION SYSTEM (ĐỒNG BỘ TỰ ĐỘNG TỪ .ENV)
// Tự động sinh bởi sync_env.js vào lúc: ${new Date().toLocaleString('vi-VN')}
// =========================================================================

var APP_CONFIG = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG) ? APP_CONFIG : {
  // 1. REASONING / SUY LUẬN SÂU
  ENABLE_REASONING: ${enableReasoning},            // true = BẬT suy luận sâu, false = TẮT
  REASONING_EFFORT: '${reasoningEffort}',          // 'high' | 'medium' | 'low'

  // 2. SUPABASE CACHE / NGÂN HÀNG CÂU HỎI
  ENABLE_SUPABASE_CACHE: ${enableSupabase},       // true = BẬT cache Supabase, false = TẮT
  SUPABASE_URL: '${supabaseUrl}',
  SUPABASE_ANON_KEY: '${supabaseAnonKey}',

  // 3. AI MODELS & API KEY
  DEFAULT_MODEL: '${defaultModel}',
  CONSENSUS_MODEL: '${consensusModel}',
  DETECT_MODEL: '${detectModel}',
  KEY4U_API_KEY: '${apiKey}',

  // 4. HUMAN-LIKE READING DEBOUNCE / CHỐNG CHỌN QUÁ NHANH
  ENABLE_HUMAN_DELAY: ${enableHumanDelay},          // true = BẬT độ trễ đọc tự nhiên theo số chữ, false = TẮT
  HUMAN_DELAY_MS_PER_WORD: ${humanDelayMsPerWord},       // ~50ms mỗi từ (Mô phỏng đọc & suy ngẫm thực tế)
  HUMAN_DELAY_MIN_MS: ${humanDelayMinMs},          // Độ trễ tối thiểu (2.8s cho câu ngắn)
  HUMAN_DELAY_MAX_MS: ${humanDelayMaxMs}           // Độ trễ tối đa (15.0s cho bài đọc dài)
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
`;

  fs.writeFileSync(configPath, newConfigContent, 'utf8');
  console.log('✅ Đã đồng bộ cấu hình từ .env sang config.js:');
  console.log(`   - ENABLE_REASONING: ${enableReasoning} (effort: ${reasoningEffort})`);
  console.log(`   - ENABLE_SUPABASE_CACHE: ${enableSupabase}`);
  console.log(`   - ENABLE_HUMAN_DELAY: ${enableHumanDelay} (${humanDelayMsPerWord}ms/word, min: ${humanDelayMinMs}ms, max: ${humanDelayMaxMs}ms)`);
  console.log(`   - DEFAULT_MODEL: ${defaultModel}`);
  console.log(`   - CONSENSUS_MODEL: ${consensusModel}`);
}

sync();

