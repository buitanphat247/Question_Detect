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

// 2. Khi bấm phím tắt Alt + H hoặc Alt + Y: Tự giải ngầm, không mở popup
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'solve-all-questions') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id && tab.url) {
        sendTriggerAutoSolve(tab.id, tab.url);
      }
    } catch (err) {
      console.warn('Lỗi phím tắt Alt+H:', err.message);
    }
  } else if (command === 'capture-and-solve') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, async () => {
          if (chrome.runtime.lastError) {
            try {
              await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
              });
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, { action: 'START_STEALTH_SNIP' }, () => {});
              }, 100);
            } catch (e) {}
          }
        });
      }
    } catch (err) {
      console.warn('Lỗi phím tắt Alt+Y:', err.message);
    }
  }
});

// Hàm cắt ảnh chụp màn hình theo toạ độ kéo thả của người dùng
async function cropScreenshot(dataUrl, rect) {
  if (!rect || !rect.width || !rect.height) return dataUrl;
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fullBitmap = await createImageBitmap(blob);
    const fullWidth = fullBitmap.width;
    const fullHeight = fullBitmap.height;

    const safeX = Math.max(0, Math.min(rect.x, fullWidth - 1));
    const safeY = Math.max(0, Math.min(rect.y, fullHeight - 1));
    const safeWidth = Math.min(rect.width, fullWidth - safeX);
    const safeHeight = Math.min(rect.height, fullHeight - safeY);

    if (safeWidth <= 0 || safeHeight <= 0) {
      fullBitmap.close();
      return dataUrl;
    }

    const offscreen = new OffscreenCanvas(safeWidth, safeHeight);
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(fullBitmap, safeX, safeY, safeWidth, safeHeight, 0, 0, safeWidth, safeHeight);
    fullBitmap.close();

    const croppedBlob = await offscreen.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
    const arrayBuffer = await croppedBlob.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.warn('[CaptureSolver] Lỗi cắt ảnh, fallback sang ảnh gốc:', err);
    return dataUrl;
  }
}

let isCapturingProcess = false;
async function handleCaptureAndSolve(targetTabId, cropRect) {
  if (isCapturingProcess) return;
  isCapturingProcess = true;

  try {
    let tabId = targetTabId;
    let windowId = null;

    if (!tabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        tabId = tab.id;
        windowId = tab.windowId;
      }
    } else {
      const tab = await chrome.tabs.get(tabId).catch(() => null);
      if (tab) windowId = tab.windowId;
    }

    if (!tabId) {
      isCapturingProcess = false;
      return;
    }

    // 1. Chụp ảnh màn hình vùng nhìn thấy của tab hiện tại
    let screenshotUrl = await new Promise((resolve) => {
      chrome.tabs.captureVisibleTab(windowId, { format: 'jpeg', quality: 90 }, (dataUrl) => {
        if (chrome.runtime.lastError || !dataUrl) {
          resolve(null);
        } else {
          resolve(dataUrl);
        }
      });
    });

    if (!screenshotUrl) {
      isCapturingProcess = false;
      return;
    }

    // 2. Nếu có toạ độ kéo thả crop, tiến hành cắt đúng vùng người dùng chọn
    if (cropRect && cropRect.width >= 10 && cropRect.height >= 10) {
      screenshotUrl = await cropScreenshot(screenshotUrl, cropRect);
    }

    // 3. Lấy API Key & Model từ storage (mặc định gpt-5.5 hỗ trợ Vision cực đỉnh)
    let apiKey = DEFAULT_API_KEY;
    let model = 'gpt-5.5';
    try {
      const stored = await new Promise(r => {
        chrome.storage.local.get(['key4uApiKey', 'key4uModel'], res => r(res || {}));
      });
      if (stored?.key4uApiKey) apiKey = stored.key4uApiKey;
      if (stored?.key4uModel) model = stored.key4uModel;
    } catch (e) {}

    // 4. Xây dựng prompt giải đề chuyên sâu từ ảnh chụp màn hình / vùng chọn
    const prompt = `Bạn là chuyên gia giải đề thi trắc nghiệm siêu chuẩn xác.
Dưới đây là ẢNH BÀI THI / VÙNG CHỌN CÂU HỎI mà thí sinh đang làm trên màn hình.

HÃY QUAN SÁT THẬT KỸ CÂU HỎI VÀ CÁC ĐÁP ÁN TRONG ẢNH ĐỂ TÌM ĐÁP ÁN ĐÚNG:
1. Xác định câu hỏi và các lựa chọn đáp án trong ảnh.
2. Với mỗi câu hỏi:
   - "num": Số thứ tự của câu (ví dụ 1, 2, 27...). Nếu không thấy số câu, hãy để là 1.
   - "type": "single_choice" (nếu chọn 1 đáp án A, B, C, D) hoặc "true_false_group" (nếu là dạng Đúng/Sai 4 ý A, B, C, D).
   - "answer": Chữ cái đáp án đúng nhất (ví dụ: "A", "B", "C" hoặc "D").
   - "answers": Nếu là câu Đúng/Sai 4 ý, trả về: { "A": "Đúng" hoặc "Sai", "B": "Đúng" hoặc "Sai", "C": "Đúng" hoặc "Sai", "D": "Đúng" hoặc "Sai" }
   - "optionText": Trích một đoạn ngắn nội dung chữ (10-30 ký tự) của phương án đúng đó (ví dụ "that", "Không có cực tính", "9 , 7 , 5 , 2", ...) để hệ thống đối chiếu click chuẩn 100%.

YÊU CẦU ĐẦU RA BẮT BUỘC:
Chỉ trả về DUY NHẤT một khối JSON hợp lệ theo định dạng:
{
  "questions": [
    {
      "num": 1,
      "type": "single_choice",
      "answer": "C",
      "optionText": "nội dung phương án đúng",
      "explanation": "giải thích ngắn gọn 1 câu"
    }
  ]
}`;

    // 5. Gọi Vision AI giải bài
    const aiResult = await solveWithKey4U(prompt, model, apiKey, screenshotUrl);

    let items = [];
    if (aiResult) {
      if (Array.isArray(aiResult.questions)) {
        items = aiResult.questions;
      } else if (Array.isArray(aiResult)) {
        items = aiResult;
      } else if (aiResult.answer || aiResult.answers) {
        items = [aiResult];
      }
    }

    if (items.length === 0) {
      isCapturingProcess = false;
      return;
    }

    // 6. Gửi danh sách đáp án sang content script để lập tức click chọn trực tiếp trên trang
    chrome.tabs.sendMessage(tabId, {
      action: 'APPLY_CAPTURE_SOLVE_RESULTS',
      data: items
    }, () => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).then(() => {
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, {
              action: 'APPLY_CAPTURE_SOLVE_RESULTS',
              data: items
            });
          }, 150);
        }).catch(() => {});
      }
    });

  } catch (err) {
    console.warn('[CaptureSolver] Lỗi:', err);
  } finally {
    isCapturingProcess = false;
  }
}

