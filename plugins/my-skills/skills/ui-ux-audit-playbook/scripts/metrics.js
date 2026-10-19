() => {
  // Page metrics for browser_evaluate: type census, text and control contrast, target sizes,
  // off-grid spacing, accessible-name gaps, clickable non-controls. Read with evidence.md "metrics".
  const px = v => parseFloat(v) || 0;
  const parse = c => { const m = c.match(/[\d.]+/g); return m ? m.map(Number) : null; };
  const lum = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && (c[3] ?? 1) > 0.5) return c; } return [255, 255, 255]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
  const visible = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const label = el => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')).slice(0, 80);

  const fonts = {}, weights = {}, lineHeights = {}, contrastFails = [], smallTargets = [], offGrid = {};
  const textEls = [...document.querySelectorAll('body *')].filter(el => visible(el) && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()));
  for (const el of textEls) {
    const s = getComputedStyle(el), size = px(s.fontSize), w = +s.fontWeight;
    fonts[size] = (fonts[size] || 0) + 1; weights[w] = (weights[w] || 0) + 1;
    lineHeights[s.lineHeight === 'normal' ? 'normal' : +(px(s.lineHeight) / size).toFixed(2)] = 1;
    const fg = parse(s.color); if (!fg) continue;
    const r = ratio(fg.slice(0, 3), bgOf(el).slice(0, 3));
    const large = size >= 24 || (size >= 18.66 && w >= 700);
    if (r < (large ? 3 : 4.5)) contrastFails.push({ el: label(el), text: el.textContent.trim().slice(0, 40), size, ratio: r, need: large ? 3 : 4.5 });
  }
  for (const el of document.querySelectorAll('a, button, input, select, textarea, [role=button], [role=tab], [role=menuitem], [tabindex]:not([tabindex="-1"])')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) smallTargets.push({ el: label(el), name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), below24: r.width < 24 || r.height < 24 });
  }
  for (const el of [...document.querySelectorAll('body *')].filter(visible).slice(0, 3000)) {
    const s = getComputedStyle(el);
    for (const p of ['paddingTop', 'paddingLeft', 'marginTop', 'marginBottom', 'gap']) { const v = px(s[p]); if (v && v % 4) offGrid[v] = (offGrid[v] || 0) + 1; }
  }
  // SC 1.4.11: form-control boundary vs the background behind it (>= 3:1 unless the fill itself contrasts)
  const uiContrastFails = [];
  for (const el of document.querySelectorAll('input:not([type=hidden]), select, textarea')) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el), border = parse(s.borderTopColor), fill = parse(s.backgroundColor);
    if (!border || px(s.borderTopWidth) === 0) continue;
    const behind = bgOf(el.parentElement || el).slice(0, 3);
    const best = Math.max(ratio(border.slice(0, 3), behind), fill && (fill[3] ?? 1) > 0.5 ? ratio(fill.slice(0, 3), behind) : 1);
    if (best < 3) uiContrastFails.push({ el: label(el), name: el.name || el.id || '', ratio: best, need: 3 });
  }
  // accessible-name gaps: approximate name computation (aria-label, labelledby, <label>, text, value, img alt, title)
  const nameOf = el => [el.getAttribute('aria-label'), (el.getAttribute('aria-labelledby') || '').split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' '),
    el.labels && [...el.labels].map(l => l.textContent).join(' '), el.matches('button, a, [role=button], [role=link]') ? el.textContent : '',
    el.matches('input[type=submit], input[type=button]') ? el.value : '', el.querySelector('img[alt]')?.alt, el.getAttribute('title')]
    .map(v => (v || '').trim()).find(Boolean) || '';
  const unnamedControls = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link]')]
    .filter(el => visible(el) && !nameOf(el)).map(el => ({ el: label(el), placeholderOnly: !!el.getAttribute('placeholder') }));
  const imagesMissingAlt = [...document.querySelectorAll('img:not([alt])')].filter(visible).map(el => ({ el: label(el), src: (el.getAttribute('src') || '').slice(0, 60) }));
  // clickable elements that are not controls: not focusable, not announced
  const clickableNonSemantic = [...document.querySelectorAll('body *')]
    .filter(el => visible(el) && !el.matches('a[href], button, input, select, textarea, label, summary, [role], [tabindex]') && !el.closest('a[href], button')
      && (el.hasAttribute('onclick') || (getComputedStyle(el).cursor === 'pointer' && getComputedStyle(el.parentElement || el).cursor !== 'pointer')))
    .map(el => ({ el: label(el), text: el.textContent.trim().slice(0, 30) })).slice(0, 30);
  return {
    url: location.href, viewport: [innerWidth, innerHeight],
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
    fontSizes: fonts, fontWeights: weights, lineHeightRatios: Object.keys(lineHeights),
    contrastFails: contrastFails.slice(0, 50), contrastFailCount: contrastFails.length,
    uiContrastFails: uiContrastFails.slice(0, 30),
    smallTargets: smallTargets.slice(0, 50), smallTargetCount: smallTargets.length,
    unnamedControls: unnamedControls.slice(0, 30), imagesMissingAlt: imagesMissingAlt.slice(0, 30), clickableNonSemantic,
    offGridSpacing: offGrid,
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 50)),
    landmarks: ['header', 'nav', 'main', 'footer', 'aside'].filter(t => document.querySelector(t + ',[role=' + ({ header: 'banner', nav: 'navigation', main: 'main', footer: 'contentinfo', aside: 'complementary' })[t] + ']')),
    outlineNone: [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules]; } catch { return []; } }).filter(r => /outline:\s*(none|0)/.test(r.cssText)).map(r => r.selectorText).slice(0, 20),
    viewportMeta: document.querySelector('meta[name=viewport]')?.content ?? null,
  };
}
