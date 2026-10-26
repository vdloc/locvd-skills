() => {
  // Design-grid check for browser_evaluate (Franz & Kauer-Franz, "User Interface Quality
  // Check: The Design Grid"). Per region, counts distinct left/right alignment edges and
  // distinct vertical gaps between stacked elements. Fewer distinct values = calmer layout.
  // Read with evidence.md "alignment-grid"; compare before/after a fix, not against a fixed number.
  const TOL = 2; // px: edges closer than this count as one line
  const REGION = 'header, nav, main, aside, footer, form, section, [role=banner], [role=main], [role=navigation], [role=contentinfo], [role=dialog]';
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const label = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 50);
  const ownText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  // A "unit" is anything a designer would draw a box around: text block, control, media, or a filled/bordered container.
  const isUnit = el => {
    if (el.matches('img, svg, video, canvas, input:not([type=hidden]), select, textarea, button, [role=button], hr')) return true;
    if (ownText(el)) return true;
    const s = getComputedStyle(el);
    return (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && el.children.length > 0) || (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none');
  };
  const cluster = values => values.sort((a, b) => a - b).reduce((acc, v) => { const last = acc[acc.length - 1]; if (last && v - last.at <= TOL) last.n++; else acc.push({ at: v, n: 1 }); return acc; }, []);

  const units = [...document.querySelectorAll('body *')].filter(el => visible(el) && isUnit(el) && !el.closest('svg *'))
    // drop inline pieces of a text block (a <b> inside a <p>): the block already carries the edge
    .filter(el => { const p = el.parentElement; return !(p && ownText(p) && getComputedStyle(el).display.startsWith('inline') && !el.matches('img, svg, input, select, textarea, button')); })
    .slice(0, 3000);
  const byRegion = new Map();
  for (const el of units) {
    const region = el.closest(REGION) || document.body;
    if (!byRegion.has(region)) byRegion.set(region, []);
    byRegion.get(region).push({ el, r: el.getBoundingClientRect() });
  }

  return [...byRegion.entries()].filter(([, boxes]) => boxes.length >= 3).slice(0, 20).map(([region, boxes]) => {
    const lefts = cluster(boxes.map(b => Math.round(b.r.left)));
    const rights = cluster(boxes.map(b => Math.round(b.r.right)));
    const gaps = {};
    for (const a of boxes) { // nearest box directly below a, overlapping horizontally
      let best = null;
      for (const b of boxes) {
        if (a === b || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const overlapX = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
        const gap = b.r.top - a.r.bottom;
        if (overlapX > 4 && gap >= 0 && gap < 200 && (!best || gap < best.gap)) best = { gap, b };
      }
      if (best) { const g = Math.round(best.gap); gaps[g] = gaps[g] || { count: 0, example: `${label(a.el)} → ${label(best.b.el)}` }; gaps[g].count++; }
    }
    const gapList = Object.entries(gaps).map(([px, v]) => ({ px: +px, ...v })).sort((a, b) => b.count - a.count);
    return {
      region: region === document.body ? 'body (outside landmarks)' : label(region),
      units: boxes.length,
      distinctLeftEdges: lefts.length, distinctRightEdges: rights.length,
      leftEdges: lefts.sort((a, b) => b.n - a.n).slice(0, 12).map(e => `${e.at}px ×${e.n}`),
      distinctVerticalGaps: gapList.length,
      verticalGaps: gapList.slice(0, 15),
      offScaleGaps: gapList.filter(g => g.px % 4).map(g => g.px),
    };
  });
}
