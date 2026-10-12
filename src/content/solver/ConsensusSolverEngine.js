class ConsensusSolverEngine {
  constructor(options = {}) {
    this.primaryModel = options.primaryModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    this.models = [...new Set(options.models || (typeof CONSENSUS_MODELS !== 'undefined' ? CONSENSUS_MODELS : [
      this.primaryModel, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'
    ]))].filter(Boolean).slice(0, 3);
    this.maxRetries = Number.isInteger(options.maxRetries)
      ? Math.max(0, options.maxRetries)
      : (typeof CONSENSUS_MAX_RETRIES !== 'undefined' ? CONSENSUS_MAX_RETRIES : 2);
    this.roundTimeoutMs = options.roundTimeoutMs || (typeof CONSENSUS_ROUND_TIMEOUT_MS !== 'undefined' ? CONSENSUS_ROUND_TIMEOUT_MS : 90000);
    this.defaultApiKey = options.defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '');
  }

  async solveQuestion(question) {
    if (!question || this.models.length !== 3) {
      return this.failure('CONFIGURATION_ERROR');
    }
    const prompt = this.buildPrompt(question);
    if (!prompt) return this.failure('UNSUPPORTED_QUESTION_TYPE');
    return this.resolveConsensus(question, prompt);
  }

  async resolveConsensus(question, initialPrompt) {
    let round = await this.solveRound(question, initialPrompt);
    const history = [round];
    if (this.isUnanimous(round.results)) return this.success(round.results[0]);

    for (let attempt = 1; attempt <= this.maxRetries && this.shouldRetry(round); attempt++) {
      const retryPrompt = this.buildDebatePrompt(question, round.results, attempt);
      round = await this.solveRound(question, retryPrompt);
      history.push(round);
      if (this.isUnanimous(round.results)) return this.success(round.results[0]);
    }

    return this.failure(this.deriveFailureStatus(round, history), round, history);
  }

  success(answer) {
    return { ...answer, consensus: true, consensusStatus: 'CONSENSUS' };
  }

  failure(status, round = null, history = []) {
    return {
      consensus: false,
      consensusStatus: status,
      diagnostics: round ? round.statuses.map(({ model, kind }) => ({ model, kind })) : [],
      retryCount: Math.max(0, history.length - 1)
    };
  }

  shouldRetry(round) {
    // Do not burn API quota when every response was malformed. Network/API failures
    // and genuine disagreement can improve on a bounded re-run.
    if (!round || round.statuses.length === 0) return false;
    return round.statuses.some(status => status.kind === 'valid' || status.kind === 'model_error' || status.kind === 'timeout');
  }

  deriveFailureStatus(round, history = []) {
    if (!round || round.statuses.length === 0) return 'NO_RESPONSE';
    const allStatuses = (history.length ? history : [round]).flatMap(item => item.statuses || []);
    if (allStatuses.some(status => status.kind === 'timeout')) return 'MODEL_TIMEOUT';
    if (allStatuses.some(status => status.kind === 'model_error')) return 'MODEL_ERROR';
    if (allStatuses.length > 0 && allStatuses.every(status => status.kind === 'invalid_response')) return 'INVALID_RESPONSE';
    return 'DISAGREEMENT';
  }

  async solveRound(question, prompt) {
    const settled = await Promise.all(this.models.map(async model => {
      try {
        const raw = await this.withTimeout(
          this.sendSolveRequest(prompt, model, question.image, 'solve'),
          this.roundTimeoutMs,
          `Consensus round timed out for ${model}`
        );
        const parsed = this.normalizeResult(raw, question);
        return parsed
          ? { model, kind: 'valid', value: parsed }
          : { model, kind: 'invalid_response' };
      } catch (error) {
        const message = String(error?.message || error || 'Unknown model error');
        return { model, kind: /timed out|timeout|abort/i.test(message) ? 'timeout' : 'model_error' };
      }
    }));

    return {
      results: settled.filter(item => item.kind === 'valid').map(item => item.value),
      statuses: settled
    };
  }

  withTimeout(promise, timeoutMs, message) {
    let timeoutId;
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
  }

  normalizeResult(raw, question) {
    if (!raw || typeof raw !== 'object') return null;
    switch (question.type) {
      case 'multiple_choice': return this.normalizeMultiple(raw, question);
      case 'true_false_group': return this.normalizeTrueFalse(raw, question);
      case 'short_answer': return this.normalizeText(raw);
      case 'dropdown_select': return this.normalizeDropdown(raw, question);
      default: return this.normalizeSingle(raw, question);
    }
  }

  normalizeSingle(raw, question) {
    const allowed = new Set((question.options || []).map(option => String(option.key || '').trim().toUpperCase()).filter(Boolean));
    const candidate = typeof raw.answer === 'string' ? raw.answer : (Array.isArray(raw.answers) && raw.answers.length === 1 ? raw.answers[0] : '');
    const answer = String(candidate || '').trim().toUpperCase();
    return allowed.has(answer) ? { answer } : null;
  }

  normalizeMultiple(raw, question) {
    const allowed = new Set((question.options || []).map(option => String(option.key || '').trim().toUpperCase()).filter(Boolean));
    const source = Array.isArray(raw.answers) ? raw.answers : (typeof raw.answer === 'string' ? raw.answer.split(',') : []);
    if (source.length === 0) return null;
    const answers = source.map(value => String(value).trim().toUpperCase()).filter(Boolean);
    if (answers.some(answer => !allowed.has(answer))) return null;
    return { answers: [...new Set(answers)].sort() };
  }

  normalizeTrueFalse(raw, question) {
    const source = raw.answers;
    if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
    const expected = (question.items || []).map(item => String(item.key || '').trim().toUpperCase()).filter(Boolean);
    if (expected.length === 0) return null;
    const supplied = Object.keys(source).map(key => key.toUpperCase());
    if (supplied.length !== expected.length || supplied.some(key => !expected.includes(key))) return null;
    const answers = {};
    for (const key of expected) {
      const value = source[key] ?? source[key.toLowerCase()];
      const normalized = String(value ?? '').trim().toLowerCase();
      if (normalized === 'true' || normalized === 'đúng') answers[key] = 'true';
      else if (normalized === 'false' || normalized === 'sai') answers[key] = 'false';
      else return null;
    }
    return { answers };
  }

  normalizeText(raw) {
    const text = typeof raw.answerText === 'string'
      ? raw.answerText
      : (typeof raw.answer === 'string' && typeof raw.raw === 'string' && raw.raw.trim() === raw.answer ? raw.answer : '');
    const answerText = String(text || '').normalize('NFC').trim();
    // Do not normalize punctuation or internal whitespace: they may be meaningful
    // for code, assembly instructions, mathematical notation, or free text.
    if (!answerText || answerText.length > 500 || /[\r\n]/.test(answerText)) return null;
    return { answerText };
  }

  normalizeDropdown(raw, question) {
    const source = raw.dropdownAnswers || raw.answers;
    if (!source || typeof source !== 'object' || Array.isArray(source)) return null;
    const selects = question.selects || [];
    if (selects.length === 0) return null;
    const answers = {};
    const usedKeys = new Set();
    for (const select of selects) {
      const aliases = [select.id, select.label].map(value => this.normalizedKey(value)).filter(Boolean);
      const sourceKey = Object.keys(source).find(key => aliases.includes(this.normalizedKey(key)));
      if (!sourceKey || usedKeys.has(sourceKey)) return null;
      usedKeys.add(sourceKey);
      const requested = this.normalizedValue(source[sourceKey]);
      const option = (select.options || []).find(item => this.normalizedValue(item.text) === requested || this.normalizedValue(item.value) === requested);
      if (!option) return null;
      answers[select.id] = option.text;
    }
    if (Object.keys(source).length !== selects.length) return null;
    return { dropdownAnswers: answers };
  }

  normalizedKey(value) {
    return String(value || '').normalize('NFC').trim().toLocaleLowerCase();
  }

  normalizedValue(value) {
    return String(value || '').normalize('NFC').trim().toLocaleLowerCase();
  }

  isUnanimous(results) {
    return results.length === this.models.length && results.every(result => this.canonicalAnswer(result) === this.canonicalAnswer(results[0]));
  }

  canonicalAnswer(result) {
    if (!result) return '';
    if (result.answer) return `single:${String(result.answer).trim().toUpperCase()}`;
    if (Array.isArray(result.answers)) return `multi:${[...result.answers].sort().join(',')}`;
    // Assembly mnemonics, register names, and most text-entry graders are
    // case-insensitive. Preserve the original text for filling the control,
    // but compare an NFC/case-folded form for consensus. The two established
    // hexadecimal spellings (0FFFFh and 0xFFFF) compare as the same value.
    // Punctuation and internal whitespace remain untouched.
    if (result.answerText) return `text:${this.canonicalTextEntry(result.answerText)}`;
    if (result.dropdownAnswers) return `dropdown:${Object.keys(result.dropdownAnswers).sort().map(key => `${key}:${result.dropdownAnswers[key]}`).join('|')}`;
    if (result.answers) return `tf:${Object.keys(result.answers).sort().map(key => `${key}:${result.answers[key]}`).join('|')}`;
    return '';
  }

  canonicalTextEntry(value) {
    const normalizeHex = (_match, digits) => {
      try {
        return `#HEX:${BigInt(`0x${digits}`).toString(16).toUpperCase()}`;
      } catch (error) {
        return String(digits).toUpperCase();
      }
    };
    return String(value)
      .normalize('NFC')
      .trim()
      .toLocaleUpperCase()
      .replace(/\b0X([0-9A-F]+)\b/g, normalizeHex)
      .replace(/\b([0-9A-F]+)H\b/g, normalizeHex);
  }

  buildPrompt(question) {
    switch (question.type) {
      case 'multiple_choice': return this.buildMultipleChoicePrompt(question);
      case 'true_false_group': return this.buildTrueFalsePrompt(question);
      case 'short_answer': return this.buildShortAnswerPrompt(question);
      case 'dropdown_select': return this.buildDropdownPrompt(question);
      default: return this.buildSingleChoicePrompt(question);
    }
  }

  buildBase(question) {
    return `QUESTION: ${question.title}\n${question.passage ? `CONTEXT: ${question.passage}\n` : ''}`;
  }

  buildSingleChoicePrompt(question) {
    return `You are a high-precision multiple-choice solver.\n${this.buildBase(question)}OPTIONS:\n${(question.options || []).map(option => `${option.key}. ${option.text}`).join('\n')}\nALLOWED_KEYS: [${(question.options || []).map(option => `"${option.key}"`).join(',')}]\nSolve internally. Return exactly one allowed uppercase key and nothing else.`;
  }

  buildMultipleChoicePrompt(question) {
    return `You are a high-precision multiple-answer solver.\n${this.buildBase(question)}OPTIONS:\n${(question.options || []).map(option => `${option.key}. ${option.text}`).join('\n')}\nALLOWED_KEYS: [${(question.options || []).map(option => `"${option.key}"`).join(',')}]\nSelect every correct option. Return exactly one minified JSON array of allowed uppercase keys, for example ["A","C"]. No Markdown, explanation, or code fence.`;
  }

  buildTrueFalsePrompt(question) {
    return `You are a high-precision true/false solver.\n${this.buildBase(question)}STATEMENTS:\n${(question.items || []).map(item => `${item.key}. ${item.text}`).join('\n')}\nReturn exactly one minified JSON object using every statement key and only boolean values, for example {"answers":{"A":true,"B":false}}. No Markdown or explanation.`;
  }

  buildShortAnswerPrompt(question) {
    return `You are a precise computer-architecture and assembly-language solver.\n${this.buildBase(question)}This is a fill-in-the-blank answer. Return exactly the value or instruction that must be entered. One plain-text line only; no JSON, Markdown, label, quotation marks, explanation, or leading/trailing whitespace.`;
  }

  buildDropdownPrompt(question) {
    const dropdowns = (question.selects || []).map(select => `${select.id}: [${(select.options || []).map(option => option.text).join(', ')}]`).join('\n');
    return `You are a precise matching-dropdown solver.\n${this.buildBase(question)}DROPDOWNS AND ALLOWED VALUES:\n${dropdowns}\nReturn exactly one minified JSON object with every dropdown id and an allowed option text, for example {"answers":{"select_1":"value"}}. No Markdown or explanation.`;
  }

  buildDebatePrompt(question, results, attempt) {
    return `${this.buildPrompt(question)}\n\nREVIEW ROUND ${attempt}: Independent candidate outputs were ${results.length ? results.map(result => JSON.stringify(result)).join(', ') : 'unavailable'}. Re-solve independently. Do not follow a candidate merely to agree. Obey the exact output contract above.`;
  }

  sendSolveRequest(prompt, model, imageUrl, task = 'solve') {
    const config = typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {};
    return new Promise((resolve, reject) => {
      const action = globalThis.MessageActions?.CALL_KEY4U_AI || 'CALL_KEY4U_AI';
      chrome.runtime.sendMessage({
        action, prompt, model, imageUrl, task,
        enableReasoning: config.ENABLE_REASONING !== false,
        reasoningEffort: config.REASONING_EFFORT || 'high'
      }, response => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (response?.success) return resolve(response.data);
        return reject(new Error(response?.error || 'AI request failed'));
      });
    });
  }
}

globalThis.ConsensusSolverEngine = ConsensusSolverEngine;
if (typeof module !== 'undefined' && module.exports) module.exports = { ConsensusSolverEngine };
