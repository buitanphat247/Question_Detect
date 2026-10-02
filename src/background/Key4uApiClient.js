class Key4uApiClient {
  constructor(options = {}) {
    this.defaultApiKey = options.defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5');
    this.defaultModel = options.defaultModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'claude-opus-4-8');
    this.backupModels = options.backupModels || (typeof BACKUP_MODELS !== 'undefined' ? BACKUP_MODELS : ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite']);
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

    // Tự động đổi model theo danh sách backup đa tầng
    const isAuthOrRateLimit = res && (res.status === 401 || res.status === 403 || res.status === 429);
    if (!res || (!res.ok && !isAuthOrRateLimit)) {
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
    let content = messageObj?.content || '';
    if (!content && messageObj?.reasoning_content) {
      content = messageObj.reasoning_content;
    }

    if (isSingleSolve) {
      const trimmed = content.trim();
      return {
        answer: trimmed,
        content: trimmed,
        raw: content,
        text: trimmed
      };
    }

    const parsed = this.extractJsonFromText(content, isExtractTask);

    if (isExtractTask) {
      if (Array.isArray(parsed)) {
        return { questions: parsed, rawContent: content };
      }
      if (parsed && Array.isArray(parsed.questions)) {
        return { questions: parsed.questions, rawContent: content };
      }
      return { questions: [], rawContent: content, error: 'Không phân tích được danh sách câu hỏi.' };
    }

    // Fail-Safe Conflict Resolver
    if (parsed && typeof parsed === 'object') {
      const explanation = parsed.explanation || content;
      if (parsed.answer && explanation) {
        const matchAffirm = explanation.match(/(?:tương\s*ứng\s*(?:với)?\s*(?:phương\s*án|đáp\s*án)?|đáp\s*án\s*(?:đúng|chính\s*xác)\s*(?:là)?|chọn\s*(?:đáp\s*án|phương\s*án)?)\s*([A-H])\b/i);
        if (matchAffirm) {
          const trueKey = matchAffirm[1].toUpperCase();
          if (trueKey !== parsed.answer.toUpperCase()) {
            parsed.answer = trueKey;
          }
        }
      }
    }

    let finalResult = parsed;
    if (!finalResult) {
      const match = content.match(/([A-H])[\.\)\:]/i) || content.match(/\b([A-H])\b/i);
      if (match) {
        finalResult = { answer: match[1].toUpperCase() };
      }
    }

    if (!finalResult) {
      throw new Error('AI không trả về kết quả hợp lệ.');
    }

    if (Array.isArray(finalResult)) {
      return { questions: finalResult, rawContent: content };
    }

    if (finalResult.answer) {
      finalResult.answer = finalResult.answer.toUpperCase().trim();
    }
    return finalResult;
  }

  async fetchCompletion(payload, timeoutMs, key) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch('https://api.key4u.vn/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify(payload)
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  extractJsonFromText(text, isExtractTask) {
    if (!text) return null;
    let cleaned = text.trim();

    const codeMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeMatch) {
      try { return JSON.parse(codeMatch[1].trim()); } catch (e) {}
      cleaned = codeMatch[1].trim();
    }

    try { return JSON.parse(cleaned); } catch (e) {}

    if (isExtractTask || cleaned.includes('[')) {
      const firstBracket = cleaned.indexOf('[');
      const lastBracket = cleaned.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        const jsonArr = cleaned.slice(firstBracket, lastBracket + 1);
        try { return JSON.parse(jsonArr); } catch (e) {}
      }
    }

    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const jsonObj = cleaned.slice(firstBrace, lastBrace + 1);
      try { return JSON.parse(jsonObj); } catch (e) {}
    }

    return null;
  }
}

globalThis.Key4uApiClient = Key4uApiClient;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Key4uApiClient };
}
