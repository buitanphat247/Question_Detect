/**
 * Q&A Detector & AI Auto Solver - Popup Controller
 * Tích hợp Key4U API (Model gpt-5.5) để tự động giải bài và click chọn đáp án trên web.
 */

// Hàm chạy trong context trang web
function inPageExtractQA() {
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

  // Tầng 1: Quiz Containers (Moodle, Canvas, Subtt, Azota, Yourhomework...)
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
        const allMedia = Array.from(document.querySelectorAll('img, svg, canvas, .yh-player-media, .yh-player-media--section, [class*="player-media"], [class*="section-media"]'));
        const preceding = allMedia.filter(el => !box.contains(el) && (el.compareDocumentPosition(box) & Node.DOCUMENT_POSITION_FOLLOWING));
        for (let i = preceding.length - 1; i >= 0; i--) {
          const el = preceding[i];
          const otherBox = el.closest(containerSelectors.join(', '));
          if (otherBox && otherBox !== box) continue;
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

  // Tầng 2: Heuristic tổng quát (Trang layout phẳng, không dùng class container)
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

      // 2. Tiêu đề câu hỏi mới
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

      // 3. Thẻ INPUT radio/checkbox
      if (node.tagName === 'INPUT' && (node.type === 'radio' || node.type === 'checkbox')) {
        currentQ.inputs.push(node);
        continue;
      }

      // 4. Text có tiền tố A, B, C, D
      const optMatch = rawText.match(OPTION_PREFIX_REGEX);
      if (optMatch && !isSpamText(rawText)) {
        currentQ.optionNodes.push({ node, key: optMatch[1].toUpperCase(), rawText });
        continue;
      }

      // 5. Text thân bài câu hỏi
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

  const passageMap = extractReadingPassages();
  const lms = extractQuizContainers(passageMap);
  if (lms && lms.length > 0) return lms;
  return extractGenericDOMQuestions(passageMap);
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

    // Ưu tiên click LABEL hoặc INPUT với đầy đủ mousedown, mouseup, click
    const clickTarget = label || input || wrapperEl;
    if (clickTarget) {
      try {
        clickTarget.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        clickTarget.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
        clickTarget.click();
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
        const rowText = (row.innerText || row.textContent || '').trim();
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

// Bóc tách nội dung văn bản thuần của đề thi để gửi cho AI phân tích
function inPageExtractCleanText() {
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

  // 3. Đánh dấu ảnh bằng marker văn bản để AI nhận biết có hình ảnh/sơ đồ (đặc biệt là section media/notice)
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

  return (mainArea.innerText || mainArea.textContent || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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

      // Xử lý blob URL trong context trang web
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
      const allMediaElements = Array.from(document.querySelectorAll(
        'img, svg, canvas, .yh-player-media, .yh-player-media--section, [class*="player-media"], [class*="section-media"], [class*="image-wrap"]'
      ));

      // Lọc các phần tử media nằm TRƯỚC targetNode trong DOM
      const precedingMedia = allMediaElements.filter(el => {
        if (targetNode.contains(el)) return false;
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

    // Ưu tiên 1: Tìm chính xác question card theo nhãn số câu hỏi
    let qCard = null;
    const questionCards = Array.from(document.querySelectorAll('.yh-question-card, .que, [class*="question-card"], [id^="q-"]'));
    for (const card of questionCards) {
      const stem = card.querySelector('.yh-question-stem__label, .yh-question-stem, .qtext, [class*="stem"], h1, h2, h3, h4, h5, b, strong') || card;
      const stemTxt = (stem.innerText || stem.textContent || '').trim();
      const m = stemTxt.match(/(?:question|câu|quest|q|bài)\s*(\d+)\b/i);
      if (m && parseInt(m[1], 10) === qNum) {
        qCard = card;
        break;
      }
    }

    const allHeaders = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, div, p, span, b, strong')).filter(el => {
      const txt = (el.innerText || el.textContent || '').trim();
      if (txt.length > 300) return false;
      const m = txt.match(/(?:question|câu|quest|q|bài)\s*(\d+)\b/i);
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
        const inputs = Array.from(qCard.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
        if (inputs.length >= 2) {
          inputs.forEach((inp, idx) => {
            const key = String.fromCharCode(65 + idx);
            inp.setAttribute('data-qa-for', qId);
            inp.setAttribute('data-qa-opt', key);
            const wrapper = inp.closest('label, .ant-radio-wrapper, .form-check') || inp.parentElement;
            if (wrapper) {
              wrapper.setAttribute('data-qa-for', qId);
              wrapper.setAttribute('data-qa-opt', key);
            }
          });
        } else {
          const rows = Array.from(qCard.querySelectorAll('label, .ant-radio-wrapper, [class*="option"], .answer > div, li'));
          rows.forEach((row, idx) => {
            const key = String.fromCharCode(65 + idx);
            row.setAttribute('data-qa-for', qId);
            row.setAttribute('data-qa-opt', key);
          });
        }
      }
    }
  });

  return { imageMap, tableMap };
}

// Logic giao diện Popup
document.addEventListener('DOMContentLoaded', async () => {
  const btnScan = document.getElementById('btnScan');
  const btnScanAI = document.getElementById('btnScanAI');
  const btnSolveAll = document.getElementById('btnSolveAll');
  const btnToggleSettings = document.getElementById('btnToggleSettings');
  const settingsPanel = document.getElementById('settingsPanel');
  const txtApiKey = document.getElementById('txtApiKey');
  const txtModel = document.getElementById('txtModel');
  const txtModelDetect = document.getElementById('txtModelDetect');
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
  const DEFAULT_MODEL = 'gpt-5.4-nano';
  const DEFAULT_DETECT_MODEL = 'gpt-5.4-nano';

  let allQuestions = [];
  let activeTabId = null;

  // Tải cài đặt đã lưu (hoặc dùng mặc định đã cài sẵn)
  chrome.storage.local.get(['key4uApiKey', 'key4uModel', 'key4uModelDetect', 'autoSelectWeb'], (res) => {
    txtApiKey.value = res.key4uApiKey || DEFAULT_API_KEY;
    txtModel.value = res.key4uModel || DEFAULT_MODEL;
    txtModelDetect.value = res.key4uModelDetect || DEFAULT_DETECT_MODEL;
    if (typeof res.autoSelectWeb !== 'undefined') {
      chkAutoSelectWeb.checked = res.autoSelectWeb;
    } else {
      chkAutoSelectWeb.checked = true;
    }

    if (!res.key4uApiKey) {
      chrome.storage.local.set({
        key4uApiKey: DEFAULT_API_KEY,
        key4uModel: DEFAULT_MODEL,
        key4uModelDetect: DEFAULT_DETECT_MODEL,
        autoSelectWeb: true
      });
    }
  });

  // Lưu cài đặt
  btnSaveKey.addEventListener('click', () => {
    const apiKey = txtApiKey.value.trim() || DEFAULT_API_KEY;
    const model = txtModel.value.trim() || DEFAULT_MODEL;
    const detectModel = txtModelDetect.value.trim() || DEFAULT_DETECT_MODEL;
    const autoSelect = chkAutoSelectWeb.checked;

    chrome.storage.local.set({
      key4uApiKey: apiKey,
      key4uModel: model,
      key4uModelDetect: detectModel,
      autoSelectWeb: autoSelect
    }, () => {
      showToast('Đã lưu cấu hình Key4U!');
    });
  });

  btnToggleSettings.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  function setScanningState(isScanning) {
    if (!btnScan) return;
    const icon = btnScan.querySelector('.icon-spin-target');
    const text = btnScan.querySelector('span');
    if (isScanning) {
      if (icon) icon.classList.add('spin');
      if (text) text.textContent = 'Đang quét...';
      btnScan.disabled = true;
    } else {
      if (icon) icon.classList.remove('spin');
      if (text) text.textContent = 'Quét DOM';
      btnScan.disabled = false;
    }
  }

  function setAIScanningState(isScanning) {
    if (!btnScanAI) return;
    const icon = btnScanAI.querySelector('.icon-ai-spin');
    const text = btnScanAI.querySelector('span');
    if (isScanning) {
      if (icon) icon.classList.add('spin');
      if (text) text.textContent = 'AI phân tích...';
      btnScanAI.disabled = true;
      if (btnScan) btnScan.disabled = true;
      if (btnSolveAll) btnSolveAll.disabled = true;
    } else {
      if (icon) icon.classList.remove('spin');
      if (text) text.textContent = '🧠 Quét AI';
      btnScanAI.disabled = false;
      if (btnScan) btnScan.disabled = false;
      if (btnSolveAll) btnSolveAll.disabled = false;
    }
  }

  // Quét DOM nội bộ
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
        showToast('Không tìm thấy câu hỏi nào trên trang! Hãy thử Quét bằng AI.', true);
      }
    } catch (err) {
      setScanningState(false);
      showToast('Lỗi khi quét: ' + err.message, true);
    }
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

  // Quét bằng AI (gpt-5.4-nano) - Bóc tách bài đọc hiểu và cấu trúc đề 100% chuẩn
  async function performAIScan() {
    const apiKey = txtApiKey.value.trim() || DEFAULT_API_KEY;
    const detectModel = txtModelDetect.value.trim() || DEFAULT_DETECT_MODEL;

    if (!apiKey) {
      settingsPanel.classList.remove('hidden');
      txtApiKey.focus();
      return showToast('Vui lòng nhập Key4U API Key trước!', true);
    }

    setAIScanningState(true);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) {
        showToast('Không tìm thấy tab hiện tại!', true);
        setAIScanningState(false);
        return;
      }
      activeTabId = tab.id;

      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
        showToast('Không thể quét trên trang cấu hình trình duyệt!', true);
        setAIScanningState(false);
        return;
      }

      showToast(`Đang trích xuất văn bản trang...`);

      const execResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: inPageExtractCleanText
      });

      const pageText = (execResults && execResults[0] && execResults[0].result) ? execResults[0].result : '';
      if (!pageText || pageText.length < 50) {
        setAIScanningState(false);
        return showToast('Không tìm thấy văn bản đề thi trên trang!', true);
      }

      showToast(`AI (${detectModel}) đang phân tích cấu trúc đề thi...`);

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

      const res = await fetch('https://api.key4u.vn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: detectModel,
          messages: [
            { role: 'system', content: 'You are an expert exam structure parser. Always reply with only a valid JSON array.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Key4U API lỗi (${res.status}): ${errText.slice(0, 120)}`);
      }

      const data = await res.json();
      let rawJson = data.choices[0]?.message?.content?.trim() || '[]';
      const m = rawJson.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (m) rawJson = m[0];

      const parsedQuestions = JSON.parse(rawJson);
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error('AI không tìm thấy cấu trúc câu hỏi nào trong văn bản!');
      }

      // Liên kết các câu hỏi AI bóc tách vào DOM trên trang web và trích xuất hình ảnh tương ứng
      let imageMap = {};
      let tableMap = {};
      try {
        const mapResults = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: inPageMapAiQuestions,
          args: [parsedQuestions]
        });
        if (mapResults && mapResults[0] && mapResults[0].result) {
          const res = mapResults[0].result;
          imageMap = res.imageMap || res || {};
          tableMap = res.tableMap || {};
        }
      } catch (e) {
        console.warn('Map DOM failed:', e);
      }

      // Chuẩn hóa thành allQuestions để render
      allQuestions = parsedQuestions.map((item, idx) => {
        const qNum = typeof item.num === 'number' ? item.num : (idx + 1);
        const qId = `qa-detected-ai-${qNum}`;
        const isTF = item.type === 'true_false_group' || (item.items && item.items.length > 0);
        const detectedImage = imageMap[qNum] || item.image || null;

        let rawTitle = (item.title || `Câu hỏi ${qNum}`).trim();
        let passageText = (item.passage || '').trim() || null;

        // Nếu chưa có passage nhưng tìm thấy bảng dữ liệu tableMap
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
            passage: passageText,
            image: detectedImage,
            items: tfItems,
            options: [],
            selectedAnswers: {},
            aiSolution: null
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
          passage: passageText,
          image: detectedImage,
          options: options,
          selectedAnswer: null,
          aiSolution: null
        };
      });

      setAIScanningState(false);
      renderQuestions(allQuestions);
      showToast(`🧠 AI (${detectModel}) đã bóc tách chuẩn xác ${allQuestions.length} câu hỏi!`);
    } catch (err) {
      setAIScanningState(false);
      showToast('Lỗi khi quét AI: ' + err.message, true);
    }
  }

  if (btnScan) btnScan.addEventListener('click', performScan);
  if (btnScanAI) btnScanAI.addEventListener('click', performAIScan);

  // Gọi Key4U API giải 1 câu hỏi
  async function solveQuestionWithAI(q) {
    const apiKey = txtApiKey.value.trim() || DEFAULT_API_KEY;
    const model = txtModel.value.trim() || DEFAULT_MODEL;

    const imgNote = q.image ? (q.image.startsWith('data:') ? '\n(LƯU Ý: Câu hỏi có hình vẽ / sơ đồ minh họa đi kèm)' : `\n(LƯU Ý: Câu hỏi có hình ảnh minh họa đi kèm: ${q.image})`) : '';
    const passageContext = q.passage ? `\n\nBÀI ĐỌC HIỂU / ĐOẠN TƯ LIỆU / BẢNG SỐ LIỆU:\n${q.passage}\n` : '';
    const hasVisionImage = q.image && (q.image.startsWith('http://') || q.image.startsWith('https://') || q.image.startsWith('data:image/'));

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

    // 1. Dạng câu hỏi Đúng / Sai (Phần II)
    if (q.type === 'true_false_group') {
      const itemsText = (q.items || []).map(it => `${it.key}. ${it.statement}`).join('\n');
      const prompt = `Bạn là chuyên gia giải đề thi trắc nghiệm siêu chính xác.
Dưới đây là câu hỏi dạng ĐÚNG / SAI (Phần II theo cấu trúc đề thi mới).
Hãy đọc kỹ đề bài, đoạn tư liệu/bảng số liệu và hình ảnh minh họa (nếu có) để xác định từng ý/mệnh đề A, B, C, D là "Đúng" hay "Sai".
${passageContext}
ĐỀ BÀI:
${q.title}${imgNote}

CÁC MỆNH ĐỀ CẦN XÁC ĐỊNH:
${itemsText}

YÊU CẦU BẮT BUỘC:
Trả về DUY NHẤT một khối JSON hợp lệ theo định dạng:
{
  "answers": {
    "A": "Đúng hoặc Sai",
    "B": "Đúng hoặc Sai",
    "C": "Đúng hoặc Sai",
    "D": "Đúng hoặc Sai"
  },
  "explanation": "Giải thích ngắn gọn cho từng ý"
}`;

      let messages = [
        { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' }
      ];

      if (hasVisionImage) {
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: q.image } }
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
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.1
        })
      });

      // Fallback tự động nếu gửi ảnh qua vision gặp lỗi (ví dụ model không hỗ trợ vision)
      if (!res.ok && hasVisionImage) {
        res = await fetch('https://api.key4u.vn/v1/chat/completions', {
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
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Key4U API lỗi (${res.status}): ${errBody.slice(0, 150)}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '';

      let parsed = extractJsonFromText(content);

      if (!parsed || !parsed.answers) {
        const fallbackAnswers = {};
        const lines = content.split('\n');
        for (const line of lines) {
          const m = line.match(/(?:mệnh\s*đề\s*|ý\s*)?([A-Da-d])[\.\:\)\s\-]+.*?(đúng|sai|true|false)\b/i);
          if (m) {
            const k = m[1].toUpperCase();
            const val = /đúng|true/i.test(m[2]) ? 'Đúng' : 'Sai';
            fallbackAnswers[k] = val;
          }
        }
        if (Object.keys(fallbackAnswers).length > 0) {
          parsed = { answers: fallbackAnswers, explanation: content };
        }
      }

      if (!parsed || !parsed.answers) {
        throw new Error('AI không trả về đáp án Đúng/Sai hợp lệ.');
      }

      const normalizedAnswers = {};
      for (const [k, v] of Object.entries(parsed.answers || {})) {
        normalizedAnswers[k.toUpperCase().trim()] = /đúng|true/i.test(String(v)) ? 'Đúng' : 'Sai';
      }
      parsed.answers = normalizedAnswers;
      return parsed;
    }

    // 2. Dạng trắc nghiệm 1 đáp án thông thường
    const optionsText = (q.options || []).map(o => `${o.key}. ${o.text}`).join('\n');
    const availableKeys = (q.options || []).map(o => o.key).join(', ');
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

    let messages = [
      { role: 'system', content: 'You are an expert exam solver. Always respond in valid JSON format.' }
    ];

    if (hasVisionImage) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: q.image } }
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
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.1
      })
    });

    if (!res.ok && hasVisionImage) {
      res = await fetch('https://api.key4u.vn/v1/chat/completions', {
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
    }

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Key4U API lỗi (${res.status}): ${errBody.slice(0, 150)}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '';

    let parsed = extractJsonFromText(content);
    const validKeys = (q.options || []).map(o => o.key.toUpperCase());
    let answerKey = '';
    if (parsed && parsed.answer) {
      answerKey = String(parsed.answer).toUpperCase().trim();
    }
    if (!validKeys.includes(answerKey)) {
      const match = content.match(new RegExp(`\\b([${validKeys.join('')}])\\b`, 'i')) || content.match(/([A-H])[\.\)\:]/i);
      if (match) {
        answerKey = match[1].toUpperCase();
      }
    }
    if (!answerKey && validKeys.length > 0) {
      answerKey = validKeys[0];
    }

    return {
      answer: answerKey,
      explanation: parsed?.explanation || content
    };
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
      if (allQuestions.length === 0) {
        await performAIScan();
      }
      if (allQuestions.length === 0) return;
    }

    const apiKey = txtApiKey.value.trim();
    if (!apiKey) {
      settingsPanel.classList.remove('hidden');
      txtApiKey.focus();
      return showToast('Vui lòng nhập Key4U API Key trước!', true);
    }

    const modelName = txtModel.value.trim() || DEFAULT_MODEL;

    btnSolveAll.disabled = true;
    btnSolveAll.innerHTML = `
      <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      <span>Đang giải AI...</span>
    `;

    let successCount = 0;
    showToast(`Bắt đầu giải ${allQuestions.length} câu với ${modelName}...`);

    for (let i = 0; i < allQuestions.length; i++) {
      const q = allQuestions[i];
      const card = document.querySelector(`[data-id="${q.id}"]`);

      try {
        if (card) {
          card.style.borderColor = '#ec4899';
        }

        const aiResult = await solveQuestionWithAI(q);
        q.aiSolution = aiResult;
        let isWebSelected = false;

        if (q.type === 'true_false_group') {
          q.selectedAnswers = aiResult.answers || {};
          if (chkAutoSelectWeb.checked) {
            let allSubOk = true;
            for (const subKey of Object.keys(aiResult.answers || {})) {
              const val = aiResult.answers[subKey];
              const isTrue = /đúng|true/i.test(val);
              const targetKey = isTrue ? `${subKey}_TRUE` : `${subKey}_FALSE`;
              const ok = await triggerWebSelect(q.id, targetKey, isTrue ? 'Đúng' : 'Sai');
              if (!ok) allSubOk = false;
            }
            isWebSelected = allSubOk;
          }
        } else {
          q.selectedAnswer = aiResult.answer;
          if (chkAutoSelectWeb.checked) {
            const matchedOpt = (q.options || []).find(o => o.key === aiResult.answer);
            const optText = matchedOpt ? matchedOpt.text : '';
            isWebSelected = await triggerWebSelect(q.id, aiResult.answer, optText);
          }
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

    if (q.type === 'true_false_group') {
      const ans = {};
      Object.entries(aiResult.answers || {}).forEach(([k, v]) => {
        ans[k.toUpperCase().trim()] = v;
      });
      card.querySelectorAll('.tf-statement-row').forEach(row => {
        const k = (row.dataset.key || '').toUpperCase().trim();
        const val = (ans[k] || '').toLowerCase().trim();
        const isTrue = val.includes('đúng') || val.includes('true');
        const btnTrue = row.querySelector('.btn-tf-true');
        const btnFalse = row.querySelector('.btn-tf-false');
        if (btnTrue && btnFalse) {
          if (isTrue) {
            btnTrue.classList.add('active');
            btnFalse.classList.remove('active');
          } else {
            btnFalse.classList.add('active');
            btnTrue.classList.remove('active');
          }
        }
      });

      let solutionBox = card.querySelector('.ai-solution-box');
      if (!solutionBox) {
        solutionBox = document.createElement('div');
        solutionBox.className = 'ai-solution-box';
        card.appendChild(solutionBox);
      }

      const summary = Object.entries(ans).map(([k, v]) => `${k}: <b>${v}</b>`).join(' | ');
      const badgeStatus = isWebSelected 
        ? `<span style="font-size:11px; color:#10b981; font-weight:600;">✓ Đã chọn 4 ý trên web</span>`
        : `<span style="font-size:11px; color:#f59e0b;">(Đã giải AI)</span>`;

      solutionBox.innerHTML = `
        <div class="ai-solution-header">
          <span>🤖 AI (GPT-5.5) chọn: <span class="ai-badge-choice" style="font-size: 11px;">${summary}</span></span>
          ${badgeStatus}
        </div>
        <div class="ai-explanation">${aiResult.explanation || ''}</div>
      `;
      return;
    }

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
      const inTitle = (q.title || '').toLowerCase().includes(keyword);
      const inOptions = (q.options || []).some(opt => (opt.text || '').toLowerCase().includes(keyword) || (opt.raw || '').toLowerCase().includes(keyword));
      const inItems = (q.items || []).some(it => (it.statement || '').toLowerCase().includes(keyword));
      return inTitle || inOptions || inItems;
    });
    renderQuestions(filtered, true);
  });


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

      const isTF = q.type === 'true_false_group';
      const tag = document.createElement('span');
      tag.className = 'q-index-tag' + (isTF ? ' q-tag-tf' : '');
      tag.textContent = isTF ? `Câu ${q.num || q.index} (Đúng/Sai)` : `Câu ${q.num || q.index || (idx + 1)}`;

      const title = document.createElement('div');
      title.className = 'q-text';
      if (q.title) {
        q.title = cleanQuestionTitle(q.title, q.passage, q.num || q.index || (idx + 1));
      }
      const displayTitle = q.title;

      title.textContent = displayTitle;
      title.style.whiteSpace = 'pre-wrap';
      title.style.fontSize = '13px';
      title.style.lineHeight = '1.45';
      title.style.fontWeight = '500';

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
          let isWebSelected = false;

          if (q.type === 'true_false_group') {
            q.selectedAnswers = aiResult.answers || {};
            if (chkAutoSelectWeb.checked) {
              let allSubOk = true;
              for (const subKey of Object.keys(aiResult.answers || {})) {
                const val = aiResult.answers[subKey];
                const isTrue = /đúng|true/i.test(val);
                const targetKey = isTrue ? `${subKey}_TRUE` : `${subKey}_FALSE`;
                const ok = await triggerWebSelect(q.id, targetKey, isTrue ? 'Đúng' : 'Sai');
                if (!ok) allSubOk = false;
              }
              isWebSelected = allSubOk;
            }
            renderAiSolutionInCard(card, aiResult, q, isWebSelected);
            showToast(`Câu ${q.num || q.index}: Đã giải các ý Đúng/Sai!`);
          } else {
            q.selectedAnswer = aiResult.answer;
            const matchedOpt = (q.options || []).find(o => o.key === aiResult.answer);
            const optText = matchedOpt ? matchedOpt.text : '';
            if (chkAutoSelectWeb.checked) {
              isWebSelected = await triggerWebSelect(q.id, aiResult.answer, optText);
            }
            renderAiSolutionInCard(card, aiResult, q, isWebSelected);
            if (isWebSelected) {
              showToast(`Câu ${q.num || q.index}: AI đã chọn ${aiResult.answer} trên trang web!`);
            } else {
              showToast(`Câu ${q.num || q.index}: AI chọn ${aiResult.answer}`);
            }
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

      if (q.passage) {
        const passageBox = document.createElement('div');
        passageBox.className = 'q-passage-box';
        passageBox.style.background = 'rgba(255, 255, 255, 0.05)';
        passageBox.style.border = '1px dashed var(--border-color, #cbd5e1)';
        passageBox.style.borderRadius = '6px';
        passageBox.style.padding = '8px 10px';
        passageBox.style.margin = '6px 0';
        passageBox.style.fontSize = '12px';
        passageBox.style.lineHeight = '1.45';
        passageBox.style.whiteSpace = 'pre-wrap';
        passageBox.style.maxHeight = '180px';
        passageBox.style.overflowY = 'auto';
        passageBox.innerHTML = `<strong>📖 Đoạn tư liệu / Bảng thông tin:</strong><br>${q.passage}`;
        card.appendChild(passageBox);
      }

      if (q.image) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'q-image-container';
        const img = document.createElement('img');
        img.src = q.image;
        img.className = 'q-image-preview';
        img.title = 'Nhấp để phóng to ảnh';
        img.addEventListener('click', () => {
          if (q.image.startsWith('data:')) {
            const w = window.open('');
            if (w) {
              w.document.write(`<title>Ảnh Câu ${q.num || ''}</title><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${q.image}" style="max-width:95vw;max-height:95vh;object-fit:contain;box-shadow:0 0 25px rgba(0,0,0,0.8);border-radius:8px;background:#fff;padding:8px;"></body>`);
            }
          } else {
            window.open(q.image, '_blank');
          }
        });
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
      }

      if (isTF && q.items && q.items.length > 0) {
        const tfContainer = document.createElement('div');
        tfContainer.className = 'tf-statements-list';

        q.items.forEach(it => {
          const row = document.createElement('div');
          row.className = 'tf-statement-row';
          row.dataset.key = it.key;

          const stem = document.createElement('div');
          stem.className = 'tf-stem';
          stem.innerHTML = `<span class="opt-badge">${it.key}</span> <span class="tf-text">${it.statement}</span>`;

          const btnGroup = document.createElement('div');
          btnGroup.className = 'tf-btn-group';

          const currVal = q.selectedAnswers ? q.selectedAnswers[it.key] : null;

          const btnTrue = document.createElement('button');
          btnTrue.type = 'button';
          btnTrue.className = 'btn-tf btn-tf-true' + (currVal === 'Đúng' ? ' active' : '');
          btnTrue.textContent = 'Đúng';
          btnTrue.addEventListener('click', async () => {
            const isOk = await triggerWebSelect(q.id, `${it.key}_TRUE`, 'Đúng');
            if (!q.selectedAnswers) q.selectedAnswers = {};
            q.selectedAnswers[it.key] = 'Đúng';
            btnTrue.classList.add('active');
            btnFalse.classList.remove('active');
            showToast(`Câu ${q.num || q.index} - Ý ${it.key}: Đã chọn Đúng!`);
          });

          const btnFalse = document.createElement('button');
          btnFalse.type = 'button';
          btnFalse.className = 'btn-tf btn-tf-false' + (currVal === 'Sai' ? ' active' : '');
          btnFalse.textContent = 'Sai';
          btnFalse.addEventListener('click', async () => {
            const isOk = await triggerWebSelect(q.id, `${it.key}_FALSE`, 'Sai');
            if (!q.selectedAnswers) q.selectedAnswers = {};
            q.selectedAnswers[it.key] = 'Sai';
            btnFalse.classList.add('active');
            btnTrue.classList.remove('active');
            showToast(`Câu ${q.num || q.index} - Ý ${it.key}: Đã chọn Sai!`);
          });

          btnGroup.appendChild(btnTrue);
          btnGroup.appendChild(btnFalse);

          row.appendChild(stem);
          row.appendChild(btnGroup);
          tfContainer.appendChild(row);
        });

        card.appendChild(tfContainer);
      } else if (q.options && q.options.length > 0) {
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
    let result = '';
    if (q.passage) {
      result += `[Đoạn tư liệu / Bài đọc]:\n${q.passage}\n\n`;
    }
    result += `${q.title}\n`;
    if (q.image) result += `[Hình ảnh: ${q.image}]\n`;
    if (q.type === 'true_false_group' && q.items && q.items.length > 0) {
      q.items.forEach(it => {
        const ans = q.selectedAnswers?.[it.key] ? ` => ${q.selectedAnswers[it.key]}` : '';
        result += `  ${it.key}. ${it.statement}${ans}\n`;
      });
    } else if (q.options && q.options.length > 0) {
      q.options.forEach(opt => {
        result += `  ${opt.key ? opt.key + '.' : '•'} ${opt.text}${opt.isChecked ? ' (Đã chọn)' : ''}\n`;
      });
    }
    if (q.aiSolution) {
      if (q.type === 'true_false_group' && q.aiSolution.answers) {
        const s = Object.entries(q.aiSolution.answers).map(([k, v]) => `${k}: ${v}`).join(' | ');
        result += `=> AI Đáp án: ${s} (${q.aiSolution.explanation || ''})\n`;
      } else if (q.aiSolution.answer) {
        result += `=> AI Đáp án: ${q.aiSolution.answer} (${q.aiSolution.explanation})\n`;
      }
    }
    return result;
  }

  function formatMarkdown(list) {
    return list.map((q, i) => {
      let md = `### Câu ${q.num || q.index || (i + 1)}: ${q.title}\n`;
      if (q.passage) md += `> **Đoạn tư liệu / Bài đọc:**\n> ${q.passage.replace(/\n/g, '\n> ')}\n\n`;
      if (q.image) md += `![](${q.image})\n\n`;
      if (q.type === 'true_false_group' && q.items && q.items.length > 0) {
        q.items.forEach(it => {
          const ans = q.selectedAnswers?.[it.key] ? ` **[${q.selectedAnswers[it.key]}]**` : '';
          md += `- **${it.key}.** ${it.statement}${ans}\n`;
        });
      } else if (q.options && q.options.length > 0) {
        q.options.forEach(opt => {
          const check = (q.selectedAnswer === opt.key || opt.isChecked) ? ' ✅' : '';
          md += `- **${opt.key || '•'}.** ${opt.text}${check}\n`;
        });
      }
      if (q.aiSolution) {
        if (q.type === 'true_false_group' && q.aiSolution.answers) {
          const s = Object.entries(q.aiSolution.answers).map(([k, v]) => `${k}: ${v}`).join(' | ');
          md += `\n> **AI Đáp án:** **${s}** - ${q.aiSolution.explanation || ''}\n`;
        } else if (q.aiSolution.answer) {
          md += `\n> **AI Đáp án:** **${q.aiSolution.answer}** - ${q.aiSolution.explanation}\n`;
        }
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

  // Tự động quét DOM siêu tốc khi mở popup (kết quả tức thì trong ~50ms)
  setTimeout(() => {
    performScan();
  }, 100);
});
