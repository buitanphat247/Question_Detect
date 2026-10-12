(function registerModelConfig(scope) {
  const DEFAULT_API_KEY = '';
  const DEFAULT_MODEL = 'gemini-3.7-flash';
  const CONSENSUS_MODEL = 'gemini-3.7-flash';
  const DETECT_MODEL = 'gemini-3.7-flash';
  const CONSENSUS_MODELS = [
    'gemini-3.7-flash',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite'
  ];
  const CONSENSUS_MAX_RETRIES = 2;
  const CONSENSUS_ROUND_TIMEOUT_MS = 90000;
  const ANSWER_NORMALIZATION_VERSION = '2';
  const CACHE_KEY_VERSION = '2';

  const BACKUP_MODELS = [
    'gemini-3.7-flash'
  ];
  const BACKUP_MODEL = BACKUP_MODELS[0];

  const KEY4U_SINGLE_SOLVE_TIMEOUT_MS = 30000;
  const KEY4U_REASONING_TIMEOUT_MS = 75000;
  const KEY4U_TEXT_TIMEOUT_MS = 120000;
  const KEY4U_VISION_TIMEOUT_MS = 150000;

  const ModelConfig = Object.freeze({
    DEFAULT_API_KEY,
    DEFAULT_MODEL,
    CONSENSUS_MODEL,
    DETECT_MODEL,
    CONSENSUS_MODELS,
    CONSENSUS_MAX_RETRIES,
    CONSENSUS_ROUND_TIMEOUT_MS,
    ANSWER_NORMALIZATION_VERSION,
    CACHE_KEY_VERSION,
    BACKUP_MODELS,
    BACKUP_MODEL,
    KEY4U_SINGLE_SOLVE_TIMEOUT_MS,
    KEY4U_REASONING_TIMEOUT_MS,
    KEY4U_TEXT_TIMEOUT_MS,
    KEY4U_VISION_TIMEOUT_MS
  });

  scope.ModelConfig = ModelConfig;
  scope.DEFAULT_API_KEY = DEFAULT_API_KEY;
  scope.DEFAULT_MODEL = DEFAULT_MODEL;
  scope.CONSENSUS_MODEL = CONSENSUS_MODEL;
  scope.DETECT_MODEL = DETECT_MODEL;
  scope.CONSENSUS_MODELS = CONSENSUS_MODELS;
  scope.CONSENSUS_MAX_RETRIES = CONSENSUS_MAX_RETRIES;
  scope.CONSENSUS_ROUND_TIMEOUT_MS = CONSENSUS_ROUND_TIMEOUT_MS;
  scope.ANSWER_NORMALIZATION_VERSION = ANSWER_NORMALIZATION_VERSION;
  scope.CACHE_KEY_VERSION = CACHE_KEY_VERSION;
  scope.BACKUP_MODELS = BACKUP_MODELS;
  scope.BACKUP_MODEL = BACKUP_MODEL;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModelConfig;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
