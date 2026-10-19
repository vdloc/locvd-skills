() => {
  // Numbered marks for screenshot localization (UICrit: numbered patches raised box accuracy from
  // IoU 0.004 to 0.22). Call once to draw marks and get the number → selector map, take the
  // screenshot, call again to remove the marks. Cite findings as "mark 12 (button.btn-primary)".
  const old = document.getElementById('audit-marks');
  if (old) { old.remove(); return { removed: true }; }
  const sel = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 60);
  const inView = r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
  const targets = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], img, svg, h1, h2, h3, label, [role=alert], [role=status]')]
    .filter(el => { const s = getComputedStyle(el); return inView(el.getBoundingClientRect()) && s.visibility !== 'hidden' && !el.closest('#audit-marks') && !(el.tagName === 'svg' && el.closest('button, a')); })
    .slice(0, 120);
  const layer = document.createElement('div');
  layer.id = 'audit-marks';
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647';
  const map = targets.map((el, i) => {
    const r = el.getBoundingClientRect();
    const box = document.createElement('div');
    box.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;outline:2px solid #e60073;`;
    const tag = document.createElement('span');
    tag.textContent = i + 1;
    tag.style.cssText = 'position:absolute;left:-2px;top:-14px;background:#e60073;color:#fff;font:700 11px/14px monospace;padding:0 3px;';
    box.appendChild(tag); layer.appendChild(box);
    const text = el.getAttribute('aria-label') || (el.labels && el.labels[0] && el.labels[0].textContent) || el.getAttribute('alt') || el.textContent || el.getAttribute('placeholder') || el.name || '';
    return `${i + 1}: ${sel(el)} "${text.trim().replace(/\s+/g, ' ').slice(0, 30)}"`;
  });
  document.body.appendChild(layer);
  return { marks: map, next: 'take the screenshot, then run this script again to remove the marks' };
}
