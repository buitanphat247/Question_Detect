class StealthCaptureSolver {
  constructor({ apiClient, defaultModel, consensusModel, defaultApiKey, contentScriptFiles } = {}) {
    this.apiClient = apiClient || new Key4uApiClient();
    this.defaultModel = defaultModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    this.consensusModel = consensusModel || (typeof CONSENSUS_MODEL !== 'undefined' ? CONSENSUS_MODEL : 'gemini-3.7-flash');
    this.consensusModels = [...new Set(
      (typeof CONSENSUS_MODELS !== 'undefined' ? CONSENSUS_MODELS : [this.defaultModel, this.consensusModel, 'gemini-2.5-flash-lite'])
    )].filter(Boolean).slice(0, 3);
    this.defaultApiKey = defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '');
    this.contentScriptFiles = contentScriptFiles || [];
    this.isCapturingProcess = false;
  }

  async handleCaptureAndSolve(targetTabId, cropRect) {
    if (this.isCapturingProcess) return;
    this.isCapturingProcess = true;

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
        this.isCapturingProcess = false;
        return;
      }

      // 1. Chụp ảnh màn hình
      let screenshotUrl = await new Promise((resolve) => {
        chrome.tabs.captureVisibleTab(windowId || null, { format: 'jpeg', quality: 90 }, (dataUrl) => {
          if (chrome.runtime.lastError || !dataUrl) {
            chrome.tabs.captureVisibleTab(null, { format: 'jpeg', quality: 90 }, (dataUrl2) => {
              resolve(dataUrl2 || null);
            });
          } else {
            resolve(dataUrl);
          }
        });
      });

      if (!screenshotUrl) {
        this.isCapturingProcess = false;
        return;
      }

      // 2. Crop vùng chọn nếu có
      if (cropRect && cropRect.width >= 10 && cropRect.height >= 10) {
        screenshotUrl = await this.cropScreenshot(screenshotUrl, cropRect);
      }

      // 3. Cấu hình
      let apiKey = this.defaultApiKey;
      const primaryModel = this.defaultModel;
      const secondaryModel = this.consensusModel;
      let enableReasoning = typeof isReasoningEnabled === 'function' ? isReasoningEnabled() : true;
      let reasoningEffort = typeof getReasoningEffort === 'function' ? getReasoningEffort() : 'high';
      try {
        const stored = await new Promise(r => {
          chrome.storage.local.get(['key4uApiKey', 'enableReasoning', 'reasoningEffort'], res => r(res || {}));
        });
        if (stored?.key4uApiKey) apiKey = stored.key4uApiKey;
        if (typeof stored?.enableReasoning !== 'undefined') enableReasoning = stored.enableReasoning;
        if (stored?.reasoningEffort) reasoningEffort = stored.reasoningEffort;
      } catch (e) {}

      // 4. Prompt giải đề trắc nghiệm qua ảnh
      const prompt = `Bạn là chuyên gia giải đề thi trắc nghiệm siêu chuẩn xác từ ảnh chụp màn hình.

QUY TẮC BẮT BUỘC:
1. Quan sát thật kỹ câu hỏi và các phương án trong ảnh. Nếu đề bằng tiếng Anh hay ngôn ngữ khác, hãy dịch ngầm và hiểu sâu sắc toàn bộ thuật ngữ chuyên ngành và ngữ cảnh câu hỏi.
2. Thực hiện quy trình suy luận ngầm sâu sắc (deep silent reasoning):
   - Phân tích cẩn thận ý đồ câu hỏi, chú ý từ phủ định (NOT, EXCEPT, SAI, KHÔNG ĐÚNG, NGOẠI TRỪ).
   - Kiểm tra kỹ các bảng biểu, số liệu, sơ đồ, công thức toán/lý/hóa trong ảnh nếu có.
   - Đánh giá độc lập từng phương án A, B, C, D trước khi đưa ra quyết định.
3. Đối chiếu kỹ kết quả với các phương án trong ảnh để lấy ĐÚNG chữ cái tương ứng.
4. TUYỆT ĐỐI KHÔNG giải thích, KHÔNG đưa ra explanation hay reasoning trong đầu ra hiển thị.
5. Chỉ trả về DUY NHẤT một khối JSON hợp lệ theo định dạng dưới đây.

ĐỊNH DẠNG ĐẦU RA:
- Với câu hỏi trắc nghiệm 1 đáp án:
{
  "questions": [
    {
      "num": 1,
      "type": "single_choice",
      "answer": "A"
    }
  ]
}
- Với câu hỏi Đúng / Sai 4 ý (nếu có):
{
  "questions": [
    {
      "num": 1,
      "type": "true_false_group",
      "answers": {
        "A": "Đúng",
        "B": "Sai",
        "C": "Đúng",
        "D": "Sai"
      }
    }
  ]
}`;

      // 5. Ba model giải độc lập song song; bất đồng phải qua debate đủ ba model.
      const firstRound = await this.runVisionRound(prompt, this.consensusModels, apiKey, screenshotUrl, enableReasoning, reasoningEffort);
      let items = this.extractUnanimousItems(firstRound);
      const unresolved = this.getCandidateItems(firstRound).filter(item => !items.some(done => (done.num || 1) === (item.num || 1)));

      if (unresolved.length > 0) {
        const debateResults = await Promise.all(unresolved.map(async candidate => {
          const qNum = candidate.num || 1;
          const debatePrompt = `Bạn đang kiểm tra lại câu hỏi số ${qNum} trong ảnh.
Các đáp án độc lập trước đó:
${candidate.results.map((item, index) => `MODEL ${index + 1}: ${JSON.stringify(item)}`).join('\n')}

Hãy giải lại từ đầu, không ưu tiên đáp án nào chỉ vì là đáp án cũ. Kiểm tra phủ định, dữ kiện, hình ảnh và tính toán. Nếu thông tin chưa đủ, không đoán.
Trả về duy nhất JSON: {"questions":[{"num":${qNum},"type":"single_choice","answer":"X"}]}`;
          const round = await this.runVisionRound(debatePrompt, this.consensusModels, apiKey, screenshotUrl, enableReasoning, reasoningEffort);
          return this.extractUnanimousItems(round).find(item => (item.num || 1) === qNum) || null;
        }));
        items = items.concat(debateResults.filter(Boolean));
      }

      if (items.length === 0) {
        this.isCapturingProcess = false;
        return;
      }

      // 6. Gửi danh sách đáp án về content script
      const actionName = globalThis.MessageActions?.APPLY_CAPTURE_SOLVE_RESULTS || 'APPLY_CAPTURE_SOLVE_RESULTS';
      chrome.tabs.sendMessage(tabId, {
        action: actionName,
        data: items
      }, () => {
        if (chrome.runtime.lastError && this.contentScriptFiles.length > 0) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: this.contentScriptFiles
          }).then(() => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tabId, {
                action: actionName,
                data: items
              });
            }, 150);
          }).catch(() => {});
        }
      });

    } catch (err) {
    } finally {
      this.isCapturingProcess = false;
    }
  }

  async cropScreenshot(dataUrl, rect) {
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
      return dataUrl;
    }
  }

  getItemsList(res) {
    if (!res) return [];
    if (Array.isArray(res.questions)) return res.questions;
    if (Array.isArray(res)) return res;
    if (res.answer || res.answers) return [res];
    return [];
  }

  async runVisionRound(prompt, models, apiKey, imageUrl, enableReasoning, reasoningEffort) {
    return Promise.allSettled(models.map(model => this.apiClient.solve({
      task: 'solve', prompt, model, apiKey, imageUrl, enableReasoning, reasoningEffort
    }))).then(results => results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => [this.getItemsList(result.value)]));
  }

  getCandidateItems(roundResults) {
    const byNum = new Map();
    roundResults.flat().forEach(item => {
      const normalized = this.normalizeCaptureItem(item);
      if (!normalized) return;
      const num = normalized.num || 1;
      if (!byNum.has(num)) byNum.set(num, []);
      byNum.get(num).push(normalized);
    });
    return [...byNum.entries()].map(([num, results]) => ({ num, results }));
  }

  extractUnanimousItems(roundResults) {
    return this.getCandidateItems(roundResults)
      .filter(candidate => candidate.results.length === this.consensusModels.length)
      .filter(candidate => candidate.results.every(item => this.captureAnswer(item) === this.captureAnswer(candidate.results[0])))
      .map(candidate => candidate.results[0]);
  }

  normalizeCaptureItem(item) {
    if (!item || typeof item !== 'object') return null;
    const normalized = { ...item, num: Number(item.num) || 1 };
    if (typeof normalized.answer === 'string') {
      normalized.answer = normalized.answer.trim().toUpperCase();
      if (!/^[A-Z]$/.test(normalized.answer)) return null;
    } else if (normalized.answers && typeof normalized.answers === 'object' && !Array.isArray(normalized.answers)) {
      const answers = {};
      for (const [key, value] of Object.entries(normalized.answers)) {
        if (typeof value !== 'string') return null;
        const val = value.trim().toLowerCase();
        if (val === 'đúng' || val === 'true') answers[key.toUpperCase()] = 'Đúng';
        else if (val === 'sai' || val === 'false') answers[key.toUpperCase()] = 'Sai';
        else return null;
      }
      normalized.answers = answers;
    } else return null;
    return normalized;
  }

  captureAnswer(item) {
    if (item.answer) return `single:${item.answer}`;
    return `tf:${Object.keys(item.answers).sort().map(key => `${key}:${item.answers[key]}`).join('|')}`;
  }
}

globalThis.StealthCaptureSolver = StealthCaptureSolver;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StealthCaptureSolver };
}
