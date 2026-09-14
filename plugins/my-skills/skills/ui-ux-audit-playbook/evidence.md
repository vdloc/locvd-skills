# Evidence Collection — Measured, Not Guessed

Use when auditing live URL/local dev server. Every finding cites measurement from here or marked "needs verification".

## Playwright MCP sequence
Load tools first if deferred (`ToolSearch select:mcp__playwright__browser_navigate,...`).

| Step | Tool | Capture |
|---|---|---|
| 1 | `mcp__playwright__browser_navigate` | target URL; one pass per mode/theme/role (e.g. light + dark, each app mode) |
| 2 | `mcp__playwright__browser_resize` → `browser_take_screenshot` (fullPage) | widths 375, 768, 1280, 1920; name `<screen>-<mode>-<w>.png` |
| 3 | `mcp__playwright__browser_snapshot` | accessibility tree: names, roles, states, heading order, landmarks (→ ch15 A3–A5) |
| 4 | `mcp__playwright__browser_evaluate` | metrics snippet below (type, colour, targets, spacing) |
| 5 | `mcp__playwright__browser_press_key` Tab ×N + screenshot | focus order + focus-visible ring (A1, A2) |
| 6 | `mcp__playwright__browser_evaluate` `document.body.style.zoom='2'` or resize 640 @1280 | reflow / horizontal scroll (A11) |
| 7 | `mcp__playwright__browser_console_messages` | runtime errors, a11y warnings |
| 8 | axe (if allowed): inject `https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js` via evaluate, run `axe.run()` | WCAG violations with selectors |

Read-only rule: never click destructive controls, submit real forms, or change persisted settings during audit.

## Metrics snippet (`browser_evaluate`)
Returns font-size census, contrast failures, small targets, spacing values off the 4px grid.

```js
() => {
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
  return {
    url: location.href, viewport: [innerWidth, innerHeight],
    horizontalScroll: document.documentElement.scrollWidth > innerWidth,
    fontSizes: fonts, fontWeights: weights, lineHeightRatios: Object.keys(lineHeights),
    contrastFails: contrastFails.slice(0, 50), contrastFailCount: contrastFails.length,
    smallTargets: smallTargets.slice(0, 50), smallTargetCount: smallTargets.length,
    offGridSpacing: offGrid,
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 50)),
    landmarks: ['header', 'nav', 'main', 'footer', 'aside'].filter(t => document.querySelector(t + ',[role=' + ({ header: 'banner', nav: 'navigation', main: 'main', footer: 'contentinfo', aside: 'complementary' })[t] + ']')),
    outlineNone: [...document.styleSheets].flatMap(ss => { try { return [...ss.cssRules]; } catch { return []; } }).filter(r => /outline:\s*(none|0)/.test(r.cssText)).map(r => r.selectorText).slice(0, 20),
    viewportMeta: document.querySelector('meta[name=viewport]')?.content ?? null,
  };
}
```

## Limits (state in report)
- Contrast uses nearest opaque ancestor background — gradients, images, overlays, `backdrop-filter`, canvas/WebGL text → verify manually on screenshot.
- Target check measures element box, not extended hit area (pseudo-elements, padding on parent).
- Off-grid spacing = hint, not violation; judge against project tokens.
- Canvas/WebGL UIs (3D viewers): DOM metrics cover chrome only; audit canvas overlays from screenshots.
- No screen-reader or real-device run → list under "needs verification".
