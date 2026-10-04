// SILENT STEALTH MODE: Vô hiệu hóa toàn bộ console để DevTools luôn sạch sẽ 100%
if (typeof console !== 'undefined') {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.error = () => {};
}

try {
  importScripts(
    '../config/runtime-config.js',
    '../shared/MessageActions.js',
    '../shared/AiPrompts.js',
    '../shared/ModelConfig.js',
    'SupabaseCacheService.js',
    'Key4uApiClient.js',
    'ScreenshotUploadService.js',
    'StealthCaptureSolver.js',
    'ContextMenuManager.js'
  );
} catch (e) {}

const CONTENT_SCRIPT_FILES = [
  'src/config/runtime-config.js',
  'src/shared/MessageActions.js',
  'src/shared/AiPrompts.js',
  'src/shared/ModelConfig.js',
  'src/content/core/TextUtils.js',
  'src/content/core/DomMediaExtractor.js',
  'src/content/scanner/MoodleScanner.js',
  'src/content/scanner/QuizCardScanner.js',
  'src/content/scanner/AnchorBasedScanner.js',
  'src/content/scanner/GenericDomScanner.js',
  'src/content/scanner/ExamDomScanner.js',
  'src/content/clicker/DomAnswerClicker.js',
  'src/content/solver/ConsensusSolverEngine.js',
  'src/content/solver/ContinuousSolveRunner.js',
  'src/content/ui/CaptureStatusNotifier.js',
  'src/content/ui/StealthToastNotifier.js',
  'src/content/ui/StealthSnipOverlay.js',
  'src/content/navigation/MoodleNavigationHandler.js',
  'src/content/controller/QuickCaptureController.js',
  'src/content/controller/HotKeyManager.js',
  'src/content/index.js'
];

// Khởi tạo các Service
const cacheService = new SupabaseCacheService({
  getConfig: () => (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {}),
  getSupabaseConfig: () => {
    const cfg = typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {};
    return {
      URL: cfg.SUPABASE_URL || 'https://aacpvpfkqhwlltwjjiag.supabase.co',
      ANON_KEY: cfg.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM'
    };
  }
});

const apiClient = new Key4uApiClient({
  defaultApiKey: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.KEY4U_API_KEY) || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : ''),
  defaultModel: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.DEFAULT_MODEL) || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash'),
  backupModels: typeof BACKUP_MODELS !== 'undefined' ? BACKUP_MODELS : ['gemini-3.7-flash']
});

const quickCaptureService = new ScreenshotUploadService({
  getConfig: () => (typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {}),
  getSupabaseConfig: () => ({
    URL: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.SUPABASE_URL) || 'https://aacpvpfkqhwlltwjjiag.supabase.co',
    ANON_KEY: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhY3B2cGZrcWh3bGx0d2pqaWFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzU4MTMsImV4cCI6MjEwNDYxMTgxM30.RUNkB2a4_Ji2rAHbqbBOMmmDDo_j8hDl7dmXKj1IooM'
  })
});

const captureSolver = new StealthCaptureSolver({
  apiClient: apiClient,
  defaultModel: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.DEFAULT_MODEL) || 'gemini-3.7-flash',
  consensusModel: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.CONSENSUS_MODEL) || 'gemini-3.7-flash',
  defaultApiKey: (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.KEY4U_API_KEY) || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : ''),
  contentScriptFiles: CONTENT_SCRIPT_FILES
});

async function sendTriggerAutoSolve(tabId, url, action = 'TRIGGER_CONTINUOUS_SOLVE') {
  if (!tabId) return;
  if (url && (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('chrome-extension://'))) {
    return;
  }
  chrome.tabs.sendMessage(tabId, { action: action }, async () => {
    if (chrome.runtime.lastError) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId, allFrames: false },
          files: CONTENT_SCRIPT_FILES
        });
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: action }, () => {});
        }, 100);
      } catch (injectErr) {}
    }
  });
}

function ensureDefaultSettings() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
  chrome.storage.local.get(['key4uApiKey', 'key4uModel', 'autoSelectWeb', 'enableReasoning', 'reasoningEffort', 'enableSupabaseCache'], (res) => {
    const updates = {};
    const cfg = typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {};
    if (!res.key4uApiKey) {
      updates.key4uApiKey = cfg.KEY4U_API_KEY || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '');
    }
    const desiredModel = cfg.DEFAULT_MODEL || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    if (res.key4uModel !== desiredModel) {
      updates.key4uModel = desiredModel;
    }
    if (typeof res.autoSelectWeb === 'undefined') {
      updates.autoSelectWeb = true;
    }
    const desiredReasoning = typeof cfg.ENABLE_REASONING !== 'undefined' ? cfg.ENABLE_REASONING : true;
    if (res.enableReasoning !== desiredReasoning) {
      updates.enableReasoning = desiredReasoning;
    }
    const desiredEffort = cfg.REASONING_EFFORT || 'high';
    if (res.reasoningEffort !== desiredEffort) {
      updates.reasoningEffort = desiredEffort;
    }
    const desiredCache = typeof cfg.ENABLE_SUPABASE_CACHE !== 'undefined' ? cfg.ENABLE_SUPABASE_CACHE : false;
    if (res.enableSupabaseCache !== desiredCache) {
      updates.enableSupabaseCache = desiredCache;
    }
    if (Object.keys(updates).length > 0) {
      chrome.storage.local.set(updates);
    }
  });
}

