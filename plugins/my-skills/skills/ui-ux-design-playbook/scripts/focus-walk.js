async () => {
  // Focus walk for browser_evaluate (WCAG 2.4.7 visible focus, 2.4.11 focus not obscured, 2.4.3 order).
  // Focuses every tabbable element in Tab order the way the browser would scroll to it, then checks:
  // does any computed style change on focus (indicator), and is the element entirely covered by a
  // fixed/sticky layer (header, footer, cookie banner, chat bubble)? Programmatic focus can differ from
  // real Tab focus (:focus-visible heuristics) — confirm flagged items with browser_press_key Tab + screenshot.
  const sel = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '')).slice(0, 50);
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const tabbable = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex], [contenteditable=true]')]
    .filter(el => visible(el) && !el.disabled && el.getAttribute('tabindex') !== '-1' && !el.closest('[inert], [aria-hidden="true"]'));
  const order = [...tabbable.filter(el => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex), ...tabbable.filter(el => !(el.tabIndex > 0))];
  const PROPS = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'backgroundColor', 'borderTopColor', 'borderBottomWidth', 'color', 'textDecorationLine'];
  const snap = el => { const s = getComputedStyle(el); return PROPS.map(p => s[p]).join('|'); };
  const overlays = () => [...document.querySelectorAll('body *')].filter(el => { const p = getComputedStyle(el).position; return (p === 'fixed' || p === 'sticky') && visible(el); });
  const frame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const startX = scrollX, startY = scrollY, startFocus = document.activeElement;
  const noIndicator = [], obscured = [], partlyCovered = [];
  for (const el of order.slice(0, 150)) {
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    const before = snap(el);
    el.focus({ focusVisible: true });
    await frame();
    if (document.activeElement !== el) continue;
    if (snap(el) === before) noIndicator.push(sel(el));
    const r = el.getBoundingClientRect();
    for (const o of overlays()) {
      if (o === el || o.contains(el)) continue;
      const q = o.getBoundingClientRect();
      const ix = Math.max(0, Math.min(r.right, q.right) - Math.max(r.left, q.left)), iy = Math.max(0, Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top));
      const cover = (ix * iy) / Math.max(1, r.width * r.height);
      const opaque = +getComputedStyle(o).opacity >= 0.9;
      if (cover >= 0.99 && opaque) { obscured.push({ el: sel(el), by: sel(o) }); break; }
      if (cover > 0.3) partlyCovered.push({ el: sel(el), by: sel(o), pct: Math.round(cover * 100) });
    }
  }
  if (document.activeElement) document.activeElement.blur();
  if (startFocus && startFocus.focus) startFocus.focus({ preventScroll: true });
  scrollTo(startX, startY);
  return {
    tabStops: order.length,
    noVisibleFocusChange: noIndicator.slice(0, 40),   // 2.4.7 candidates: no style changed on focus
    fullyObscured: obscured.slice(0, 40),             // 2.4.11 fail candidates (confirm with screenshot)
    partlyCovered: partlyCovered.slice(0, 20),        // passes 2.4.11 (AA), fails 2.4.12 (AAA); note only
    overlays: overlays().map(o => `${sel(o)} ${getComputedStyle(o).position} h=${Math.round(o.getBoundingClientRect().height)}`).slice(0, 10),
    scrollPaddingTop: getComputedStyle(document.documentElement).scrollPaddingTop,
  };
}
