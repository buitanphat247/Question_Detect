class StealthCaptureSolver {
  constructor({ apiClient, defaultModel, consensusModel, defaultApiKey, contentScriptFiles } = {}) {
    this.apiClient = apiClient || new Key4uApiClient();
    this.defaultModel = defaultModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    this.consensusModel = consensusModel || (typeof CONSENSUS_MODEL !== 'undefined' ? CONSENSUS_MODEL : 'claude-opus-4-8');
    this.defaultApiKey = defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5');
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

      // 5. Chạy song song 2 Model đối chiếu (Dual Model Consensus)
      const [resp1, resp2] = await Promise.allSettled([
        this.apiClient.solve({
          task: 'solve',
          prompt: prompt,
          model: primaryModel,
          apiKey: apiKey,
          imageUrl: screenshotUrl,
          enableReasoning: enableReasoning,
          reasoningEffort: reasoningEffort
        }),
        this.apiClient.solve({
          task: 'solve',
          prompt: prompt,
          model: secondaryModel,
          apiKey: apiKey,
          imageUrl: screenshotUrl,
          enableReasoning: enableReasoning,
          reasoningEffort: reasoningEffort
        })
      ]);

      const res1 = resp1.status === 'fulfilled' ? resp1.value : null;
      const res2 = resp2.status === 'fulfilled' ? resp2.value : null;

      const items1 = this.getItemsList(res1);
      const items2 = this.getItemsList(res2);

      let items = [];

      if (items1.length > 0 && items2.length > 0) {
        const map2 = new Map(items2.map(it => [it.num || 1, it]));
        for (const it1 of items1) {
          const qNum = it1.num || 1;
          const it2 = map2.get(qNum);
          if (it2 && it1.answer === it2.answer) {
            items.push(it1);
          } else if (it2 && it1.answer !== it2.answer) {
            // Kích hoạt Cross-Review phản biện
            try {
              const crossPrompt = `Bạn đang thực hiện phản biện độc lập cho câu hỏi trắc nghiệm trong ảnh đính kèm.
Trước đó:
- Model 1 đưa ra đáp án: ${it1.answer}
- Model 2 đưa ra đáp án: ${it2.answer}

QUY TẮC BẮT BUỘC:
1. Quan sát kỹ lại ảnh câu hỏi và các phương án. Dịch ngầm và suy luận ngầm độc lập (silent reasoning).
2. Kiểm tra kỹ từ phủ định (NOT, EXCEPT, SAI, KHÔNG ĐÚNG, NGOẠI TRỪ) và các tính toán/dữ kiện trong ảnh.
3. Đánh giá xem ${it1.answer} hay ${it2.answer} mới là đáp án thực sự chính xác, hoặc nếu cả 2 đều sai thì chọn đáp án đúng thực tế.
4. Trả về DUY NHẤT một khối JSON: {"num": ${qNum}, "type": "single_choice", "answer": "X"}`;

              const reviewResp = await this.apiClient.solve({
                task: 'solve',
                prompt: crossPrompt,
                model: secondaryModel,
                apiKey: apiKey,
                imageUrl: screenshotUrl,
                enableReasoning: enableReasoning,
                reasoningEffort: reasoningEffort
              });
              const reviewedList = this.getItemsList(reviewResp);
              const reviewedItem = reviewedList.find(r => (r.num || 1) === qNum) || reviewedList[0];
              if (reviewedItem && reviewedItem.answer) {
                items.push(reviewedItem);
              } else {
                items.push(it1);
              }
            } catch (crossErr) {
              items.push(it1);
            }
          } else {
            items.push(it1);
          }
        }
      } else if (items1.length > 0) {
        items = items1;
      } else if (items2.length > 0) {
        items = items2;
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
}

globalThis.StealthCaptureSolver = StealthCaptureSolver;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StealthCaptureSolver };
}
