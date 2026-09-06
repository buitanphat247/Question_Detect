/**
 * Q&A Detector & AI Auto Solver - Background Service Worker
 * Xử lý gọi API Key4U bypass CSP và lắng nghe phím tắt toàn cục (Alt+Shift+Q).
 */

const DEFAULT_API_KEY = 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5';
const DEFAULT_MODEL = 'gpt-5.5';

// Thiết lập mặc định khi cài đặt hoặc reload extension
chrome.runtime.onInstalled.addListener(async () => {
  chrome.storage.local.get(['key4uApiKey', 'key4uModel', 'autoSelectWeb'], (res) => {
    if (!res.key4uApiKey) {
      chrome.storage.local.set({ key4uApiKey: DEFAULT_API_KEY });
    }
    if (!res.key4uModel) {
      chrome.storage.local.set({ key4uModel: DEFAULT_MODEL });
    }
    if (typeof res.autoSelectWeb === 'undefined') {
      chrome.storage.local.set({ autoSelectWeb: true });
    }
  });

  // Tự động inject content script vào các tab đang mở để dùng được ngay không cần F5
  try {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://') && !tab.url.startsWith('about:') && !tab.url.startsWith('chrome-extension://')) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).catch(() => {});
      }
    }
  } catch (e) {}
});

// Hàm kích hoạt giải ngầm an toàn trên tab
async function sendTriggerAutoSolve(tabId, url) {
  if (!url || url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('chrome-extension://')) {
    return;
  }
  chrome.tabs.sendMessage(tabId, { action: 'TRIGGER_AUTO_SOLVE' }, async () => {
    if (chrome.runtime.lastError) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { action: 'TRIGGER_AUTO_SOLVE' }, () => {
            if (chrome.runtime.lastError) { /* Bỏ qua lỗi ngầm */ }
          });
        }, 150);
      } catch (injectErr) {
        // Không ném lỗi ra ngoài
      }
    }
  });
}

// 1. Khi click trực tiếp vào icon extension trên toolbar: Tự giải ngầm, không mở popup
chrome.action.onClicked.addListener(async (tab) => {
  if (tab && tab.id && tab.url) {
    sendTriggerAutoSolve(tab.id, tab.url);
  }
});

// 2. Khi bấm phím tắt Alt + H: Tự giải ngầm, không mở popup
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'solve-all-questions') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && tab.url) {
        sendTriggerAutoSolve(tab.id, tab.url);
      }
    } catch (err) {
      console.warn('Lỗi phím tắt an toàn:', err.message);
    }
  }
});

// Lắng nghe yêu cầu gọi API từ content script hoặc popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CALL_KEY4U_AI') {
    solveWithKey4U(request.prompt, request.model, request.apiKey)
      .then(res => sendResponse({ success: true, data: res }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Giữ kết nối async
  }
});

async function solveWithKey4U(prompt, model, apiKey) {
  const key = apiKey || DEFAULT_API_KEY;
  const m = model || DEFAULT_MODEL;

  const res = await fetch('https://api.key4u.vn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: m,
      messages: [
        { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1
    })
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Key4U API lỗi (${res.status}): ${errBody.slice(0, 150)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';

  function extractJsonFromText(text) {
    if (!text) return null;
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonStr = cleaned.slice(firstBrace, lastBrace + 1);
      try { return JSON.parse(jsonStr); } catch (e) {}
    }
    try { return JSON.parse(cleaned); } catch (e) {}
    return null;
  }

  let parsed = extractJsonFromText(content);
  if (!parsed) {
    const match = content.match(/([A-H])[\.\)\:]/i) || content.match(/\b([A-H])\b/i);
    if (match) {
      parsed = { answer: match[1].toUpperCase(), explanation: content };
    }
  }

  if (!parsed || (!parsed.answer && !parsed.answers)) {
    throw new Error('AI không trả về đáp án rõ ràng.');
  }

  if (parsed.answer) {
    parsed.answer = parsed.answer.toUpperCase().trim();
  }
  return parsed;
}
