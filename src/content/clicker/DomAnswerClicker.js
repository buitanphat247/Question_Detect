class DomAnswerClicker {
  static forceClickTarget(targetInput, wrapperEl) {
    if (!targetInput && !wrapperEl) return false;

    const input = (targetInput && targetInput.tagName === 'INPUT') 
      ? targetInput 
      : (wrapperEl?.querySelector?.('input') || (targetInput?.querySelector?.('input') ? targetInput.querySelector('input') : targetInput));
    
    const row = wrapperEl || input?.closest?.('.r0, .r1, .form-check, .custom-control, .d-flex, label, tr, li, div') || input?.parentElement || input;
    const doc = input?.ownerDocument || document;

    // Tìm thẻ label liên kết
    const label = (input?.id ? doc.querySelector(`label[for="${input.id}"]`) : null) 
      || input?.closest?.('label') 
      || row?.querySelector?.('label') 
      || (row?.tagName === 'LABEL' ? row : null);

    const mainTarget = label || input || row;

    try {
      mainTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    } catch (e) {}

    // 1. Cập nhật thuộc tính checked qua prototype setter (vượt qua mọi override của framework)
    if (input && (input.type === 'radio' || input.type === 'checkbox')) {
      try {
        const proto = window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'checked')?.set;
        if (nativeSetter) {
          nativeSetter.call(input, true);
        } else {
          input.checked = true;
        }
      } catch (e) {
        input.checked = true;
      }
    }

    // 2. Kích hoạt chuỗi sự kiện chuột chuẩn xác trên target chính (label hoặc input)
    const clickElement = label || input || row;
    const mouseEvents = ['pointerdown', 'mousedown', 'pointerup', 'mouseup'];

    mouseEvents.forEach(type => {
      try {
        const evt = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          view: window,
          buttons: 1
        });
        clickElement.dispatchEvent(evt);
        if (input && input !== clickElement) {
          input.dispatchEvent(evt);
        }
      } catch (e) {}
    });

    // 3. Kích hoạt Native Click
    try {
      if (typeof clickElement.click === 'function') {
        clickElement.click();
      }
    } catch (e) {}

    if (input && input !== clickElement) {
      try {
        if (typeof input.click === 'function') {
          input.click();
        }
      } catch (e) {}
    }

    if (row && row !== clickElement && row !== input) {
      try {
        if (typeof row.click === 'function') {
          row.click();
        }
      } catch (e) {}
    }

    // 4. Kích hoạt Input & Change Events trên input và form
    if (input) {
      try {
        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
        input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
      } catch (e) {}

      try {
        const form = input.closest('form');
        if (form) {
          form.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
          form.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        }
      } catch (e) {}
    }

    // 5. Cập nhật các class trạng thái nếu trang web dùng custom visual state
    try {
      if (row) {
        row.classList.add('active', 'selected', 'checked');
        row.setAttribute('aria-checked', 'true');
      }
      if (label) {
        label.classList.add('active', 'selected', 'checked');
        label.setAttribute('aria-checked', 'true');
      }
    } catch (e) {}

    return true;
  }

  static autoSelectAnswerOnPage(qaId, targetKey, optionText = '') {
    if (!targetKey && !optionText) return false;
    const cleanKey = (targetKey || '').toUpperCase().trim();
    const cleanOpt = TextUtils.normalizeForMatch(optionText);

    // 1. Tìm chính xác theo data-qa-for và data-qa-opt
    if (qaId && cleanKey) {
      const exactInput = document.querySelector(`input[data-qa-for="${qaId}"][data-qa-opt="${cleanKey}"]`);
      if (exactInput) {
        const row = document.querySelector(`[data-qa-for="${qaId}"][data-qa-opt="${cleanKey}"]:not(input)`) || exactInput.parentElement;
        return DomAnswerClicker.forceClickTarget(exactInput, row);
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
        const selected = DomAnswerClicker.selectInCard(card, cleanKey, cleanOpt);
        if (selected) return true;
      }
    }

    // 3. Quét các thẻ câu hỏi trên trang
    const allCards = Array.from(document.querySelectorAll('.que, .yh-question-card, [data-qa-id], [class*="question-card"], [id^="q-"], [id^="question-"]'));
    for (const card of allCards) {
      const selected = DomAnswerClicker.selectInCard(card, cleanKey, cleanOpt);
      if (selected) return true;
    }

    // 4. Fallback quét toàn bộ radio/checkbox trên trang
    const allInputs = Array.from(document.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
      .filter(inp => inp.value !== '-1' && !inp.closest('.clear-choice, .clearchoice, .clear'));

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

    // 1. Thử theo data-qa-opt đã được gán trước đó
    if (cleanKey) {
      const optEl = card.querySelector(`input[data-qa-opt="${cleanKey}"], [data-qa-opt="${cleanKey}"]`);
      if (optEl) {
        const inp = optEl.tagName === 'INPUT' ? optEl : optEl.querySelector('input') || optEl;
        const row = optEl.tagName === 'INPUT' ? optEl.parentElement : optEl;
        return DomAnswerClicker.forceClickTarget(inp, row);
      }
    }

    // Lọc danh sách radio/checkbox hợp lệ của câu hỏi (loại trừ Xóa lựa chọn của Moodle)
    const validInputs = Array.from(card.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
      .filter(inp => {
        if (inp.value === '-1') return false;
        if (inp.closest('.clear-choice, .clearchoice, .clear, .clear-choice-option')) return false;
        const label = card.querySelector(`label[for="${inp.id}"]`) || inp.closest('label');
        const txt = (label?.innerText || label?.textContent || '').toLowerCase();
        if (txt.includes('xóa lựa chọn') || txt.includes('clear my choice')) return false;
        return true;
      });

    // 2. Thử theo cấu trúc answernumber / prefix chữ cái A, B, C, D
    for (const inp of validInputs) {
      const row = inp.closest('.r0, .r1, .form-check, .custom-control, .d-flex, tr, li, div, label') || inp.parentElement;
      const label = (inp.id ? card.querySelector(`label[for="${inp.id}"]`) : null) || inp.closest('label') || row;

      const numSpan = label?.querySelector('.answernumber, .option-letter, .choice-label');
      if (numSpan) {
        const spanTxt = (numSpan.innerText || numSpan.textContent || '').trim().toUpperCase();
        const sm = spanTxt.match(/([A-Za-zĐđ0-9])/);
        if (sm && sm[1] === cleanKey) {
          return DomAnswerClicker.forceClickTarget(inp, row);
        }
      }

      const rawTxt = label?.innerText || label?.textContent || row?.innerText || '';
      const m = rawTxt.match(TextUtils.OPTION_PREFIX_REGEX);
      if (m && m[1].toUpperCase() === cleanKey) {
        return DomAnswerClicker.forceClickTarget(inp, row);
      }
    }

    // 3. Thử theo nội dung text tương đồng
    if (cleanOpt) {
      for (const inp of validInputs) {
        const row = inp.closest('.r0, .r1, .form-check, .custom-control, .d-flex, tr, li, div, label') || inp.parentElement;
        const label = (inp.id ? card.querySelector(`label[for="${inp.id}"]`) : null) || inp.closest('label') || row;
        const rawTxt = label?.innerText || label?.textContent || row?.innerText || '';
        const normTxt = TextUtils.normalizeForMatch(rawTxt);
        if (normTxt && (normTxt === cleanOpt || normTxt.includes(cleanOpt) || cleanOpt.includes(normTxt))) {
          return DomAnswerClicker.forceClickTarget(inp, row);
        }
      }
    }

    // 4. BÁM SÁT CẤU TRÚC THỨ TỰ (Index structural fallback):
    // A -> 0, B -> 1, C -> 2, D -> 3, E -> 4
    if (cleanKey && cleanKey.length === 1 && validInputs.length >= 2) {
      const keyIndex = cleanKey.charCodeAt(0) - 65;
      if (keyIndex >= 0 && keyIndex < validInputs.length) {
        const targetInp = validInputs[keyIndex];
        const row = targetInp.closest('.r0, .r1, .form-check, .custom-control, .d-flex, tr, li, div') || targetInp.parentElement;
        return DomAnswerClicker.forceClickTarget(targetInp, row);
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
        const qCard = document.querySelector(
          `[data-qa-id="qa-detected-card-${qNum}"], ` +
          `[data-qa-id="qa-detected-moodle-${qNum}"], ` +
          `[data-qa-id="qa-detected-generic-${qNum}"], ` +
          `[data-qa-id="qa-detected-anchor-${qNum}"], ` +
          `[data-qa-id="qa-detected-direct-${qNum}"]`
        );
        const scope = qCard || document;
        Object.entries(item.answers).forEach(([key, val]) => {
          const isTrue = /đúng|true/i.test(val);
          const optCode = `${key.toUpperCase()}_${isTrue ? 'TRUE' : 'FALSE'}`;
          const target = scope.querySelector(`[data-qa-opt="${optCode}"]`);
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
        let qCard = document.querySelector(
          `[data-qa-id="qa-detected-card-${qNum}"], ` +
          `[data-qa-id="qa-detected-moodle-${qNum}"], ` +
          `[data-qa-id="qa-detected-generic-${qNum}"], ` +
          `[data-qa-id="qa-detected-anchor-${qNum}"], ` +
          `[data-qa-id="qa-detected-direct-${qNum}"]`
        );
        if (!qCard) {
          const allCards = Array.from(document.querySelectorAll('.que, .yh-question-card, [class*="question-card"], [id^="q-"], [id^="question-"]'));
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
        DomAnswerClicker.autoSelectAnswerOnPage(`qa-detected-moodle-${qNum}`, answerKey, optionText) ||
        DomAnswerClicker.autoSelectAnswerOnPage(`qa-detected-card-${qNum}`, answerKey, optionText) ||
        DomAnswerClicker.autoSelectAnswerOnPage(`qa-detected-direct-${qNum}`, answerKey, optionText) ||
        DomAnswerClicker.autoSelectAnswerOnPage(null, answerKey, optionText);
      }
    });
  }
}

globalThis.DomAnswerClicker = DomAnswerClicker;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DomAnswerClicker };
}
