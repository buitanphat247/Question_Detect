class ConsensusSolverEngine {
  constructor(options = {}) {
    this.primaryModel = options.primaryModel || (typeof DEFAULT_MODEL !== 'undefined' ? DEFAULT_MODEL : 'claude-opus-4-8');
    this.consensusModel = options.consensusModel || (typeof CONSENSUS_MODEL !== 'undefined' ? CONSENSUS_MODEL : 'gemini-3.5-flash');
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

    const [resp1, resp2] = await Promise.allSettled([
      this.sendSolveRequest(prompt, this.primaryModel, q.image),
      this.sendSolveRequest(prompt, this.consensusModel, q.image)
    ]);

    const ans1 = resp1.status === 'fulfilled' ? this.parseSingleChoiceAnswer(resp1.value, availableKeys) : null;
    const ans2 = resp2.status === 'fulfilled' ? this.parseSingleChoiceAnswer(resp2.value, availableKeys) : null;

    if (ans1 && ans2 && ans1.answer === ans2.answer) {
      return ans1;
    }

    // Nếu mismatch, kích hoạt Cross-Review
    if (ans1 && ans2 && ans1.answer !== ans2.answer) {
      const crossPrompt = `Bạn đang thực hiện phản biện độc lập cho câu hỏi trắc nghiệm sau:
ĐỀ BÀI: ${q.title}
${q.passage ? `BÀI ĐỌC: ${q.passage}\n` : ''}
CÁC PHƯƠNG ÁN:
${q.options.map(o => `${o.key}. ${o.text}`).join('\n')}

Trước đó:
- Model 1 đưa ra đáp án: ${ans1.answer}
- Model 2 đưa ra đáp án: ${ans2.answer}

QUY TẮC:
1. Đánh giá xem ${ans1.answer} hay ${ans2.answer} mới là đáp án đúng, hoặc chọn đáp án đúng thực tế nếu cả hai sai.
2. Trả về DUY NHẤT một khối JSON: {"answer": "X"}`;

      try {
        const reviewResp = await this.sendSolveRequest(crossPrompt, this.consensusModel, q.image);
        const reviewedAns = this.parseSingleChoiceAnswer(reviewResp, availableKeys);
        if (reviewedAns && reviewedAns.answer) {
          return reviewedAns;
        }
      } catch (e) {}
    }

    return ans1 || ans2 || null;
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
      const resp = await this.sendSolveRequest(prompt, this.primaryModel, q.image);
      if (resp && resp.answers) return resp;
      if (typeof resp === 'string') {
        const match = resp.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
      }
    } catch (e) {}
    return null;
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

  async sendSolveRequest(prompt, model, imageUrl) {
    return new Promise((resolve, reject) => {
      const action = globalThis.MessageActions?.CALL_KEY4U_AI || 'CALL_KEY4U_AI';
      chrome.runtime.sendMessage({
        action: action,
        prompt: prompt,
        model: model,
        imageUrl: imageUrl,
        enableReasoning: true,
        reasoningEffort: 'high'
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
      if (availableKeys.includes(trimmed.toUpperCase())) {
        key = trimmed.toUpperCase();
      } else {
        const m = trimmed.match(/\b([A-H])\b/);
        if (m) key = m[1].toUpperCase();
      }
    }

    if (key && (availableKeys.length === 0 || availableKeys.includes(key))) {
      return { answer: key };
    }
    return null;
  }
}

globalThis.ConsensusSolverEngine = ConsensusSolverEngine;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ConsensusSolverEngine };
}
