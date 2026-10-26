# Evidence collection: measured, not guessed

Every finding carries an evidence tag (audit-workflow.md *Ground rules*): **Measured** comes from this file's tools, **Observed** from the walkthrough below, anything else is **Inferred** and capped at Medium.

## Contents
- Running the scripts
- Playwright MCP sequence (live URL or dev server)
- Interaction walkthrough log
- Static source or screenshot only
- Reading `metrics.js`
- Reading `style-inventory.js`
- Reading `alignment-grid.js`
- Reading `form-layout.js`
- Reading `axe-run.js`
- Reading `a11y-transcript.js`
- Reading `focus-walk.js`
- WCAG 2.2 procedures: `text-spacing.js`, `live-regions.js`, `wcag22-inventory.js`
- Marking screenshots: `mark-elements.js`
- Limits (state these in the report)

## Running the scripts
The files in `scripts/` are page functions, each a bare `() => { … }` or `async () => { … }` expression:

| Script | Measures | Feeds |
|---|---|---|
| `scripts/metrics.js` | font sizes/weights, text contrast, form-control contrast, small targets, unnamed controls, images without `alt`, clickable non-controls, off-grid spacing, headings, landmarks, `outline:none`, viewport meta | ch02–05, ch08, ch14, ch15 |
| `scripts/style-inventory.js` | text-style, colour, radius, border, shadow, gradient, control-height and motion-duration census; `prefers-reduced-motion` rule present | ch01 F9, ch04 T3, ch05 C4, ch06 D1, ch12 S1, ch18 |
| `scripts/alignment-grid.js` | per region: distinct left/right edges and distinct vertical gaps | ch03 L1, L2, L7, L15 |
| `scripts/form-layout.js` | per form: label position, columns, widths, required markers vs `required`, required/optional interleaving, image adjacency | ch09, ch03 L14 |
| `scripts/axe-run.js` | axe-core 4.12.1 with `wcag2a/aa`, `wcag21a/aa`, `wcag22aa`, `best-practice` tags; violations and needs-review | ch15 |
| `scripts/a11y-transcript.js` | every landmark, heading and control in reading order as "role, name, states" with its Tab number; unnamed controls; upward Tab-order jumps | ch15 A3–A6, ch09, ch10 |
| `scripts/focus-walk.js` | focuses each Tab stop in turn: no visible style change on focus, focused element fully covered by a fixed/sticky layer | ch15 A2, A18 |
| `scripts/text-spacing.js` | applies the 1.4.12 spacing and lists text that becomes clipped (and text clipped even before) | ch15 A19 |
| `scripts/live-regions.js` | two calls around an action: what reached a live region, what appeared visibly without one | ch16 FB4, ch15 A23 |
| `scripts/wcag22-inventory.js` | password/OTP fields (`autocomplete`, paste blocked), CAPTCHA, drag-capable widgets, help links and their order, filled vs empty fields | ch15 A20–A22, A24 |
| `scripts/mark-elements.js` | draws numbered marks over visible elements and returns number → selector; second call removes them | localizing screenshot findings |
| `scripts/code-smells.sh` (shell, not a page function) | grep-able source leads S01–S35 and repo checks R1–R2 (focus removed, clickable divs, zoom blocked, `transition: all`, plural hacks, colour literals, reduced-motion coverage, theme mechanisms); run `bash scripts/code-smells.sh <dir> [max-hits]` on the repo, not in the browser | ch03–ch05, ch07, ch13–ch15, ch18; confirm each lead per code-smells.md |

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
| 13 | `browser_evaluate` with `scripts/axe-run.js` (needs network access to cdnjs; blocked by strict CSP) | WCAG violations with selectors; needs-review items |
| 14 | `browser_evaluate` with `scripts/a11y-transcript.js` | reading-order transcript for the accessibility lens |
| 15 | `browser_evaluate` with `scripts/focus-walk.js`, then confirm one flagged item with real `browser_press_key` Tab + screenshot | visible focus, focus obscured |
| 16 | `browser_evaluate` with `scripts/text-spacing.js` and `scripts/wcag22-inventory.js` | 1.4.12, 3.3.8, 2.5.7, 3.2.6, 3.3.7 facts |
| 17 | `scripts/live-regions.js` → perform the save/submit on a dev form → `scripts/live-regions.js` again | status messages (4.1.3) |
| 18 | walkthrough (next section) | Observed findings |

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
- **WCAG 2.2 checks from source** (the same facts the scripts collect, read from code; Measured when read directly):
  - fixed/sticky elements (headers, cookie bars, chat buttons) and their heights vs `scroll-padding-*` → A18 focus obscured;
  - `:focus { outline: none }` without a replacement style → A2;
  - text in boxes with fixed `height` + `overflow:hidden`, `text-overflow`, or `line-clamp` → A19 text spacing;
  - `paste` handlers that call `preventDefault`, `onpaste="return false"`, missing `autocomplete` on password/OTP fields, CAPTCHA embeds → A20;
  - `draggable`, drag/sortable libraries, sliders without inputs or buttons → A21;
  - scripts that insert toasts, errors or status text: is the container `role=status/alert` or `aria-live`? → A23 / FB4.
