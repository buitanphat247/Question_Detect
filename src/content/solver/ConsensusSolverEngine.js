class ConsensusSolverEngine {
  constructor(options = {}) {
    this.primaryModel = options.primaryModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    this.consensusModel = options.consensusModel || (typeof CONSENSUS_MODEL !== 'undefined' ? CONSENSUS_MODEL : 'gemini-3.7-flash');
    this.models = [...new Set(options.models || (typeof CONSENSUS_MODELS !== 'undefined' ? CONSENSUS_MODELS : [
      this.primaryModel,
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite'
    ]))].filter(Boolean).slice(0, 3);
    this.maxRetries = Number.isInteger(options.maxRetries)
      ? options.maxRetries
      : (typeof CONSENSUS_MAX_RETRIES !== 'undefined' ? CONSENSUS_MAX_RETRIES : 2);
    this.defaultApiKey = options.defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '');
  }

  async solveQuestion(q) {
    if (!q) return null;
    if (q.type === 'true_false_group') {
      return this.solveTrueFalseQuestion(q);
    }
    if (q.type === 'multiple_choice') {
      return this.solveMultipleChoiceQuestion(q);
    }
    if (q.type === 'short_answer') {
      return this.solveShortAnswerQuestion(q);
    }
    if (q.type === 'dropdown_select') {
      return this.solveDropdownQuestion(q);
    }
    return this.solveSingleChoiceQuestion(q);
  }

  async solveMultipleChoiceQuestion(q) {
    const prompt = this.buildMultipleChoicePrompt(q);
    const availableKeys = (q.options || []).map(o => String(o.key || '').toUpperCase());
    let results = await this.solveRound(prompt, q.image, availableKeys, 'solve');
    if (this.isUnanimous(results)) return { ...results[0], consensus: true };

    for (let retry = 0; retry < this.maxRetries; retry++) {
      const debatePrompt = this.buildMultipleChoiceDebatePrompt(q, results, retry + 1);
      results = await this.solveRound(debatePrompt, q.image, availableKeys, 'solve');
      if (this.isUnanimous(results)) return { ...results[0], consensus: true };
    }

    const strongest = this.selectStrongestResult(results);
    return strongest ? { ...strongest, consensus: false, consensusStatus: 'unresolved' } : null;
  }

  async solveSingleChoiceQuestion(q) {
    const prompt = this.buildSingleChoicePrompt(q);
    const availableKeys = (q.options || []).map(o => o.key);
    let results = await this.solveRound(prompt, q.image, availableKeys);
    if (this.isUnanimous(results)) return { ...results[0], consensus: true };

    for (let retry = 0; retry < this.maxRetries; retry++) {
      const debatePrompt = this.buildDebatePrompt(q, results, retry + 1);
      results = await this.solveRound(debatePrompt, q.image, availableKeys);
      if (this.isUnanimous(results)) return { ...results[0], consensus: true };
    }

    const strongest = this.selectStrongestResult(results);
    return strongest ? { ...strongest, consensus: false, consensusStatus: 'unresolved' } : null;
  }

  async solveShortAnswerQuestion(q) {
    const prompt = this.buildShortAnswerPrompt(q);
    const results = await this.solveRound(prompt, q.image, [], 'solve');
    if (!this.isUnanimous(results)) return null;
    const textVal = results[0]?.answerText || results[0]?.answer || '';
    return textVal ? { answerText: textVal, answer: textVal, consensus: true } : null;
  }

  async solveDropdownQuestion(q) {
    const prompt = this.buildDropdownPrompt(q);
    const results = (await this.solveRound(prompt, q.image, [], 'solve'))
      .map(result => result?.dropdownAnswers ? result : { dropdownAnswers: result?.answers || {} })
      .filter(result => Object.keys(result.dropdownAnswers).length > 0);
    if (!this.isUnanimous(results)) return null;
    return { dropdownAnswers: results[0].dropdownAnswers, consensus: true };
  }

  async solveTrueFalseQuestion(q) {
    const prompt = `Bạn là chuyên gia giải đề trắc nghiệm Đúng / Sai.
ĐỀ BÀI: ${q.title}
${q.passage ? `BÀI ĐỌC: ${q.passage}\n` : ''}
CÁC Ý CẦN ĐÁNH GIÁ:
${(q.items || []).map(it => `${it.key}. ${it.text}`).join('\n')}

QUY TẮC: Trả về DUY NHẤT một khối JSON theo mẫu:
{
  "answers": {
    "A": "Đúng",
    "B": "Sai",
    "C": "Đúng",
    "D": "Sai"
  }
}`;

    try {
      const availableKeys = (q.items || []).map(item => String(item.key || '').toUpperCase()).filter(Boolean);
      const results = await this.solveRound(prompt, q.image, availableKeys, 'solve');
      if (this.isUnanimous(results)) return { ...results[0], consensus: true };
      let latest = results;
      for (let retry = 0; retry < this.maxRetries; retry++) {
        const debatePrompt = this.buildTrueFalseDebatePrompt(q, latest, retry + 1);
        latest = await this.solveRound(debatePrompt, q.image, availableKeys, 'solve');
        if (this.isUnanimous(latest)) return { ...latest[0], consensus: true };
      }
      const strongest = this.selectStrongestResult(latest);
      if (strongest) return { ...strongest, consensus: false, consensusStatus: 'unresolved' };
    } catch (e) {}
    return null;
  }

  async solveRound(prompt, imageUrl, availableKeys = [], task = 'single_solve') {
    const responses = await Promise.allSettled(this.models.map(model =>
      this.sendSolveRequest(prompt, model, imageUrl, task)
    ));
    return responses
      .filter(result => result.status === 'fulfilled')
      .map(result => this.parseResult(result.value, availableKeys))
      .filter(Boolean);
  }

  parseResult(result, availableKeys = []) {
    if (!result) return null;

    if (typeof result === 'object') {
      if (result.dropdownAnswers) return { dropdownAnswers: result.dropdownAnswers };
      if (result.answerText) return { answerText: result.answerText, answer: result.answerText };

      if (Array.isArray(result.answers)) return this.parseMultipleChoiceAnswers(result, availableKeys);
      if (Array.isArray(result.answer)) return this.parseMultipleChoiceAnswers({ answers: result.answer }, availableKeys);
      if (typeof result.answer === 'string' && result.answer.includes(',')) {
        return this.parseMultipleChoiceAnswers({ answers: result.answer.split(',') }, availableKeys);
      }
      if (result.answer) return this.parseSingleChoiceAnswer(result, availableKeys);
      if (result.answers && typeof result.answers === 'object') return this.parseTrueFalseAnswers(result, availableKeys);
    }

    if (typeof result === 'string') {
      const trimmed = result.trim();
      // Chữ cái đơn
      if (/^[A-Za-z0-9]$/.test(trimmed)) {
        return this.parseSingleChoiceAnswer({ answer: trimmed.toUpperCase() }, availableKeys);
      }
      // Mảng
      try {
        const parsed = JSON.parse(trimmed);
        return this.parseResult(parsed, availableKeys);
      } catch (e) {}

      // Regex mảng
      const arrMatch = trimmed.match(/\[\s*(?:["'][A-Za-z0-9]+["']\s*,?\s*)+\]/);
      if (arrMatch) {
        try { return this.parseResult(JSON.parse(arrMatch[0]), availableKeys); } catch (err) {}
      }

      // Short answer
      return { answerText: trimmed, answer: trimmed };
    }

    return null;
  }

  parseMultipleChoiceAnswers(result, availableKeys = []) {
    if (!result || !result.answers) return null;
    const rawList = Array.isArray(result.answers) ? result.answers : [result.answers];
    const cleanAnswers = rawList
      .map(k => String(k).trim().toUpperCase().replace(/[^A-Z0-9]/g, ''))
      .filter(k => k && (availableKeys.length === 0 || availableKeys.includes(k)));
    if (cleanAnswers.length === 0) return null;
    return { answers: [...new Set(cleanAnswers)], reason: result.reason || '' };
  }

  isUnanimous(results) {
    if (results.length !== this.models.length) return false;
    const answers = results.map(result => this.canonicalAnswer(result));
    return answers.every(answer => answer === answers[0]);
  }

  canonicalAnswer(result) {
    if (!result) return '';
    if (result.dropdownAnswers) {
      return `dropdown:${Object.keys(result.dropdownAnswers).sort().map(key => `${key}:${result.dropdownAnswers[key]}`).join('|')}`;
    }
    if (result.answer) return `single:${String(result.answer).toUpperCase().trim()}`;
    if (result.answers) {
      if (Array.isArray(result.answers)) {
        return `multi:${[...result.answers].map(k => String(k).trim().toUpperCase()).sort().join(',')}`;
      }
      return `tf:${Object.keys(result.answers).sort().map(key => `${key}:${result.answers[key]}`).join('|')}`;
    }
    if (result.answerText) return `text:${result.answerText}`;
    return '';
  }

  parseTrueFalseAnswers(result, availableKeys = []) {
    if (!result || !result.answers || typeof result.answers !== 'object' || Array.isArray(result.answers)) return null;
    const expected = availableKeys.length > 0 ? [...new Set(availableKeys)] : Object.keys(result.answers).map(key => key.toUpperCase());
    if (expected.length === 0) return { answers: result.answers };
    const answers = {};
    for (const key of expected) {
      const raw = result.answers[key] ?? result.answers[key.toLowerCase()];
      if (typeof raw !== 'string') continue;
      const normalized = raw.trim().toLowerCase();
      if (normalized === 'đúng' || normalized === 'true') answers[key] = 'Đúng';
      else if (normalized === 'sai' || normalized === 'false') answers[key] = 'Sai';
    }
    return Object.keys(answers).length > 0 ? { answers } : { answers: result.answers };
  }

  selectStrongestResult(results) {
    return results
      .filter(result => result && (result.answer || result.answers || result.answerText || result.dropdownAnswers))
      .sort((a, b) => String(b.reason || '').length - String(a.reason || '').length)[0] || null;
  }

  buildDebatePrompt(q, results, round) {
    return `${this.buildSingleChoicePrompt(q)}

DEBATE ROUND ${round}: Các kết quả độc lập trước đó:
${results.map((result, index) => `MODEL ${index + 1}: ${JSON.stringify(result)}`).join('\n')}

Hãy đối chiếu kỹ lưỡng và CHỈ trả về DUY NHẤT một chữ cái đáp án đúng. Tuyệt đối không giải thích.`;
  }

  buildTrueFalseDebatePrompt(q, results, round) {
    return `${this.solveTrueFalsePrompt(q)}

DEBATE ROUND ${round}: Kiểm tra lại độc lập các kết quả sau:
${results.map((result, index) => `MODEL ${index + 1}: ${JSON.stringify(result)}`).join('\n')}
Trả về duy nhất JSON theo schema answers, không thêm văn bản.`;
  }

  solveTrueFalsePrompt(q) {
    return `Bạn là chuyên gia giải đề trắc nghiệm Đúng / Sai.
ĐỀ BÀI: ${q.title}
${q.passage ? `BÀI ĐỌC: ${q.passage}\n` : ''}
CÁC Ý CẦN ĐÁNH GIÁ:
${(q.items || []).map(it => `${it.key}. ${it.text}`).join('\n')}

Trả về duy nhất JSON: {"answers":{"A":"Đúng","B":"Sai","C":"Đúng","D":"Sai"}}`;
  }

  buildSingleChoicePrompt(q) {
    return `You are a high-precision multiple-choice solver.
QUESTION: ${q.title}
${q.passage ? `CONTEXT: ${q.passage}\n` : ''}
OPTIONS:
${(q.options || []).map(o => `${o.key}. ${o.text}`).join('\n')}

ALLOWED_KEYS: [${(q.options || []).map(o => `"${o.key}"`).join(',')}]
Solve internally. Return exactly one allowed uppercase key and nothing else.
Valid output example: A`;
  }

  buildMultipleChoicePrompt(q) {
    return `You are a high-precision multiple-answer solver.
QUESTION: ${q.title}
${q.passage ? `CONTEXT: ${q.passage}\n` : ''}
OPTIONS:
${(q.options || []).map(o => `${o.key}. ${o.text}`).join('\n')}

ALLOWED_KEYS: [${(q.options || []).map(o => `"${o.key}"`).join(',')}]
Select every correct option and solve internally.
STRICT OUTPUT: return exactly one minified JSON array of allowed uppercase keys, on one line, with no whitespace, Markdown, code fence, explanation, or trailing newline.
Valid output example: ["A","C"]`;
  }

  buildMultipleChoiceDebatePrompt(q, results, round) {
    return `${this.buildMultipleChoicePrompt(q)}

DEBATE ROUND ${round}: Các kết quả độc lập trước đó:
${results.map((result, index) => `MODEL ${index + 1}: ${JSON.stringify(result)}`).join('\n')}

Re-solve from scratch, compare every option, then return ONLY a JSON array of answer letters (e.g. ["A", "C"]).`;
  }

  buildShortAnswerPrompt(q) {
    return `You are a precise computer-architecture and assembly-language solver.
QUESTION: ${q.title}
${q.passage ? `CONTEXT: ${q.passage}\n` : ''}

This is a fill-in-the-blank answer. Solve internally, then return exactly the value or instruction that must be entered in the input field.
STRICT OUTPUT: one plain-text line only; no JSON, Markdown, code fence, label, explanation, quotation marks, or leading/trailing whitespace.
Examples: FE67 | 104 | and EAX,FFFFF000`;
  }

  buildDropdownPrompt(q) {
    const list = (q.selects || []).map(s => {
      const optTexts = (s.options || []).map(o => o.text).filter(t => t && t !== 'Choose...');
      return `- ${s.label || s.id}: [${optTexts.join(', ')}]`;
    }).join('\n');

    return `You are a precise computer-architecture and assembly-language solver for matching dropdowns.
QUESTION: ${q.title}
${q.passage ? `CONTEXT: ${q.passage}\n` : ''}
DROPDOWNS AND ALLOWED VALUES:
${list}

Solve internally. Return exactly one minified JSON object on one ASCII line, with no Markdown, code fence, explanation, or extra keys.
Use each dropdown label exactly as supplied and an allowed option text exactly as supplied.
Exact shape: {"answers":{"CX":"FE67","BX":"67FE"}}`;
  }

  async sendSolveRequest(prompt, model, imageUrl, task = 'solve') {
    const config = typeof APP_CONFIG !== 'undefined' ? APP_CONFIG : {};
    return new Promise((resolve, reject) => {
      const action = globalThis.MessageActions?.CALL_KEY4U_AI || 'CALL_KEY4U_AI';
      chrome.runtime.sendMessage({
        action: action,
        prompt: prompt,
        model: model,
        imageUrl: imageUrl,
        task: task,
        enableReasoning: config.ENABLE_REASONING !== false,
        reasoningEffort: config.REASONING_EFFORT || 'high'
      }, res => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        if (res && res.success) {
          resolve(res.data);
        } else {
          reject(new Error(res?.error || 'AI Request failed'));
        }
      });
    });
  }

  parseSingleChoiceAnswer(res, availableKeys = []) {
    if (!res) return null;
    let key = '';

    if (typeof res === 'object' && res.answer) {
      key = String(res.answer).toUpperCase().trim();
    } else if (typeof res === 'string') {
      const trimmed = res.trim();
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed.answer === 'string') key = parsed.answer.toUpperCase().trim();
      } catch (e) {
        if (/^[A-Za-z0-9]$/.test(trimmed)) key = trimmed.toUpperCase();
      }
    }

    if (key && (availableKeys.length === 0 || availableKeys.includes(key))) {
      const result = { answer: key };
      if (typeof res === 'object' && typeof res.reason === 'string') {
        result.reason = res.reason;
      }
      return result;
    }

    if (key) {
      return { answer: key };
    }
    return null;
  }
}

globalThis.ConsensusSolverEngine = ConsensusSolverEngine;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConsensusSolverEngine };
}
