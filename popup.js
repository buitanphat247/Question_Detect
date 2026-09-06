/**
 * Q&A Detector & AI Auto Solver - Popup Controller
 * Tích hợp Key4U API (Model gpt-5.5) để tự động giải bài và click chọn đáp án trên web.
 */

// Hàm chạy trong context trang web
function inPageExtractQA() {
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
      .replace(/^chưa trả lời\s*/i, '')
      .replace(/^not yet answered\s*/i, '')
      .trim();
  }

  function isSpamText(text) {
    if (!text) return true;
    const lower = text.toLowerCase().trim();
    return SYSTEM_SPAM_WORDS.some(spam => lower === spam || lower.startsWith(spam) || (lower.length < 40 && lower.includes(spam)));
  }

  function stripOptionPrefix(text, expectedKey) {
    if (!text) return '';
    let s = cleanText(text);

    if (expectedKey) {
      const k = expectedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Bỏ prefix có dấu phân cách rõ ràng: "A.", "A)", "A:", "(A)", "[A]", hoặc "A. A."
      const prefixRegex = new RegExp(`^\\s*(?:(?:\\(?\\[?${k}\\)?\\]?[\\.\\)\\:\\/]|\\(${k}\\)|\\[${k}\\])\\s*)+`, 'i');
      s = s.replace(prefixRegex, '').trim();

      // Nếu prefix dùng gạch ngang (ví dụ "A - Văn bản"), chỉ bỏ khi đằng sau KHÔNG phải chuỗi hoán vị (như "d - e - a")
      if (!/^[a-z]\s*[\-\–—]\s*[a-z]\s*[\-\–—]/i.test(s)) {
        const dashPrefix = new RegExp(`^\\s*${k}\\s*[\\–—\\-]\\s+`, 'i');
        s = s.replace(dashPrefix, '').trim();
      }
    }

    // Bỏ prefix chung nếu còn: "(A)", "[A]", "A.", "A)", "A:"
    s = s.replace(/^\s*(?:\([A-Za-z0-9Đđ]\)|\[[A-Za-z0-9Đđ]\]|[A-Za-z0-9Đđ①-⑩❶-❿Ⓐ-Ⓗ][\.\)\:\/])\s*/, '').trim();
    s = s.replace(/\s*(?:clear my choice|xóa lựa chọn|flag question)\s*$/i, '').trim();

    return s;
  }

  function cleanOptionText(text, currentKey) {
    return stripOptionPrefix(text, currentKey);
  }

  function extractRichText(element) {
    if (!element) return '';
    const clone = element.cloneNode(true);

    // 1. Xóa các phần tử ẩn
    clone.querySelectorAll('.accesshide, .sr-only, .sr-only-focusable, .hidden-screen, [aria-hidden="true"]').forEach(el => el.remove());

    // 2. Xử lý KaTeX: Giữ TeX annotation nếu có, loại bỏ duplicate mathml
    clone.querySelectorAll('.katex').forEach(katex => {
      const tex = katex.querySelector('annotation[encoding="application/x-tex"]');
      if (tex && tex.textContent.trim()) {
        katex.textContent = ' ' + tex.textContent.trim() + ' ';
      } else {
        katex.querySelectorAll('.katex-mathml').forEach(m => m.remove());
      }
    });

    // 3. Xử lý MathJax
    clone.querySelectorAll('.MathJax_Preview').forEach(el => el.remove());

    // 4. Xử lý sup / sub (ví dụ 10^C, H_2O)
    clone.querySelectorAll('sup').forEach(sup => {
      sup.textContent = '^' + sup.textContent.trim();
    });
    clone.querySelectorAll('sub').forEach(sub => {
      sub.textContent = '_' + sub.textContent.trim();
    });

    // 5. Xử lý ngắt dòng
    clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
    clone.querySelectorAll('p, div, li, tr').forEach(block => {
      block.insertAdjacentText('afterend', '\n');
    });

    return cleanText(clone.innerText || clone.textContent);
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
    // Tìm A. ... B. ... trong đoạn văn bản (bắt buộc phải có cả A và B sau câu hỏi)
    const optAMatch = text.match(/(?:\s+|^)([A-Da-d])[\.\)\:]\s+/);
    const optBMatch = text.match(/(?:\s+|^)([B-Db-d])[\.\)\:]\s+/);

    if (optAMatch && optBMatch && text.indexOf(optBMatch[0]) > text.indexOf(optAMatch[0])) {
      const splitIdx = text.indexOf(optAMatch[0]);
      if (splitIdx > 5) { // Phải có ít nhất 5 ký tự đề bài trước options
        const titlePart = cleanText(text.slice(0, splitIdx));
        const optsPart = text.slice(splitIdx);

        const options = [];
        const regex = /(?:\s+|^)([A-Da-d])[\.\)\:]\s*(.*?)(?=(?:\s+[A-Da-d][\.\)\:]|$))/g;
        let m;
        while ((m = regex.exec(optsPart)) !== null) {
          const key = m[1].toUpperCase();
          const optVal = stripOptionPrefix(m[2], key);
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
        rawText = extractRichText(clone);
      }
    }

    if (!rawText && inputNode.id) {
      try {
        const labelFor = document.querySelector(`label[for="${CSS.escape(inputNode.id)}"]`);
        if (labelFor) {
          const clone = labelFor.cloneNode(true);
          clone.querySelectorAll('.accesshide, .sr-only, input').forEach(el => el.remove());
          rawText = extractRichText(clone);
        }
      } catch (e) {}
    }

    if (!rawText) {
      const closestLabel = inputNode.closest('label');
      if (closestLabel) {
        const clone = closestLabel.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, input').forEach(el => el.remove());
        rawText = extractRichText(clone);
      }
    }

    if (!rawText) {
      const sib = inputNode.nextElementSibling;
      if (sib) rawText = extractRichText(sib);
    }

    return rawText || fallbackContainerText;
  }

  // Tầng 1: Quiz Containers (Moodle, Canvas, Subtt, Azota, Yourhomework...)
  function extractQuizContainers() {
    const containerSelectors = [
      '.que',
      '[id^="question-"]',
      '[id^="que-"]',
      '[class*="question-item"]',
      '[class*="question_item"]',
      '[class*="questionBox"]',
      '[class*="question-box"]',
      '[class*="question-holder"]',
      '[class*="quiz-item"]',
      '[class*="quiz_item"]',
      '[class*="quiz-question"]',
      '[class*="test-item"]',
      '[class*="exam-item"]',
      '[class*="cau-hoi"]',
      '[class*="cauhoi"]',
      '[class*="box-cauhoi"]'
    ];

    let questionBoxes = Array.from(document.querySelectorAll(containerSelectors.join(', '))).filter(isVisible);

    questionBoxes = questionBoxes.filter(box => {
      return !questionBoxes.some(other => other !== box && other.contains(box));
    });

    if (questionBoxes.length === 0) return null;

    const results = [];
    questionBoxes.forEach((box, idx) => {
      let qNum = idx + 1;
      const numElem = box.querySelector('.qno, .no, .info .no, .info .header, .q-number, .question-number, b, strong');
      if (numElem) {
        const text = cleanText(numElem.textContent);
        const matchNum = text.match(/\d+/);
        if (matchNum) {
          const parsed = parseInt(matchNum[0], 10);
          if (!isNaN(parsed)) qNum = parsed;
        }
      }

      let title = '';
      const qtextEl = box.querySelector('.qtext, [class*="question-title"], [class*="question-text"], [class*="content-question"], .stem');
      if (qtextEl) {
        const clone = qtextEl.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, .sr-only-focusable, input, .ablock, .answer').forEach(el => el.remove());
        title = extractRichText(clone);
      } else {
        const formEl = box.querySelector('.formulation') || box;
        const clone = formEl.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, .ablock, .answer, .r0, .r1, input, h4, .qtype_multichoice_clearchoice, [class*="option"], [class*="answer"]').forEach(el => el.remove());
        title = extractRichText(clone);
      }

      if (!title || title.length < 3) title = `Câu hỏi ${qNum}`;

      const imgSrc = extractImageUrl(qtextEl || box);
      const options = [];
      const qId = `qa-detected-quiz-${qNum}`;
      box.setAttribute('data-qa-id', qId);

      const inputs = Array.from(box.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
        .filter(inp => !inp.closest('.qtype_multichoice_clearchoice') && isVisible(inp.parentElement || inp));

      if (inputs.length >= 2) {
        inputs.forEach((input, optIdx) => {
          let optRaw = getOptionTextFromInput(input, cleanText(input.parentElement?.innerText || ''));
          let key = String.fromCharCode(65 + optIdx);
          const match = optRaw.match(OPTION_PREFIX_REGEX);
          if (match) {
            key = match[1].toUpperCase();
            optRaw = match[2];
          }
          const optText = stripOptionPrefix(optRaw, key);
          if (!optText || isSpamText(optText)) return;

          input.setAttribute('data-qa-for', qId);
          input.setAttribute('data-qa-opt', key);
          if (input.parentElement) {
            input.parentElement.setAttribute('data-qa-for', qId);
            input.parentElement.setAttribute('data-qa-opt', key);
          }

          options.push({
            key: key,
            text: optText,
            raw: `${key}. ${optText}`,
            isChecked: input.checked
          });
        });
      } else {
        const optionRows = Array.from(box.querySelectorAll('.answer > div, .answer > li, .ablock .r0, .ablock .r1, .form-check, [class*="option-item"], [class*="choice"]')).filter(isVisible);
        optionRows.forEach((row, optIdx) => {
          if (row.querySelector('.qtype_multichoice_clearchoice') || row.classList.contains('qtype_multichoice_clearchoice')) return;
          let optRaw = cleanText(row.innerText || row.textContent);
          if (!optRaw || isSpamText(optRaw)) return;

          let key = String.fromCharCode(65 + optIdx);
          const match = optRaw.match(OPTION_PREFIX_REGEX);
          if (match) {
            key = match[1].toUpperCase();
            optRaw = match[2];
          }
          const optText = stripOptionPrefix(optRaw, key);
          if (!optText) return;

          row.setAttribute('data-qa-for', qId);
          row.setAttribute('data-qa-opt', key);

          options.push({
            key: key,
            text: optText,
            raw: `${key}. ${optText}`,
            isChecked: false
          });
        });
      }

      if (options.length >= 2 || (title && title.length > 10)) {
        results.push({
          id: qId,
          num: qNum,
          index: idx + 1,
          title: title,
          image: imgSrc,
          options: options,
          selectedAnswer: options.find(o => o.isChecked)?.key || null
        });
      }
    });

    return results.length > 0 ? results : null;
  }

  // Tầng 2: Heuristic tổng quát (Trang layout phẳng, không dùng class container)
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

    const questionList = [];
    let currentQ = null;

    for (let i = 0; i < atomicNodes.length; i++) {
      const node = atomicNodes[i];
      const rawText = cleanText(node.innerText || node.textContent);
      const imgSrc = extractImageUrl(node);

      if (isSpamText(rawText)) continue;

      if (node.tagName === 'IMG' || (!rawText && imgSrc)) {
        if (currentQ && !currentQ.image && imgSrc) {
          currentQ.image = imgSrc;
        }
        continue;
      }

      const qMatch = rawText.match(QUESTION_HEADER_REGEX);
      if (qMatch && !isSpamText(rawText)) {
        const qNum = parseInt(qMatch[1], 10);
        const qId = `qa-detected-${qNum}`;
        node.setAttribute('data-qa-id', qId);

        currentQ = {
          id: qId,
          num: qNum,
          title: rawText,
          image: imgSrc,
          inputs: [],
          optionNodes: []
        };
        questionList.push(currentQ);
        continue;
      }

      if (!currentQ) continue;

      if (node.tagName === 'INPUT' && (node.type === 'radio' || node.type === 'checkbox')) {
        currentQ.inputs.push(node);
        continue;
      }

      const optMatch = rawText.match(OPTION_PREFIX_REGEX);
      if (optMatch && !isSpamText(rawText)) {
        currentQ.optionNodes.push({ node, key: optMatch[1].toUpperCase(), rawText });
        continue;
      }

      if (currentQ.inputs.length === 0 && currentQ.optionNodes.length === 0 && rawText.length < 400 && !isSpamText(rawText)) {
        if (!currentQ.title.includes(rawText)) {
          currentQ.title += ' ' + rawText;
        }
      }
    }

    const results = [];
    questionList.forEach((q, idx) => {
      const options = [];
      const optionsMap = new Map();

      if (q.inputs.length >= 2) {
        q.inputs.forEach((input, optIdx) => {
          let containerText = cleanText(input.parentElement?.innerText || '');
          let optRaw = getOptionTextFromInput(input, containerText);
          let key = String.fromCharCode(65 + optIdx);

          const match = optRaw.match(OPTION_PREFIX_REGEX);
          if (match) {
            key = match[1].toUpperCase();
            optRaw = match[2];
          }

          const optText = stripOptionPrefix(optRaw, key);
          if (!optText || isSpamText(optText)) return;

          input.setAttribute('data-qa-for', q.id);
          input.setAttribute('data-qa-opt', key);
          if (input.parentElement) {
            input.parentElement.setAttribute('data-qa-for', q.id);
            input.parentElement.setAttribute('data-qa-opt', key);
          }

          if (!optionsMap.has(key)) {
            const optObj = {
              key: key,
              text: optText,
              raw: `${key}. ${optText}`,
              isChecked: input.checked
            };
            optionsMap.set(key, optObj);
            options.push(optObj);
          }
        });
      } else if (q.optionNodes.length >= 2) {
        q.optionNodes.forEach(({ node, key, rawText }) => {
          const optText = stripOptionPrefix(rawText, key);
          if (!optText || isSpamText(optText)) return;

          node.setAttribute('data-qa-for', q.id);
          node.setAttribute('data-qa-opt', key);

          if (!optionsMap.has(key)) {
            const optObj = {
              key: key,
              text: optText,
              raw: `${key}. ${optText}`,
              isChecked: false
            };
            optionsMap.set(key, optObj);
            options.push(optObj);
          }
        });
      } else {
        const { title: cleanTitle, options: inlineOptions } = splitTextAndOptions(q.title);
        if (inlineOptions.length >= 2) {
          q.title = cleanTitle;
          inlineOptions.forEach(opt => options.push(opt));
        }
      }

      if (options.length > 0 || q.title.length > 8 || q.image) {
        results.push({
          id: q.id,
          num: q.num,
          index: idx + 1,
          title: q.title,
          image: q.image,
          options: options.sort((a, b) => a.key.localeCompare(b.key)),
          selectedAnswer: options.find(o => o.isChecked)?.key || null
        });
      }
    });

    return results;
  }

  const lms = extractQuizContainers();
  if (lms && lms.length > 0) return lms;
  return extractGenericDOMQuestions();
}

