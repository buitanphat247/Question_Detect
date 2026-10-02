class ConsensusSolverEngine {
  constructor(options = {}) {
    this.primaryModel = options.primaryModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'gemini-3.7-flash');
    this.consensusModel = options.consensusModel || (typeof CONSENSUS_MODEL !== 'undefined' ? CONSENSUS_MODEL : 'gemini-3.7-flash');
    this.models = options.models || (typeof CONSENSUS_MODELS !== 'undefined' ? CONSENSUS_MODELS : [
      this.primaryModel,
      'gemini-2.5-flash',
      'gemini-3.5-flash-lite'
    ]);
    this.maxRetries = Number.isInteger(options.maxRetries)
      ? options.maxRetries
      : (typeof CONSENSUS_MAX_RETRIES !== 'undefined' ? CONSENSUS_MAX_RETRIES : 2);
    this.defaultApiKey = options.defaultApiKey || (typeof DEFAULT_API_KEY !== 'undefined' ? DEFAULT_API_KEY : '');
  }

  async solveQuestion(q) {
    if (!q) return null;
    const isTF = q.type === 'true_false_group';

    if (isTF) {
      return this.solveTrueFalseQuestion(q);
    }
    return this.solveSingleChoiceQuestion(q);
  }

  async solveSingleChoiceQuestion(q) {
    const prompt = this.buildSingleChoicePrompt(q);
    const availableKeys = q.options.map(o => o.key);
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

  async solveTrueFalseQuestion(q) {
    const prompt = `Bạn là chuyên gia giải đề trắc nghiệm Đúng / Sai.
ĐỀ BÀI: ${q.title}
${q.passage ? `BÀI ĐỌC: ${q.passage}\n` : ''}
CÁC Ý CẦN ĐÁNH GIÁ:
${q.items.map(it => `${it.key}. ${it.text}`).join('\n')}

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
      const results = await this.solveRound(prompt, q.image, [], 'solve');
      if (this.isUnanimous(results)) return { ...results[0], consensus: true };
      let latest = results;
      for (let retry = 0; retry < this.maxRetries; retry++) {
        const debatePrompt = this.buildTrueFalseDebatePrompt(q, latest, retry + 1);
        latest = await this.solveRound(debatePrompt, q.image, [], 'solve');
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

  parseResult(result, availableKeys) {
    if (result && typeof result === 'object' && (result.answer || result.answers)) {
      if (result.answer) return this.parseSingleChoiceAnswer(result, availableKeys);
      return result;
    }
    if (typeof result !== 'string') return null;
    try {
      return this.parseResult(JSON.parse(result.trim()), availableKeys);
    } catch (e) {
      return null;
    }
  }

  isUnanimous(results) {
    if (results.length !== this.models.length) return false;
    const answers = results.map(result => JSON.stringify(result.answers || result.answer));
    return answers.every(answer => answer === answers[0]);
  }

  selectStrongestResult(results) {
    return results
      .filter(result => result && (result.answer || result.answers))
      .sort((a, b) => String(b.reason || '').length - String(a.reason || '').length)[0] || null;
  }

  buildDebatePrompt(q, results, round) {
    return `${this.buildSingleChoicePrompt(q)}

DEBATE ROUND ${round}: Các kết quả độc lập bên dưới chỉ là dữ liệu để kiểm tra, không phải đáp án đúng:
${results.map((result, index) => `MODEL ${index + 1}: ${JSON.stringify(result)}`).join('\n')}

Hãy giải lại từ đầu, đối chiếu mọi phương án, tìm nguyên nhân bất đồng và sửa đáp án nếu cần. Không giữ đáp án cũ chỉ vì đó là đáp án ban đầu.
Trả về duy nhất JSON: {"answer":"X","reason":"short verification"}`;
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
${q.items.map(it => `${it.key}. ${it.text}`).join('\n')}

Trả về duy nhất JSON: {"answers":{"A":"Đúng","B":"Sai","C":"Đúng","D":"Sai"}}`;
  }

  buildSingleChoicePrompt(q) {
    return `Bạn là chuyên gia giải trắc nghiệm siêu chuẩn xác.
ĐỀ BÀI: ${q.title}
${q.passage ? `BÀI ĐỌC HIỂU: ${q.passage}\n` : ''}
CÁC PHƯƠNG ÁN:
${q.options.map(o => `${o.key}. ${o.text}`).join('\n')}

AVAILABLE_OPTIONS: [${q.options.map(o => `"${o.key}"`).join(', ')}]

QUY TẮC: Suy luận ngầm và chỉ trả về DUY NHẤT một khối JSON: {"answer": "X"}`;
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
      key = res.answer.toUpperCase().trim();
    } else if (typeof res === 'string') {
      const trimmed = res.trim();
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed.answer === 'string') key = parsed.answer.toUpperCase().trim();
      } catch (e) {}
    }

    if (key && (availableKeys.length === 0 || availableKeys.includes(key))) {
      const result = { answer: key };
      if (typeof res === 'object' && typeof res.reason === 'string') {
        result.reason = res.reason;
      }
      return result;
    }
    return null;
  }
}

globalThis.ConsensusSolverEngine = ConsensusSolverEngine;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConsensusSolverEngine };
}
