class QuizCardScanner {
  static scan(scanRoot, passageMap = {}) {
    if (!scanRoot) return [];
    const questions = [];
    const candidateCards = Array.from(scanRoot.querySelectorAll(
      '.yh-question-card, [class*="question-card"], [id^="question-"], .exam-question, .quiz-item, .test-question'
    )).filter(TextUtils.isVisible);

    candidateCards.forEach((card, index) => {
      const qNum = QuizCardScanner.extractQuestionNumber(card, index + 1);
      const qId = `qa-detected-card-${qNum}`;
      card.setAttribute('data-qa-id', qId);

      const isTrueFalse = card.querySelectorAll('.yh-tf4-row').length > 0;

      const stemEl = card.querySelector('.yh-question-stem, .question-text, .stem, .title, .content, h4, h5') || card;
      const questionText = TextUtils.extractRichText(stemEl);
      const image = DomMediaExtractor.extractImageFromNode(card);

      if (isTrueFalse) {
        const tfRows = Array.from(card.querySelectorAll('.yh-tf4-row'));
        const tfItems = [];

        tfRows.forEach((row, rIdx) => {
          let key = String.fromCharCode(65 + rIdx);
          const stem = row.querySelector('.yh-tf4-stem, td:first-child, span');
          if (stem) {
            const m = (stem.innerText || '').match(/^([A-Da-d])[.\:\)]/);
            if (m) key = m[1].toUpperCase();
          }

          const rowText = TextUtils.cleanText(stem?.innerText || '');

          const trueCont = row.querySelector('.yh-tf4-true') || Array.from(row.querySelectorAll('label, div, span')).find(el => /\bđúng\b|\btrue\b/i.test(el.innerText || ''));
          const trueInp = trueCont ? (trueCont.tagName === 'INPUT' ? trueCont : trueCont.querySelector('input')) : row.querySelectorAll('input')[0];
          if (trueInp) {
            trueInp.setAttribute('data-qa-for', qId);
            trueInp.setAttribute('data-qa-opt', `${key}_TRUE`);
          }

          const falseCont = row.querySelector('.yh-tf4-false') || Array.from(row.querySelectorAll('label, div, span')).find(el => /\bsai\b|\bfalse\b/i.test(el.innerText || ''));
          const falseInp = falseCont ? (falseCont.tagName === 'INPUT' ? falseCont : falseCont.querySelector('input')) : row.querySelectorAll('input')[1];
          if (falseInp) {
            falseInp.setAttribute('data-qa-for', qId);
            falseInp.setAttribute('data-qa-opt', `${key}_FALSE`);
          }

          tfItems.push({
            key: key,
            text: rowText,
            trueInput: trueInp,
            falseInput: falseInp
          });
        });

        if (tfItems.length > 0) {
          questions.push({
            id: qId,
            num: qNum,
            type: 'true_false_group',
            title: questionText,
            items: tfItems,
            passage: passageMap[qNum] || null,
            image: image,
            element: card
          });
        }
      } else {
        const options = [];
        const optionRows = Array.from(card.querySelectorAll('.yh-option, .option, .choice, .form-check, .ant-radio-wrapper, .ant-checkbox-wrapper, label'));

        optionRows.forEach((row, optIdx) => {
          const input = row.querySelector('input[type="radio"], input[type="checkbox"]') || (row.tagName === 'INPUT' ? row : null);
          let key = String.fromCharCode(65 + optIdx);
          const rawOptText = TextUtils.cleanText(row.innerText || row.textContent || '');

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
            element: row
          });
        });

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
      }
    });

    return questions;
  }

  static extractQuestionNumber(card, fallback) {
    if (!card) return fallback;
    const numEl = card.querySelector('.yh-question-stem__label, [class*="question-num"], [class*="q-num"], .question-number, h3, h4, h5');
    if (numEl) {
      const txt = (numEl.innerText || numEl.textContent || '').trim();
      const m = txt.match(/(?:question|câu|câu\s*hỏi|quest|q|bài)\s*(\d+)\b/i);
      if (m) return parseInt(m[1], 10);
    }
    return fallback;
  }
}

globalThis.QuizCardScanner = QuizCardScanner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuizCardScanner };
}
