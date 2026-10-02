class DomAnswerClicker {
  static forceClickTarget(targetInput, wrapperEl) {
    if (!targetInput && !wrapperEl) return false;
    const el = targetInput || wrapperEl;

    try {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    } catch (e) {}

    const events = ['pointerdown', 'mousedown', 'focus', 'click', 'pointerup', 'mouseup', 'change', 'input'];

    events.forEach(evtType => {
      try {
        const evt = new MouseEvent(evtType, {
          bubbles: true,
          cancelable: true,
          view: window,
          buttons: 1
        });
        el.dispatchEvent(evt);
        if (targetInput && targetInput !== el) {
          targetInput.dispatchEvent(evt);
        }
      } catch (e) {}
    });

    if (targetInput && (targetInput.type === 'radio' || targetInput.type === 'checkbox')) {
      targetInput.checked = true;
    }

    return true;
  }

  static autoSelectAnswerOnPage(qaId, targetKey, optionText = '') {
    if (!targetKey && !optionText) return false;
    const cleanKey = (targetKey || '').toUpperCase().trim();
    const cleanOpt = TextUtils.normalizeForMatch(optionText);

    // 1. Tìm theo data-qa-for và data-qa-opt
    if (qaId && cleanKey) {
      const exactInput = document.querySelector(`input[data-qa-for="${qaId}"][data-qa-opt="${cleanKey}"]`);
      if (exactInput) {
        return DomAnswerClicker.forceClickTarget(exactInput, exactInput.parentElement);
      }
      const exactWrapper = document.querySelector(`[data-qa-for="${qaId}"][data-qa-opt="${cleanKey}"]`);
      if (exactWrapper) {
        const inp = exactWrapper.querySelector('input') || exactWrapper;
        return DomAnswerClicker.forceClickTarget(inp, exactWrapper);
      }
    }

    // 2. Tìm trong container câu hỏi nếu có qaId
    if (qaId) {
      const card = document.querySelector(`[data-qa-id="${qaId}"]`);
      if (card) {
        return DomAnswerClicker.selectInCard(card, cleanKey, cleanOpt);
      }
    }

    // 3. Fallback quét toàn trang
    const allInputs = Array.from(document.querySelectorAll('input[type="radio"], input[type="checkbox"]')).filter(TextUtils.isVisible);
    for (const inp of allInputs) {
      const cont = inp.closest('label, div, li, tr') || inp.parentElement;
      const txt = TextUtils.normalizeForMatch(cont?.innerText || '');
      if (cleanOpt && txt && (txt === cleanOpt || txt.includes(cleanOpt) || cleanOpt.includes(txt))) {
        return DomAnswerClicker.forceClickTarget(inp, cont);
      }
    }

    return false;
  }

  static selectInCard(card, targetKey, optionText = '') {
    if (!card) return false;
    const cleanKey = (targetKey || '').toUpperCase().trim();
    const cleanOpt = TextUtils.normalizeForMatch(optionText);

    // Thử theo data-qa-opt
    if (cleanKey) {
      const optEl = card.querySelector(`[data-qa-opt="${cleanKey}"]`);
      if (optEl) {
        const inp = optEl.tagName === 'INPUT' ? optEl : optEl.querySelector('input') || optEl;
        return DomAnswerClicker.forceClickTarget(inp, optEl);
      }
    }

    // Thử theo nội dung text của option
    const options = Array.from(card.querySelectorAll('.option, .choice, .form-check, .yh-option, label, tr, div')).filter(TextUtils.isVisible);
    for (const opt of options) {
      const inp = opt.querySelector('input[type="radio"], input[type="checkbox"]') || (opt.tagName === 'INPUT' ? opt : null);
      if (!inp) continue;
      const rawTxt = opt.innerText || opt.textContent || '';
      const normTxt = TextUtils.normalizeForMatch(rawTxt);

      const m = rawTxt.match(TextUtils.OPTION_PREFIX_REGEX);
      if (m && m[1].toUpperCase() === cleanKey) {
        return DomAnswerClicker.forceClickTarget(inp, opt);
      }

      if (cleanOpt && normTxt && (normTxt === cleanOpt || normTxt.includes(cleanOpt) || cleanOpt.includes(normTxt))) {
        return DomAnswerClicker.forceClickTarget(inp, opt);
      }
    }

    return false;
  }

  static applyCaptureSolveResults(items) {
    if (!Array.isArray(items) || items.length === 0) return;

    items.forEach(item => {
      const qNum = item.num || 1;

      // 1. Đúng / Sai
      if (item.type === 'true_false_group' && item.answers) {
        Object.entries(item.answers).forEach(([key, val]) => {
          const isTrue = /đúng|true/i.test(val);
          const optCode = `${key.toUpperCase()}_${isTrue ? 'TRUE' : 'FALSE'}`;
          const target = document.querySelector(`[data-qa-opt="${optCode}"]`);
          if (target) {
            DomAnswerClicker.forceClickTarget(target.tagName === 'INPUT' ? target : target.querySelector('input') || target, target);
          }
        });
        return;
      }

      // 2. Trắc nghiệm 1 đáp án A, B, C, D
      const answerKey = (item.answer || '').toUpperCase().trim();
      const optionText = (item.optionText || '').trim();
      if (!answerKey && !optionText) return;

      let selected = false;
      if (window.__qaLastSnippedCard && document.body.contains(window.__qaLastSnippedCard)) {
        selected = DomAnswerClicker.selectInCard(window.__qaLastSnippedCard, answerKey, optionText);
      }

      if (!selected) {
        let qCard = document.querySelector(`[data-qa-id="qa-detected-card-${qNum}"], [data-qa-id="qa-detected-moodle-${qNum}"], [data-qa-id="qa-detected-generic-${qNum}"]`);
        if (!qCard) {
          const allCards = Array.from(document.querySelectorAll('.que, .yh-question-card, [class*="question-card"], [id^="q-"]'));
          for (const card of allCards) {
            const numElem = card.querySelector('.yh-question-stem__label, .qno, .no, h3, h4, h5') || card;
            const numTxt = (numElem.innerText || numElem.textContent || '').trim();
            const m = numTxt.match(/(?:question|câu|câu\s*hỏi|quest|q|bài)\s*(\d+)\b/i);
            if (m && parseInt(m[1], 10) === qNum) {
              qCard = card;
              break;
            }
          }
        }
        if (qCard) {
          selected = DomAnswerClicker.selectInCard(qCard, answerKey, optionText);
        }
      }

      if (!selected) {
        DomAnswerClicker.autoSelectAnswerOnPage(`qa-detected-card-${qNum}`, answerKey, optionText) ||
        DomAnswerClicker.autoSelectAnswerOnPage(`qa-detected-moodle-${qNum}`, answerKey, optionText) ||
        DomAnswerClicker.autoSelectAnswerOnPage(null, answerKey, optionText);
      }
    });
  }
}

globalThis.DomAnswerClicker = DomAnswerClicker;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DomAnswerClicker };
}
