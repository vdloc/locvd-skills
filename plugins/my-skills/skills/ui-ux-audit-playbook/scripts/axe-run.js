async () => {
  // axe-core run for browser_evaluate with WCAG 2.2 enabled. A bare axe.run() skips target-size
  // (2.5.8, axe's only WCAG 2.2 rule, off by default) and best-practice choices are implicit.
  // Violations → Measured findings. "needsReview" (axe incomplete) → Needs verification, never violations.
  // axe accepts a placeholder as an accessible name, so it passes placeholder-only fields that
  // metrics.js flags (placeholderOnly): keep both.
  const SRC = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.12.1/axe.min.js';
  if (!window.axe) await new Promise((ok, fail) => {
    const s = document.createElement('script'); s.src = SRC; s.onload = ok;
    s.onerror = () => fail(new Error('axe could not load (CSP or offline): audit without it and say so'));
    document.head.appendChild(s);
  });
  const r = await axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
    resultTypes: ['violations', 'incomplete'],
  });
  const brief = list => list.map(v => ({
    id: v.id, impact: v.impact, wcag: v.tags.filter(t => /^wcag\d{3,}$/.test(t)).join(' ') || (v.tags.includes('best-practice') ? 'best-practice' : ''),
    nodes: v.nodes.length, targets: v.nodes.slice(0, 5).map(n => n.target.join(' ')), help: v.help,
  }));
  return { axe: axe.version, url: location.href, violations: brief(r.violations), needsReview: brief(r.incomplete) };
}
