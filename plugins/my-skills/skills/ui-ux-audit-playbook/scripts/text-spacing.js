async () => {
  // WCAG 1.4.12 Text Spacing test for browser_evaluate. Applies the SC's spacing (Faulkner bookmarklet
  // values, plus 2em after div-wrapped messages), lists text that becomes clipped or overflows its box,
  // then removes the style. Take a screenshot between two runs if you need visual proof: set
  // KEEP = true, screenshot, then reload the page.
  const KEEP = false;
  const sel = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 50);
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const textEls = () => [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()); });
  const clipped = el => {
    // the text box itself, or the nearest ancestor that hides overflow, no longer fits its content
    for (let e = el, d = 0; e && e !== document.body && d < 4; e = e.parentElement, d++) {
      const s = getComputedStyle(e);
      const hides = /(hidden|clip)/.test(s.overflowX + s.overflowY) || s.textOverflow === 'ellipsis' || +s.webkitLineClamp > 0;
      if (hides && (e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1)) return sel(e);
    }
    return null;
  };
  const before = new Map(textEls().map(el => [el, clipped(el)]));
  const style = document.createElement('style');
  style.id = 'audit-text-spacing';
  style.textContent = `*:not(#\\9):not(#\\9) { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }
    p, li, h1, h2, h3, h4, h5, h6, [role=alert], [role=status], .error, .hint, .message { margin-bottom: 2em !important; }`;
  document.head.appendChild(style);
  await frame();
  const newlyClipped = [];
  for (const el of textEls()) {
    const c = clipped(el);
    if (c && !before.get(el)) newlyClipped.push({ text: el.textContent.trim().slice(0, 50), el: sel(el), clippedBy: c });
  }
  if (!KEEP) style.remove();
  return {
    newlyClipped: newlyClipped.slice(0, 40),   // 1.4.12 fail candidates; confirm on a screenshot with KEEP = true
    clippedEvenWithoutSpacing: [...before.entries()].filter(([, c]) => c).map(([el, c]) => ({ text: el.textContent.trim().slice(0, 50), el: sel(el), clippedBy: c })).slice(0, 20), // content already cut off: a defect regardless of 1.4.12
    note: 'Overlap between neighbouring boxes (text running into other text) is not detected; check the KEEP screenshot.',
  };
}
