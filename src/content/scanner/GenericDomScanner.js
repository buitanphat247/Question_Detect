class GenericDomScanner {
  static scan(scanRoot, passageMap = {}) {
    if (!scanRoot) return [];
    const questions = [];
    const headerElements = Array.from(scanRoot.querySelectorAll('h1, h2, h3, h4, h5, p, b, strong, div')).filter(el => {
      if (el.closest('header, nav, footer, #page-header, #header, .breadcrumb, [class*="breadcrumb"], [class*="banner"]')) {
        return false;
      }
      const txt = (el.innerText || el.textContent || '').trim();
      if (txt.length > 200 || txt.length < 3) return false;
      return TextUtils.QUESTION_HEADER_REGEX.test(txt);
    });

    headerElements.forEach((header, index) => {
      const txt = (header.innerText || header.textContent || '').trim();
      const m = txt.match(TextUtils.QUESTION_HEADER_REGEX);
      const qNum = m ? parseInt(m[1], 10) : (index + 1);
      const qId = `qa-detected-generic-${qNum}`;

      // Tìm container bao bọc có chứa options
      let container = header;
      while (container && container !== document.body) {
        const inps = container.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        if (inps.length >= 2) break;
        container = container.parentElement;
      }

      if (!container || container === document.body) return;
      container.setAttribute('data-qa-id', qId);

      const questionText = TextUtils.extractRichText(header);
      const image = DomMediaExtractor.extractImageFromNode(container);

      const options = [];
      const inputs = Array.from(container.querySelectorAll('input[type="radio"], input[type="checkbox"]'));

      inputs.forEach((input, optIdx) => {
        let key = String.fromCharCode(65 + optIdx);
        const optCont = input.closest('label, div, li, tr') || input.parentElement;
        const rawOptText = TextUtils.cleanText(optCont?.innerText || '');

        const match = rawOptText.match(TextUtils.OPTION_PREFIX_REGEX);
        if (match) key = match[1].toUpperCase();

        const optText = TextUtils.cleanOptionText(rawOptText, key);

        input.setAttribute('data-qa-for', qId);
        input.setAttribute('data-qa-opt', key);
        if (optCont) {
          optCont.setAttribute('data-qa-for', qId);
          optCont.setAttribute('data-qa-opt', key);
        }

        options.push({
          key: key,
          text: optText,
          input: input,
          element: optCont
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
          image: image,
          element: container
        });
      }
    });

    return questions;
  }
}

globalThis.GenericDomScanner = GenericDomScanner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GenericDomScanner };
}
