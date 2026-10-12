class ContinuousSolveRunner {
  constructor(solverEngineOrOptions = {}, options = {}) {
    // Accept both constructor forms used across the extension:
    // new ContinuousSolveRunner(engine, options)
    // new ContinuousSolveRunner({ solverEngine: engine, onAutoAdvance })
    const config = solverEngineOrOptions?.solverEngine
      ? solverEngineOrOptions
      : options;
    this.solverEngine = solverEngineOrOptions?.solverEngine || solverEngineOrOptions;
    this.isSolvingProcess = false;
    this.requestSequence = 0;
    this.activeRequestId = 0;
    this.onAutoAdvance = config.onAutoAdvance || this.defaultAutoAdvance.bind(this);
    this.isAutoAdvanceEnabled = config.isAutoAdvanceEnabled || (() => false);
  }

  stop() {
    this.isSolvingProcess = false;
    // Invalidate any in-flight response. The background request may still finish,
    // but it can no longer update this page.
    this.activeRequestId = ++this.requestSequence;
  }

  getCacheContext() {
    const models = Array.isArray(this.solverEngine?.models) ? this.solverEngine.models.join(',') : '';
    const normalization = typeof ANSWER_NORMALIZATION_VERSION !== 'undefined' ? ANSWER_NORMALIZATION_VERSION : '2';
    return `models:${models}|normalization:${normalization}`;
  }

  getQuestionFingerprint(question) {
    if (!question || typeof TextUtils === 'undefined' || typeof TextUtils.hashQuestion !== 'function') return '';
    return TextUtils.hashQuestion(question, this.getCacheContext());
  }

  beginRequest(question) {
    const id = ++this.requestSequence;
    this.activeRequestId = id;
    return { id, fingerprint: this.getQuestionFingerprint(question), element: question?.element };
  }

  isRequestCurrent(request, question) {
    if (!request || !question || !this.isSolvingProcess || request.id !== this.activeRequestId) return false;
    if (!question.element?.isConnected || request.element !== question.element) return false;
    const latest = (ExamDomScanner.scanAll() || []).find(candidate => candidate.element === question.element || candidate.id === question.id);
    return !!latest && this.getQuestionFingerprint(latest) === request.fingerprint;
  }

  canApplyResult(request, question, result) {
    return this.isRequestCurrent(request, question) && result?.consensus === true;
  }

  isQuestionVisible(q) {
    if (!q || !q.element) return false;
    const el = q.element;
    if (el.offsetParent === null && window.getComputedStyle(el).position !== 'fixed') {
      return false;
    }
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  isElementInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const vHeight = window.innerHeight || document.documentElement.clientHeight;
    const vWidth = window.innerWidth || document.documentElement.clientWidth;
    return (
      rect.bottom > 80 &&
      rect.top < vHeight - 80 &&
      rect.right > 0 &&
      rect.left < vWidth
    );
  }

  findActiveQuestion(questions) {
    if (!questions || questions.length === 0) return null;

    // 1. Lọc tất cả các câu hỏi đang hiển thị trên màn hình
    const visible = questions.filter(q => this.isQuestionVisible(q));

    if (visible.length === 1) {
      // Chế độ 1 câu/trang: Chọn đúng câu duy nhất đang hiển thị!
      return visible[0];
    }

    if (visible.length > 1) {
      // Chế độ hiển thị nhiều câu: ưu tiên câu nằm trong viewport và chưa trả lời
      const inViewUnanswered = visible.find(q => this.isElementInViewport(q.element) && !this.isQuestionAnswered(q));
      if (inViewUnanswered) return inViewUnanswered;

      // Hoặc câu nằm trong viewport
      const inView = visible.find(q => this.isElementInViewport(q.element));
      if (inView) return inView;

      // Hoặc câu visible đầu tiên chưa trả lời
      const firstUnanswered = visible.find(q => !this.isQuestionAnswered(q));
      if (firstUnanswered) return firstUnanswered;

      return visible[0];
    }

    return questions.find(q => !this.isQuestionAnswered(q)) || questions[0];
  }

  async solveSingle() {
    if (this.isSolvingProcess) return;
    this.isSolvingProcess = true;

    try {
      const questions = ExamDomScanner.scanAll();
      if (!questions || questions.length === 0) {
        StealthToastNotifier.show('Không tìm thấy câu hỏi nào trên trang.', 'error', 2500);
        this.isSolvingProcess = false;
        return;
      }

      // Chọn câu hỏi đang hiển thị trên màn hình hiện tại
      let targetQ = this.findActiveQuestion(questions);
      if (!targetQ) targetQ = questions[0];
      const request = this.beginRequest(targetQ);

      StealthToastNotifier.show(`Đang giải câu ${targetQ.num}...`, 'info', 2000);

      const cached = await this.getCachedResult(targetQ);
      if (!this.isRequestCurrent(request, targetQ)) return;
      const result = cached || await this.solverEngine.solveQuestion(targetQ);
      if (this.canApplyResult(request, targetQ, result)) {
        if (!cached && result.consensus === true) this.saveCachedResult(targetQ, result);
        DomAnswerClicker.clearSuggestedMarkers(targetQ.element);

        // 1. Câu hỏi Đúng / Sai
        if (targetQ.type === 'true_false_group' && result.answers) {
          Object.entries(result.answers).forEach(([key, val]) => {
            const isTrue = /đúng|true/i.test(val);
            const optCode = `${key.toUpperCase()}_${isTrue ? 'TRUE' : 'FALSE'}`;
            const item = targetQ.items?.find(it => it.key === key.toUpperCase());
            const targetInput = isTrue ? item?.trueInput : item?.falseInput;
            if (targetInput) {
              DomAnswerClicker.forceClickTarget(targetInput, targetInput.parentElement);
            } else {
              const inp = targetQ.element?.querySelector(`[data-qa-opt="${optCode}"]`);
              if (inp) DomAnswerClicker.forceClickTarget(inp.tagName === 'INPUT' ? inp : inp.querySelector('input') || inp, inp);
            }
          });
          StealthToastNotifier.show(`Đã chọn câu ${targetQ.num}`, 'success', 2000);
        }
        // 2. Câu hỏi Short Answer / Điền text
        else if (targetQ.type === 'short_answer') {
          const textToFill = result.answerText || result.answer || '';
          const targetInp = targetQ.input || targetQ.inputs?.[0];
          if (targetInp && textToFill && !String(targetInp.value || '').trim()) {
            DomAnswerClicker.fillTextInput(targetInp, textToFill);
            StealthToastNotifier.show(`Câu ${targetQ.num}: đã điền [${textToFill}]`, 'success', 2200);
          }
        }
        // 3. Câu hỏi Dropdown / Sổ xuống
        else if (targetQ.type === 'dropdown_select') {
          const ansMap = result.dropdownAnswers || result.answers || {};
          let filledCount = 0;
          (targetQ.selects || []).forEach(sel => {
            // Tìm giá trị tương ứng theo nhãn hoặc id
            const matchedKey = Object.keys(ansMap).find(k =>
              k.toLowerCase() === (sel.label || '').toLowerCase() ||
              k.toLowerCase() === (sel.id || '').toLowerCase() ||
              (sel.label || '').toLowerCase().includes(k.toLowerCase())
            );
            const val = matchedKey ? ansMap[matchedKey] : null;
            if (val && sel.element) {
              DomAnswerClicker.selectDropdownOption(sel.element, val);
              filledCount++;
            }
          });
          StealthToastNotifier.show(`Câu ${targetQ.num}: đã đánh dấu ${filledCount} lựa chọn sổ xuống`, 'success', 2200);
        }
        // 4. Trắc nghiệm nhiều đáp án (Checkboxes)
        else if (Array.isArray(result.answers)) {
          for (const ansKey of result.answers) {
            const cleanKey = String(ansKey).toUpperCase().trim();
            const opt = targetQ.options?.find(o => o.key === cleanKey);
            let clicked = false;
            if (opt && (opt.input || opt.label || opt.element)) {
              clicked = DomAnswerClicker.forceClickTarget(opt.input, opt.label || opt.element);
            }
            if (!clicked) {
              clicked = DomAnswerClicker.autoSelectAnswerOnPage(targetQ.id, cleanKey, opt?.text || '');
            }
            if (!clicked && targetQ.element) {
              clicked = DomAnswerClicker.selectInCard(targetQ.element, cleanKey, opt?.text || '');
            }
            if (!clicked && targetQ.options && targetQ.options.length >= 2) {
              const idx = cleanKey.charCodeAt(0) - 65;
              const fallbackOpt = targetQ.options[idx];
              if (fallbackOpt) {
                clicked = DomAnswerClicker.forceClickTarget(fallbackOpt.input, fallbackOpt.label || fallbackOpt.element);
              }
            }
            await new Promise(r => setTimeout(r, 120));
          }
          StealthToastNotifier.show(`Câu ${targetQ.num}: gợi ý [${result.answers.join(', ')}]`, 'success', 2000);
        }
        // 5. Trắc nghiệm 1 đáp án (Radio)
        else if (result.answer) {
          const opt = targetQ.options?.find(o => o.key === result.answer);
          let clicked = false;

          if (opt && (opt.input || opt.label || opt.element)) {
            clicked = DomAnswerClicker.forceClickTarget(opt.input, opt.label || opt.element);
          }
          if (!clicked) {
            clicked = DomAnswerClicker.autoSelectAnswerOnPage(targetQ.id, result.answer, opt?.text || '');
          }
          if (!clicked && targetQ.element) {
            clicked = DomAnswerClicker.selectInCard(targetQ.element, result.answer, opt?.text || '');
          }
          if (!clicked && targetQ.options && targetQ.options.length >= 2) {
            const idx = result.answer.charCodeAt(0) - 65;
            const fallbackOpt = targetQ.options[idx];
            if (fallbackOpt) {
              clicked = DomAnswerClicker.forceClickTarget(fallbackOpt.input, fallbackOpt.label || fallbackOpt.element);
            }
          }

          StealthToastNotifier.show(`Câu ${targetQ.num}: gợi ý [${result.answer}]`, 'success', 2200);
        }
      } else {
        StealthToastNotifier.show(`Bất đồng thuận câu ${targetQ.num}`, 'warning', 2500);
      }
    } catch (err) {
      StealthToastNotifier.show('Lỗi trong quá trình giải câu hỏi.', 'error', 2500);
    } finally {
      this.isSolvingProcess = false;
    }
  }

  async solveContinuous() {
    if (this.isSolvingProcess) return;
    this.isSolvingProcess = true;

    try {
      const questions = ExamDomScanner.scanAll();
      if (!questions || questions.length === 0) {
        StealthToastNotifier.show('Không tìm thấy câu hỏi nào trên trang.', 'error', 2500);
        this.isSolvingProcess = false;
        return;
      }

      // Chỉ giải các câu hỏi đang hiển thị trên trang hiện tại!
      const visibleQuestions = questions.filter(q => this.isQuestionVisible(q));
      const targetQuestions = visibleQuestions.length > 0 ? visibleQuestions : questions;

      for (const q of targetQuestions) {
        if (!this.isSolvingProcess) break;
        if (this.isQuestionAnswered(q)) continue;
        const request = this.beginRequest(q);

        StealthToastNotifier.show(`Đang giải câu ${q.num}...`, 'info', 1500);
        const cached = await this.getCachedResult(q);
        if (!this.isRequestCurrent(request, q)) continue;
        const result = cached || await this.solverEngine.solveQuestion(q);
        if (this.canApplyResult(request, q, result)) {
          if (!cached && result.consensus === true) this.saveCachedResult(q, result);
          DomAnswerClicker.clearSuggestedMarkers(q.element);

          if (q.type === 'true_false_group' && result.answers) {
            Object.entries(result.answers).forEach(([key, val]) => {
              const isTrue = /đúng|true/i.test(val);
              const optCode = `${key.toUpperCase()}_${isTrue ? 'TRUE' : 'FALSE'}`;
              const item = q.items?.find(it => it.key === key.toUpperCase());
              const targetInput = isTrue ? item?.trueInput : item?.falseInput;
              if (targetInput) {
                DomAnswerClicker.forceClickTarget(targetInput, targetInput.parentElement);
              } else {
                const inp = q.element?.querySelector(`[data-qa-opt="${optCode}"]`);
                if (inp) DomAnswerClicker.forceClickTarget(inp.tagName === 'INPUT' ? inp : inp.querySelector('input') || inp, inp);
              }
            });
          } else if (q.type === 'short_answer') {
            const textToFill = result.answerText || result.answer || '';
            const targetInp = q.input || q.inputs?.[0];
            if (targetInp && textToFill && !String(targetInp.value || '').trim()) {
              DomAnswerClicker.fillTextInput(targetInp, textToFill);
            }
          } else if (q.type === 'dropdown_select') {
            const ansMap = result.dropdownAnswers || result.answers || {};
            (q.selects || []).forEach(sel => {
              const matchedKey = Object.keys(ansMap).find(k =>
                k.toLowerCase() === (sel.label || '').toLowerCase() ||
                k.toLowerCase() === (sel.id || '').toLowerCase() ||
                (sel.label || '').toLowerCase().includes(k.toLowerCase())
              );
              const val = matchedKey ? ansMap[matchedKey] : null;
              if (val && sel.element) {
                DomAnswerClicker.selectDropdownOption(sel.element, val);
              }
            });
          } else if (Array.isArray(result.answers)) {
            for (const ansKey of result.answers) {
              const cleanKey = String(ansKey).toUpperCase().trim();
              const opt = q.options?.find(o => o.key === cleanKey);
              let clicked = false;
              if (opt && (opt.input || opt.label || opt.element)) {
                clicked = DomAnswerClicker.forceClickTarget(opt.input, opt.label || opt.element);
              }
              if (!clicked) {
                clicked = DomAnswerClicker.autoSelectAnswerOnPage(q.id, cleanKey, opt?.text || '');
              }
              if (!clicked && q.element) {
                clicked = DomAnswerClicker.selectInCard(q.element, cleanKey, opt?.text || '');
              }
              if (!clicked && q.options && q.options.length >= 2) {
                const idx = cleanKey.charCodeAt(0) - 65;
                const fallbackOpt = q.options[idx];
                if (fallbackOpt) {
                  clicked = DomAnswerClicker.forceClickTarget(fallbackOpt.input, fallbackOpt.label || fallbackOpt.element);
                }
              }
              await new Promise(r => setTimeout(r, 120));
            }
          } else if (result.answer) {
            const opt = q.options?.find(o => o.key === result.answer);
            let clicked = false;

            if (opt && (opt.input || opt.label || opt.element)) {
              clicked = DomAnswerClicker.forceClickTarget(opt.input, opt.label || opt.element);
            }
            if (!clicked) {
              clicked = DomAnswerClicker.autoSelectAnswerOnPage(q.id, result.answer, opt?.text || '');
            }
            if (!clicked && q.element) {
              clicked = DomAnswerClicker.selectInCard(q.element, result.answer, opt?.text || '');
            }
            if (!clicked && q.options && q.options.length >= 2) {
              const idx = result.answer.charCodeAt(0) - 65;
              const fallbackOpt = q.options[idx];
              if (fallbackOpt) {
                clicked = DomAnswerClicker.forceClickTarget(fallbackOpt.input, fallbackOpt.label || fallbackOpt.element);
              }
            }
          }
        }
        await new Promise(r => setTimeout(r, 600));
      }

      if (this.isSolvingProcess && this.isAutoAdvanceEnabled() && !DomAnswerClicker.MANUAL_REVIEW_MODE) {
        StealthToastNotifier.show('Đã giải xong các câu trên trang này!', 'success', 2500);
        this.onAutoAdvance();
      } else if (this.isSolvingProcess && this.isAutoAdvanceEnabled() && DomAnswerClicker.MANUAL_REVIEW_MODE) {
        StealthToastNotifier.show('Đã đánh dấu gợi ý. Hãy tự chọn đáp án trước khi chuyển trang.', 'info', 3000);
      }
    } catch (err) {
      StealthToastNotifier.show('Lỗi tiến trình tự động giải.', 'error', 2500);
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
    if (q.type === 'short_answer') {
      const inp = q.input || q.inputs?.[0];
      return !!(inp && inp.value && inp.value.trim().length > 0);
    }
    if (q.type === 'dropdown_select') {
      const selects = q.selects || [];
      if (selects.length === 0) return false;
      return selects.every(s => s.element && s.element.value && s.element.value !== '');
    }
    const checked = Array.from(q.element.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked'))
      .filter(inp => inp.value !== '-1' && !inp.closest('.clear-choice, .clearchoice, .clear'));
    return checked.length > 0;
  }

  defaultAutoAdvance() {
    const nextBtn = document.querySelector('input[name="next"], .mod_quiz-next-nav, #mod_quiz-next-nav, button.next-page, a.next-page');
    if (nextBtn) {
      nextBtn.click();
    }
  }

  async getCachedResult(q) {
    if (typeof isSupabaseCacheEnabled === 'function' && !isSupabaseCacheEnabled()) return null;
    if (!q || typeof TextUtils === 'undefined' || typeof TextUtils.hashQuestion !== 'function') return null;
    try {
      const hash = this.getQuestionFingerprint(q);
      const action = globalThis.MessageActions?.CHECK_SUPABASE_BATCH || 'CHECK_SUPABASE_BATCH';
      const response = await new Promise(resolve => chrome.runtime.sendMessage({ action, hashes: [hash] }, resolve));
      const item = response?.data?.[hash];
      const answer = item?.answer;
      return answer && answer.consensus === true && answer.cacheContext === this.getCacheContext() ? answer : null;
    } catch (e) { return null; }
  }

  saveCachedResult(q, result) {
    if (typeof isSupabaseCacheEnabled === 'function' && !isSupabaseCacheEnabled()) return;
    if (!q || !result || typeof TextUtils === 'undefined' || typeof TextUtils.hashQuestion !== 'function') return;
    try {
      const action = globalThis.MessageActions?.SAVE_SUPABASE_CACHE || 'SAVE_SUPABASE_CACHE';
      chrome.runtime.sendMessage({
        action,
        hash: this.getQuestionFingerprint(q),
        questionText: q.title,
        translatedText: q.passage || null,
        answer: { ...result, cacheContext: this.getCacheContext() }
      }, () => {});
    } catch (e) {}
  }
}

globalThis.ContinuousSolveRunner = ContinuousSolveRunner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ContinuousSolveRunner };
}
