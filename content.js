/**
 * Q&A Detector & AI Auto Solver - Content Script
 * Tự động click chọn đáp án trực tiếp trên web với forceClickOption siêu mạnh.
 */

(function () {
  const QUESTION_HEADER_REGEX = /(?:^|\s)(?:câu|question|quest|q|bài|item|câu\s*hỏi)\s*(\d+)\b(?![:\/]\d)/i;
  const OPTION_PREFIX_REGEX = /^\s*([A-Za-zĐđ①-⑩❶-❿Ⓐ-Ⓗ])[\.\)\/:\–—\-]\s*(.*)$/;

  const SYSTEM_SPAM_WORDS = [
    'clear my choice', 'xóa lựa chọn', 'chưa trả lời', 'not yet answered',
    'đạt điểm', 'marked out of', 'đặt cờ', 'flag question', 'đoạn văn câu hỏi',
    'question text', 'bảng câu hỏi', 'quiz navigation', 'trang tiếp', 'next page',
    'quay lại', 'làm xong', 'finish attempt', 'nộp bài', 'kết quả bài làm',
    'tổng hợp bài tập', 'bạn đang đăng nhập', 'logged in as', 'copyright',
    'mở chỉ số ngăn', 'khóa học', 'course', 'danh sách câu hỏi', 'danh sách câu',
    'phân nhóm'
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
    if (lower.includes('danh sách câu hỏi') || lower.includes('danh sách câu') || lower.includes('phân nhóm') || lower.includes('bảng câu hỏi')) return true;
    return SYSTEM_SPAM_WORDS.some(spam => lower === spam || lower.startsWith(spam) || (lower.length < 50 && lower.includes(spam)));
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

    // Xóa điểm số rò rỉ cuối option, ví dụ: "(Điểm: 0.25)", "Điểm: 0/0.25", "Marked out of 1.00"
    s = s.replace(/\s*\(?(?:Điểm|Điểm số|Điểm đạt|Marked out of|Mark|Points?)\s*:\s*[\d\.,\/]+\)?\s*$/i, '').trim();
    s = s.replace(/\s*\(\s*Điểm\s*:\s*[\d\.,\/]+\s*\)\s*$/i, '').trim();

    // Cắt bỏ phần đáp án kế tiếp bị dính chùm vào (ví dụ option A có text: "learned B. buzzed C. curbed D. squeezed")
    if (expectedKey && expectedKey.length === 1) {
      const nextCode = expectedKey.toUpperCase().charCodeAt(0) + 1;
      if (nextCode <= 90) {
        const nextKey = String.fromCharCode(nextCode);
        const nextPattern = new RegExp(`\\s+(?:${nextKey})[\\.\\)\\:]\\s+`, 'i');
        const nextIdx = s.search(nextPattern);
        if (nextIdx > 0) {
          s = s.slice(0, nextIdx).trim();
        }
      }
    }

    return s;
  }

  function cleanOptionText(text, currentKey) {
    return stripOptionPrefix(text, currentKey);
  }

  function extractRichText(element) {
    if (!element) return '';
    const clone = element.cloneNode(true);

    // 1. Xóa các phần tử ẩn hoặc vô hình
    clone.querySelectorAll('.accesshide, .sr-only, .sr-only-focusable, .hidden-screen, [aria-hidden="true"]').forEach(el => el.remove());

    // 2. Xử lý KaTeX: Nếu có annotation TeX, lấy TeX; nếu không thì xóa .katex-mathml để không bị lặp chữ
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
      const src = img.currentSrc || img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src') || img.src;
      if (src) {
        const lowerSrc = src.toLowerCase();
        if (lowerSrc.includes('filtericon') || lowerSrc.includes('monologo') || lowerSrc.includes('icon.php') || lowerSrc.includes('/pix/') || lowerSrc.includes('avatar') || lowerSrc.includes('favicon') || lowerSrc.includes('logo')) {
          return null;
        }
        const rect = img.getBoundingClientRect();
        if ((rect.width > 25 && rect.height > 25) || (img.naturalWidth > 25 && img.naturalHeight > 25) || !img.complete) {
          return src;
        }
      }
    }
    const svg = elem.tagName === 'svg' ? elem : elem.querySelector('svg');
    if (svg) {
      const rect = svg.getBoundingClientRect();
      const w = parseInt(svg.getAttribute('width') || '0', 10);
      const h = parseInt(svg.getAttribute('height') || '0', 10);
      if ((rect.width > 30 && rect.height > 30) || (w > 30 || h > 30) || svg.getAttribute('viewBox')) {
        try {
          return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
        } catch (e) {}
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

  // Tầng 0: Nhận diện bài đọc hiểu (Reading Comprehension / Đoạn văn điền từ)
  function extractReadingPassages() {
    const readingSelectors = [
      '.yh-reading-area',
      '[class*="reading-area"]',
      '[class*="reading_area"]',
      '[class*="reading-passage"]',
      '[class*="reading-content"]',
      '[class*="reading-text"]',
      '[class*="reading-box"]',
      '[class*="passage"]',
      '.reading-area',
      '.reading-passage',
      '.reading',
      '.passage'
    ];

    const elements = Array.from(document.querySelectorAll(readingSelectors.join(', '))).filter(isVisible);

    const generalBlocks = Array.from(document.querySelectorAll('.ant-card, .card, blockquote, div[style*="background"]')).filter(el => {
      if (!isVisible(el)) return false;
      if (el.matches('.yh-question-card, [class*="question-card"], [id^="q-"], .que')) return false;
      const text = cleanText(el.textContent || '');
      return /^(?:read the following|đọc đoạn văn|đọc bài đọc|đọc kỹ đoạn văn|đọc hiểu|dưới đây là bài đọc|read the text)/i.test(text);
    });

    const allPassageElements = Array.from(new Set([...elements, ...generalBlocks]));
    const cleanPassageEls = allPassageElements.filter(el => {
      return !allPassageElements.some(other => other !== el && other.contains(el));
    });

    const passageMap = new Map(); // qNum -> passageText

    cleanPassageEls.forEach(passageEl => {
      const passageText = extractRichText(passageEl);
      if (!passageText || passageText.length < 35) return;

      // Tìm dải số câu hỏi, ví dụ: "from 13 to 16", "từ câu 13 đến 16", "blanks 13 to 16", "questions 31-36"
      const rangeRegex = /(?:from|từ|câu|blanks?|questions?)\s*(?:câu\s*)?(\d+)\s*(?:to|đến|tới|-)\s*(?:câu\s*)?(\d+)/i;
      const m = passageText.match(rangeRegex);
      if (m) {
        const startQ = parseInt(m[1], 10);
        const endQ = parseInt(m[2], 10);
        if (!isNaN(startQ) && !isNaN(endQ) && startQ <= endQ && (endQ - startQ) <= 25) {
          for (let q = startQ; q <= endQ; q++) {
            passageMap.set(q, passageText);
          }
          return;
        }
      }

      // Nếu không ghi rõ số câu, gán cho các câu hỏi anh em cùng container/section cha
      const parentSection = passageEl.closest('div[style*="margin-bottom"], section, .exam-section, .quiz-section, .ant-space, body');
      if (parentSection && parentSection !== document.body) {
        const siblingQuestionBoxes = Array.from(parentSection.querySelectorAll('.yh-question-card, [class*="question-card"], [id^="q-"], .que')).filter(isVisible);
        siblingQuestionBoxes.forEach(qBox => {
          const numElem = qBox.querySelector('.yh-question-stem__label, .yh-question-stem, [class*="question-stem"], .qno, .no, .q-number, b, strong');
          if (numElem) {
            const numMatch = numElem.textContent.match(/\d+/);
            if (numMatch) {
              const num = parseInt(numMatch[0], 10);
              if (!isNaN(num) && !passageMap.has(num)) {
                passageMap.set(num, passageText);
              }
            }
          }
        });
      }
    });

    return passageMap;
  }

  // Tầng 1: Nhận diện cấu trúc thẻ câu hỏi điển hình (Moodle, Canvas, Subtt, Azota, Yourhomework...)
  function extractQuizContainers(passageMap) {
    const containerSelectors = [
      '.que',
      '.yh-question-card',
      '[class*="yh-question-card"]',
      '[class*="question-card"]',
      '[id^="q-"]',
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

    // Lọc bỏ container cha bao bọc container con
    questionBoxes = questionBoxes.filter(box => {
      return !questionBoxes.some(other => other !== box && other.contains(box));
    });

    if (questionBoxes.length === 0) return null;

    const questionsMap = new Map();

    questionBoxes.forEach((box, idx) => {
      let qNum = idx + 1;
      const numElem = box.querySelector(
        '.yh-question-stem__label, .yh-question-stem, [class*="question-stem"], ' +
        '.qno, .no, .info .no, .info .header, .q-number, .question-number, ' +
        '[class*="question-num"], [class*="q-num"], h3, h4, h5'
      );
      if (numElem) {
        const text = cleanText(numElem.textContent);
        const matchNum = text.match(/(?:question|câu|quest|q|bài)?\s*(\d+)/i);
        if (matchNum) {
          const parsed = parseInt(matchNum[1], 10);
          if (!isNaN(parsed) && parsed > 0 && parsed < 1000) qNum = parsed;
        }
      }

      let title = '';
      const qtextEl = box.querySelector(
        '.yh-question-stem, [class*="question-stem"], .qtext, [class*="question-title"], ' +
        '[class*="question-text"], [class*="content-question"], .stem'
      );
      if (qtextEl) {
        const clone = qtextEl.cloneNode(true);
        clone.querySelectorAll('.accesshide, .sr-only, .sr-only-focusable, input, .ablock, .answer').forEach(el => el.remove());
        title = extractRichText(clone);
      } else {
        const formEl = box.querySelector('.formulation') || box;
        const clone = formEl.cloneNode(true);
        clone.querySelectorAll(
          '.accesshide, .sr-only, .ablock, .answer, .r0, .r1, input, h4, ' +
          '.qtype_multichoice_clearchoice, [class*="option"], [class*="answer"], ' +
          '.yh-mcq-options, .ant-radio-group'
        ).forEach(el => el.remove());
        title = extractRichText(clone);
      }

      if (!title || title.length < 3) title = `Câu hỏi ${qNum}`;

      // Nếu có bài đọc hiểu tương ứng, tách riêng vào passage
      let passageText = null;
      if (passageMap && passageMap.has(qNum)) {
        passageText = passageMap.get(qNum);
        if (/^(?:câu|question|quest|q|bài)\s*\d+[\.\:\s]*$/i.test(title.trim())) {
          title = `${title} (Chọn đáp án đúng nhất cho vị trí (${qNum}) hoặc câu hỏi này dựa trên bài đọc hiểu trên)`;
        }
      }

      let imgSrc = extractImageUrl(qtextEl || box);
      if (!imgSrc) {
        const qTitleText = cleanText(title || '');
        const asksForMedia = /(?:bảng|table|hình|ảnh|sơ đồ|đồ thị|biểu đồ|biển báo|thông báo|notice|sign|figure|diagram|picture|image|chart|sau đây|dưới đây)/i.test(qTitleText);

        const allMedia = Array.from(document.querySelectorAll('img, svg, canvas, .yh-player-media, .yh-player-media--section, [class*="player-media"], [class*="section-media"]'));
        const preceding = allMedia.filter(el => {
          if (box.contains(el)) return false;
          if (el.closest('header, nav, footer, #page-header, #header, .navbar, .breadcrumb, [class*="breadcrumb"], [class*="banner"], [class*="logo"], [class*="avatar"], [class*="user"], [class*="profile"], aside, [class*="drawer"]')) {
            return false;
          }
          return (el.compareDocumentPosition(box) & Node.DOCUMENT_POSITION_FOLLOWING);
        });

        for (let i = preceding.length - 1; i >= 0; i--) {
          const el = preceding[i];
          const otherBox = el.closest(containerSelectors.join(', '));
          if (otherBox && otherBox !== box) continue;

          const isExplicitSectionMedia = !!el.closest('.yh-player-media, .yh-player-media--section, [class*="section-media"], [class*="player-media"]');
          if (!asksForMedia && !isExplicitSectionMedia) {
            continue;
          }

          const candidate = extractImageUrl(el);
          if (candidate) {
            imgSrc = candidate;
            break;
          }
        }
      }
      const options = [];
      const qId = `qa-detected-quiz-${qNum}`;
      box.setAttribute('data-qa-id', qId);

      // Kiểm tra dạng câu hỏi Đúng / Sai 4 ý (Phần II)
      const yhTfRows = Array.from(box.querySelectorAll('.yh-tf4-row'));
      if (yhTfRows.length > 0) {
        const tfItems = [];
        yhTfRows.forEach((row, rIdx) => {
          let key = String.fromCharCode(65 + rIdx);
          const keyElem = row.querySelector('.yh-tf4-stem__key, .key, b, strong');
          if (keyElem) {
            const m = (keyElem.innerText || keyElem.textContent || '').match(/([A-D])/i);
            if (m) key = m[1].toUpperCase();
          }
          const stemEl = row.querySelector('.yh-tf4-stem__text, .stem-text, [class*="text"]') || row;
          const statement = cleanText(stemEl.innerText || stemEl.textContent || '');

          const trueInp = row.querySelector('.yh-tf4-true input, [class*="true"] input') || row.querySelectorAll('input')[0];
          if (trueInp) {
            trueInp.setAttribute('data-qa-for', qId);
            trueInp.setAttribute('data-qa-opt', `${key}_TRUE`);
            const wrap = trueInp.closest('label, .ant-radio-wrapper') || trueInp.parentElement;
            if (wrap) {
              wrap.setAttribute('data-qa-for', qId);
              wrap.setAttribute('data-qa-opt', `${key}_TRUE`);
            }
          }
          const falseInp = row.querySelector('.yh-tf4-false input, [class*="false"] input') || row.querySelectorAll('input')[1];
          if (falseInp) {
            falseInp.setAttribute('data-qa-for', qId);
            falseInp.setAttribute('data-qa-opt', `${key}_FALSE`);
            const wrap = falseInp.closest('label, .ant-radio-wrapper') || falseInp.parentElement;
            if (wrap) {
              wrap.setAttribute('data-qa-for', qId);
              wrap.setAttribute('data-qa-opt', `${key}_FALSE`);
            }
          }

          tfItems.push({
            key: key,
            statement: statement
          });
        });

        const qObj = {
          id: qId,
          num: qNum,
          index: idx + 1,
          type: 'true_false_group',
          title: cleanText(title),
          passage: passageText,
          image: imgSrc,
          items: tfItems,
          options: [],
          selectedAnswers: {},
          aiSolution: null
        };
        questionsMap.set(qNum, qObj);
        return;
      }

      // Tìm các lựa chọn đáp án: ưu tiên thẻ input (radio/checkbox)
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
          const wrapper = input.closest('label, .ant-radio-wrapper, .form-check') || input.parentElement;
          if (wrapper) {
            wrapper.setAttribute('data-qa-for', qId);
            wrapper.setAttribute('data-qa-opt', key);
          }

          const isChecked = input.checked || !!input.closest('.ant-radio-wrapper-checked, [class*="checked"]');

          options.push({
            key: key,
            text: optText,
            raw: `${key}. ${optText}`,
            isChecked: isChecked
          });
        });
      } else {
        // Nếu không có input radio, tìm các hàng đáp án (div, li, label, .r0, .r1, .form-check, .option)
        const optionRows = Array.from(box.querySelectorAll(
          '.yh-mcq-options > div, .ant-radio-wrapper, .answer > div, .answer > li, ' +
          '.ablock .r0, .ablock .r1, .form-check, [class*="option-item"], [class*="choice"]'
        )).filter(isVisible);

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
        const qObj = {
          id: qId,
          num: qNum,
          index: idx + 1,
          title: title,
          passage: passageText,
          image: imgSrc,
          options: options,
          selectedAnswer: options.find(o => o.isChecked)?.key || null
        };

        // Chống trùng lặp câu hỏi (Deduplication): giữ câu có options đầy đủ nhất hoặc có bài đọc hiểu
        if (questionsMap.has(qNum)) {
          const existing = questionsMap.get(qNum);
          if (options.length > existing.options.length || (!existing.passage && passageText)) {
            questionsMap.set(qNum, qObj);
          }
        } else {
          questionsMap.set(qNum, qObj);
        }
      }
    });

    const results = Array.from(questionsMap.values());
    results.sort((a, b) => a.num - b.num);
    results.forEach((q, i) => { q.index = i + 1; });
    return results.length > 0 ? results : null;
  }

  // Tầng 2: Heuristic tổng quát (Xử lý trang layout phẳng, không dùng class container)
  function extractGenericDOMQuestions(passageMap) {
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

      // 1. Ảnh
      if (node.tagName === 'IMG' || (!rawText && imgSrc)) {
        if (currentQ && !currentQ.image && imgSrc) {
          currentQ.image = imgSrc;
        }
        continue;
      }

      // 2. Kiểm tra nếu là tiêu đề câu hỏi mới (ví dụ: "Question 1.", "Câu 1:")
      const qMatch = rawText.match(QUESTION_HEADER_REGEX);
      if (qMatch && !isSpamText(rawText)) {
        const qNum = parseInt(qMatch[1], 10);

        // Bỏ qua timestamp (ví dụ 54:20)
        if (/^\d+:\d+/.test(rawText) || rawText.includes('54:20')) continue;

        // Nếu trùng qNum với câu đang tạo và câu đang tạo chưa có options/inputs, ghép vào title
        if (currentQ && currentQ.num === qNum && currentQ.inputs.length === 0 && currentQ.optionNodes.length === 0) {
          if (!currentQ.title.includes(rawText)) {
            currentQ.title += ' ' + rawText;
          }
          continue;
        }

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

      // 3. Nếu là thẻ INPUT radio/checkbox
      if (node.tagName === 'INPUT' && (node.type === 'radio' || node.type === 'checkbox')) {
        currentQ.inputs.push(node);
        continue;
      }

      // 4. Nếu là text có tiền tố A, B, C, D
      const optMatch = rawText.match(OPTION_PREFIX_REGEX);
      if (optMatch && !isSpamText(rawText)) {
        currentQ.optionNodes.push({ node, key: optMatch[1].toUpperCase(), rawText });
        continue;
      }

      // 5. Nếu là text thân bài của câu hỏi (trước khi có input/option)
      if (currentQ.inputs.length === 0 && currentQ.optionNodes.length === 0 && rawText.length < 400 && !isSpamText(rawText)) {
        if (!currentQ.title.includes(rawText)) {
          currentQ.title += ' ' + rawText;
        }
      }
    }

    // Xử lý hoàn thiện từng câu hỏi và Deduplication
    const questionsMap = new Map();

    questionList.forEach((q) => {
      const options = [];
      const optionsMap = new Map();

      // Trường hợp 1: Có các thẻ input radio/checkbox trực tiếp
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
          const wrapper = input.closest('label, .ant-radio-wrapper, .form-check') || input.parentElement;
          if (wrapper) {
            wrapper.setAttribute('data-qa-for', q.id);
            wrapper.setAttribute('data-qa-opt', key);
          }

          if (!optionsMap.has(key)) {
            const isChecked = input.checked || !!input.closest('.ant-radio-wrapper-checked, [class*="checked"]');
            const optObj = {
              key: key,
              text: optText,
              raw: `${key}. ${optText}`,
              isChecked: isChecked
            };
            optionsMap.set(key, optObj);
            options.push(optObj);
          }
        });
      }
      // Trường hợp 2: Có các nút text mang tiền tố A, B, C, D
      else if (q.optionNodes.length >= 2) {
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
      }
      // Trường hợp 3: Đoạn text câu hỏi chứa inline options
      else {
        const { title: cleanTitle, options: inlineOptions } = splitTextAndOptions(q.title);
        if (inlineOptions.length >= 2) {
          q.title = cleanTitle;
          inlineOptions.forEach(opt => options.push(opt));
        }
      }

      let passageText = null;
      if (passageMap && passageMap.has(q.num)) {
        passageText = passageMap.get(q.num);
      }
      let finalTitle = q.title;
      if (passageText && /^(?:câu|question|quest|q|bài)\s*\d+[\.\:\s]*$/i.test(finalTitle.trim())) {
        finalTitle = `${finalTitle} (Chọn đáp án đúng nhất cho vị trí (${q.num}) hoặc câu hỏi này dựa trên bài đọc hiểu trên)`;
      }

      if (options.length > 0 || finalTitle.length > 8 || q.image) {
        const qObj = {
          id: q.id,
          num: q.num,
          title: finalTitle,
          passage: passageText,
          image: q.image,
          options: options.sort((a, b) => a.key.localeCompare(b.key)),
          selectedAnswer: options.find(o => o.isChecked)?.key || null
        };

        if (questionsMap.has(q.num)) {
          const existing = questionsMap.get(q.num);
          if (options.length > existing.options.length || (!existing.passage && passageText)) {
            questionsMap.set(q.num, qObj);
          }
        } else {
          questionsMap.set(q.num, qObj);
        }
      }
    });

    const results = Array.from(questionsMap.values());
    results.sort((a, b) => a.num - b.num);
    results.forEach((q, i) => { q.index = i + 1; });
    return results;
  }

  function extractQuestionsAndAnswers() {
    clearHighlights();
    const passageMap = extractReadingPassages();
    const lmsResults = extractQuizContainers(passageMap);
    if (lmsResults && lmsResults.length > 0) {
      return lmsResults;
    }
    return extractGenericDOMQuestions(passageMap);
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

    // Kích hoạt click cả input và label để ăn 100% trên mọi nền tảng (Moodle, Azota, Canvas, YourHomework...)
    if (input && typeof input.click === 'function') {
      try {
        input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        input.click();
      } catch (e) {}
    }

    if (label && label !== input && typeof label.click === 'function') {
      try {
        label.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        label.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        label.click();
      } catch (e) {}
    }

    if (!input && !label && wrapperEl) {
      try {
        wrapperEl.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        wrapperEl.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        wrapperEl.click();
      } catch (e) {}
    }

    // Đảm bảo INPUT được set checked và bắn event chuẩn
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
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      } catch (e) {}
    }

    // Xóa sạch mọi bôi đen/selection
    try {
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    } catch (e) {}

    return true;
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

      // 2.0: Dành riêng cho câu hỏi Đúng / Sai theo từng ý (A_TRUE, A_FALSE, B_TRUE, B_FALSE...)
      const tfMatch = cleanKey.match(/^([A-D])_(TRUE|FALSE)$/i);
      if (tfMatch) {
        const subKey = tfMatch[1].toUpperCase();
        const wantTrue = tfMatch[2].toUpperCase() === 'TRUE';
        
        let tfRows = Array.from(container.querySelectorAll('.yh-tf4-row'));
        if (tfRows.length === 0) {
          tfRows = Array.from(container.querySelectorAll('.ant-space-item')).filter(r => r.querySelectorAll('input[type="radio"], input[type="checkbox"]').length === 2);
        }
        if (tfRows.length === 0) {
          tfRows = Array.from(container.querySelectorAll('tr')).filter(r => r.querySelectorAll('input[type="radio"], input[type="checkbox"]').length === 2);
        }
        if (tfRows.length === 0) {
          const divs = Array.from(container.querySelectorAll('div, li, fieldset'));
          tfRows = divs.filter(r => {
            const inps = r.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            return inps.length === 2 && !Array.from(r.children).some(c => c.querySelectorAll('input[type="radio"], input[type="checkbox"]').length === 2);
          });
        }

        for (let rIdx = 0; rIdx < tfRows.length; rIdx++) {
          const row = tfRows[rIdx];
          const rowText = cleanText(row.innerText || row.textContent || '');
          const keyElem = row.querySelector('.yh-tf4-stem__key, .key, b, strong');
          let rowKey = String.fromCharCode(65 + rIdx);
          if (keyElem) {
            const m = (keyElem.innerText || keyElem.textContent || '').match(/([A-D])/i);
            if (m) rowKey = m[1].toUpperCase();
          } else {
            const m = rowText.match(/(?:^|\s)([A-D])[\.\)]/i);
            if (m) rowKey = m[1].toUpperCase();
          }

          if (rowKey === subKey) {
            const inps = Array.from(row.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
            let targetInp = null;
            let targetCont = null;

            if (wantTrue) {
              targetCont = row.querySelector('.yh-tf4-true') || Array.from(row.querySelectorAll('label, div, span')).find(el => /\bđúng\b|\btrue\b/i.test(el.innerText || ''));
              targetInp = targetCont ? (targetCont.tagName === 'INPUT' ? targetCont : targetCont.querySelector('input')) : inps[0];
            } else {
              targetCont = row.querySelector('.yh-tf4-false') || Array.from(row.querySelectorAll('label, div, span')).find(el => /\bsai\b|\bfalse\b/i.test(el.innerText || ''));
              targetInp = targetCont ? (targetCont.tagName === 'INPUT' ? targetCont : targetCont.querySelector('input')) : (inps[1] || inps[inps.length - 1]);
            }

            if (targetInp || targetCont) {
              return forceClickTarget(targetInp, targetCont || row);
            }
          }
        }
      }

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
  const DEFAULT_MODEL = 'gpt-5.4-nano';

  // Dọn sạch toast cũ nếu còn tồn tại
  const oldToast = document.getElementById('qa-stealth-toast');
  if (oldToast) oldToast.remove();

  // Liên kết các câu hỏi AI bóc tách vào DOM trên trang web và trích xuất hình ảnh/sơ đồ chuẩn xác
  function inPageMapAiQuestions(parsedQuestions) {
    if (!parsedQuestions || parsedQuestions.length === 0) return {};

    document.querySelectorAll('[data-qa-id], [data-qa-for], [data-qa-opt]').forEach(el => {
      el.removeAttribute('data-qa-id');
      el.removeAttribute('data-qa-for');
      el.removeAttribute('data-qa-opt');
    });

    function isValidImageSrc(src) {
      if (!src || typeof src !== 'string') return false;
      const s = src.trim().toLowerCase();
      if (s.length < 10) return false;
      if (s.includes('avatar') || s.includes('filtericon') || s.includes('monologo') ||
          s.includes('icon.php') || s.includes('/pix/') || s.includes('favicon') ||
          s.includes('emoji') || s.includes('button') || s.includes('radio') ||
          s.includes('logo') || s.includes('navbar') || s.includes('arrow')) {
        return false;
      }
      return true;
    }

    function extractImageFromNode(node) {
      if (!node || !node.querySelectorAll) return null;

      function checkImg(img) {
        let src = img.currentSrc || img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src') || img.src;
        if (!src || !isValidImageSrc(src)) return null;

        const rect = img.getBoundingClientRect();
        const nw = img.naturalWidth || 0;
        const nh = img.naturalHeight || 0;
        if ((rect.width > 0 && rect.width < 25 && rect.height < 25) || (nw > 0 && nw < 25 && nh < 25)) {
          return null;
        }

        if (src.startsWith('blob:')) {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.clientWidth || 300;
            canvas.height = img.naturalHeight || img.clientHeight || 300;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            return canvas.toDataURL('image/png');
          } catch (e) {}
        }
        return src;
      }

      if (node.tagName === 'IMG') {
        const s = checkImg(node);
        if (s) return s;
      }

      const imgs = Array.from(node.querySelectorAll('img'));
      for (const img of imgs) {
        const s = checkImg(img);
        if (s) return s;
      }

      const svgs = Array.from(node.querySelectorAll('svg'));
      for (const svg of svgs) {
        const rect = svg.getBoundingClientRect();
        const w = parseInt(svg.getAttribute('width') || '0', 10);
        const h = parseInt(svg.getAttribute('height') || '0', 10);
        if ((rect.width > 30 && rect.height > 30) || (w > 30 || h > 30) || svg.getAttribute('viewBox')) {
          try {
            const clone = svg.cloneNode(true);
            if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
          } catch (e) {}
        }
      }

      const canvases = Array.from(node.querySelectorAll('canvas'));
      for (const cv of canvases) {
        if (cv.width > 30 && cv.height > 30) {
          try {
            return cv.toDataURL('image/png');
          } catch (e) {}
        }
      }

      const bgElements = Array.from(node.querySelectorAll('[style*="background"]'));
      for (const el of bgElements) {
        const style = el.getAttribute('style') || '';
        const bgMatch = style.match(/background(?:-image)?\s*:\s*url\((['"]?)(.*?)\1\)/i);
        if (bgMatch && isValidImageSrc(bgMatch[2])) {
          return bgMatch[2];
        }
      }

      return null;
    }

    function convertTableToMarkdown(tbl) {
      try {
        const rows = Array.from(tbl.querySelectorAll('tr'));
        if (rows.length === 0) return null;
        const mdRows = [];
        let maxCols = 0;
        rows.forEach((tr, rIdx) => {
          const cells = Array.from(tr.querySelectorAll('th, td')).map(td => {
            return (td.innerText || td.textContent || '').replace(/[\r\n\t]+/g, ' ').trim();
          });
          if (cells.length > 0) {
            if (cells.length > maxCols) maxCols = cells.length;
            mdRows.push(`| ${cells.join(' | ')} |`);
            if (rIdx === 0) {
              mdRows.push(`| ${cells.map(() => '---').join(' | ')} |`);
            }
          }
        });
        if (mdRows.length > 0) {
          return `[BẢNG THÔNG TIN / DỮ LIỆU]:\n${mdRows.join('\n')}`;
        }
      } catch (e) {}
      return null;
    }

    // Quét tìm hình ảnh, sơ đồ, bảng biểu dạng ảnh hoặc bảng dữ liệu HTML (tìm trong câu hoặc truy ngược lên trên tìm cái gần nhất)
    function findQuestionMedia(qCard, allHeaders, qNum) {
      let foundImg = null;
      let foundTable = null;

      const targetNode = qCard || (allHeaders && allHeaders[0]) || null;
      if (!targetNode) return { image: null, table: null };

      // 1. Kiểm tra trực tiếp bên trong câu hỏi (targetNode hoặc qCard)
      foundImg = extractImageFromNode(targetNode);
      if (!foundImg && qCard && qCard !== targetNode) {
        foundImg = extractImageFromNode(qCard);
      }

      const insideTable = targetNode.querySelector('table') || (qCard ? qCard.querySelector('table') : null);
      if (insideTable) {
        foundTable = convertTableToMarkdown(insideTable);
      }

      // 2. Quét ngược lên trên tìm hình ảnh / sơ đồ / bảng biểu dạng ảnh gần nhất đứng trước câu hỏi
      if (!foundImg) {
        const qNodeText = (targetNode.innerText || targetNode.textContent || '').toLowerCase();
        const asksForMedia = /(?:bảng|table|hình|ảnh|sơ đồ|đồ thị|biểu đồ|biển báo|thông báo|notice|sign|figure|diagram|picture|image|chart|sau đây|dưới đây)/i.test(qNodeText);

        const allMediaElements = Array.from(document.querySelectorAll(
          'img, svg, canvas, .yh-player-media, .yh-player-media--section, [class*="player-media"], [class*="section-media"], [class*="image-wrap"]'
        ));

        // Lọc các phần tử media nằm TRƯỚC targetNode trong DOM
        const precedingMedia = allMediaElements.filter(el => {
          if (targetNode.contains(el)) return false;
          if (el.closest('header, nav, footer, #page-header, #header, .navbar, .breadcrumb, [class*="breadcrumb"], [class*="banner"], [class*="logo"], [class*="avatar"], [class*="user"], [class*="profile"], aside, [class*="drawer"]')) {
            return false;
          }
          try {
            return (el.compareDocumentPosition(targetNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
          } catch (e) {
            return false;
          }
        });

        // Duyệt ngược từ cuối (phần tử gần nhất) lên trên đầu trang
        for (let i = precedingMedia.length - 1; i >= 0; i--) {
          const el = precedingMedia[i];

          // Bỏ qua nếu đây là hình ảnh nội bộ nằm trong card câu hỏi khác
          const otherQCard = el.closest('.yh-question-card, .que, [class*="question-card"], [id^="q-"]');
          if (otherQCard && otherQCard !== targetNode) {
            continue;
          }

          const isExplicitSectionMedia = !!el.closest('.yh-player-media, .yh-player-media--section, [class*="section-media"], [class*="player-media"]');
          if (!asksForMedia && !isExplicitSectionMedia) {
            continue;
          }

          const imgCandidate = extractImageFromNode(el);
          if (imgCandidate) {
            foundImg = imgCandidate;
            break; // ĐÃ TÌM THẤY MEDIA/BẢNG BIỂU GẦN NHẤT ĐỨNG TRƯỚC CÂU HỎI!
          }
        }
      }

      // 3. Quét ngược lên trên tìm bảng <table> HTML gần nhất nếu đề bài nhắc tới bảng/số liệu
      if (!foundTable) {
        const qText = (targetNode.innerText || targetNode.textContent || '').toLowerCase();
        const refersToTable = /bảng|table|số liệu|dữ liệu|thông tin trong bảng/i.test(qText);
        if (refersToTable) {
          const allTables = Array.from(document.querySelectorAll('table'));
          const precedingTables = allTables.filter(tbl => {
            if (targetNode.contains(tbl)) return false;
            if (tbl.closest('header, nav, footer, #page-header, #header, .navbar, .breadcrumb, [class*="breadcrumb"], [class*="banner"], aside')) return false;
            try {
              return (tbl.compareDocumentPosition(targetNode) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
            } catch (e) {
              return false;
            }
          });

          for (let i = precedingTables.length - 1; i >= 0; i--) {
            const tbl = precedingTables[i];
            const otherQCard = tbl.closest('.yh-question-card, .que, [class*="question-card"], [id^="q-"]');
            if (otherQCard && otherQCard !== targetNode) continue;

            const md = convertTableToMarkdown(tbl);
            if (md) {
              foundTable = md;
              break; // ĐÃ TÌM THẤY TABLE HTML GẦN NHẤT ĐỨNG TRƯỚC CÂU HỎI!
            }
          }
        }
      }

      return { image: foundImg, table: foundTable };
    }

    const imageMap = {};
    const tableMap = {};

    parsedQuestions.forEach(q => {
      const qNum = q.num;
      const qId = `qa-detected-ai-${qNum}`;

      // Ưu tiên 1: Tìm chính xác question card theo nhãn số câu hỏi (Hỗ trợ chuẩn Moodle, YourHomework...)
      let qCard = null;
      const questionCards = Array.from(document.querySelectorAll('.yh-question-card, .que, [class*="question-card"], [id^="q-"]'));
      for (const card of questionCards) {
        const numElem = card.querySelector(
          '.yh-question-stem__label, .qno, .no, .info .no, .info .header, .info h3, ' +
          '[class*="question-num"], [class*="q-num"], .question-number, h3, h4, h5'
        ) || card.querySelector('.yh-question-stem, .qtext, [class*="stem"], b, strong') || card;
        const numTxt = (numElem.innerText || numElem.textContent || '').trim();
        const m = numTxt.match(/(?:question|câu|câu\s*hỏi|quest|q|bài)\s*(\d+)\b/i);
        if (m && parseInt(m[1], 10) === qNum) {
          qCard = card;
          break;
        }
      }

      const allHeaders = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, div, p, span, b, strong')).filter(el => {
        if (el.closest('header, nav, footer, #page-header, #header, .breadcrumb, [class*="breadcrumb"], [class*="banner"], .navbar, [class*="nav"]')) {
          return false;
        }
        const txt = (el.innerText || el.textContent || '').trim();
        if (txt.length > 150) return false;
        const m = txt.match(/^(?:question|câu|câu\s*hỏi|quest|q)\s*(?:số\s*)?(\d+)\b/i);
        return m && parseInt(m[1], 10) === qNum;
      });

      if (!qCard && allHeaders.length > 0) {
        for (const h of allHeaders) {
          let curr = h;
          while (curr && curr !== document.body) {
            if (curr.querySelectorAll('input[type="radio"], input[type="checkbox"]').length >= 2) {
              qCard = curr;
              break;
            }
            curr = curr.parentElement;
          }
          if (qCard) break;
        }
        if (!qCard && allHeaders[0]) {
          qCard = allHeaders[0].closest('.yh-question-card, .que, .question-card, [id^="q-"], div') || allHeaders[0];
        }
      }

      // Trích xuất ảnh/bảng biểu dạng ảnh hoặc bảng HTML cho câu hỏi này
      const media = findQuestionMedia(qCard, allHeaders, qNum);
      if (media.image) {
        imageMap[qNum] = media.image;
      }
      if (media.table) {
        tableMap[qNum] = media.table;
      }

      if (qCard) {
        qCard.setAttribute('data-qa-id', qId);

        // Kiểm tra xem đây có phải dạng câu hỏi Đúng / Sai 4 ý không
        const yhTfRows = Array.from(qCard.querySelectorAll('.yh-tf4-row'));
        const isTF = (q.type === 'true_false_group') || yhTfRows.length > 0;

        if (isTF) {
          let tfRows = yhTfRows;
          if (tfRows.length === 0) {
            const candidates = Array.from(qCard.querySelectorAll('.ant-space-item, tr, .form-check-inline, div'));
            tfRows = candidates.filter(r => {
              const inps = r.querySelectorAll('input[type="radio"], input[type="checkbox"]');
              return inps.length === 2 && /đúng|sai|true|false/i.test(r.innerText || '');
            });
          }

          tfRows.forEach((row, rIdx) => {
            let key = String.fromCharCode(65 + rIdx);
            const keyElem = row.querySelector('.yh-tf4-stem__key, .key, b, strong');
            if (keyElem) {
              const m = (keyElem.innerText || '').match(/([A-D])/i);
              if (m) key = m[1].toUpperCase();
            }

            // Đúng
            const trueCont = row.querySelector('.yh-tf4-true') || 
              Array.from(row.querySelectorAll('label, div, span')).find(el => /\bđúng\b|\btrue\b/i.test(el.innerText || ''));
            const trueInp = trueCont ? (trueCont.tagName === 'INPUT' ? trueCont : trueCont.querySelector('input')) : row.querySelectorAll('input')[0];
            if (trueInp) {
              trueInp.setAttribute('data-qa-for', qId);
              trueInp.setAttribute('data-qa-opt', `${key}_TRUE`);
              const wrap = trueInp.closest('label, .ant-radio-wrapper') || trueInp.parentElement;
              if (wrap) {
                wrap.setAttribute('data-qa-for', qId);
                wrap.setAttribute('data-qa-opt', `${key}_TRUE`);
              }
            }

            // Sai
            const falseCont = row.querySelector('.yh-tf4-false') || 
              Array.from(row.querySelectorAll('label, div, span')).find(el => /\bsai\b|\bfalse\b/i.test(el.innerText || ''));
            const falseInp = falseCont ? (falseCont.tagName === 'INPUT' ? falseCont : falseCont.querySelector('input')) : row.querySelectorAll('input')[1];
            if (falseInp) {
              falseInp.setAttribute('data-qa-for', qId);
              falseInp.setAttribute('data-qa-opt', `${key}_FALSE`);
              const wrap = falseInp.closest('label, .ant-radio-wrapper') || falseInp.parentElement;
              if (wrap) {
                wrap.setAttribute('data-qa-for', qId);
                wrap.setAttribute('data-qa-opt', `${key}_FALSE`);
              }
            }
          });
        } else {
          const inputs = Array.from(qCard.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
            .filter(inp => !inp.closest('.qtype_multichoice_clearchoice'));
          if (inputs.length >= 2) {
            inputs.forEach((inp, idx) => {
              let key = String.fromCharCode(65 + idx);
              const label = findLabel(null, inp);
              const txt = cleanText((label ? label.innerText : inp.parentElement?.innerText) || '');
              const m = txt.match(/(?:^|\s)([A-Da-d])[\.\)\:]/);
              if (m) {
                key = m[1].toUpperCase();
              }
              inp.setAttribute('data-qa-for', qId);
              inp.setAttribute('data-qa-opt', key);
              const wrapper = inp.closest('label, .ant-radio-wrapper, .form-check, .r0, .r1') || inp.parentElement;
              if (wrapper) {
                wrapper.setAttribute('data-qa-for', qId);
                wrapper.setAttribute('data-qa-opt', key);
              }
              if (label) {
                label.setAttribute('data-qa-for', qId);
                label.setAttribute('data-qa-opt', key);
              }
            });
          } else {
            const rows = Array.from(qCard.querySelectorAll('label, .ant-radio-wrapper, [class*="option"], .answer > div, .r0, .r1, li'));
            rows.forEach((row, idx) => {
              let key = String.fromCharCode(65 + idx);
              const txt = cleanText(row.innerText || '');
              const m = txt.match(/(?:^|\s)([A-Da-d])[\.\)\:]/);
              if (m) {
                key = m[1].toUpperCase();
              }
              row.setAttribute('data-qa-for', qId);
              row.setAttribute('data-qa-opt', key);
            });
          }
        }
      }
    });

    return { imageMap, tableMap };
  }

  // Hàm làm sạch triệt để tiêu đề câu hỏi, tách bài đọc hiểu và loại bỏ trùng lặp
  function cleanQuestionTitle(rawTitle, passageText, qNum) {
    if (!rawTitle) return ('Câu hỏi ' + (qNum || '')).trim();
    let t = String(rawTitle).trim();

    // 1. Tách nếu có nhãn [NỘI DUNG CÂU HỎI]:
    if (t.includes('[NỘI DUNG CÂU HỎI]:')) {
      const parts = t.split('[NỘI DUNG CÂU HỎI]:');
      t = parts[parts.length - 1].trim();
    }

    // 2. Bỏ prefix nhãn đọc hiểu ở đầu
    t = t.replace(/^\[(?:ĐỌC HIỂU|TƯ LIỆU|READING PASSAGE)[^\]]*\]\s*:\s*/i, '').trim();

    // 3. Nếu tiêu đề chứa hoặc bắt đầu bằng đoạn văn passage
    if (passageText && typeof passageText === 'string') {
      const pTrim = passageText.trim();
      if (pTrim.length > 15) {
        if (t.startsWith(pTrim)) {
          t = t.slice(pTrim.length).trim();
        } else if (t.includes(pTrim)) {
          t = t.replace(pTrim, '').trim();
        } else {
          const normP = pTrim.replace(/\s+/g, ' ');
          const normT = t.replace(/\s+/g, ' ');
          if (normT.startsWith(normP)) {
            t = normT.slice(normP.length).trim();
          } else if (normT.includes(normP)) {
            t = normT.replace(normP, '').trim();
          }
        }
      }
    }

    // 4. Nếu có tiêu đề nhóm câu dạng "Question 19 - 22: ...\n (a)..."
    const groupMatch = t.match(/^((?:question|câu)\s*\d+\s*[\-\–]\s*\d+[\.\:\s\-]+[^\n]*)\n+([\s\S]*)$/i);
    if (groupMatch) {
      t = groupMatch[2].trim();
    }

    // 5. Bỏ tiền tố số câu ở đầu (Question 1., Câu 1:)
    t = t.replace(/^(?:question|câu|câu\s*hỏi|bài|item|q)\s*\d+[\.\:\s\-]+/i, '').trim();

    // 6. Nếu rỗng sau khi xử lý
    if (!t) {
      t = rawTitle.includes('(') ? rawTitle : ('Dựa vào bài đọc hiểu/đoạn văn trên để trả lời câu hỏi ' + (qNum || '')).trim();
    }

    return t;
  }

  // Bóc tách câu hỏi bằng AI trực tiếp trong content script
  async function extractQuestionsWithAI(apiKey, detectModel) {
    const clone = document.body.cloneNode(true);

    // 1. Loại bỏ các nút điều khiển media, nút zoom ảnh, phân trang, cờ đánh dấu
    clone.querySelectorAll('.yh-player-media__image-controls, .yh-player-media__audio-controls, button, .ant-btn, [class*="controls"], [class*="btn"], .ant-divider, .yh-question-action, .anticon-flag').forEach(el => el.remove());

    // 2. Chuyển đổi các thẻ <table> thành định dạng Markdown table rõ ràng để AI đọc hiểu dữ liệu
    clone.querySelectorAll('table').forEach(tbl => {
      try {
        const rows = Array.from(tbl.querySelectorAll('tr'));
        if (rows.length === 0) return;

        const mdRows = [];
        let maxCols = 0;

        rows.forEach((tr, rIdx) => {
          const cells = Array.from(tr.querySelectorAll('th, td')).map(td => {
            return (td.innerText || td.textContent || '').replace(/[\r\n\t]+/g, ' ').trim();
          });
          if (cells.length > 0) {
            if (cells.length > maxCols) maxCols = cells.length;
            mdRows.push(`| ${cells.join(' | ')} |`);
            if (rIdx === 0) {
              const divider = cells.map(() => '---').join(' | ');
              mdRows.push(`| ${divider} |`);
            }
          }
        });

        if (mdRows.length > 0) {
          const tableText = `\n\n[BẢNG THÔNG TIN / DỮ LIỆU]:\n${mdRows.join('\n')}\n\n`;
          const marker = document.createTextNode(tableText);
          tbl.parentNode?.replaceChild(marker, tbl);
        }
      } catch (e) {}
    });

    // 3. Đánh dấu ảnh bằng marker văn bản để AI nhận biết có hình ảnh/sơ đồ
    clone.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('data-src') || img.getAttribute('data-original') || img.getAttribute('data-lazy-src') || img.src;
      if (src && src.length > 10) {
        const lower = src.toLowerCase();
        if (!lower.includes('avatar') && !lower.includes('icon.php') && !lower.includes('/pix/') && !lower.includes('favicon') && !lower.includes('logo')) {
          const isSectionMedia = !!img.closest('.yh-player-media, .yh-player-media--section, [class*="section-media"], [class*="player-media"], [class*="image-wrap"]');
          const markerText = isSectionMedia
            ? `\n[HÌNH ẢNH / BẢNG BIỂU / SƠ ĐỒ / BIỂN BÁO CHO CÂU HỎI TIẾP THEO: ${src}]\n`
            : `\n[HÌNH ẢNH: ${src}]\n`;
          const marker = document.createTextNode(markerText);
          img.parentNode?.replaceChild(marker, img);
        }
      }
    });

    // 4. Đánh dấu sơ đồ hình học SVG bằng marker văn bản
    clone.querySelectorAll('svg').forEach(svg => {
      const rect = svg.getBoundingClientRect();
      const w = parseInt(svg.getAttribute('width') || '0', 10);
      const h = parseInt(svg.getAttribute('height') || '0', 10);
      if ((rect.width > 30 && rect.height > 30) || (w > 30 || h > 30) || svg.getAttribute('viewBox')) {
        const marker = document.createTextNode('\n[HÌNH ẢNH / SƠ ĐỒ HÌNH HỌC]\n');
        svg.parentNode?.replaceChild(marker, svg);
      } else {
        svg.remove();
      }
    });

    clone.querySelectorAll('script, style, noscript, nav, header, footer, iframe, select, textarea, audio, video, aside, .navbar, .sidebar, .menu, [class*="nav"], [class*="sidebar"], [class*="footer"]').forEach(el => el.remove());
    const mainArea = clone.querySelector('main, #main, .main, [role="main"], .quiz-content, .exam-content, .paper-container, .ant-layout-content, #content, .content') || clone;
    const pageText = (mainArea.innerText || mainArea.textContent || '')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!pageText || pageText.length < 50) return null;

    const prompt = `Bạn là chuyên gia bóc tách cấu trúc đề thi trắc nghiệm siêu chuẩn xác.
Hãy đọc kỹ văn bản đề thi dưới đây và trích xuất TOÀN BỘ các câu hỏi trắc nghiệm thành một mảng JSON hợp lệ.

CÁC NGUYÊN TẮC BẮT BUỘC:
1. PHÂN BIỆT RÕ 2 DẠNG CÂU HỎI ("type"):
   - Dạng 1: "single_choice" - Câu trắc nghiệm chọn 1 đáp án (có thể có 2, 3 hoặc 4 phương án như A, B, C hoặc A, B, C, D).
     CHÚ Ý CỰC KỲ QUAN TRỌNG: CHỈ trích xuất các phương án THỰC SỰ CÓ trong đề thi! Nếu câu hỏi chỉ có 3 đáp án A, B, C thì CHỈ tạo đúng 3 phần tử A, B, C trong mảng options, TUYỆT ĐỐI KHÔNG tự thêm phương án D rỗng hoặc gán text rỗng!
   - Dạng 2: "true_false_group" - Dạng Đúng / Sai (Phần II theo form mới Bộ GD&ĐT), mỗi câu có các mệnh đề A, B, C, D (hoặc a, b, c, d) và mỗi mệnh đề có 2 lựa chọn Đúng / Sai.

2. BÀI ĐỌC HIỂU, ĐOẠN TƯ LIỆU, HOẶC BẢNG SỐ LIỆU ("passage"):
   - CỰC KỲ QUAN TRỌNG: Nếu có đoạn văn đọc hiểu, đoạn trích, đoạn tư liệu, hoặc [BẢNG THÔNG TIN / DỮ LIỆU] dùng chung cho một câu hoặc một nhóm câu (ví dụ: 'Read the following passage...', 'Dựa vào bảng số liệu sau...', 'Cho đoạn tư liệu sau...'):
     BẮT BUỘC trích xuất TOÀN BỘ nội dung bài đọc, tư liệu hoặc bảng số liệu đó vào trường "passage" của tất cả các câu hỏi thuộc phần đọc hiểu đó.
   - Nếu câu độc lập không có bài đọc/tư liệu/bảng số liệu riêng, để "passage": null.

3. HÌNH ẢNH / BẢNG BIỂU DẠNG ẢNH / BIỂN BÁO / SƠ ĐỒ ("image"):
   - CỰC KỲ QUAN TRỌNG: Các câu hỏi có hình ảnh minh họa, BẢNG BIỂU DẠNG ẢNH, bảng số liệu, sơ đồ, biểu đồ, biển báo hoặc thông báo (ví dụ: 'Cho những thông tin trong bảng sau đây...', 'Dựa vào bảng số liệu sau...', 'Read the following notice/table/sign...', 'Quan sát hình vẽ sau...', 'Dựa vào sơ đồ...'):
     Nếu có [HÌNH ẢNH: url] hoặc [HÌNH ẢNH / BẢNG BIỂU / SƠ ĐỒ / BIỂN BÁO CHO CÂU HỎI TIẾP THEO: url] nằm ngay TRƯỚC câu hỏi hoặc trong câu hỏi:
     BẮT BUỘC PHẢI TRÍCH XUẤT LINK ẢNH ĐÓ VÀ GÁN VÀO TRƯỜNG "image" CỦA CÂU HỎI ĐÓ (hoặc tất cả các câu hỏi cùng tham chiếu đến bảng/ảnh này)!
   - TUYỆT ĐỐI KHÔNG ĐƯỢC để "image": null khi đề bài có hình ảnh/bảng biểu/biển báo minh họa tương ứng!
   - Nếu hoàn toàn không có hình ảnh hoặc bảng biểu minh họa, để "image": null.

4. BỎ QUA CÁC THÀNH PHẦN RÁC:
   - Đồng hồ đếm ngược, bảng danh sách câu hỏi, điểm số (ví dụ: '(Điểm: 0.25)'), chữ "Đúng Sai" bị lặp rác, nút nộp bài, các nút thu nhỏ/phóng to hình ("− 100% + Đặt lại").

5. CẤU TRÚC JSON MỖI PHẦN TỬ:
   - Nếu là dạng "single_choice":
     {
       "num": 1,
       "type": "single_choice",
       "passage": "Nội dung bài đọc hiểu, đoạn văn hoặc bảng số liệu nếu có (hoặc null nếu là câu hỏi độc lập)",
       "image": "url_ảnh_nếu_có_hoặc_null",
       "title": "CHỈ ghi câu hỏi cụ thể (ví dụ: 'What does \"they\" refer to?'). TUYỆT ĐỐI KHÔNG lặp lại bài đọc/passage vào trường title!",
       "options": [
         { "key": "A", "text": "nội dung đáp án A..." },
         { "key": "B", "text": "nội dung đáp án B..." }
       ]
     }
   - Nếu là dạng "true_false_group":
     {
       "num": 27,
       "type": "true_false_group",
       "passage": "Nội dung bài đọc hiểu, đoạn tư liệu hoặc bảng số liệu nếu có (hoặc null)",
       "image": "url_ảnh_nếu_có_hoặc_null",
       "title": "Yêu cầu câu hỏi (ví dụ: 'Cho đoạn tư liệu sau đây:'). TUYỆT ĐỐI KHÔNG lặp lại toàn bộ tư liệu vào title nếu đã đưa vào passage!",
       "items": [
         { "key": "A", "statement": "mệnh đề A..." },
         { "key": "B", "statement": "mệnh đề B..." },
         { "key": "C", "statement": "mệnh đề C..." },
         { "key": "D", "statement": "mệnh đề D..." }
       ]
     }

ĐỊNH DẠNG ĐẦU RA:
Chỉ trả về DUY NHẤT một khối JSON hợp lệ dạng mảng [...].

VĂN BẢN ĐỀ THI:
${pageText.slice(0, 45000)}`;

    let content = null;
    if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
      const resp = await new Promise(resolve => {
        chrome.runtime.sendMessage({
          action: 'CALL_KEY4U_AI',
          prompt: prompt,
          model: detectModel || 'gpt-5.4-nano',
          apiKey: apiKey || DEFAULT_API_KEY
        }, (res) => resolve(res));
      });
      if (resp && resp.success && resp.data) {
        content = resp.data.explanation || resp.data.rawContent || JSON.stringify(resp.data);
      }
    }

    if (!content) {
      const direct = await directKey4USolve(prompt, detectModel || 'gpt-5.4-nano', apiKey || DEFAULT_API_KEY);
      if (direct && direct.success && direct.data) {
        content = direct.data.explanation || direct.data.rawContent || JSON.stringify(direct.data);
      }
    }

    if (!content) return null;
    const m = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (m) content = m[0];
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return null;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    const resMap = inPageMapAiQuestions(parsed) || {};
    const imageMap = resMap.imageMap || resMap;
    const tableMap = resMap.tableMap || {};

    return parsed.map((item, idx) => {
      const qNum = typeof item.num === 'number' ? item.num : (idx + 1);
      const qId = `qa-detected-ai-${qNum}`;
      const isTF = item.type === 'true_false_group' || (item.items && item.items.length > 0);
      const detectedImage = imageMap[qNum] || item.image || null;

      let rawTitle = (item.title || `Câu hỏi ${qNum}`).trim();
      let passageText = (item.passage || '').trim() || null;

      if (!passageText && tableMap[qNum]) {
        passageText = tableMap[qNum];
      }

      // Nếu rawTitle có chứa [NỘI DUNG CÂU HỎI]: và passageText rỗng, trích xuất passage từ phần trước
      if (rawTitle.includes('[NỘI DUNG CÂU HỎI]:')) {
        const parts = rawTitle.split('[NỘI DUNG CÂU HỎI]:');
        const pPart = parts[0].replace(/^\[(?:ĐỌC HIỂU|TƯ LIỆU|READING PASSAGE)[^\]]*\]\s*:\s*/i, '').trim();
        if (pPart && !passageText) passageText = pPart;
      }

      // Tách group header (ví dụ Question 19 - 22: ...) vào passageText nếu chưa có
      const groupMatch = rawTitle.match(/^((?:question|câu)\s*\d+\s*[\-\–]\s*\d+[\.\:\s\-]+[^\n]*)\n+([\s\S]*)$/i);
      if (groupMatch && !passageText) {
        passageText = groupMatch[1].trim();
      }

      const finalTitle = cleanQuestionTitle(rawTitle, passageText, qNum);

      if (isTF) {
        const tfItems = (item.items || []).map((it, itIdx) => {
          const key = (it.key || String.fromCharCode(65 + itIdx)).toUpperCase();
          return {
            key: key,
            statement: (it.statement || it.text || '').trim()
          };
        });

        return {
          id: qId,
          num: qNum,
          index: idx + 1,
          type: 'true_false_group',
          title: finalTitle,
          passage: item.passage || null,
          image: detectedImage,
          items: tfItems,
          options: [],
          selectedAnswers: {}
        };
      }

      const options = (item.options || [])
        .filter(o => {
          const txt = (o.text || o.statement || o.raw || '').trim();
          return txt.length > 0 && txt !== '_' && txt !== '...' && txt !== '-';
        })
        .map((o, optIdx) => {
          const key = (o.key || String.fromCharCode(65 + optIdx)).toUpperCase();
          const optText = (o.text || o.statement || '').trim();
          return {
            key: key,
            text: optText,
            raw: `${key}. ${optText}`,
            isChecked: false
          };
        });

      return {
        id: qId,
        num: qNum,
        index: idx + 1,
        type: 'single_choice',
        title: finalTitle,
        passage: item.passage || null,
        image: detectedImage,
        options: options,
        selectedAnswer: null
      };
    });
  }

  // Hàm gọi API trực tiếp (khi chạy không qua background hoặc chạy thẳng F12 console)
  async function directKey4USolve(prompt, model, apiKey, imageUrl) {
    const key = apiKey || DEFAULT_API_KEY;
    const m = model || DEFAULT_MODEL;

    function extractJsonFromText(text) {
      if (!text) return null;
      let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonStr = cleaned.slice(firstBrace, lastBrace + 1);
        try { return JSON.parse(jsonStr); } catch (e) {}
      }
      try { return JSON.parse(cleaned); } catch (e) {}
      return null;
    }

    try {
      let messages = [
        { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' }
      ];

      const hasVisionImage = imageUrl && (
        imageUrl.startsWith('http://') || 
        imageUrl.startsWith('https://') || 
        imageUrl.startsWith('data:image/png') || 
        imageUrl.startsWith('data:image/jpeg') || 
        imageUrl.startsWith('data:image/webp')
      );
      if (hasVisionImage) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        });
      } else {
        messages.push({
          role: 'user',
          content: prompt
        });
      }

      let res = await fetch('https://api.key4u.vn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: m,
          messages: messages,
          temperature: 0.1
        })
      });

      if (!res.ok && hasVisionImage) {
        res = await fetch('https://api.key4u.vn/v1/chat/completions', {
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
      }

      if (!res.ok) return { success: false, error: 'HTTP ' + res.status };
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';
      let parsed = extractJsonFromText(content);
      if (!parsed) {
        const match = content.match(/([A-H])[\.\)\:]/i) || content.match(/\b([A-H])\b/i);
        if (match) parsed = { answer: match[1].toUpperCase(), explanation: content };
      }
      if (parsed) {
        return { success: true, data: parsed };
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
      let apiKey = DEFAULT_API_KEY;
      let model = DEFAULT_MODEL;
      let detectModel = 'gpt-5.4-nano';
      if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
        try {
          const stored = await new Promise(r => {
            chrome.storage.local.get(['key4uApiKey', 'key4uModel', 'key4uModelDetect'], (res) => r(res || {}));
          });
          if (stored?.key4uApiKey) apiKey = stored.key4uApiKey;
          if (stored?.key4uModel) model = stored.key4uModel;
          if (stored?.key4uModelDetect) detectModel = stored.key4uModelDetect;
        } catch (e) {}
      }

      console.log(`[AutoSolver Stealth] Đang quét DOM đề thi (siêu tốc 5ms)...`);
      let questions = extractQuestionsAndAnswers();
      if (!questions || questions.length === 0) {
        console.log(`[AutoSolver Stealth] DOM không có câu hỏi, chuyển sang bóc tách bằng AI (${detectModel})...`);
        questions = await extractQuestionsWithAI(apiKey, detectModel);
      }

      if (!questions || questions.length === 0) {
        console.log('[AutoSolver Stealth] Không tìm thấy câu hỏi nào trên trang.');
        isSolvingProcess = false;
        return;
      }

      console.log(`[AutoSolver Stealth] Đang giải ${questions.length} câu với ${model}...`);

      let successCount = 0;
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const imgNote = q.image ? (q.image.startsWith('data:') ? '\n(LƯU Ý: Câu hỏi có hình vẽ / sơ đồ minh họa đi kèm)' : `\n(LƯU Ý: Câu hỏi có hình ảnh minh họa đi kèm: ${q.image})`) : '';
        const passageContext = q.passage ? `\n\nBÀI ĐỌC HIỂU / ĐOẠN TƯ LIỆU / BẢNG SỐ LIỆU:\n${q.passage}\n` : '';

        // 1. Dạng câu hỏi Đúng / Sai 4 ý (Phần II)
        if (q.type === 'true_false_group') {
          if (!q.items || q.items.length === 0) continue;
          const itemsText = q.items.map(it => `${it.key}. ${it.statement}`).join('\n');
          const prompt = `Bạn là chuyên gia giải đề thi trắc nghiệm siêu chính xác.
Dưới đây là câu hỏi dạng ĐÚNG / SAI 4 Ý (Phần II theo form mới Bộ GD&ĐT).
Hãy đọc kỹ đoạn tư liệu/bảng số liệu/đề bài và hình ảnh minh họa (nếu có) để đánh giá từng mệnh đề A, B, C, D là "Đúng" hay "Sai".
${passageContext}
ĐỀ BÀI:
${q.title}${imgNote}

CÁC MỆNH ĐỀ:
${itemsText}

YÊU CẦU:
Trả về kết quả DUY NHẤT dưới dạng JSON hợp lệ:
{
  "answers": {
    "A": "Đúng" hoặc "Sai",
    "B": "Đúng" hoặc "Sai",
    "C": "Đúng hoặc Sai",
    "D": "Đúng hoặc Sai"
  },
  "explanation": "Giải thích ngắn gọn cho từng ý"
}`;

          try {
            let resp = null;
            if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
              resp = await new Promise(resolve => {
                chrome.runtime.sendMessage({
                  action: 'CALL_KEY4U_AI',
                  prompt: prompt,
                  model: model,
                  apiKey: apiKey,
                  imageUrl: q.image || null
                }, (res) => {
                  if (chrome.runtime.lastError) resolve({ success: false });
                  else resolve(res || { success: false });
                });
              });
            }

            if (!resp || !resp.success) {
              resp = await directKey4USolve(prompt, model, apiKey, q.image);
            }

            if (resp && resp.success && resp.data && resp.data.answers) {
              const ans = {};
              Object.entries(resp.data.answers || {}).forEach(([k, v]) => {
                ans[k.toUpperCase().trim()] = v;
              });
              for (const subKey of Object.keys(ans)) {
                const isTrue = /đúng|true/i.test(String(ans[subKey]));
                const targetKey = isTrue ? `${subKey}_TRUE` : `${subKey}_FALSE`;
                autoSelectAnswerOnPage(q.id, targetKey, isTrue ? 'Đúng' : 'Sai');
              }
              successCount++;
              console.log(`[AutoSolver Stealth] Đã giải câu Đúng/Sai ${q.num || i + 1} (${successCount}/${questions.length})`);
            }
          } catch (err) {
            console.warn('[AutoSolver Stealth] Lỗi khi giải câu ' + (q.num || i + 1), err);
          }
          continue;
        }

        // 2. Dạng trắc nghiệm 1 đáp án A, B, C, D thông thường
        if (!q.options || q.options.length === 0) continue;

        const optionsText = q.options.map(o => `${o.key}. ${o.text}`).join('\n');
        const availableKeys = q.options.map(o => o.key).join(', ');
        const prompt = `Bạn là một chuyên gia giải đề trắc nghiệm siêu chính xác.
Hãy đọc kỹ câu hỏi, ngữ cảnh bài đọc/bảng số liệu và hình ảnh minh họa (nếu có), sau đó tìm ra ĐÁP ÁN ĐÚNG NHẤT trong các phương án (${availableKeys}).
${passageContext}
CÂU HỎI:
${q.title}${imgNote}

CÁC LỰA CHỌN:
${optionsText}

YÊU CẦU:
Trả về kết quả DUY NHẤT dưới dạng JSON hợp lệ:
{
  "answer": "Chọn 1 trong các chữ cái: ${availableKeys}",
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
                apiKey: apiKey,
                imageUrl: q.image || null
              }, (res) => {
                if (chrome.runtime.lastError) {
                  resolve({ success: false, error: chrome.runtime.lastError.message });
                } else {
                  resolve(res || { success: false });
                }
              });
            });
          }

          if (!resp || !resp.success) {
            resp = await directKey4USolve(prompt, model, apiKey, q.image);
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

  // ==========================================
  // TỰ ĐỘNG CHUYỂN TRANG KHÔNG RELOAD (GIỮ SCRIPT & ALT+H VĨNH VIỄN)
  // ==========================================
  function attachMoodleAjaxNavigation() {
    if (window._qaAjaxNavigationAttached) return;
    window._qaAjaxNavigationAttached = true;

    // Bắt sự kiện click vào bất kỳ nút điều hướng trang nào của đề thi
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('input[type="submit"], button[type="submit"], .mod_quiz-next-nav, .mod_quiz-prev-nav, a.page-link, .qnbutton, #mod_quiz_navblock a');
      if (!btn) return;

      const form = document.querySelector('form#responseform, form[action*="attempt.php"], form.mform') || document.forms[0];
      if (!form) return;

      // 1. Click vào số câu hỏi trên Bảng câu hỏi (thẻ <a>)
      if (btn.tagName === 'A' && btn.href && !btn.href.startsWith('javascript:')) {
        e.preventDefault();
        e.stopPropagation();
        try {
          const formData = new FormData(form);
          await fetch(form.action || window.location.href, { method: 'POST', body: formData });
          const res = await fetch(btn.href);
          const html = await res.text();
          applyNewPageContent(html, btn.href);
        } catch (err) {
          window.location.href = btn.href;
        }
        return;
      }

      // 2. Click vào nút "Trang tiếp", "Trang trước", "Làm xong"
      const btnText = (btn.value || btn.innerText || btn.textContent || '').toLowerCase();
      const isNavBtn = btn.name === 'next' || btn.name === 'previous' || btn.classList.contains('mod_quiz-next-nav') || btn.classList.contains('mod_quiz-prev-nav') || btnText.includes('trang tiếp') || btnText.includes('trang trước') || btnText.includes('next') || btnText.includes('previous');

      if (isNavBtn) {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(form);
        if (btn.name) {
          formData.append(btn.name, btn.value || '1');
        }

        try {
          const targetUrl = form.action || window.location.href;
          const res = await fetch(targetUrl, {
            method: 'POST',
            body: formData
          });
          const html = await res.text();
          applyNewPageContent(html, res.url || targetUrl);
        } catch (err) {
          form.submit();
        }
      }
    }, true);
  }

  function applyNewPageContent(html, newUrl) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      if (doc.title) document.title = doc.title;
      if (newUrl) {
        try { window.history.pushState(null, '', newUrl); } catch (e) {}
      }

      // Thay thế nội dung form và câu hỏi mới
      const oldMain = document.querySelector('#region-main, [role="main"], #page-content, form#responseform, .que');
      const newMain = doc.querySelector('#region-main, [role="main"], #page-content, form#responseform, .que');
      if (oldMain && newMain) {
        oldMain.innerHTML = newMain.innerHTML;
      }

      // Cập nhật Bảng câu hỏi bên phải
      const oldNav = document.querySelector('#mod_quiz_navblock, .qn_buttons, [data-region="blocks-column"]');
      const newNav = doc.querySelector('#mod_quiz_navblock, .qn_buttons, [data-region="blocks-column"]');
      if (oldNav && newNav) {
        oldNav.innerHTML = newNav.innerHTML;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.warn('[AutoSolver] Lỗi khi nạp trang mới:', e);
      window.location.reload();
    }
  }

  attachMoodleAjaxNavigation();
})();
