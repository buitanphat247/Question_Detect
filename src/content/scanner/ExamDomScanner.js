class ExamDomScanner {
  static getMainScanRoot(root = (typeof document !== 'undefined' ? document : null)) {
    if (!root) return null;
    const candidateSelectors = [
      'form#responseform',
      '#region-main',
      'section#region-main',
      '#region-main-box',
      '#page-content',
      'main',
      '#main',
      '[role="main"]',
      '.quiz-content',
      '.exam-content',
      '.paper-container',
      '.ant-layout-content'
    ];

    for (const sel of candidateSelectors) {
      try {
        if (typeof root.matches === 'function' && root.matches(sel)) {
          return root;
        }
        const el = root.querySelector(sel);
        if (el && el.querySelector('.que, .yh-question-card, [class*="question"], [id^="q-"], [id^="question-"], input[type="radio"], input[type="checkbox"]')) {
          return el;
        }
      } catch (e) {}
    }

    return root.body || (root.documentElement || root);
  }

  static scanAll(root = null) {
    const doc = (typeof document !== 'undefined' ? document : null);
    const docRoot = doc?.body || doc;
    const scanRoot = ExamDomScanner.getMainScanRoot(root || doc);
    if (!scanRoot) return [];

    const passageMap = DomMediaExtractor.extractReadingPassages(scanRoot);

    // 1. Quét theo Moodle (.que)
    let questions = MoodleScanner.scan(scanRoot, passageMap);
    let valid = ExamDomScanner.filterValidQuestions(questions);
    if (valid.length > 0) return valid;

    // 2. Quét theo QuizCard (.yh-question-card, .exam-question, ...)
    questions = QuizCardScanner.scan(scanRoot, passageMap);
    valid = ExamDomScanner.filterValidQuestions(questions);
    if (valid.length > 0) return valid;

    // 3. Quét theo Anchor Grouping & LCA
    questions = AnchorBasedScanner.scan(scanRoot, passageMap);
    valid = ExamDomScanner.filterValidQuestions(questions);
    if (valid.length > 0) return valid;

    // 4. Quét theo Generic DOM Header
    questions = GenericDomScanner.scan(scanRoot, passageMap);
    valid = ExamDomScanner.filterValidQuestions(questions);
    if (valid.length > 0) return valid;

    // Fallback toàn trang nếu scanRoot bị thu hẹp
    if (docRoot && scanRoot !== docRoot) {
      questions = MoodleScanner.scan(docRoot, passageMap);
      valid = ExamDomScanner.filterValidQuestions(questions);
      if (valid.length > 0) return valid;

      questions = QuizCardScanner.scan(docRoot, passageMap);
      valid = ExamDomScanner.filterValidQuestions(questions);
      if (valid.length > 0) return valid;

      questions = AnchorBasedScanner.scan(docRoot, passageMap);
      valid = ExamDomScanner.filterValidQuestions(questions);
      if (valid.length > 0) return valid;

      questions = GenericDomScanner.scan(docRoot, passageMap);
      valid = ExamDomScanner.filterValidQuestions(questions);
      if (valid.length > 0) return valid;
    }

    // 5. Ultimate Fallback: Trực tiếp tìm mọi nhóm radio/checkbox trên DOM
    questions = ExamDomScanner.scanDirectInputGroups(doc || scanRoot, passageMap);
    valid = ExamDomScanner.filterValidQuestions(questions);
    if (valid.length > 0) return valid;

    return [];
  }

  static scanDirectInputGroups(scanRoot, passageMap = {}) {
    if (!scanRoot) return [];
    const allRadios = Array.from(scanRoot.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
      .filter(inp => inp.value !== '-1' && !inp.closest('.clear-choice, .clearchoice, .clear'));

    if (allRadios.length < 2) return [];

    // Gom nhóm theo name attribute
    const nameMap = new Map();
    allRadios.forEach(inp => {
      const name = inp.name || '__anon__';
      if (!nameMap.has(name)) nameMap.set(name, []);
      nameMap.get(name).push(inp);
    });

    const groups = [];
    nameMap.forEach(list => {
      if (list.length >= 2) groups.push(list);
    });

    if (groups.length === 0) {
      let temp = [];
      for (let i = 0; i < allRadios.length; i++) {
        temp.push(allRadios[i]);
        if (temp.length === 4 || i === allRadios.length - 1) {
          if (temp.length >= 2) groups.push(temp);
          temp = [];
        }
      }
    }

    const questions = [];
    groups.forEach((group, idx) => {
      const qNum = idx + 1;
      const qId = `qa-detected-direct-${qNum}`;
      const lca = AnchorBasedScanner.getLowestCommonAncestor(group);
      if (!lca) return;

      const card = lca.closest('.que, .formulation, .card, [class*="question"], [id^="q"], form > div') || lca.parentElement || lca;
      card.setAttribute('data-qa-id', qId);

      const clone = card.cloneNode(true);
      clone.querySelectorAll('input, label, .answer, button, .info').forEach(el => el.remove());
      let questionText = TextUtils.extractRichText(clone);
      if (!questionText) {
        questionText = `Câu hỏi ${qNum}`;
      }

      const options = [];
      group.forEach((inp, optIdx) => {
        let key = String.fromCharCode(65 + optIdx);
        const row = inp.closest('label, .r0, .r1, .form-check, .custom-control, .d-flex, li, tr, div') || inp.parentElement;
        const label = (inp.id ? card.querySelector(`label[for="${inp.id}"]`) : null) || inp.closest('label') || row;

        const numSpan = label?.querySelector('.answernumber, .option-letter, .choice-label');
        if (numSpan) {
          const spanTxt = (numSpan.innerText || numSpan.textContent || '').trim();
          const sm = spanTxt.match(/([A-Za-zĐđ0-9])/);
          if (sm) key = sm[1].toUpperCase();
        } else {
          const rawOptText = TextUtils.cleanText(label?.innerText || row?.innerText || '');
          const m = rawOptText.match(TextUtils.OPTION_PREFIX_REGEX);
          if (m) key = m[1].toUpperCase();
        }

        const rawOptText = TextUtils.cleanText(label?.innerText || row?.innerText || '');
        const optText = TextUtils.cleanOptionText(rawOptText, key);

        inp.setAttribute('data-qa-for', qId);
        inp.setAttribute('data-qa-opt', key);
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
          input: inp,
          label: label,
          element: row
        });
      });

      if (options.length >= 2) {
        questions.push({
          id: qId,
          num: qNum,
          type: 'single_choice',
          title: questionText,
          options: options,
          passage: passageMap[qNum] || null,
          image: DomMediaExtractor.extractImageFromNode(card),
          element: card
        });
      }
    });

    return questions;
  }

  static filterValidQuestions(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(q => {
      if (!q || !q.title) return false;
      if (q.type === 'true_false_group') {
        return Array.isArray(q.items) && q.items.length > 0;
      }
      return Array.isArray(q.options) && q.options.length >= 2;
    });
  }

  static buildExtractionStats(questions) {
    if (!Array.isArray(questions)) return { total: 0, singleChoice: 0, trueFalse: 0 };
    let single = 0;
    let tf = 0;
    questions.forEach(q => {
      if (q.type === 'true_false_group') tf++;
      else single++;
    });
    return {
      total: questions.length,
      singleChoice: single,
      trueFalse: tf
    };
  }
}

globalThis.ExamDomScanner = ExamDomScanner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExamDomScanner };
}
