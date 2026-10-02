class ContinuousSolveRunner {
  constructor({ solverEngine, onAutoAdvance } = {}) {
    this.solverEngine = solverEngine || new ConsensusSolverEngine();
    this.onAutoAdvance = onAutoAdvance || (() => {});
    this.isSolvingProcess = false;
  }

  isAutoAdvanceEnabled() {
    try {
      return sessionStorage.getItem('qa_auto_advance_enabled') === 'true';
    } catch (e) {
      return false;
    }
  }

  setAutoAdvanceEnabled(val) {
    try {
      if (val) {
        sessionStorage.setItem('qa_auto_advance_enabled', 'true');
      } else {
        sessionStorage.removeItem('qa_auto_advance_enabled');
      }
    } catch (e) {}
  }

  stop() {
    this.isSolvingProcess = false;
    this.setAutoAdvanceEnabled(false);
    StealthToastNotifier.show('⏹ Đã dừng tiến trình giải.', 'info', 1800);
  }

  async solveSingle() {
    if (this.isSolvingProcess) return;
    this.isSolvingProcess = true;

    try {
      const questions = ExamDomScanner.scanAll();
      if (!questions || questions.length === 0) {
        StealthToastNotifier.show('⚠️ Không tìm thấy câu hỏi nào trên trang.', 'error', 2500);
        this.isSolvingProcess = false;
        return;
      }

      // Tìm câu hỏi chưa được làm hoặc câu hỏi đang hiển thị trong tầm nhìn
      let targetQ = questions.find(q => !this.isQuestionAnswered(q)) || questions[0];
      StealthToastNotifier.show(`🤖 Đang giải câu ${targetQ.num}...`, 'info', 2000);

      const result = await this.solverEngine.solveQuestion(targetQ);
      if (result) {
        if (targetQ.type === 'true_false_group' && result.answers) {
          Object.entries(result.answers).forEach(([key, val]) => {
            const isTrue = /đúng|true/i.test(val);
            const optCode = `${key.toUpperCase()}_${isTrue ? 'TRUE' : 'FALSE'}`;
            const inp = targetQ.element?.querySelector(`[data-qa-opt="${optCode}"]`);
            if (inp) DomAnswerClicker.forceClickTarget(inp.tagName === 'INPUT' ? inp : inp.querySelector('input') || inp, inp);
          });
          StealthToastNotifier.show(`✅ Đã chọn câu ${targetQ.num}`, 'success', 2000);
        } else if (result.answer) {
          const opt = targetQ.options?.find(o => o.key === result.answer);
          DomAnswerClicker.autoSelectAnswerOnPage(targetQ.id, result.answer, opt?.text || '');
          StealthToastNotifier.show(`✅ Câu ${targetQ.num}: Đáp án [${result.answer}]`, 'success', 2200);
        }
      } else {
        StealthToastNotifier.show(`❌ Không thể giải câu ${targetQ.num}`, 'error', 2500);
      }
    } catch (err) {
      StealthToastNotifier.show('❌ Lỗi khi giải câu hỏi.', 'error', 2500);
    } finally {
      this.isSolvingProcess = false;
    }
  }

  async solveContinuous() {
    if (this.isSolvingProcess) return;
    this.isSolvingProcess = true;
    this.setAutoAdvanceEnabled(true);

    try {
      const questions = ExamDomScanner.scanAll();
      if (!questions || questions.length === 0) {
        StealthToastNotifier.show('⚠️ Không tìm thấy câu hỏi để giải tiếp.', 'error', 2500);
        this.isSolvingProcess = false;
        return;
      }

      StealthToastNotifier.show(`🚀 Bắt đầu tự động giải (${questions.length} câu)...`, 'info', 2500);

      for (let i = 0; i < questions.length; i++) {
        if (!this.isAutoAdvanceEnabled()) break;
        const q = questions[i];
        if (this.isQuestionAnswered(q)) continue;

        StealthToastNotifier.show(`🤖 Đang giải câu ${q.num} (${i + 1}/${questions.length})...`, 'info', 1500);
        const result = await this.solverEngine.solveQuestion(q);

        if (result) {
          if (q.type === 'true_false_group' && result.answers) {
            Object.entries(result.answers).forEach(([key, val]) => {
              const isTrue = /đúng|true/i.test(val);
              const optCode = `${key.toUpperCase()}_${isTrue ? 'TRUE' : 'FALSE'}`;
              const inp = q.element?.querySelector(`[data-qa-opt="${optCode}"]`);
              if (inp) DomAnswerClicker.forceClickTarget(inp.tagName === 'INPUT' ? inp : inp.querySelector('input') || inp, inp);
            });
          } else if (result.answer) {
            const opt = q.options?.find(o => o.key === result.answer);
            DomAnswerClicker.autoSelectAnswerOnPage(q.id, result.answer, opt?.text || '');
          }
        }
        await new Promise(r => setTimeout(r, 600));
      }

      if (this.isAutoAdvanceEnabled()) {
        StealthToastNotifier.show('✅ Đã giải xong toàn bộ câu trang này!', 'success', 2500);
        this.onAutoAdvance();
      }
    } catch (err) {
      StealthToastNotifier.show('❌ Lỗi tiến trình tự động giải.', 'error', 2500);
    } finally {
      this.isSolvingProcess = false;
    }
  }

  isQuestionAnswered(q) {
    if (!q || !q.element) return false;
    if (q.type === 'true_false_group') {
      const inputs = Array.from(q.element.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked'));
      return inputs.length >= (q.items?.length || 4);
    }
    const checked = q.element.querySelector('input[type="radio"]:checked, input[type="checkbox"]:checked');
    return !!checked;
  }
}

globalThis.ContinuousSolveRunner = ContinuousSolveRunner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContinuousSolveRunner };
}
