# Evidence collection: measured, not guessed

Every finding carries an evidence tag (SKILL.md *Ground rules*): **Measured** comes from this file's tools, **Observed** from the walkthrough below, anything else is **Inferred** and capped at Medium.

## Contents
- Running the scripts
- Playwright MCP sequence (live URL or dev server)
- Interaction walkthrough log
- Static source or screenshot only
- Reading `metrics.js`
- Reading `style-inventory.js`
- Reading `alignment-grid.js`
- Reading `form-layout.js`
- Limits (state these in the report)

## Running the scripts
The four files in `scripts/` are page functions, each a bare `() => { … }` expression:

| Script | Measures | Feeds |
|---|---|---|
| `scripts/metrics.js` | font sizes/weights, text contrast, form-control contrast, small targets, unnamed controls, images without `alt`, clickable non-controls, off-grid spacing, headings, landmarks, `outline:none`, viewport meta | ch02–05, ch08, ch14, ch15 |
| `scripts/style-inventory.js` | text-style, colour, radius, border, shadow, gradient, control-height and motion-duration census; `prefers-reduced-motion` rule present | ch01 F9, ch04 T3, ch05 C4, ch06 D1, ch12 S1, ch18 |
| `scripts/alignment-grid.js` | per region: distinct left/right edges and distinct vertical gaps | ch03 L1, L2, L7, L15 |
| `scripts/form-layout.js` | per form: label position, columns, widths, required markers vs `required`, required/optional interleaving, image adjacency | ch09, ch03 L14 |

To run one: Read the file, then call `browser_evaluate` with the file's full text as the `function` argument. Run each script at every breakpoint and theme you screenshot, and keep the JSON with the screenshot name it belongs to. For long output, pass `filename` so the result is saved to a file instead of returned inline; the Playwright MCP only writes inside its allowed roots (the project directory and its `.playwright-mcp/` folder), so use a relative path such as `.playwright-mcp/metrics-1280.json`.

## Playwright MCP sequence
Load the tools first if they are deferred (`ToolSearch select:mcp__playwright__browser_navigate,…`).

| Step | Tool | Capture |
|---|---|---|
| 1 | `browser_navigate` | target URL; one pass per theme, role or app mode |
| 2 | `browser_resize` → `browser_take_screenshot` (fullPage) | widths 375, 768, 1280, 1920; name `<screen>-<mode>-<w>.png` |
| 3 | `browser_snapshot` | accessibility tree: names, roles, states, heading order, landmarks (ch15 A3–A5) |
| 4 | `browser_evaluate` with `scripts/metrics.js` | type, contrast, targets, names, spacing |
| 5 | `browser_evaluate` with `scripts/style-inventory.js` | system consistency census |
| 6 | `browser_evaluate` with `scripts/alignment-grid.js` | edge and gap counts per region |
| 7 | `browser_evaluate` with `scripts/form-layout.js` (pages with a form) | field arrangement, required markers |
| 8 | `browser_press_key` Tab ×N + screenshot | focus order and visible focus (A1, A2) |
| 9 | `browser_evaluate` `document.body.style.zoom='2'`, or resize to 640 wide at 1280 | reflow, horizontal scroll (A11) |
| 10 | `browser_resize` to the shortest realistic height (e.g. 1280×600) + screenshot | split-pane starvation (ch03 L13); width-only testing never catches it |
| 11 | `browser_emulate_media` reduced motion (if available) + screenshot of animated areas | ch18 AN4 |
| 12 | `browser_console_messages` | runtime errors, framework a11y warnings |
| 13 | axe (if allowed): inject `https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js` via evaluate, run `axe.run()` | WCAG violations with selectors |
| 14 | walkthrough (next section) | Observed findings |

**Gather before you judge.** ch09's checks (FM2, FM4, FM7, FM15–FM20) and ch03's grouping checks (L2, L14) are tests against this page's measured arrangement, not impressions from a screenshot.

## Interaction walkthrough log
For each top task, record one line per action. Only these lines can support an *Observed* finding about behaviour.

```
Task: <name> · Screen: <route> · Breakpoint: <w>
| # | Action (what you pressed/typed) | Expected | Actually happened | Screenshot | Check |
| 1 | Esc on open "Edit address" dialog | dialog closes, focus back on trigger | closes; focus lost to <body> | edit-esc-1280.png | S5, A1 |
```

Cover, per task: Back, Cancel, Esc, Undo and close (control and freedom, ch17 IX5); whether needed options and values stay visible (recognition, ch17 IX2); defaults, autofill, shortcuts, bulk actions (efficiency, ch17 IX1); a deliberately wrong value on a dev or non-persisting form (error recovery, ch09 FM10–FM12, ch16); one keyboard-only pass. Never submit real orders, payments or messages, never press destructive controls, never change persisted settings.

