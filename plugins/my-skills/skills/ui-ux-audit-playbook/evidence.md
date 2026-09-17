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
| 6b | `browser_resize` to the shortest realistic window height (e.g. 1280×600 — laptop with browser chrome) + screenshot | split-pane starvation: a `flex-grow` region eating a fixed-purpose sibling (tools/actions) down to invisible — see ch03 L13. Width-only breakpoint testing (step 2) never catches this. |
| 7 | `mcp__playwright__browser_console_messages` | runtime errors, a11y warnings |
| 8 | axe (if allowed): inject `https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js` via evaluate, run `axe.run()` | WCAG violations with selectors |
| 9 | If the page has a `<form>`/`<fieldset>`: `browser_evaluate` the **form-layout snippet** below | current field/label/diagram arrangement — required input for ch09 lenses, see "Read as" table |

Read-only rule: never click destructive controls, submit real forms, or change persisted settings during audit.

**Gather before you judge.** ch09's Audit Checks table (FM2, FM4, FM7, FM15–19) and ch03's Gestalt/proximity checks (L2, L14) are pass/fail tests against *this page's current arrangement*, not against a memorized rule. Never assert a form-layout finding from a screenshot glance alone — run the snippet below first, then read each captured fact against the matching check. Static screenshots/code-only audits: derive the same facts by measuring `getBoundingClientRect()`-equivalent positions from CSS/DOM directly, or mark the check "needs verification" if you can't.

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

## Form-layout snippet (`browser_evaluate`)
Captures the *current* arrangement per form/fieldset — label position, column count, field widths, required/optional spatial clustering, and any image/diagram within adjacency range of a field (with DOM-order delta, for SC 1.3.2) — so ch09/ch03 checks below test facts, not guesses.

```js
() => {
  const rect = el => el.getBoundingClientRect();
  const domIndex = (() => { let i = 0; const map = new WeakMap(); (function walk(el){ map.set(el, i++); [...el.children].forEach(walk); })(document.body); return el => map.get(el) ?? -1; })();
  const containers = [...document.querySelectorAll('form, fieldset')];
  const scope = containers.length ? containers : [document.body];

  return scope.map(container => {
    const fields = [...container.querySelectorAll('input:not([type=hidden]), select, textarea')]
      .filter(el => { const r = rect(el); return r.width > 0 && r.height > 0; });

    const info = fields.map(f => {
      const label = (f.labels && f.labels[0]) || document.querySelector(f.id ? `label[for="${f.id}"]` : null) || null;
      const fr = rect(f), lr = label ? rect(label) : null;
      let labelPos = label ? 'unclear' : 'MISSING';
      if (lr) {
        if (fr.top - lr.bottom >= -2 && fr.top - lr.bottom < 40) labelPos = 'above';
        else if (lr.right <= fr.left + 4) labelPos = 'left';
        else if (lr.left >= fr.right - 4) labelPos = 'right';
      }
      return {
        field: f.name || f.id || f.tagName.toLowerCase(),
        required: f.required,
        x: Math.round(fr.left), y: Math.round(fr.top), width: Math.round(fr.width),
        labelPos,
        labelGapPx: lr ? Math.round(Math.max(0, Math.min(Math.abs(fr.top - lr.bottom), Math.abs(fr.left - lr.right)))) : null,
      };
    });

    // column count: cluster distinct x-starts more than 40px apart
    const xs = [...new Set(info.map(f => f.x))].sort((a, b) => a - b);
    const columns = xs.reduce((cols, x) => { if (!cols.length || x - cols[cols.length - 1] > 40) cols.push(x); return cols; }, []);

    // diagram/image adjacency to each field, with DOM-order delta (SC 1.3.2 signal)
    const media = [...container.querySelectorAll('img, svg, picture, canvas')];
    const diagramLinks = [];
    for (const f of fields) {
      const fr = rect(f);
      for (const m of media) {
        const mr = rect(m);
        const dx = Math.max(fr.left - mr.right, mr.left - fr.right, 0);
        const dy = Math.max(fr.top - mr.bottom, mr.top - fr.bottom, 0);
        const dist = Math.round(Math.hypot(dx, dy));
        if (dist < 150) diagramLinks.push({
          field: f.name || f.id || f.tagName.toLowerCase(),
          media: m.tagName.toLowerCase() + (m.getAttribute('alt') ? `[alt="${m.getAttribute('alt').slice(0, 40)}"]` : '[NO ALT]'),
          distancePx: dist,
          domOrderDelta: domIndex(m) - domIndex(f), // 0 = adjacent in DOM too; large |delta| = visual-only adjacency, check SC 1.3.2
        });
      }
    }

    // required/optional interleaving: do required and optional fields alternate in reading order (no spatial separation)?
    const interleaved = info.length > 1 && info.some((f, i) => i > 0 && f.required !== info[i - 1].required);

    return {
      container: container.tagName.toLowerCase() + (container.id ? '#' + container.id : container.className ? '.' + String(container.className).split(/\s+/)[0] : ''),
      fieldCount: fields.length,
      columnCount: columns.length, // >1 with no matching short-pair rationale (expiry+CVC, day+month+year) → FM2/Baymard multicolumn check
      labelPositions: [...new Set(info.map(f => f.labelPos))], // mixed positions in one form = FM2 fail
      requiredCount: info.filter(f => f.required).length,
      optionalCount: info.filter(f => !f.required).length,
      requiredOptionalInterleaved: interleaved, // true + both counts >0 → gap #5 (Tullis & Pons 1997): not spatially separated
      diagramLinks, // empty + field name suggests physically-located value (code/serial/CVV) → candidate FM16 gap
      fields: info.slice(0, 40),
    };
  });
}
```

**Read as** — map captured facts to checks, don't re-derive the rule each time:

| Captured fact | Check it feeds |
|---|---|
| `labelPositions` has >1 value in one form | ch09 FM2 (mixed label position) |
| `columnCount > 1` and fields aren't a documented short-pair (expiry/CVC, day/month/year, city/state/ZIP) | ch09 FM2, Baymard multicolumn finding |
| `labelGapPx` for label↔input vs. measured field↔field gap | ch09 FM15 / ch03 L2 |
| `requiredOptionalInterleaved: true` with both counts >0 | ch09 FM4 spatial-separation gap (Tullis & Pons 1997) |
| field name/label suggests a physically-located value (serial no., security code, activation code) and `diagramLinks` is empty for it | ch09 FM16 |
| `diagramLinks[].domOrderDelta` far from 0 for a visually-adjacent image | ch03 L14 / WCAG SC 1.3.2 — verify with `browser_snapshot`'s accessibility-tree order, not just this heuristic |
| viewport width/height from step 2 shows landscape mobile (`width > height`, `width < 900`) and `labelPositions` is `['above']` | ch09 FM17 |

## Limits (state in report)
- Contrast uses nearest opaque ancestor background — gradients, images, overlays, `backdrop-filter`, canvas/WebGL text → verify manually on screenshot.
- Target check measures element box, not extended hit area (pseudo-elements, padding on parent).
- Off-grid spacing = hint, not violation; judge against project tokens.
- Canvas/WebGL UIs (3D viewers): DOM metrics cover chrome only; audit canvas overlays from screenshots.
- No screen-reader or real-device run → list under "needs verification".
- Form-layout snippet's `labelPos` and `diagramLinks` are geometric heuristics (bounding-box position/distance), not a semantic reading-order check — always cross-check any flagged `domOrderDelta` against `browser_snapshot`'s actual accessibility-tree order before citing SC 1.3.2 as a violation, don't cite the heuristic alone.
