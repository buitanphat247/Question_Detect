class MoodleScanner {
  static scan(scanRoot, passageMap = {}) {
    if (!scanRoot) return [];
    const questions = [];

    // Tìm tất cả các thẻ câu hỏi Moodle
    const rootMatches = (typeof scanRoot.matches === 'function' && scanRoot.matches('.que, [class*="que "], div[id^="q"], div[id^="question-"]')) ? [scanRoot] : [];
    const childCards = Array.from(scanRoot.querySelectorAll('.que, [class*="que "], div[id^="q"], div[id^="question-"]'));
    const candidateCards = Array.from(new Set([...rootMatches, ...childCards])).filter(card => {
      if (!card || card.nodeType !== 1) return false;
      // Phải có phần thân câu hỏi hoặc đáp án
      return !!card.querySelector('.qtext, .formulation, .content, .answer, input[type="radio"], input[type="checkbox"]');
    });

    candidateCards.forEach((card, index) => {
      const qNum = MoodleScanner.extractQuestionNumber(card, index + 1);
      const qId = `qa-detected-moodle-${qNum}`;
      card.setAttribute('data-qa-id', qId);

      // 1. Trích xuất nội dung câu hỏi (Stem/Title)
      let qTextEl = card.querySelector('.qtext, .formulation .qtext, .formulation .text, [class*="qtext"], .questiontext');
      let questionText = '';

      if (qTextEl) {
        questionText = TextUtils.extractRichText(qTextEl);
      } else {
        const formulation = card.querySelector('.formulation, .content') || card;
        const clone = formulation.cloneNode(true);
        clone.querySelectorAll('.answer, .absubpart, .prompt, .im-controls, .feedback, .validationerror, .info').forEach(el => el.remove());
        questionText = TextUtils.extractRichText(clone);
      }

      const image = DomMediaExtractor.extractImageFromNode(qTextEl || card.querySelector('.formulation') || card);

      // 2. Trích xuất đáp án
      const options = [];
      const formulation = card.querySelector('.formulation, .content') || card;

      // Tìm tất cả các radio / checkbox hợp lệ
      const allInputs = Array.from(formulation.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
        .filter(inp => {
          if (inp.value === '-1') return false;
          if (inp.closest('.clear-choice, .clearchoice, .clear, .clear-choice-option')) return false;
          const id = (inp.id || '').toLowerCase();
          const name = (inp.name || '').toLowerCase();
          if (id.includes('clearchoice') || name.includes('clearchoice')) return false;

          const label = card.querySelector(`label[for="${inp.id}"]`) || inp.closest('label');
          const labelTxt = (label?.innerText || label?.textContent || '').toLowerCase();
          if (labelTxt.includes('xóa lựa chọn') || labelTxt.includes('clear my choice') || labelTxt.includes('xóa câu trả lời')) return false;
          return true;
        });

      if (allInputs.length >= 2) {
        allInputs.forEach((input, optIdx) => {
          let key = String.fromCharCode(65 + optIdx);
          const row = input.closest('.r0, .r1, .form-check, .custom-control, .d-flex, tr, li, div') || input.parentElement;
          const label = (input.id ? card.querySelector(`label[for="${input.id}"]`) : null) || input.closest('label') || row;

          // Kiểm tra xem có span answernumber (a., b., c., d.) không
          const numSpan = label?.querySelector('.answernumber, .option-letter, .choice-label');
          if (numSpan) {
            const spanTxt = (numSpan.innerText || numSpan.textContent || '').trim();
            const sm = spanTxt.match(/([A-Za-zĐđ0-9])/);
            if (sm) key = sm[1].toUpperCase();
          } else {
            const rawOptText = TextUtils.cleanText(label?.innerText || label?.textContent || row?.innerText || '');
            const m = rawOptText.match(TextUtils.OPTION_PREFIX_REGEX);
            if (m) key = m[1].toUpperCase();
          }

          const rawOptText = TextUtils.cleanText(label?.innerText || label?.textContent || row?.innerText || '');
          const optText = TextUtils.cleanOptionText(rawOptText, key);

          input.setAttribute('data-qa-for', qId);
          input.setAttribute('data-qa-opt', key);
          if (row) {
            row.setAttribute('data-qa-for', qId);
            row.setAttribute('data-qa-opt', key);
          }
          if (label && label !== row) {
            label.setAttribute('data-qa-for', qId);
            label.setAttribute('data-qa-opt', key);
          }

          options.push({
            key: key,
            text: optText,
            input: input,
            label: label,
            element: row
          });
        });
      } else {
        // Fallback: Tìm qua các div hàng đáp án
        const optionRows = Array.from(card.querySelectorAll('.answer > div, .answer > fieldset > div, .answer tr, .answer .r0, .answer .r1, .formulation .answer > div'));
        optionRows.forEach((row, optIdx) => {
          const input = row.querySelector('input[type="radio"], input[type="checkbox"]');
          if (input && (input.value === '-1' || input.id?.includes('clear'))) return;

          let key = String.fromCharCode(65 + optIdx);
          const label = row.querySelector('label') || row;
          const rawOptText = TextUtils.cleanText(label.innerText || label.textContent || '');

          const m = rawOptText.match(TextUtils.OPTION_PREFIX_REGEX);
          if (m) key = m[1].toUpperCase();

          const optText = TextUtils.cleanOptionText(rawOptText, key);

          if (input) {
            input.setAttribute('data-qa-for', qId);
            input.setAttribute('data-qa-opt', key);
          }
          row.setAttribute('data-qa-for', qId);
          row.setAttribute('data-qa-opt', key);

          options.push({
            key: key,
            text: optText,
            input: input,
            label: label,
            element: row
          });
        });
      }

      if (questionText && options.length >= 2) {
        questions.push({
          id: qId,
          num: qNum,
          type: 'single_choice',
          title: questionText,
          options: options,
          passage: passageMap[qNum] || null,
          image: image,
          element: card
        });
      }
    });

    return questions;
  }

  static extractQuestionNumber(card, fallback) {
    if (!card) return fallback;
    const numEl = card.querySelector('.qno, .no, .info .no, .info .header, h3.no, .info h3, [class*="question-number"]');
    if (numEl) {
      const txt = (numEl.innerText || numEl.textContent || '').trim();
      const m = txt.match(/\b(\d+)\b/);
      if (m) return parseInt(m[1], 10);
    }
    // Fallback thử tìm từ id thẻ (ví dụ q8381554:1 -> 1)
    if (card.id) {
      const m = card.id.match(/[:\-_](\d+)$/);
      if (m) return parseInt(m[1], 10);
    }
    return fallback;
  }
}

globalThis.MoodleScanner = MoodleScanner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MoodleScanner };
}