## Static source or screenshot only
- **HTML/CSS source**: derive the same facts by reading it: label association (`for`/`id`, wrapping), `alt` presence, `outline` rules, viewport meta, declared sizes, colours (compute contrast with the WCAG formula), spacing values against the scale. These count as *Measured* when the value is read directly from the source.
- **Screenshot only**: sizes and colours sampled from pixels are approximate; say so. Names, roles, focus and behaviour cannot be seen: list those checks under *Needs verification*.
- **No JavaScript behaviour is observable from static files**: anything that happens after a click is *Inferred*.

## Reading `metrics.js`
| Field | Check | Note |
|---|---|---|
| `contrastFails[]` | C1, T11, A7 | text vs nearest opaque ancestor background |
| `uiContrastFails[]` | C2, D5, FM9 | input/select/textarea boundary vs background behind it, needs ≥3:1 |
| `smallTargets[]` (`below24: true`) | B4, M3, A14, L12 | under 24 px fails WCAG 2.5.8 unless spaced; under 44 px misses the playbook target |
| `unnamedControls[]` (`placeholderOnly: true`) | A4, FM3 | placeholder is not a label |
| `imagesMissingAlt[]` | I8, A9 | `alt=""` is not listed: it is correct for decorative images |
| `clickableNonSemantic[]` | B10, A3 | `onclick` or pointer cursor on a non-control |
| `fontSizes`, `fontWeights` | T3, T4, T5 | many sizes = no scale; anything under 12 px |
| `offGridSpacing` | L1 | values not on a 4 px grid; a hint, judge against project tokens |
| `outlineNone`, `viewportMeta`, `landmarks`, `headings` | A2, M1/A11, A5, T12 | |

## Reading `style-inventory.js`
Malewicz's audit method: count every style, keep the ones with a purpose, merge the rest into the nearest common value.

| Field | Check | Signal |
|---|---|---|
| `counts.textStyles`, `rareTextStyles` | T3, T4 | more than 3–4 styles per screen is hard to parse; styles used once or twice are merge candidates |
| `counts.fontFamilies` | T1 | more than 2 |
| `counts.colourValues`, `colours[]` | C4, C5, C6 | each colour should map to a palette role; one-off greys and near-duplicate hues are drift |
| `radii`, `borderWidths` | S1, D1 | more than one border width, or more than 2–3 radii, without a reason |
| `shadows` | D1, D3 | more values than the elevation tokens |
| `controlHeights` | B12, S2 | buttons and inputs of one size tier should share a height; very small heights also feed B4 |
| `motion.durations`, `motion.reducedMotionRule` | ch18 AN2, AN4 | durations outside 100–500 ms; animation present but no reduced-motion rule |

## Reading `alignment-grid.js`
Franz & Kauer-Franz's design grid: draw a line at both side edges of every element and count them; measure the gaps between stacked elements and count the distinct values. Fewer lines and fewer distinct gaps read as calmer and more ordered.

| Field | Check | Signal |
|---|---|---|
| `distinctLeftEdges`, `leftEdges` | L7, L15 | edges a few px apart (e.g. 160 and 163) are accidental misalignment; many single-use edges = choppy layout |
| `distinctVerticalGaps`, `verticalGaps` | L1, L2, L15 | many distinct gaps = no spacing rhythm; label→input gap should be smaller than field→field gap |
| `offScaleGaps` | L1 | gaps not on the 4 px grid |

There is no universal pass number. Use the counts to compare regions of one page, competitor screens, or before and after a fix, and cite the specific stray values in findings.

## Reading `form-layout.js`
| Captured fact | Check |
|---|---|
| `labelPositions` has more than one value in one form, or contains `MISSING` | FM2 (mixed position), FM3 (missing label) |
| `columnCount > 1` and the fields are not a short pair (expiry/CVC, day/month/year, city/state/ZIP) | FM2, Baymard multicolumn finding |
| `labelGapPx` vs the measured field-to-field gap (`alignment-grid.js`) | FM15, L2 |
| `markedRequiredButNotProgrammatic` non-empty | FM4, A13 |
| `requiredOptionalInterleaved: true` with both counts > 0 | FM20 (Tullis & Pons 1997) |
| a field asks for a physically located value (serial, security code, activation code) and `diagramLinks` is empty for it | FM16 |
| `diagramLinks[].domOrderDelta` far from 0 for a visually adjacent image | L14, SC 1.3.2: confirm with `browser_snapshot` order before citing |
| landscape mobile (`width > height`, `width < 900`) and `labelPositions` is `['above']` | FM17 |

## Limits (state these in the report)
- Contrast uses the nearest opaque ancestor background. Gradients, images, overlays, `backdrop-filter`, canvas/WebGL text and modern colour syntaxes (`oklch()`, `color()`) need a manual check on the screenshot.
- The name check approximates the accessible-name algorithm; confirm odd results in `browser_snapshot`.
- Target size measures the element box, not an extended hit area (pseudo-elements, padding on a parent).
- Off-grid spacing and edge counts are hints, judged against the project's own tokens.
- Canvas/WebGL interfaces: DOM metrics cover only the surrounding chrome; audit canvas overlays from screenshots.
- No screen-reader or real-device run happened unless the report says so; list those checks under *Needs verification*.
- `form-layout.js` label position and diagram adjacency are geometric heuristics, not a semantic reading-order check.
