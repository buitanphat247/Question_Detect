class AnchorBasedScanner {
  static scan(scanRoot, passageMap = {}) {
    if (!scanRoot) return [];
    const anchors = Array.from(scanRoot.querySelectorAll('input[type="radio"], input[type="checkbox"]')).filter(TextUtils.isVisible);
    if (anchors.length < 2) return [];

    const grouped = AnchorBasedScanner.groupAnchors(anchors);
    const questions = [];

    grouped.forEach((group, index) => {
      if (group.length < 2) return;
      const lca = AnchorBasedScanner.getLowestCommonAncestor(group);
      if (!lca) return;

      const qNum = index + 1;
      const qId = `qa-detected-anchor-${qNum}`;
      lca.setAttribute('data-qa-id', qId);

      const questionText = TextUtils.extractRichText(lca);
      const image = DomMediaExtractor.extractImageFromNode(lca);

      const options = [];
      group.forEach((input, optIdx) => {
        let key = String.fromCharCode(65 + optIdx);
        const container = input.closest('label, div, li, tr, p') || input.parentElement;
        const rawOptText = TextUtils.cleanText(container?.innerText || container?.textContent || '');

        const m = rawOptText.match(TextUtils.OPTION_PREFIX_REGEX);
        if (m) key = m[1].toUpperCase();

        const optText = TextUtils.cleanOptionText(rawOptText, key);

        input.setAttribute('data-qa-for', qId);
        input.setAttribute('data-qa-opt', key);
        if (container) {
          container.setAttribute('data-qa-for', qId);
          container.setAttribute('data-qa-opt', key);
        }

        options.push({
          key: key,
          text: optText,
          input: input,
          element: container
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
          element: lca
        });
      }
    });

    return questions;
  }

  static groupAnchors(anchors) {
    const groups = [];
    const nameMap = new Map();

    anchors.forEach(a => {
      const name = a.name;
      if (name) {
        if (!nameMap.has(name)) {
          nameMap.set(name, []);
        }
        nameMap.get(name).push(a);
      }
    });

    if (nameMap.size > 0) {
      nameMap.forEach(list => groups.push(list));
    } else {
      // Nhóm theo khoảng cách DOM
      let current = [];
      for (let i = 0; i < anchors.length; i++) {
        current.push(anchors[i]);
        if (current.length === 4 || i === anchors.length - 1) {
          groups.push(current);
          current = [];
        }
      }
    }

    return groups;
  }

  static getLowestCommonAncestor(elements) {
    if (!elements || elements.length === 0) return null;
    if (elements.length === 1) return elements[0].parentElement;

    let ancestors = AnchorBasedScanner.getAncestors(elements[0]);
    for (let i = 1; i < elements.length; i++) {
      const currentAncestors = new Set(AnchorBasedScanner.getAncestors(elements[i]));
      ancestors = ancestors.filter(a => currentAncestors.has(a));
    }
    return ancestors[0] || document.body;
  }

  static getAncestors(el) {
    const list = [];
    let curr = el?.parentElement;
    while (curr && curr !== document.body) {
      list.push(curr);
      curr = curr.parentElement;
    }
    return list;
  }
}

globalThis.AnchorBasedScanner = AnchorBasedScanner;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnchorBasedScanner };
}
