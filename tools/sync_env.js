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
  const rootDir = path.resolve(__dirname, '..');
  const envPath = path.join(rootDir, '.env');
  const configPath = path.join(rootDir, 'src', 'config', 'runtime-config.js');

  if (!fs.existsSync(envPath)) {
    console.log('Không tìm thấy file .env, giữ nguyên runtime config mặc định.');
    return;
  }

  const envVars = parseEnv(fs.readFileSync(envPath, 'utf8'));

  const enableReasoning = envVars.ENABLE_REASONING ? envVars.ENABLE_REASONING.toLowerCase() === 'true' : true;
  const reasoningEffort = envVars.REASONING_EFFORT || 'high';
  const enableSupabase = envVars.ENABLE_SUPABASE_CACHE ? envVars.ENABLE_SUPABASE_CACHE.toLowerCase() === 'true' : true;
  const supabaseUrl = envVars.SUPABASE_URL || 'https://aacpvpfkqhwlltwjjiag.supabase.co';
  const supabaseAnonKey = envVars.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM';
  const enableScreenshotUpload = envVars.ENABLE_SCREENSHOT_UPLOAD ? envVars.ENABLE_SCREENSHOT_UPLOAD.toLowerCase() === 'true' : true;
  const screenshotUploadBucket = envVars.SCREENSHOT_UPLOAD_BUCKET || 'screenshots';
  const screenshotUploadMaxBytes = Number(envVars.SCREENSHOT_UPLOAD_MAX_BYTES) || 6000000;
  const defaultModel = envVars.DEFAULT_MODEL || 'gemini-3.7-flash';
  const consensusModel = envVars.CONSENSUS_MODEL || 'gemini-3.7-flash';
  const detectModel = envVars.DETECT_MODEL || 'gemini-3.7-flash';
  // API keys must stay in extension storage, never in generated source/bundles.
  const apiKey = '';

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

(function () {
  var config = {
    // 1. REASONING / SUY LUẬN SÂU
    ENABLE_REASONING: ${enableReasoning},            // true = BẬT suy luận sâu, false = TẮT
    REASONING_EFFORT: '${reasoningEffort}',          // 'high' | 'medium' | 'low'

    // 2. SUPABASE CACHE / NGÂN HÀNG CÂU HỎI
    ENABLE_SUPABASE_CACHE: ${enableSupabase},       // true = BẬT cache Supabase, false = TẮT
    SUPABASE_URL: '${supabaseUrl}',
    SUPABASE_ANON_KEY: '${supabaseAnonKey}',

    ENABLE_SCREENSHOT_UPLOAD: ${enableScreenshotUpload},
    SCREENSHOT_UPLOAD_BUCKET: '${screenshotUploadBucket}',
    SCREENSHOT_UPLOAD_MAX_BYTES: ${screenshotUploadMaxBytes},

    // 3. AI MODELS & API KEY
    DEFAULT_MODEL: '${defaultModel}',
    CONSENSUS_MODEL: '${consensusModel}',
    DETECT_MODEL: '${detectModel}',
    KEY4U_API_KEY: '${apiKey}'
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
`;

  fs.writeFileSync(configPath, newConfigContent, 'utf8');
  console.log('Đã đồng bộ cấu hình từ .env sang src/config/runtime-config.js:');
  console.log(`   - ENABLE_REASONING: ${enableReasoning} (effort: ${reasoningEffort})`);
  console.log(`   - ENABLE_SUPABASE_CACHE: ${enableSupabase}`);
  console.log(`   - ENABLE_SCREENSHOT_UPLOAD: ${enableScreenshotUpload}`);
  console.log(`   - DEFAULT_MODEL: ${defaultModel}`);
  console.log(`   - CONSENSUS_MODEL: ${consensusModel}`);
}

sync();