- **No JavaScript behaviour is observable from static files**: you can read what a script *would* do (a `preventDefault` on paste is Measured from the code), but whether it runs, and anything that happens after a click, stays *Inferred*.

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

## Reading `axe-run.js`
`violations` are Measured findings (cite rule id and WCAG SC). `needsReview` (axe "incomplete") are things axe could not decide, such as contrast over images: list them under *Needs verification* unless you check them yourself. Absence of violations proves little: in GOV.UK's test of 142 seeded barriers, axe found 29%. axe accepts a placeholder as an accessible name, so placeholder-only fields pass axe but fail `metrics.js` `placeholderOnly` and FM3.

## Reading `a11y-transcript.js`
Read the transcript top to bottom as a screen-reader user would hear it, and judge each line against its neighbours: would "button, [no name]" next to a product name make sense? Does "textbox, Verification code" say what format is expected? Are two links called "Edit" distinguishable? Is a heading level skipped? Plain questions like these found more problems than quoting WCAG text in a screen-reader-grounded LLM study (ScreenAudit, 2025).

| Field | Check | Signal |
|---|---|---|
| `transcript[]` | A4, A5, A9, W6, N8 | missing or vague names, wrong roles, heading structure, states not exposed (`expanded`, `invalid`, `required`) |
| `unnamedInteractive` | A4 | controls with no accessible name |
| `positiveTabindex` | A1, A6 | any positive `tabindex` breaks natural order |
| `tabOrderUpwardJumps` | A6, FM19, 2.4.3 | Tab moves more than 150 px back up the page (fixed and sticky layers excluded) |

The name and role computation is an approximation; confirm surprising lines in `browser_snapshot`. It is not a substitute for testing with a real screen reader.

## Reading `focus-walk.js`
| Field | Check | Signal |
|---|---|---|
| `noVisibleFocusChange` | A2, 2.4.7 | no outline, shadow, border, background, colour or underline change when focused |
| `fullyObscured` | A18, 2.4.11 | focused element entirely under an opaque fixed/sticky layer (`by`); partial cover passes 2.4.11 |
| `partlyCovered` | note only | fails 2.4.12 (AAA), not AA |
| `overlays`, `scrollPaddingTop` | fix hint | `scroll-padding-top/bottom` equal to the layer's height usually fixes 2.4.11 |
Programmatic focus can differ from keyboard focus (`:focus-visible` heuristics), so confirm at least one flagged element with real Tab presses and a screenshot before rating it.

## WCAG 2.2 procedures: `text-spacing.js`, `live-regions.js`, `wcag22-inventory.js`
| Output | Check | Fails when |
|---|---|---|
| `text-spacing.js` `newlyClipped` | A19, 1.4.12 | text is cut off once line height 1.5, letter spacing 0.12em, word spacing 0.16em and 2em paragraph spacing apply; `clippedEvenWithoutSpacing` is content loss regardless |
| `live-regions.js` `visibleButNotAnnounced` | FB4, A23, 4.1.3 | a toast, error or status appeared but not inside `role=status/alert` or `aria-live` |
| `wcag22-inventory.js` `auth.fields[].pasteBlocked`, `autocomplete` | A20, 3.3.8 | paste is blocked, or `autocomplete="current-password"`/`one-time-code` is missing so password managers cannot help; a CAPTCHA has no alternative |
| `dragCandidates` | A21, 2.5.7 | a drag-capable widget has no single-pointer alternative (buttons, inputs, menu) — check by looking |
| `helpMechanisms` | A22, 3.2.6 | run on 3+ pages; the same help link changes relative order or region |
| `redundantEntry` | A24, 3.3.7 | on a later step of a flow, a field asks again for data entered earlier |
These scripts collect facts; the agent confirms and records the finding as Observed.

## Marking screenshots: `mark-elements.js`
Run it, take the screenshot, run it again to remove the marks. Refer to elements as "mark 12 (`button.btn-primary`)". Numbered marks located elements far better than asking a model for coordinates on a bare screenshot (UICrit: IoU 0.22 vs 0.004). Elements hidden under overlays still get marks, which itself reveals covered controls.

## Limits (state these in the report)
- Contrast uses the nearest opaque ancestor background. Gradients, images, overlays, `backdrop-filter`, canvas/WebGL text and modern colour syntaxes (`oklch()`, `color()`) need a manual check on the screenshot.
- The name check approximates the accessible-name algorithm; confirm odd results in `browser_snapshot`.
- Target size measures the element box, not an extended hit area (pseudo-elements, padding on a parent).
- Off-grid spacing and edge counts are hints, judged against the project's own tokens.
- Canvas/WebGL interfaces: DOM metrics cover only the surrounding chrome; audit canvas overlays from screenshots.
- No screen-reader or real-device run happened unless the report says so; list those checks under *Needs verification*.
- `form-layout.js` label position and diagram adjacency are geometric heuristics, not a semantic reading-order check.
- `text-spacing.js` and `mark-elements.js` inject a `<style>`/overlay; a strict Content-Security-Policy can block injected styles and axe's script. Say so instead of reporting a pass.