// Lắng nghe yêu cầu gọi API từ content script hoặc popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'CALL_KEY4U_AI') {
    solveWithKey4U(request.prompt, request.model, request.apiKey, request.imageUrl)
      .then(res => sendResponse({ success: true, data: res }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Giữ kết nối async
  } else if (request.action === 'TRIGGER_CROP_CAPTURE_SOLVE') {
    handleCaptureAndSolve(sender?.tab?.id, request.rect);
    sendResponse({ success: true });
    return true;
  } else if (request.action === 'TRIGGER_CAPTURE_SOLVE') {
    handleCaptureAndSolve(sender?.tab?.id, null);
    sendResponse({ success: true });
    return true;
  }
});

async function solveWithKey4U(prompt, model, apiKey, imageUrl) {
  const key = apiKey || DEFAULT_API_KEY;
  const m = model || DEFAULT_MODEL;

  let messages = [
    { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' }
  ];

  const hasVisionImage = imageUrl && (
    imageUrl.startsWith('http://') || 
    imageUrl.startsWith('https://') || 
    imageUrl.startsWith('data:image/png') || 
    imageUrl.startsWith('data:image/jpeg') || 
    imageUrl.startsWith('data:image/webp')
  );
  if (hasVisionImage) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    });
  } else {
    messages.push({
      role: 'user',
      content: prompt
    });
  }

  let res = await fetch('https://api.key4u.vn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: m,
      messages: messages,
      temperature: 0.1
    })
  });

  if (!res.ok && hasVisionImage) {
    res = await fetch('https://api.key4u.vn/v1/chat/completions', {
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
  }

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
    const firstBracket = cleaned.indexOf('[');
    
    // Nếu là JSON array
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      const lastBracket = cleaned.lastIndexOf(']');
      if (lastBracket > firstBracket) {
        const jsonArr = cleaned.slice(firstBracket, lastBracket + 1);
        try { return JSON.parse(jsonArr); } catch (e) {}
      }
    }

    if (firstBrace !== -1) {
      const lastBrace = cleaned.lastIndexOf('}');
      if (lastBrace > firstBrace) {
        const jsonStr = cleaned.slice(firstBrace, lastBrace + 1);
        try { return JSON.parse(jsonStr); } catch (e) {}
      }
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

  if (!parsed) {
    throw new Error('AI không trả về kết quả hợp lệ.');
  }

  if (Array.isArray(parsed)) {
    return { questions: parsed, rawContent: content };
  }

  if (parsed.answer) {
    parsed.answer = parsed.answer.toUpperCase().trim();
  }
  return parsed;
}
