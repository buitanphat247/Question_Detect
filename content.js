/**
 * Q&A Detector & AI Auto Solver - Content Script
 * Tự động click chọn đáp án trực tiếp trên web với forceClickOption siêu mạnh.
 */

(function () {
  const QUESTION_HEADER_REGEX = /(?:^|\s)(?:câu|question|quest|q|bài|item|câu\s*hỏi)\s*(\d+)/i;
  const OPTION_PREFIX_REGEX = /^\s*([A-Za-zĐđ①-⑩❶-❿Ⓐ-Ⓗ])[\.\)\/:\–—\-]\s*(.*)$/;

  const SYSTEM_SPAM_WORDS = [
    'clear my choice', 'xóa lựa chọn', 'chưa trả lời', 'not yet answered',
    'đạt điểm', 'marked out of', 'đặt cờ', 'flag question', 'đoạn văn câu hỏi',
    'question text', 'bảng câu hỏi', 'quiz navigation', 'trang tiếp', 'next page',
    'quay lại', 'làm xong', 'finish attempt', 'nộp bài', 'kết quả bài làm',
    'tổng hợp bài tập', 'bạn đang đăng nhập', 'logged in as', 'copyright',
    'mở chỉ số ngăn', 'khóa học', 'course'
  ];

  const IGNORE_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'NAV', 'HEADER', 'FOOTER',
    'IFRAME', 'BUTTON', 'SELECT', 'TEXTAREA', 'AUDIO', 'VIDEO', 'ASIDE'
  ]);

  function isVisible(elem) {
    if (!elem) return false;
    const cls = (elem.className || '').toString();
    if (cls.includes('accesshide') || cls.includes('sr-only') || cls.includes('hidden-screen')) {
      return false;
    }
    if (elem.offsetParent === null && elem.tagName !== 'BODY') return false;
    const style = window.getComputedStyle(elem);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rect = elem.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return true;
  }

  function cleanText(str) {
    if (!str) return '';
    return str
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/^đoạn văn câu hỏi\s*/i, '')
      .replace(/^question text\s*/i, '')
      .trim();
  }

  function isSpamText(text) {
    if (!text) return true;
    const lower = text.toLowerCase().trim();
    return SYSTEM_SPAM_WORDS.some(spam => lower === spam || lower.startsWith(spam) || (lower.length < 40 && lower.includes(spam)));
  }

  function cleanOptionText(text, currentKey) {
    if (!text) return '';
    let clean = cleanText(text);

    if (currentKey) {
      const selfPrefix = new RegExp(`^\\s*${currentKey}[\\.\\)\\/\\:\\–—\\-]\\s*`, 'i');
      clean = clean.replace(selfPrefix, '').trim();
    }

    const nextKeyRegex = /(?:^|\s+)([A-Ha-hĐđ])[\.\)\/:\–—\-]\s+/g;
    let match;
    let cutIndex = -1;
    while ((match = nextKeyRegex.exec(clean)) !== null) {
      const foundKey = match[1].toUpperCase();
      if (!currentKey || foundKey !== currentKey.toUpperCase()) {
        cutIndex = match.index;
        break;
      }
    }

    if (cutIndex !== -1) {
      clean = clean.slice(0, cutIndex).trim();
    }

    return clean;
  }

  function extractImageUrl(elem) {
    if (!elem) return null;
    let img = elem.tagName === 'IMG' ? elem : elem.querySelector('img');
    if (img) {
      const src = img.getAttribute('data-src') || img.getAttribute('data-original') || img.src;
      if (src && !src.startsWith('data:image/svg')) {
        const lowerSrc = src.toLowerCase();
        if (lowerSrc.includes('filtericon') || lowerSrc.includes('monologo') || lowerSrc.includes('icon.php') || lowerSrc.includes('/pix/')) {
          return null;
        }
        const rect = img.getBoundingClientRect();
        if ((rect.width > 35 && rect.height > 35) || (img.naturalWidth > 35 && img.naturalHeight > 35) || !img.complete) {
          return src;
        }
      }
    }
    return null;
  }

  function splitTextAndOptions(fullRawText) {
    const text = cleanText(fullRawText);
    const firstOptMatch = text.match(/(?:^|\s+)([A-D|a-d])[\.\)\/:\–—\-]\s+/);
    
    if (firstOptMatch) {
      const splitIdx = text.indexOf(firstOptMatch[0]);
      if (splitIdx !== -1) {
        const titlePart = cleanText(text.slice(0, splitIdx));
        const optsPart = text.slice(splitIdx);

        const options = [];
        const regex = /(?:^|\s+)([A-D|a-d])[\.\)\/:\–—\-]\s*(.*?)(?=(?:\s+[A-D|a-d][\.\)\/:\–—\-]|$))/g;
        let m;
        while ((m = regex.exec(optsPart)) !== null) {
          const key = m[1].toUpperCase();
          const optVal = cleanOptionText(m[2], key);
          if (optVal) {
            options.push({
              key: key,
              text: optVal,
              raw: `${key}. ${optVal}`,
              isChecked: false
            });
          }
        }

        if (options.length >= 2) {
          return { title: titlePart || text, options };
        }
      }
    }
    return { title: text, options: [] };
  }

  function getOptionTextFromInput(inputNode, fallbackContainerText) {
    let rawText = '';
    const ariaLabelledby = inputNode.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const labelEl = document.getElementById(ariaLabelledby);
      if (labelEl) {
        const clone = labelEl.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, input').forEach(el => el.remove());
        rawText = cleanText(clone.innerText || clone.textContent);
      }
    }

    if (!rawText && inputNode.id) {
      const labelFor = document.querySelector(`label[for="${inputNode.id}"]`);
      if (labelFor) {
        const clone = labelFor.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, input').forEach(el => el.remove());
        rawText = cleanText(clone.innerText || clone.textContent);
      }
    }

    if (!rawText) {
      const closestLabel = inputNode.closest('label');
      if (closestLabel) {
        const clone = closestLabel.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, input').forEach(el => el.remove());
        rawText = cleanText(clone.innerText || clone.textContent);
      }
    }

    if (!rawText) {
      const sib = inputNode.nextElementSibling;
      if (sib) rawText = cleanText(sib.innerText || sib.textContent);
    }

    return rawText || fallbackContainerText;
  }

  // Tầng 1: Moodle / LMS
  function extractMoodleOrQuizContainers() {
    const questionBoxes = Array.from(document.querySelectorAll('.que, .form-group.question, [id^="question-"]')).filter(isVisible);
    if (questionBoxes.length === 0) return null;

    const results = [];
    questionBoxes.forEach((box, idx) => {
      let qNum = idx + 1;
      const numElem = box.querySelector('.qno, .no, .info .no, .info .header');
      if (numElem) {
        const text = cleanText(numElem.textContent);
        const matchNum = text.match(/\d+/);
        if (matchNum) {
          const parsed = parseInt(matchNum[0], 10);
          if (!isNaN(parsed)) qNum = parsed;
        }
      }

      let title = '';
      const qtextEl = box.querySelector('.qtext');
      if (qtextEl) {
        const clone = qtextEl.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, .sr-only-focusable, input').forEach(el => el.remove());
        title = cleanText(clone.innerText || clone.textContent);
      } else {
        const formEl = box.querySelector('.formulation');
        if (formEl) {
          const clone = formEl.cloneNode(true);
          clone.querySelectorAll('.accesshide, .sr-only, .ablock, .answer, input, h4').forEach(el => el.remove());
          title = cleanText(clone.innerText || clone.textContent);
        }
      }

      if (!title) title = `Câu hỏi ${qNum}`;

      const imgSrc = extractImageUrl(qtextEl || box);
      const options = [];
      const optionRows = Array.from(box.querySelectorAll('.answer > div, .answer > li, .ablock .r0, .ablock .r1, .form-check')).filter(isVisible);
      
      const qId = `qa-detected-lms-${qNum}`;
      box.setAttribute('data-qa-id', qId);

      optionRows.forEach((row, rowIdx) => {
        if (row.querySelector('.qtype_multichoice_clearchoice') || row.classList.contains('qtype_multichoice_clearchoice')) {
          return;
        }

        const input = row.querySelector('input[type="radio"], input[type="checkbox"]');
        const isChecked = input ? input.checked : false;

        let optText = '';
        const answerLabel = row.querySelector('[data-region="answer-label"], .d-flex, label, .flex-fill');
        if (answerLabel) {
          const clone = answerLabel.cloneNode(true);
          clone.querySelectorAll('.accesshide, .sr-only, input').forEach(el => el.remove());
          optText = cleanText(clone.innerText || clone.textContent);
        } else {
          optText = cleanText(row.innerText || row.textContent);
        }

        if (isSpamText(optText) || !optText) return;

        let key = String.fromCharCode(65 + options.length);
        const match = optText.match(OPTION_PREFIX_REGEX);
        if (match) {
          key = match[1].toUpperCase();
          optText = match[2];
        }

        optText = cleanOptionText(optText, key);

        // Gắn selector chuẩn
        row.setAttribute('data-qa-for', qId);
        row.setAttribute('data-qa-opt', key);
        if (input) {
          input.setAttribute('data-qa-for', qId);
          input.setAttribute('data-qa-opt', key);
        }

        options.push({
          key: key,
          text: optText,
          raw: `${key}. ${optText}`,
          isChecked: isChecked
        });
      });

      results.push({
        id: qId,
        num: qNum,
        index: idx + 1,
        title: title,
        image: imgSrc,
        options: options,
        selectedAnswer: options.find(o => o.isChecked)?.key || null
      });
    });

    return results.length > 0 ? results : null;
  }

  // Tầng 2: Heuristic tổng quát
  function extractGenericDOMQuestions() {
    const allElements = Array.from(document.body.querySelectorAll('*')).filter(el => {
      if (IGNORE_TAGS.has(el.tagName)) return false;
      const cls = (el.className || '').toString().toLowerCase();
      const id = (el.id || '').toString().toLowerCase();
      if (
        cls.includes('nav') || cls.includes('sidebar') || cls.includes('footer') ||
        cls.includes('breadcrumb') || cls.includes('userinfo') || cls.includes('navbar') ||
        id.includes('nav') || id.includes('sidebar') || id.includes('footer')
      ) return false;
      return isVisible(el);
    });

    const atomicNodes = [];
    for (const el of allElements) {
      if (el.tagName === 'IMG' || (el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox'))) {
        atomicNodes.push(el);
        continue;
      }
      const totalText = cleanText(el.innerText || el.textContent);
      const hasImg = !!el.querySelector('img');
      if (!totalText && !hasImg) continue;

      const qCount = (totalText.match(/(?:câu\s*hỏi|câu|question|bài)\s*\d+/gi) || []).length;
      if (qCount > 1) continue;

      let hasChild = false;
      for (const child of el.children) {
        if (!IGNORE_TAGS.has(child.tagName) && isVisible(child)) {
          const childText = cleanText(child.innerText || child.textContent);
          if (childText === totalText && totalText.length > 0 && !hasImg) {
            hasChild = true;
            break;
          }
        }
      }
      if (!hasChild) atomicNodes.push(el);
    }

    const questionMap = new Map();
    let currentQNum = null;

    for (let i = 0; i < atomicNodes.length; i++) {
      const node = atomicNodes[i];
      const rawText = cleanText(node.innerText || node.textContent);
      const imgSrc = extractImageUrl(node);

      if (isSpamText(rawText)) continue;

      if (node.tagName === 'IMG' || (!rawText && imgSrc)) {
        if (currentQNum !== null && questionMap.has(currentQNum)) {
          const qObj = questionMap.get(currentQNum);
          if (!qObj.image && imgSrc) qObj.image = imgSrc;
        }
        continue;
      }

      if (node.tagName === 'INPUT' && (node.type === 'radio' || node.type === 'checkbox')) {
        if (currentQNum !== null && questionMap.has(currentQNum)) {
          const qObj = questionMap.get(currentQNum);
          let containerText = cleanText(node.parentElement?.innerText || '');
          if (isSpamText(containerText)) continue;

          const optRaw = getOptionTextFromInput(node, containerText);
          let key = null;
          let optText = '';

          const match = optRaw.match(OPTION_PREFIX_REGEX);
          if (match) {
            key = match[1].toUpperCase();
            optText = match[2];
          } else {
            key = String.fromCharCode(65 + qObj.optionsMap.size);
            optText = optRaw;
          }

          optText = cleanOptionText(optText, key);

          if (key && optText && !isSpamText(optText)) {
            node.setAttribute('data-qa-for', qObj.id);
            node.setAttribute('data-qa-opt', key);
            if (node.parentElement) {
              node.parentElement.setAttribute('data-qa-for', qObj.id);
              node.parentElement.setAttribute('data-qa-opt', key);
            }

            const existing = qObj.optionsMap.get(key);
            if (!existing || (optText !== existing.text && optText.length > 0 && !optText.includes('B.') && !optText.includes('C.'))) {
              qObj.optionsMap.set(key, {
                key: key,
                text: optText,
                raw: `${key}. ${optText}`,
                isChecked: node.checked
              });
            }
            if (node.checked) qObj.selectedAnswer = key;
          }
        }
        continue;
      }

      if (!rawText) continue;

      const qMatch = rawText.match(QUESTION_HEADER_REGEX);
      if (qMatch && !isSpamText(rawText)) {
        const qNum = parseInt(qMatch[1], 10);
        currentQNum = qNum;

        const qId = `qa-detected-${qNum}`;
        node.setAttribute('data-qa-id', qId);

        const { title: cleanTitle, options: inlineOptions } = splitTextAndOptions(rawText);

        if (!questionMap.has(qNum)) {
          const newQ = {
            id: qId,
            num: qNum,
            title: cleanTitle,
            image: imgSrc,
            optionsMap: new Map(),
            selectedAnswer: null
          };
          inlineOptions.forEach(opt => newQ.optionsMap.set(opt.key, opt));
          questionMap.set(qNum, newQ);
        } else {
          const existing = questionMap.get(qNum);
          if (cleanTitle.length > existing.title.length && cleanTitle.length > 10) {
            existing.title = cleanTitle;
          }
          if (!existing.image && imgSrc) existing.image = imgSrc;
          inlineOptions.forEach(opt => {
            if (!existing.optionsMap.has(opt.key)) {
              existing.optionsMap.set(opt.key, opt);
            }
          });
        }
        continue;
      }

      const optMatch = rawText.match(OPTION_PREFIX_REGEX);
      if (optMatch && currentQNum !== null && questionMap.has(currentQNum) && !isSpamText(rawText)) {
        const qObj = questionMap.get(currentQNum);
        const key = optMatch[1].toUpperCase();
        let optText = cleanOptionText(optMatch[2] || rawText, key);

        if (optText && !isSpamText(optText)) {
          node.setAttribute('data-qa-for', qObj.id);
          node.setAttribute('data-qa-opt', key);

          const existing = qObj.optionsMap.get(key);
          if (!existing || (optText.length < existing.text.length && (existing.text.includes('B.') || existing.text.includes('C.')))) {
            qObj.optionsMap.set(key, {
              key: key,
              text: optText,
              raw: `${key}. ${optText}`,
              isChecked: false
            });
          }
        }
        continue;
      }

      if (currentQNum !== null && questionMap.has(currentQNum)) {
        const qObj = questionMap.get(currentQNum);
        if (qObj.optionsMap.size === 0 && !isSpamText(rawText) && rawText.length < 400) {
          if (!qObj.title.includes(rawText)) {
            if (qObj.title.length <= 15) {
              qObj.title = `Câu hỏi ${qObj.num}. ` + rawText;
            } else {
              qObj.title += ' ' + rawText;
            }
          }
        }
      }
    }

    return Array.from(questionMap.values())
      .filter(q => q.title.length > 8 || q.optionsMap.size > 0 || q.image)
      .sort((a, b) => a.num - b.num)
      .map((q, idx) => {
        const cleanedOpts = Array.from(q.optionsMap.values()).map(opt => ({
          ...opt,
          text: cleanOptionText(opt.text, opt.key),
          raw: `${opt.key}. ${cleanOptionText(opt.text, opt.key)}`
        })).sort((a, b) => a.key.localeCompare(b.key));

        return {
          id: q.id,
          index: idx + 1,
          title: q.title,
          image: q.image,
          options: cleanedOpts,
          selectedAnswer: q.selectedAnswer
        };
      });
  }

  function extractQuestionsAndAnswers() {
    clearHighlights();
    const lmsResults = extractMoodleOrQuizContainers();
    if (lmsResults && lmsResults.length > 0) {
      return lmsResults;
    }
    return extractGenericDOMQuestions();
  }

  /**
   * Tìm thẻ INPUT radio/checkbox chính xác nhất từ bất kỳ element nào
   */
  function findRadioInput(el) {
    if (!el) return null;
    if (el.tagName === 'INPUT' && (el.type === 'radio' || el.type === 'checkbox')) {
      return el;
    }
    // 1. Bên trong el
    let inp = el.querySelector('input[type="radio"], input[type="checkbox"]');
    if (inp) return inp;

    // 2. Anh chị em liền kề (siblings)
    if (el.previousElementSibling && el.previousElementSibling.tagName === 'INPUT') {
      return el.previousElementSibling;
    }
    if (el.nextElementSibling && el.nextElementSibling.tagName === 'INPUT') {
      return el.nextElementSibling;
    }

    // 3. Trong cùng hàng/vùng chứa cha gần nhất (tối đa 3 cấp)
    let parent = el.parentElement;
    for (let depth = 0; depth < 3 && parent && parent !== document.body; depth++) {
      inp = parent.querySelector('input[type="radio"], input[type="checkbox"]');
      if (inp) return inp;
      parent = parent.parentElement;
    }

    // 4. Nếu el là label có htmlFor
    if (el.tagName === 'LABEL' && el.htmlFor) {
      inp = document.getElementById(el.htmlFor);
      if (inp) return inp;
    }

    return null;
  }

  function findLabel(el, inp) {
    if (el && el.tagName === 'LABEL') return el;
    if (inp && inp.id) {
      try {
        const lbl = document.querySelector(`label[for="${CSS.escape(inp.id)}"]`);
        if (lbl) return lbl;
      } catch (e) {
        const lbl = document.querySelector(`label[for="${inp.id}"]`);
        if (lbl) return lbl;
      }
    }
    if (inp) {
      const lbl = inp.closest('label') || inp.parentElement?.querySelector('label');
      if (lbl) return lbl;
    }
    if (el) {
      const lbl = el.closest('label') || el.parentElement?.querySelector('label');
      if (lbl) return lbl;
    }
    return null;
  }

  /**
   * Click tự nhiên, kín đáo (KHÔNG hiệu ứng lộ, KHÔNG bôi đen text)
   */
  function forceClickTarget(targetInput, wrapperEl) {
    const input = findRadioInput(targetInput) || findRadioInput(wrapperEl);
    const label = findLabel(wrapperEl, input);

    if (!input && !label && !wrapperEl) return false;

    // Cuộn nhẹ tới câu hỏi nếu cần
    const scrollTarget = label || input || wrapperEl;
    if (scrollTarget && typeof scrollTarget.scrollIntoView === 'function') {
      try {
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {}
    }

    // 1. Click vào LABEL trước (Cơ chế native chuẩn nhất của mọi trình duyệt)
    if (label && typeof label.click === 'function') {
      try {
        label.click();
      } catch (e) {}
    }

    // 2. Đảm bảo INPUT được set checked và bắn event chuẩn
    if (input && input.tagName === 'INPUT') {
      try {
        if (!input.checked) {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked')?.set;
          if (nativeSetter) {
            nativeSetter.call(input, true);
          } else {
            input.checked = true;
          }
        }
      } catch (e) {
        input.checked = true;
      }

      try {
        input.click();
      } catch (e) {}

      try {
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    }

    // 3. Nếu vẫn chưa checked và wrapper khác label/input, thử click wrapper
    if (wrapperEl && wrapperEl !== label && wrapperEl !== input) {
      if (!input || !input.checked) {
        try {
          wrapperEl.click();
        } catch (e) {}
      }
    }

    // 4. Xóa sạch mọi bôi đen/selection để tuyệt đối không bị lộ
    try {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    } catch (e) {}

    return input ? input.checked : true;
  }

  /**
   * TỰ ĐỘNG CHỌN ĐÁP ÁN TRỰC TIẾP TRÊN WEB (Đa tầng, chống miss 100%, tàng hình)
   */
  function autoSelectAnswerOnPage(qaId, targetKey, optionText) {
    if (!targetKey) return false;
    const cleanKey = targetKey.toUpperCase().trim();
    const cleanOptText = optionText ? cleanText(optionText).toLowerCase() : '';

    // Chiến lược 1: Tìm theo attribute [data-qa-for][data-qa-opt]
    let foundEls = Array.from(document.querySelectorAll(`[data-qa-for="${qaId}"][data-qa-opt="${cleanKey}"]`));
    // Ưu tiên phần tử là input hoặc gần input nhất
    foundEls.sort((a, b) => {
      const inpA = findRadioInput(a);
      const inpB = findRadioInput(b);
      return (inpB ? 1 : 0) - (inpA ? 1 : 0);
    });

    for (const el of foundEls) {
      const input = findRadioInput(el);
      if (forceClickTarget(input, el)) return true;
    }

    // Chiến lược 2: Tìm trong container của câu hỏi tương ứng
    let qContainers = [];
    if (qaId) {
      const qTarget = document.querySelector(`[data-qa-id="${qaId}"]`);
      if (qTarget) {
        // Leo lên DOM tìm container chứa cả câu hỏi và danh sách đáp án
        let curr = qTarget;
        while (curr && curr !== document.body) {
          const radios = curr.querySelectorAll('input[type="radio"], input[type="checkbox"]');
          if (radios.length >= 2) {
            qContainers.push(curr);
            break;
          }
          curr = curr.parentElement;
        }
        if (qContainers.length === 0 && qTarget.parentElement) {
          qContainers.push(qTarget.closest('.que, .form-group, .question, .question-item, tr, li, div') || qTarget.parentElement);
        }
      }
    }

    if (qContainers.length === 0 || !qContainers[0]) {
      qContainers = Array.from(document.querySelectorAll('.que, .form-group.question, [id^="question-"], .question-item, .question'));
    }
    if (qContainers.length === 0) {
      qContainers = [document.body];
    }

    for (const container of qContainers) {
      if (!container) continue;
      const inputs = Array.from(container.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
        .filter(inp => !inp.closest('.qtype_multichoice_clearchoice'));

      // 2.1: So khớp theo text của đáp án (ví dụ: "thang đo diode" hoặc "+")
      if (cleanOptText) {
        for (const input of inputs) {
          const row = input.closest('.r0, .r1, .form-check, .radio, .radio-inline, label, li, tr, div') || input.parentElement;
          const rowText = cleanText(row?.innerText || '').toLowerCase();
          if (rowText.includes(cleanOptText)) {
            if (forceClickTarget(input, row)) return true;
          }
        }
      }

      // 2.2: So khớp theo tiền tố A, B, C, D (ví dụ: "a." hoặc "A." hoặc "A)")
      for (const input of inputs) {
        const row = input.closest('.r0, .r1, .form-check, .radio, .radio-inline, label, li, tr, div') || input.parentElement;
        const rowText = cleanText(row?.innerText || '');
        const match = rowText.match(OPTION_PREFIX_REGEX);
        if (match && match[1].toUpperCase() === cleanKey) {
          if (forceClickTarget(input, row)) return true;
        }
      }

      // 2.3: So khớp theo thứ tự index (A=0, B=1, C=2, D=3...)
      const keyIndex = cleanKey.charCodeAt(0) - 65;
      if (inputs.length > keyIndex && keyIndex >= 0) {
        const targetInput = inputs[keyIndex];
        const row = targetInput.closest('.r0, .r1, .form-check, .radio, .radio-inline, label, li, tr, div') || targetInput.parentElement;
        if (forceClickTarget(targetInput, row)) return true;
      }
    }

    // Chiến lược 3: Tìm trên toàn bộ trang theo nội dung đáp án (chỉ xét nhãn ngắn)
    if (cleanOptText) {
      const allLabels = Array.from(document.querySelectorAll('label, .answer > div, .d-flex, .answernumber, .r0, .r1, .form-check, .radio, .radio-inline, li'));
      for (const lbl of allLabels) {
        const txt = cleanText(lbl.innerText || '').toLowerCase();
        if (txt.includes(cleanOptText) && txt.length < 150) {
          const input = findRadioInput(lbl);
          if (input && forceClickTarget(input, lbl)) return true;
        }
      }
    }

    // Chiến lược 4: Tìm radio theo value hoặc id có chứa key/index
    const allRadios = Array.from(document.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
    const keyIndex = cleanKey.charCodeAt(0) - 65;
    for (const r of allRadios) {
      if (r.value === cleanKey || r.value === cleanKey.toLowerCase() || r.value === String(keyIndex) || r.id?.endsWith(`_${keyIndex}`) || r.id?.endsWith(`answer${keyIndex}`)) {
        const row = r.closest('.r0, .r1, .form-check, .radio, .radio-inline, label, div') || r.parentElement;
        if (forceClickTarget(r, row)) return true;
      }
    }

    return false;
  }

  function highlightQuestion(qaId) {
    clearHighlights();
    const elem = document.querySelector(`[data-qa-id="${qaId}"]`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      elem.classList.add('qa-detector-highlight-target');

      const prevBox = document.getElementById('qa-detector-floating-box');
      if (prevBox) prevBox.remove();

      const box = document.createElement('div');
      box.id = 'qa-detector-floating-box';
      const rect = elem.getBoundingClientRect();
      
      box.style.cssText = `
        position: absolute;
        top: ${window.scrollY + rect.top - 6}px;
        left: ${window.scrollX + rect.left - 6}px;
        width: ${rect.width + 12}px;
        height: ${rect.height + 12}px;
        border: 2px solid #6366f1;
        background: rgba(99, 102, 241, 0.08);
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.5), inset 0 0 10px rgba(99, 102, 241, 0.2);
        pointer-events: none;
        z-index: 999999;
        transition: all 0.3s ease;
      `;
      document.body.appendChild(box);

      setTimeout(() => {
        if (box) box.style.opacity = '0';
        setTimeout(() => box && box.remove(), 400);
      }, 4000);
      return true;
    }
    return false;
  }

  function clearHighlights() {
    const existingBox = document.getElementById('qa-detector-floating-box');
    if (existingBox) existingBox.remove();
    document.querySelectorAll('.qa-detector-highlight-target').forEach(el => {
      el.classList.remove('qa-detector-highlight-target');
    });
  }

  const DEFAULT_API_KEY = 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5';
  const DEFAULT_MODEL = 'gpt-5.5';

  // Dọn sạch toast cũ nếu còn tồn tại
  const oldToast = document.getElementById('qa-stealth-toast');
  if (oldToast) oldToast.remove();

  // Hàm gọi API trực tiếp (khi chạy không qua background hoặc chạy thẳng F12 console)
  async function directKey4USolve(prompt, model, apiKey) {
    const key = apiKey || DEFAULT_API_KEY;
    const m = model || DEFAULT_MODEL;
    try {
      const res = await fetch('https://api.key4u.vn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: m,
          messages: [
            { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1
        })
      });
      if (!res.ok) return { success: false, error: 'HTTP ' + res.status };
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      let parsed = null;
      try {
        const jsonMatch = content.match(/\{[\s\S]*?\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      } catch (e) {
        const match = content.match(/([A-H])[\.\)\:]/i) || content.match(/\b([A-H])\b/i);
        if (match) parsed = { answer: match[1].toUpperCase(), explanation: content };
      }
      if (parsed && parsed.answer) {
        return { success: true, data: { answer: parsed.answer.toUpperCase().trim() } };
      }
      return { success: false, error: 'No answer parsed' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  let isSolvingProcess = false;
  async function triggerAutoSolveFromPage() {
    if (isSolvingProcess) {
      return;
    }
    isSolvingProcess = true;

    try {
      console.log('[AutoSolver Stealth] Đang quét câu hỏi...');
      const questions = extractQuestionsAndAnswers();
      if (!questions || questions.length === 0) {
        console.log('[AutoSolver Stealth] Không tìm thấy câu hỏi nào trên trang.');
        isSolvingProcess = false;
        return;
      }

      console.log(`[AutoSolver Stealth] Đang giải ${questions.length} câu với GPT-5.5...`);

      let apiKey = DEFAULT_API_KEY;
      let model = DEFAULT_MODEL;
      if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
        try {
          const stored = await new Promise(r => {
            chrome.storage.local.get(['key4uApiKey', 'key4uModel'], (res) => r(res || {}));
          });
          if (stored?.key4uApiKey) apiKey = stored.key4uApiKey;
          if (stored?.key4uModel) model = stored.key4uModel;
        } catch (e) {}
      }

      let successCount = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.options || q.options.length === 0) continue;

        const optionsText = q.options.map(o => `${o.key}. ${o.text}`).join('\n');
        const prompt = `Bạn là một chuyên gia giải đề trắc nghiệm siêu chính xác.
Hãy đọc câu hỏi và các phương án lựa chọn dưới đây, sau đó tìm ra ĐÁP ÁN ĐÚNG NHẤT.

CÂU HỎI:
${q.title}

CÁC LỰA CHỌN:
${optionsText}

YÊU CẦU:
Trả về kết quả DUY NHẤT dưới dạng JSON hợp lệ:
{
  "answer": "A hoặc B hoặc C hoặc D",
  "explanation": "Giải thích ngắn gọn 1-2 câu"
}`;

        try {
          let resp = null;
          if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
            resp = await new Promise(resolve => {
              chrome.runtime.sendMessage({
                action: 'CALL_KEY4U_AI',
                prompt: prompt,
                model: model,
                apiKey: apiKey
              }, (res) => {
                if (chrome.runtime.lastError) {
                  resolve({ success: false, error: chrome.runtime.lastError.message });
                } else {
                  resolve(res || { success: false });
                }
              });
            });
          }

          // Dự phòng gọi trực tiếp nếu chạy ngoài extension (ví dụ dán F12 Console)
          if (!resp || !resp.success) {
            resp = await directKey4USolve(prompt, model, apiKey);
          }

          if (resp && resp.success && resp.data) {
            const aiAnswer = resp.data.answer;
            const matchedOpt = q.options.find(o => o.key === aiAnswer);
            const optText = matchedOpt ? matchedOpt.text : '';

            autoSelectAnswerOnPage(q.id, aiAnswer, optText);
            successCount++;
            console.log(`[AutoSolver Stealth] Đã chọn câu ${q.num || i + 1}: ${aiAnswer} (${successCount}/${questions.length})`);
          }
        } catch (err) {
          console.warn('[AutoSolver Stealth] Lỗi khi giải câu ' + (q.num || i + 1), err);
        }
      }

      console.log(`[AutoSolver Stealth] Hoàn tất! Đã chọn ${successCount}/${questions.length} câu.`);
    } catch (e) {
      console.warn('[AutoSolver Stealth] Lỗi:', e);
    } finally {
      isSolvingProcess = false;
    }
  }

  // Bắt phím tắt Alt + H hoặc Alt + Shift + H trực tiếp trên trang khi làm bài
  window.addEventListener('keydown', (e) => {
    const isAltH = (e.altKey && !e.ctrlKey && !e.metaKey && (e.key === 'h' || e.key === 'H' || e.code === 'KeyH'));
    if (isAltH) {
      e.preventDefault();
      e.stopPropagation();
      triggerAutoSolveFromPage();
    }
  }, true);

  if (typeof chrome !== 'undefined' && chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'SCAN_QUESTIONS') {
        try {
          const results = extractQuestionsAndAnswers();
          sendResponse({ success: true, data: results, count: results.length, url: window.location.href });
        } catch (err) {
          sendResponse({ success: false, error: err.message });
        }
      } else if (request.action === 'AUTO_SELECT_ANSWER') {
        const ok = autoSelectAnswerOnPage(request.qaId, request.key, request.optionText);
        sendResponse({ success: ok });
      } else if (request.action === 'TRIGGER_AUTO_SOLVE') {
        triggerAutoSolveFromPage();
        sendResponse({ success: true });
      } else if (request.action === 'HIGHLIGHT_QUESTION') {
        const success = highlightQuestion(request.qaId);
        sendResponse({ success: success });
      } else if (request.action === 'CLEAR_HIGHLIGHT') {
        clearHighlights();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  console.log('%c[Q&A AutoSolver] Sẵn sàng! Nhấn Alt + H trên trang để tự động giải & chọn đáp án.', 'color: #10b981; font-weight: bold;');
  triggerAutoSolveFromPage();
})();