// Khởi tạo Context Menus
const contextMenuManager = new ContextMenuManager({
  onTriggerAction: (tab, action) => {
    if (action === 'START_STEALTH_SNIP') {
      chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, async () => {
        if (chrome.runtime.lastError) {
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: CONTENT_SCRIPT_FILES
            });
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, () => {});
            }, 100);
          } catch (e) {}
        }
      });
    } else {
      sendTriggerAutoSolve(tab.id, tab.url, action);
    }
  }
});
contextMenuManager.registerListeners();

// Runtime Event Listeners
if (typeof chrome !== 'undefined') {
  if (chrome.runtime?.onInstalled) {
    chrome.runtime.onInstalled.addListener(async () => {
      ensureDefaultSettings();
      try {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && !tab.url.startsWith('about:') && !tab.url.startsWith('chrome-extension://')) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: CONTENT_SCRIPT_FILES
            }).catch(() => {});
          }
        }
      } catch (e) {}
    });
  }

  if (chrome.runtime?.onStartup) {
    chrome.runtime.onStartup.addListener(() => ensureDefaultSettings());
  }

  ensureDefaultSettings();

  if (chrome.action?.onClicked) {
    chrome.action.onClicked.addListener(async (tab) => {
      if (tab && tab.id && tab.url) {
        sendTriggerAutoSolve(tab.id, tab.url, 'TRIGGER_SINGLE_SOLVE');
      }
    });
  }

  if (chrome.commands?.onCommand) {
    chrome.commands.onCommand.addListener(async (command) => {
      if (command === 'solve-single-question' || command === 'solve-all-questions') {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab && tab.id && tab.url) {
            sendTriggerAutoSolve(tab.id, tab.url, 'TRIGGER_SINGLE_SOLVE');
          }
        } catch (err) {}
      } else if (command === 'solve-continuous') {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab && tab.id && tab.url) {
            sendTriggerAutoSolve(tab.id, tab.url, 'TRIGGER_CONTINUOUS_SOLVE');
          }
        } catch (err) {}
      } else if (command === 'capture-and-solve') {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab && tab.id) {
            chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, async () => {
              if (chrome.runtime.lastError) {
                try {
                  await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: CONTENT_SCRIPT_FILES
                  });
                  setTimeout(() => {
                    chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, () => {});
                  }, 100);
                } catch (e) {}
              }
            });
          }
        } catch (err) {}
      }
    });
  }

  if (chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const actions = globalThis.MessageActions || {};
      
      if (request.action === (actions.CHECK_SUPABASE_BATCH || 'CHECK_SUPABASE_BATCH')) {
        cacheService.getCachedQuestionsBatch(request.hashes)
          .then(cacheMap => sendResponse({ success: true, data: cacheMap }))
          .catch(err => sendResponse({ success: false, data: {}, error: err.message }));
        return true;
      } else if (request.action === (actions.SAVE_SUPABASE_CACHE || 'SAVE_SUPABASE_CACHE')) {
        cacheService.saveQuestionToCache(request.hash, request.questionText, request.translatedText, request.answer);
        sendResponse({ success: true });
        return true;
      } else if (request.action === (actions.CALL_KEY4U_AI || 'CALL_KEY4U_AI')) {
        chrome.storage.local.get(['key4uApiKey'], stored => {
          const apiKey = request.apiKey || stored?.key4uApiKey || '';
          if (!apiKey) return sendResponse({ success: false, error: 'KEY4U_API_KEY_MISSING' });
          apiClient.solve({
            task: request.task || 'solve',
            prompt: request.prompt,
            model: request.model,
            apiKey,
            imageUrl: request.imageUrl,
            systemPrompt: request.systemPrompt,
            enableReasoning: request.enableReasoning,
            reasoningEffort: request.reasoningEffort
          })
            .then(res => sendResponse({ success: true, data: res }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        });
        return true;
      } else if (request.action === (actions.TRIGGER_QUICK_CAPTURE_UPLOAD || 'TRIGGER_M_CAPTURE_UPLOAD')) {
        quickCaptureService.captureAndUpload(sender?.tab?.id)
          .then(result => sendResponse(result))
          .catch(err => sendResponse({ success: false, error: err.message }));
        return true;
      } else if (request.action === (actions.TRIGGER_CROP_CAPTURE_SOLVE || 'TRIGGER_CROP_CAPTURE_SOLVE')) {
        captureSolver.handleCaptureAndSolve(sender?.tab?.id, request.rect);
        sendResponse({ success: true });
        return true;
      } else if (request.action === (actions.TRIGGER_CAPTURE_SOLVE || 'TRIGGER_CAPTURE_SOLVE')) {
        captureSolver.handleCaptureAndSolve(sender?.tab?.id, null);
        sendResponse({ success: true });
        return true;
      }
    });
  }
}

// Hàm backward compatibility nếu có script bên ngoài gọi trực tiếp solveWithKey4U
function solveWithKey4U(...args) {
  return apiClient.solve(...args);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    solveWithKey4U,
    cacheService,
    apiClient,
    captureSolver,
    quickCaptureService
  };
}
