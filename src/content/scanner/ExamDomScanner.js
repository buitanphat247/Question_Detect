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
        const el = root.querySelector(sel);
        if (el && el.querySelector('.que, .yh-question-card, [class*="question"], [id^="q-"], [id^="question-"], input[type="radio"], input[type="checkbox"]')) {
          return el;
        }
      } catch (e) {}
    }

    return root.body || (root.documentElement || root);
  }

  static scanAll(root = null) {
    const scanRoot = ExamDomScanner.getMainScanRoot(root);
    if (!scanRoot) return [];

    const passageMap = DomMediaExtractor.extractReadingPassages(scanRoot);

    // 1. Quét theo Moodle (.que)
    let questions = MoodleScanner.scan(scanRoot, passageMap);
    if (questions.length > 0) return ExamDomScanner.filterValidQuestions(questions);

    // 2. Quét theo QuizCard (.yh-question-card, .exam-question, ...)
    questions = QuizCardScanner.scan(scanRoot, passageMap);
    if (questions.length > 0) return ExamDomScanner.filterValidQuestions(questions);

    // 3. Quét theo Anchor Grouping & LCA
    questions = AnchorBasedScanner.scan(scanRoot, passageMap);
    if (questions.length > 0) return ExamDomScanner.filterValidQuestions(questions);

    // 4. Quét theo Generic DOM Header
    questions = GenericDomScanner.scan(scanRoot, passageMap);
    return ExamDomScanner.filterValidQuestions(questions);
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