// Tự động click chọn đáp án trên web (Đa tầng, chống miss 100%, tàng hình)
function inPageAutoSelect(qaId, targetKey, optionText) {
  if (!targetKey) return false;
  const cleanKey = targetKey.toUpperCase().trim();
  const cleanOptText = optionText ? (optionText || '').toLowerCase().trim() : '';

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
        const rowText = (row?.innerText || '').toLowerCase().trim();
        if (rowText.includes(cleanOptText)) {
          if (forceClickTarget(input, row)) return true;
        }
      }
    }

    // 2.2: So khớp theo tiền tố A, B, C, D (ví dụ: "a." hoặc "A." hoặc "A)")
    for (const input of inputs) {
      const row = input.closest('.r0, .r1, .form-check, .radio, .radio-inline, label, li, tr, div') || input.parentElement;
      const rowText = (row?.innerText || '').trim();
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
      const txt = (lbl.innerText || '').toLowerCase().trim();
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

function inPageHighlightQA(qaId) {
  const prevBox = document.getElementById('qa-detector-floating-box');
  if (prevBox) prevBox.remove();
  document.querySelectorAll('.qa-detector-highlight-target').forEach(el => el.classList.remove('qa-detector-highlight-target'));

  const elem = document.querySelector(`[data-qa-id="${qaId}"]`);
  if (elem) {
    elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    elem.classList.add('qa-detector-highlight-target');

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

// Logic giao diện Popup
document.addEventListener('DOMContentLoaded', async () => {
  const btnScan = document.getElementById('btnScan');
  const btnSolveAll = document.getElementById('btnSolveAll');
  const btnToggleSettings = document.getElementById('btnToggleSettings');
  const settingsPanel = document.getElementById('settingsPanel');
  const txtApiKey = document.getElementById('txtApiKey');
  const txtModel = document.getElementById('txtModel');
  const btnSaveKey = document.getElementById('btnSaveKey');
  const chkAutoSelectWeb = document.getElementById('chkAutoSelectWeb');
  const searchInput = document.getElementById('searchInput');
  const filterSection = document.getElementById('filterSection');
  const emptyState = document.getElementById('emptyState');
  const questionsList = document.getElementById('questionsList');
  const questionCount = document.getElementById('questionCount');
  const toast = document.getElementById('toast');

  const btnCopyMarkdown = document.getElementById('btnCopyMarkdown');
  const btnCopyJson = document.getElementById('btnCopyJson');
  const btnCopyText = document.getElementById('btnCopyText');
  const btnDownload = document.getElementById('btnDownload');

  const DEFAULT_API_KEY = 'sk-oHL29VmqcUURTnx0qwUeJJ4uoLMu38hQ5CxsTqkcFLUAi2m5';
  const DEFAULT_MODEL = 'gpt-5.5';

  let allQuestions = [];
  let activeTabId = null;

  // Tải cài đặt đã lưu (hoặc dùng mặc định đã cài sẵn)
  chrome.storage.local.get(['key4uApiKey', 'key4uModel', 'autoSelectWeb'], (res) => {
    txtApiKey.value = res.key4uApiKey || DEFAULT_API_KEY;
    txtModel.value = res.key4uModel || DEFAULT_MODEL;
    if (typeof res.autoSelectWeb !== 'undefined') {
      chkAutoSelectWeb.checked = res.autoSelectWeb;
    } else {
      chkAutoSelectWeb.checked = true;
    }

    if (!res.key4uApiKey) {
      chrome.storage.local.set({
        key4uApiKey: DEFAULT_API_KEY,
        key4uModel: DEFAULT_MODEL,
        autoSelectWeb: true
      });
    }
  });

  // Lưu cài đặt
  btnSaveKey.addEventListener('click', () => {
    const apiKey = txtApiKey.value.trim() || DEFAULT_API_KEY;
    const model = txtModel.value.trim() || DEFAULT_MODEL;
    const autoSelect = chkAutoSelectWeb.checked;

    chrome.storage.local.set({
      key4uApiKey: apiKey,
      key4uModel: model,
      autoSelectWeb: autoSelect
    }, () => {
      showToast('Đã lưu cấu hình Key4U!');
    });
  });

  btnToggleSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  // Quét trang
  async function performScan() {
    setScanningState(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        showToast('Không tìm thấy tab hiện tại!', true);
        setScanningState(false);
        return;
      }
      activeTabId = tab.id;

      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
        showToast('Không thể quét trên trang cấu hình trình duyệt!', true);
        setScanningState(false);
        return;
      }

      let scanResults = null;
      // 1. Thử qua sendMessage tới content script trước
      try {
        const resp = await new Promise((resolve) => {
          chrome.tabs.sendMessage(tab.id, { action: 'SCAN_QUESTIONS' }, (res) => {
            if (chrome.runtime.lastError) resolve(null);
            else resolve(res);
          });
        });
        if (resp && resp.success && resp.data && resp.data.length > 0) {
          scanResults = resp.data;
        }
      } catch (e) {}

      // 2. Nếu sendMessage chưa có kết quả (tab chưa nạp content script), chạy trực tiếp executeScript
      if (!scanResults || scanResults.length === 0) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: inPageExtractQA
        });
        if (results && results[0] && results[0].result) {
          scanResults = results[0].result;
        }
      }

      setScanningState(false);

      if (scanResults && scanResults.length > 0) {
        allQuestions = scanResults;
        renderQuestions(allQuestions);
        showToast(`Đã nhận diện chuẩn xác ${allQuestions.length} câu hỏi!`);
      } else {
        showToast('Không tìm thấy câu hỏi nào trên trang!', true);
      }
    } catch (err) {
      setScanningState(false);
      showToast('Lỗi khi quét: ' + err.message, true);
    }
  }

  btnScan.addEventListener('click', performScan);

  // Gọi Key4U API giải 1 câu hỏi
  async function solveQuestionWithAI(q) {
    const apiKey = txtApiKey.value.trim() || DEFAULT_API_KEY;
    const model = txtModel.value.trim() || DEFAULT_MODEL;

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

    const res = await fetch('https://api.key4u.vn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Key4U API lỗi (${res.status}): ${errBody.slice(0, 150)}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON từ content
    let parsed = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Fallback tìm chữ cái
      const m = content.match(/([A-H])[\.\)\:]/i) || content.match(/\b([A-H])\b/i);
      if (m) {
        parsed = { answer: m[1].toUpperCase(), explanation: content };
      }
    }

    if (!parsed || !parsed.answer) {
      throw new Error('AI không trả về đáp án rõ ràng.');
    }

    parsed.answer = parsed.answer.toUpperCase().trim();
    return parsed;
  }

  // Tự động chọn đáp án trên web (Trả về true nếu thành công)
  async function triggerWebSelect(qaId, key, optionText) {
    if (!activeTabId) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) activeTabId = tab.id;
    }
    if (!activeTabId) return false;

    let isSelected = false;

    // Cách 1: Thử executeScript trực tiếp vào tab
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: activeTabId },
        func: inPageAutoSelect,
        args: [qaId, key, optionText || '']
      });
      if (results && results[0] && results[0].result) {
        isSelected = true;
      }
    } catch (e) {
      console.warn('executeScript failed, fallback to sendMessage:', e);
    }

    // Cách 2: Nếu executeScript chưa chọn được, gọi qua content script
    if (!isSelected) {
      try {
        const resp = await new Promise((resolve) => {
          chrome.tabs.sendMessage(activeTabId, {
            action: 'AUTO_SELECT_ANSWER',
            qaId: qaId,
            key: key,
            optionText: optionText || ''
          }, (res) => {
            if (chrome.runtime.lastError) {
              resolve({ success: false });
            } else {
              resolve(res || { success: false });
            }
          });
        });
        if (resp && resp.success) {
          isSelected = true;
        }
      } catch (e) {
        console.warn('sendMessage failed:', e);
      }
    }

    return isSelected;
  }

  // Giải toàn bộ câu hỏi và tự động chọn trên web
  btnSolveAll.addEventListener('click', async () => {
    if (allQuestions.length === 0) {
      await performScan();
      if (allQuestions.length === 0) return;
    }

    const apiKey = txtApiKey.value.trim();
    if (!apiKey) {
      settingsPanel.classList.remove('hidden');
      txtApiKey.focus();
      return showToast('Vui lòng nhập Key4U API Key trước!', true);
    }

    btnSolveAll.disabled = true;
    btnSolveAll.innerHTML = `
      <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      <span>Đang giải AI...</span>
    `;

    let successCount = 0;
    showToast(`Bắt đầu giải ${allQuestions.length} câu với GPT-5.5...`);

    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      const card = document.querySelector(`[data-id="${q.id}"]`);

      try {
        if (card) {
          card.style.borderColor = '#ec4899';
        }

        const aiResult = await solveQuestionWithAI(q);
        q.aiSolution = aiResult;
        q.selectedAnswer = aiResult.answer;

        // Tự động chọn trên web nếu được bật (kèm text để so khớp chuẩn 100%)
        const matchedOpt = q.options.find(o => o.key === aiResult.answer);
        const optText = matchedOpt ? matchedOpt.text : '';
        let isWebSelected = false;

        if (chkAutoSelectWeb.checked) {
          isWebSelected = await triggerWebSelect(q.id, aiResult.answer, optText);
        }

        // Cập nhật thẻ Card trên Popup
        renderAiSolutionInCard(card, aiResult, q, isWebSelected);
        successCount++;
      } catch (err) {
        console.error(`Lỗi câu ${q.num || q.index}:`, err);
        if (card) {
          let errBox = card.querySelector('.ai-solution-box');
          if (!errBox) {
            errBox = document.createElement('div');
            errBox.className = 'ai-solution-box';
            card.appendChild(errBox);
          }
          errBox.innerHTML = `<span style="color:#ef4444;">❌ Lỗi: ${err.message}</span>`;
        }
      }
    }

    btnSolveAll.disabled = false;
    btnSolveAll.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
      </svg>
      <span>AI Giải & Tự Chọn</span>
    `;

    showToast(`Đã giải xong ${successCount}/${allQuestions.length} câu và tự chọn trên web!`);
  });

  // Hiển thị kết quả AI trên Card
  function renderAiSolutionInCard(card, aiResult, q, isWebSelected = false) {
    if (!card) return;

    // Highlight option tương ứng trong popup
    card.querySelectorAll('.option-item').forEach(optEl => {
      const badge = optEl.querySelector('.opt-badge');
      if (badge && badge.textContent.trim().toUpperCase() === aiResult.answer) {
        optEl.classList.add('is-selected');
      } else {
        optEl.classList.remove('is-selected');
      }
    });

    let solutionBox = card.querySelector('.ai-solution-box');
    if (!solutionBox) {
      solutionBox = document.createElement('div');
      solutionBox.className = 'ai-solution-box';
      card.appendChild(solutionBox);
    }

    const badgeStatus = isWebSelected 
      ? `<span style="font-size:11px; color:#10b981; font-weight:600;">✓ Đã chọn trên web</span>`
      : `<span style="font-size:11px; color:#f59e0b;">(Chưa chọn trên web)</span>`;

    solutionBox.innerHTML = `
      <div class="ai-solution-header">
        <span>🤖 AI (GPT-5.5) chọn: <span class="ai-badge-choice">${aiResult.answer}</span></span>
        ${badgeStatus}
      </div>
      <div class="ai-explanation">${aiResult.explanation || ''}</div>
    `;
  }

  // Tìm kiếm realtime
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    if (!keyword) {
      renderQuestions(allQuestions);
      return;
    }
    const filtered = allQuestions.filter(q => {
      const inTitle = q.title.toLowerCase().includes(keyword);
      const inOptions = q.options.some(opt => opt.text.toLowerCase().includes(keyword) || opt.raw.toLowerCase().includes(keyword));
      return inTitle || inOptions;
    });
    renderQuestions(filtered, true);
  });

  function setScanningState(isScanning) {
    const icon = btnScan.querySelector('.icon-spin-target');
    const text = btnScan.querySelector('span');
    if (isScanning) {
      icon.classList.add('spin');
      text.textContent = 'Đang quét...';
      btnScan.disabled = true;
    } else {
      icon.classList.remove('spin');
      text.textContent = 'Quét trang';
      btnScan.disabled = false;
    }
  }

  function renderQuestions(items, isFiltered = false) {
    questionCount.textContent = items.length;

    if (items.length === 0) {
      if (isFiltered) {
        questionsList.innerHTML = `<div style="text-align:center; padding: 30px; color: var(--text-muted)">Không tìm thấy câu hỏi phù hợp.</div>`;
      } else {
        emptyState.classList.remove('hidden');
        filterSection.classList.add('hidden');
        questionsList.innerHTML = '';
      }
      return;
    }

    emptyState.classList.add('hidden');
    filterSection.classList.remove('hidden');
    questionsList.innerHTML = '';

    items.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.dataset.id = q.id;

      const header = document.createElement('div');
      header.className = 'question-header';

      const tag = document.createElement('span');
      tag.className = 'q-index-tag';
      tag.textContent = `Câu ${q.num || q.index || (idx + 1)}`;

      const title = document.createElement('div');
      title.className = 'q-text';
      let displayTitle = (q.title || '').replace(/^(?:question|câu|câu\s*hỏi|bài|item|q)\s*\d+[\.\:\s\-]+/i, '').trim();
      if (!displayTitle) displayTitle = q.title;
      title.textContent = displayTitle;

      const actions = document.createElement('div');
      actions.className = 'q-card-actions';

      // Nút AI giải riêng 1 câu
      const btnSolveSingle = document.createElement('button');
      btnSolveSingle.className = 'btn-card-action';
      btnSolveSingle.title = 'Dùng AI giải câu này và tự động chọn';
      btnSolveSingle.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"></path>
        </svg>
      `;
      btnSolveSingle.addEventListener('click', async () => {
        btnSolveSingle.style.opacity = '0.5';
        try {
          const aiResult = await solveQuestionWithAI(q);
          q.aiSolution = aiResult;
          q.selectedAnswer = aiResult.answer;

          const matchedOpt = q.options.find(o => o.key === aiResult.answer);
          const optText = matchedOpt ? matchedOpt.text : '';
          let isWebSelected = false;

          if (chkAutoSelectWeb.checked) {
            isWebSelected = await triggerWebSelect(q.id, aiResult.answer, optText);
          }
          renderAiSolutionInCard(card, aiResult, q, isWebSelected);
          if (isWebSelected) {
            showToast(`Câu ${q.num || q.index}: AI đã chọn ${aiResult.answer} trên trang web!`);
          } else {
            showToast(`Câu ${q.num || q.index}: AI chọn ${aiResult.answer}`);
          }
        } catch (e) {
          showToast(e.message, true);
        } finally {
          btnSolveSingle.style.opacity = '1';
        }
      });

      // Nút Cuộn tới vị trí trên web
      const btnLocate = document.createElement('button');
      btnLocate.className = 'btn-card-action';
      btnLocate.title = 'Cuộn tới câu hỏi trên trang';
      btnLocate.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      `;
      btnLocate.addEventListener('click', () => {
        if (activeTabId && q.id) {
          chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            func: inPageHighlightQA,
            args: [q.id]
          });
        }
      });

      // Nút Copy
      const btnCopySingle = document.createElement('button');
      btnCopySingle.className = 'btn-card-action';
      btnCopySingle.title = 'Sao chép câu này';
      btnCopySingle.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      btnCopySingle.addEventListener('click', () => {
        const text = formatSingleQuestion(q);
        copyToClipboard(text, 'Đã chép câu ' + (q.num || q.index || (idx + 1)));
      });

      actions.appendChild(btnSolveSingle);
      actions.appendChild(btnLocate);
      actions.appendChild(btnCopySingle);

      header.appendChild(tag);
      header.appendChild(title);
      header.appendChild(actions);
      card.appendChild(header);

      if (q.image) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'q-image-container';
        const img = document.createElement('img');
        img.src = q.image;
        img.className = 'q-image-preview';
        img.title = 'Nhấp để xem ảnh lớn';
        img.addEventListener('click', () => window.open(q.image, '_blank'));
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
      }

      if (q.options && q.options.length > 0) {
        const optsContainer = document.createElement('div');
        optsContainer.className = 'options-list';

        q.options.forEach(opt => {
          const optDiv = document.createElement('div');
          const isSel = (q.selectedAnswer === opt.key) || opt.isChecked;
          optDiv.className = 'option-item' + (isSel ? ' is-selected' : '');

          const badge = document.createElement('span');
          badge.className = 'opt-badge';
          badge.textContent = opt.key || '•';

          const optText = document.createElement('span');
          optText.className = 'opt-text';
          optText.textContent = opt.text || opt.raw;

          // Click vào option trong popup cũng tự động chọn trên web
          optDiv.style.cursor = 'pointer';
          optDiv.addEventListener('click', async () => {
            const isWebSelected = await triggerWebSelect(q.id, opt.key, opt.text);
            q.selectedAnswer = opt.key;
            card.querySelectorAll('.option-item').forEach(el => el.classList.remove('is-selected'));
            optDiv.classList.add('is-selected');
            if (isWebSelected) {
              showToast(`Đã chọn đáp án ${opt.key} trực tiếp trên trang web!`);
            } else {
              showToast(`Đã chọn ${opt.key}`);
            }
          });

          optDiv.appendChild(badge);
          optDiv.appendChild(optText);
          optsContainer.appendChild(optDiv);
        });

        card.appendChild(optsContainer);
      }

      if (q.aiSolution) {
        renderAiSolutionInCard(card, q.aiSolution, q);
      }

      questionsList.appendChild(card);
    });
  }

  function formatSingleQuestion(q) {
    let result = `${q.title}\n`;
    if (q.image) result += `[Hình ảnh: ${q.image}]\n`;
    if (q.options && q.options.length > 0) {
      q.options.forEach(opt => {
        result += `  ${opt.key ? opt.key + '.' : '•'} ${opt.text}${opt.isChecked ? ' (Đã chọn)' : ''}\n`;
      });
    }
    if (q.aiSolution) {
      result += `=> AI Đáp án: ${q.aiSolution.answer} (${q.aiSolution.explanation})\n`;
    }
    return result;
  }

  function formatMarkdown(list) {
    return list.map((q, i) => {
      let md = `### Câu ${q.num || q.index || (i + 1)}: ${q.title}\n`;
      if (q.image) md += `![](${q.image})\n\n`;
      if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          const check = (q.selectedAnswer === opt.key || opt.isChecked) ? ' ✅' : '';
          md += `- **${opt.key || '•'}.** ${opt.text}${check}\n`;
        });
      }
      if (q.aiSolution) {
        md += `\n> **AI Đáp án:** **${q.aiSolution.answer}** - ${q.aiSolution.explanation}\n`;
      }
      return md;
    }).join('\n---\n\n');
  }

  function formatPlainText(list) {
    return list.map((q, i) => formatSingleQuestion(q)).join('\n');
  }

  function formatJSON(list) {
    return JSON.stringify(list, null, 2);
  }

  function copyToClipboard(content, message = 'Đã sao chép vào bộ nhớ đệm!') {
    navigator.clipboard.writeText(content).then(() => {
      showToast(message);
    }).catch(() => {
      showToast('Lỗi khi sao chép!', true);
    });
  }

  let toastTimer = null;
  function showToast(msg, isError = false) {
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.style.background = isError ? '#ef4444' : '#10b981';
    toast.classList.remove('hidden');
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }

  btnCopyMarkdown.addEventListener('click', () => {
    if (allQuestions.length === 0) return showToast('Chưa có câu hỏi nào được quét!', true);
    copyToClipboard(formatMarkdown(allQuestions), 'Đã sao chép Markdown!');
  });

  btnCopyJson.addEventListener('click', () => {
    if (allQuestions.length === 0) return showToast('Chưa có câu hỏi nào được quét!', true);
    copyToClipboard(formatJSON(allQuestions), 'Đã sao chép JSON!');
  });

  btnCopyText.addEventListener('click', () => {
    if (allQuestions.length === 0) return showToast('Chưa có câu hỏi nào được quét!', true);
    copyToClipboard(formatPlainText(allQuestions), 'Đã sao chép văn bản thuần!');
  });

  btnDownload.addEventListener('click', () => {
    if (allQuestions.length === 0) return showToast('Chưa có câu hỏi nào để tải về!', true);
    const content = formatPlainText(allQuestions);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cau_hoi_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã tải file câu hỏi!');
  });

  // Tự động quét khi mở popup
  setTimeout(performScan, 150);
});
