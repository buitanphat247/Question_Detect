class MoodleScanner {
  static scan(scanRoot, passageMap = {}) {
    if (!scanRoot) return [];
    const questions = [];
    const moodleCards = Array.from(scanRoot.querySelectorAll('.que')).filter(TextUtils.isVisible);

    moodleCards.forEach((card, index) => {
      const qNum = MoodleScanner.extractQuestionNumber(card, index + 1);
      const qId = `qa-detected-moodle-${qNum}`;
      card.setAttribute('data-qa-id', qId);

      const qTextEl = card.querySelector('.qtext, .formulation .qtext');
      const questionText = qTextEl ? TextUtils.extractRichText(qTextEl) : '';
      const image = DomMediaExtractor.extractImageFromNode(qTextEl || card);

      const options = [];
      const optionRows = Array.from(card.querySelectorAll('.answer > div, .answer > tr, .answer .r0, .answer .r1, .formulation .answer > div'));

      optionRows.forEach((row, optIdx) => {
        const input = row.querySelector('input[type="radio"], input[type="checkbox"]');
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
    });

    return questions;
  }

  static extractQuestionNumber(card, fallback) {
    if (!card) return fallback;
    const numEl = card.querySelector('.qno, .no, .info .no, .info .header, h3.no');
    if (numEl) {
      const txt = (numEl.innerText || numEl.textContent || '').trim();
      const m = txt.match(/\b(\d+)\b/);
      if (m) return parseInt(m[1], 10);
    }
    return fallback;
  }
}

globalThis.MoodleScanner = MoodleScanner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MoodleScanner };
}
