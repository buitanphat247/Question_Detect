class Key4uApiClient {
  constructor(options = {}) {
    this.defaultApiKey = options.defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '');
    this.defaultModel = options.defaultModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    this.backupModels = options.backupModels || (typeof BACKUP_MODELS !== 'undefined' ? BACKUP_MODELS : ['gemini-3.7-flash']);
  }

  async solve(promptOrOptions, legacyModel, legacyApiKey, legacyImageUrl, legacyTask) {
    let prompt, model, apiKey, imageUrl, task, systemPrompt, enableReasoning, reasoningEffort;
    if (promptOrOptions && typeof promptOrOptions === 'object') {
      prompt = promptOrOptions.prompt;
      model = promptOrOptions.model;
      apiKey = promptOrOptions.apiKey;
      imageUrl = promptOrOptions.imageUrl;
      task = promptOrOptions.task || 'solve';
      systemPrompt = promptOrOptions.systemPrompt;
      enableReasoning = promptOrOptions.enableReasoning;
      reasoningEffort = promptOrOptions.reasoningEffort;
    } else {
      prompt = promptOrOptions;
      model = legacyModel;
      apiKey = legacyApiKey;
      imageUrl = legacyImageUrl;
      task = legacyTask || 'solve';
    }

    const key = apiKey || this.defaultApiKey;
    const m = model || this.defaultModel;

    const isSingleSolve = task === 'single_solve';
    const isExtractTask = task === 'extract';
    const chosenSystemPrompt = systemPrompt || (
      isExtractTask ? (typeof SYSTEM_PROMPT_EXTRACTOR !== 'undefined' ? SYSTEM_PROMPT_EXTRACTOR : (globalThis.AiPrompts?.SYSTEM_PROMPT_EXTRACTOR || '')) :
      isSingleSolve ? (typeof SYSTEM_PROMPT_SINGLE_SOLVER !== 'undefined' ? SYSTEM_PROMPT_SINGLE_SOLVER : (globalThis.AiPrompts?.SYSTEM_PROMPT_SINGLE_SOLVER || '')) :
      (typeof SYSTEM_PROMPT_SOLVER !== 'undefined' ? SYSTEM_PROMPT_SOLVER : (globalThis.AiPrompts?.SYSTEM_PROMPT_SOLVER || ''))
    );

    const messages = [
      { role: 'system', content: chosenSystemPrompt }
    ];

    const hasVisionImage = imageUrl && (
      imageUrl.startsWith('http://') || 
      imageUrl.startsWith('https://') || 
      imageUrl.startsWith('data:image/png') || 
      imageUrl.startsWith('data:image/jpeg') || 
      imageUrl.startsWith('data:image/webp') ||
      imageUrl.startsWith('data:image/gif')
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

    const isReasoning = typeof enableReasoning !== 'undefined'
      ? !!enableReasoning
      : (typeof isReasoningEnabled === 'function' ? isReasoningEnabled() : true);
    const reasoningEffortVal = reasoningEffort || (typeof getReasoningEffort === 'function' ? getReasoningEffort() : 'high');

    const singleTimeout = typeof KEY4U_SINGLE_SOLVE_TIMEOUT_MS !== 'undefined' ? KEY4U_SINGLE_SOLVE_TIMEOUT_MS : 30000;
    const reasoningTimeout = typeof KEY4U_REASONING_TIMEOUT_MS !== 'undefined' ? KEY4U_REASONING_TIMEOUT_MS : 75000;
    const textTimeout = typeof KEY4U_TEXT_TIMEOUT_MS !== 'undefined' ? KEY4U_TEXT_TIMEOUT_MS : 120000;
    const visionTimeout = typeof KEY4U_VISION_TIMEOUT_MS !== 'undefined' ? KEY4U_VISION_TIMEOUT_MS : 150000;

    const requestTimeout = hasVisionImage
      ? visionTimeout
      : (isReasoning ? reasoningTimeout : (isSingleSolve ? singleTimeout : textTimeout));

    const payload = {
      model: m,
      messages: messages,
      temperature: 0.1,
      ...(isReasoning ? { reasoning_effort: reasoningEffortVal } : {})
    };

    let res = null;
    let firstError = null;

    try {
      res = await this.fetchCompletion(payload, requestTimeout, key);
      if (!res.ok && hasVisionImage) {
        res = await this.fetchCompletion({
          model: m,
          messages: [
            { role: 'system', content: chosenSystemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1
        }, isSingleSolve ? singleTimeout : textTimeout, key).catch(() => null);
      }
      if (!res || !res.ok) {
        firstError = res ? `HTTP ${res.status}` : 'Request failed';
      }
    } catch (err) {
      firstError = err.name === 'AbortError' ? `Key4U API quá thời gian (${Math.round(requestTimeout / 1000)}s)` : err.message;
    }

    // Retry only transient transport/server failures with a backup model.
    // Retrying 4xx authentication, validation, or quota failures wastes quota
    // and masks the actionable error from the consensus engine.
    if ((!res || !res.ok) && this.shouldTryBackupModel(res)) {
      for (let bIdx = 0; bIdx < this.backupModels.length; bIdx++) {
        const backupModel = this.backupModels[bIdx];
        if (backupModel === m) continue;
        try {
          const backupPayload = {
            model: backupModel,
            messages: messages,
            temperature: 0.1,
            ...(isReasoning ? { reasoning_effort: reasoningEffortVal } : {})
          };
          res = await this.fetchCompletion(backupPayload, requestTimeout, key);
          if (!res.ok && hasVisionImage) {
            res = await this.fetchCompletion({
              model: backupModel,
              messages: [
                { role: 'system', content: chosenSystemPrompt },
                { role: 'user', content: prompt }
              ],
              temperature: 0.1
            }, isSingleSolve ? singleTimeout : textTimeout, key).catch(() => null);
          }
          if (res && res.ok) break;
        } catch (errBackup) {}
      }
    }

    if (!res || !res.ok) {
      const errBody = res ? await res.text().catch(() => '') : '';
      throw new Error(`Key4U API lỗi (${firstError}): ${errBody.slice(0, 150)}`);
    }

    const data = await res.json();
    const messageObj = data.choices?.[0]?.message;
    // Reasoning is never an answer payload. Only the final content is allowed
    // to reach parsers, dropdown markers, or input fields.
    const content = messageObj?.content || '';

    if (isExtractTask) {
      const parsed = this.extractJsonFromText(content, true);
      if (Array.isArray(parsed)) {
        return { questions: parsed, rawContent: content };
      }
      if (parsed && Array.isArray(parsed.questions)) {
        return { questions: parsed.questions, rawContent: content };
      }
      return { questions: [], rawContent: content, error: 'Không phân tích được danh sách câu hỏi.' };
    }

    const flexibleResult = this.parseFlexibleResponse(content);
    if (flexibleResult) {
      return { ...flexibleResult, raw: content };
    }

    // Reject non-contract output instead of treating an explanation as an
    // answer that could be inserted into a text field.
    return { raw: content };
  }

  parseFlexibleResponse(text) {
    if (typeof text !== 'string') return null;
    let cleaned = text.trim();

    // Bỏ code fences
    const fenceMatch = cleaned.match(/^```(?:json)?\s*\r?\n?([\s\S]*?)\r?\n?```$/i);
    if (fenceMatch) cleaned = fenceMatch[1].trim();

    // 1. Chữ cái đơn giản: A, B, C, D (hoặc "C", "C.", "Đáp án: C")
    const singleMatch = cleaned.match(/^(?:đáp án[:\s]*|answer[:\s]*)?["'\(\\[]?\s*([A-Za-z0-9])\s*["'\)\\]]?\.?$/i);
    if (singleMatch) {
      return { answer: singleMatch[1].toUpperCase() };
    }

    // 2. Thử parse JSON
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        const cleanArr = parsed.map(k => String(k).trim().toUpperCase()).filter(Boolean);
        return { answers: cleanArr };
      }
      if (parsed && typeof parsed === 'object') {
        if (parsed.answer) {
          if (Array.isArray(parsed.answer)) return { answers: parsed.answer.map(k => String(k).trim().toUpperCase()) };
          return { answer: String(parsed.answer).trim().toUpperCase(), reason: parsed.reason };
        }
        if (parsed.answers) {
          return { answers: parsed.answers, reason: parsed.reason };
        }
        return { answers: parsed, reason: parsed.reason };
      }
      if (typeof parsed === 'string' && /^[A-Za-z0-9]$/.test(parsed.trim())) {
        return { answer: parsed.trim().toUpperCase() };
      }
    } catch (e) {}

    // 3. Mảng JSON trong chuỗi: ["A", "C"]
    const arrayMatch = cleaned.match(/\[\s*(?:["'][A-Za-z0-9]+["']\s*,?\s*)+\]/);
    if (arrayMatch) {
      try {
        const arr = JSON.parse(arrayMatch[0]);
        if (Array.isArray(arr) && arr.length > 0) {
          return { answers: arr.map(k => String(k).trim().toUpperCase()) };
        }
      } catch (e) {}
    }

    // 4. Chuỗi phân tách phẩy: "A, C" hoặc "A, B, D"
    if (/^[A-Za-z0-9](?:\s*,\s*[A-Za-z0-9])+$/i.test(cleaned)) {
      const parts = cleaned.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      return { answers: parts };
    }

    // 5. JSON Object {...}
    const objMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try {
        const obj = JSON.parse(objMatch[0]);
        if (obj.answer) {
          if (Array.isArray(obj.answer)) return { answers: obj.answer.map(k => String(k).trim().toUpperCase()) };
          return { answer: String(obj.answer).trim().toUpperCase(), reason: obj.reason };
        }
        if (obj.answers) return { answers: obj.answers, reason: obj.reason };
        return { answers: obj, reason: obj.reason };
      } catch (e) {}
    }

    // 6. Điền văn bản ngắn (Short Answer): ví dụ FE67, 104, AND EAX, FFFFF000
    if (cleaned.length < 80 && !cleaned.includes('\n')) {
      return { answerText: cleaned, answer: cleaned };
    }

    return null;
  }

  async fetchCompletion(payload, timeoutMs, key) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch('https://api.key4u.vn/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  shouldTryBackupModel(response) {
    if (!response) return true;
    return response.status === 408 || response.status === 425 || response.status >= 500;
  }

  extractCompactAnswer(text) {
    const res = this.parseFlexibleResponse(text);
    if (res?.answer) return res.answer;
    if (Array.isArray(res?.answers)) return res.answers;
    return null;
  }

  extractJsonFromText(text, isExtractTask) {
    if (!text) return null;
    let cleaned = text.trim();

    const fenceStart = cleaned.indexOf('```');
    if (fenceStart !== -1) {
      const contentStart = cleaned.indexOf('\n', fenceStart);
      const fenceEnd = cleaned.indexOf('```', contentStart + 1);
      if (contentStart !== -1 && fenceEnd !== -1) {
        cleaned = cleaned.slice(contentStart + 1, fenceEnd).trim();
      }
    }

    try { return JSON.parse(cleaned); } catch (e) {}
    const objMatch = cleaned.match(/\{[\s\S]*\}|(?:\[[\s\S]*\])/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch (e) {}
    }
    return null;
  }
}

globalThis.Key4uApiClient = Key4uApiClient;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Key4uApiClient };
}
