# Code smells: static source detection

Grep-able patterns that point at a known defect, each mapped to the chapter check that decides it. Use them when you have the source (repo, PR, static files), alongside the rendered evidence in [evidence.md](evidence.md), never instead of it. Run `bash scripts/code-smells.sh <dir> [max-hits]` for S01–S35 and R1–R2; the rest need reading. Design-generation defaults (eyebrow labels, gradients, card kits, a given radius or press scale) are deliberately absent: they are choices to question while designing (design-workflow.md), not defects.

**Every hit is a lead, not a finding.** Read the line in context, confirm it against the named check, and only then record it as *Measured* with `path:line`. A deliberate, consistent project convention is not a smell; the same detail done two ways inside the project is. House-style values (press scale, easing curves, stagger timings) are never smells. [JK]

## Scanned by `scripts/code-smells.sh`
| ID | Pattern | Check | Fix | Known false positives |
|---|---|---|---|---|
| S01 | `outline: none`, `outline-none`, `outline: 0` | ch15 A2 | Restore the browser ring or add a verified `:focus-visible` one (≥3:1) | A same-line replacement (`focus-visible:ring-*`, `focus:shadow-*`, `focus-visible:outline-2`) is filtered out, but `focus-visible:outline-none` is kept; a replacement in another rule still needs reading; non-focusable panels |
| S02 | `<div/span/li/td/img onClick=` | ch15 A3 | `<button type="button">`, or `<a href>` when it navigates | Click-outside / stopPropagation wrappers whose child is a real control |
| S03 | `role=` button, tab, menuitem, option, checkbox, switch or link | ch15 A16 | Native element, or implement the APG key map (Enter/Space, arrows, Esc) | Library components that already implement APG |
| S04 | positive `tabindex` | ch15 A1 | Fix DOM order; `0` to join, `-1` for programmatic focus | none |
| S05 | `disabled={!isValid}` and similar | ch08, ch15 A13 | Keep submit enabled, validate on submit, focus the first invalid field | Disabled only while the request is in flight (`isSubmitting`) |
| S06 | `<img` with no `alt` | ch15 A9 | `alt=""` if decorative, otherwise describe the purpose | `alt` set by a spread prop (`{...props}`) |
| S07 | `user-scalable=no`, `maximum-scale=1` | ch14 M1 | Remove; fix iOS input zoom with 16px inputs (ch04 T21) | none |
| S08 | `aria-live="assertive"` | ch16, ch15 A23 | `role="status"` for everything but urgent errors | A genuine session-expiry or data-loss alert |
| S09 | `{msg && <div role="status">` | ch15 A23 | Render the empty region first, then update its text | Regions inside a container that is itself always mounted and announced |
| S10 | `href="#"`, `href="javascript:"` | ch15 A26 | `<button>` for actions, a real URL for navigation | Skip-link targets written as `href="#main"` are not matched |
| S11 | paste blocked (`onPaste` + `preventDefault`) | ch09, ch15 A20 | Allow paste; users paste passwords and one-time codes | Rich-text editors sanitising paste (check they still insert it) |
| S12 | `transition: all`, `transition-all`, `will-change: all` | ch18 AN11 | Name the properties that change | none (low severity; often a component-library default: report once at the shared component) |
| S13 | `line-height` in `px/rem/em` | ch04 T15 | Unitless value | A deliberate fixed-row grid (still check wrapping text) |
| S14 | `letter-spacing` in `px` | ch04 T21 | Same value in `em` | none |
| S15 | `font-variation-settings: "wght"`, `font-feature-settings: "tnum"/"zero"` | ch04 T20 | `font-weight`, `font-variant-numeric: tabular-nums / slashed-zero` | Custom axes (`GRAD`) and features without a property (`ss01`) are fine |
| S16 | `font-weight: 100–300`, `font-thin/light` | ch04 T4 | 400+ below ~28px | Large display text |
| S17 | `text-align: justify` | ch04 T8 | `text-align: start` | Editorial layouts with hyphenation |
| S18 | `user-select: none`, `select-none` | ch04 T21 | Remove; keep only on drag or gesture surfaces | Draggable handles, canvases, sliders, and touch controls (buttons, chips, tabs) where it stops long-press label selection (ch14 M18) |
| S19 | `text-decoration-skip-ink: none` | ch04 T21 | Remove; tune `text-underline-offset` instead | none |
| S20 | `width: 100vw`, `height: 100vh`, `w-screen`, `h-screen` | ch03 L17 | `width: 100%`; `100dvh` for full-height mobile panes | Desktop-only surfaces; `min-h-screen` is not matched (check it on mobile) |
| S21 | `fill="#…"` / `stroke="#…"` in SVG markup | ch07 I13 | `currentColor`, state via CSS | Multicolour brand marks and illustrations |
| S22 | hex / `rgb()` literal in a component file | ch05 C13 | Use or add a semantic token, in the project's notation | `theme-color` meta, chart palettes defined once, canvas drawing, hex-looking fragment links outside `href`/`to` (`"#bad"`) |
| S23 | `n === 1 ? "" : "s"`, `"You have " + n + " …"` | ch13 W15 | One ICU message with a plural argument | Log or debug strings never shown to users |
| S24 | link/button text "Click here", "here", "Learn more", "Read more" | ch13 W6 | Name the destination; suffix repeated "Learn more about exports" | A single "Learn more" with a programmatic name that adds context (`aria-describedby`) |
| S25 | "Oops", "Something went wrong" | ch13 W10, W17 | Say what failed and the next step | none |
| S26 | "Are you sure", buttons `OK`/`Yes`/`No` | ch13 W17, ch08 | Title names action + object; verb + object buttons | Native `confirm()` in dev-only tooling |
| S27 | "successfully", "Please" in UI strings | ch13 W1 | Cut them ("Changes saved") | Legal or support copy where politeness is required |
| S28 | `aria-label` naming the glyph ("Trash icon", "X") | ch15 A4, ch13 | Name the action: "Delete project", "Close dialog" | none |
| S29 | `...` in rendered text | ch04 T21 | `…` | Code samples, i18n placeholders |
| S30 | text colour with alpha (`text-*/50`, `color: rgba(`) | ch05 C14 | Measure the rendered pair, or use a solid token | Disabled/inactive text (exempt from 1.4.3), decorative text |
| S31 | entrance from `scale(0)` / `scale-0` | ch18 AN10 | Start at ≥0.9 with opacity 0 | Collapsing a decorative dot or a progress fill on purpose |
| S32 | press scale below 0.95 (`whileTap={{ scale: 0.9 }}`, `active:scale-90`) | ch18 AN10 | A subtle 0.95–0.98, one value product-wide (cheatsheet conflict) | Deliberately playful toy UI; 0.95–0.98 itself is never flagged |
| S33 | `addEventListener("scroll"`, `onScroll={` | ch18 AN7 | Scroll or view timelines, `IntersectionObserver`, or rAF-throttled reads with no layout writes | Scroll handlers that only save position or load more content |
| S34 | `autoFocus` | ch14 M17 | Only on desktop for the single primary input of a focused task; never on mobile, never on page load of a content page | A dialog's first field when the dialog itself handles focus |
| S35 | `onClick` that calls `router.push` / `navigate(` / `location.href =` | ch15 A26 | `<a href>` / the router's `<Link>` so Cmd/Ctrl/middle-click and "open in new tab" work | Navigation after a successful form submit or a confirm step |
| R1 | files with animation vs files honouring reduced motion | ch18 AN4 | Gate movement behind `prefers-reduced-motion: no-preference` (or `motion-safe:`, `MotionConfig reducedMotion="user"`) | Tailwind `animate-spin` spinners count as animation but are essential progress |
| R2 | theme via `prefers-color-scheme` **and** via a class/attribute | ch05 C16 | One mechanism throughout | `theme-color` meta media queries, a class strategy that reads the OS setting once |

## Read, don't grep
These need the surrounding code or the rendered page; look for them while reading components:
| Look for | Check |
|---|---|
| `animation:` on `:hover`, `.open` or another toggled class | ch18 AN8 |
| `opacity: 0` in a base rule that only an `animation` reveals | ch18 AN10 |
| `-webkit-line-clamp` without `display: -webkit-box` | ch04 T18 |
| truncation (`truncate`, `text-overflow`) with no way to the full value | ch04 T18, ch03 L18 |
| a timer, counter, price or numeric column without `tabular-nums` | ch04 T17 |
| a padded parent and child with the same radius | ch06 D11 |
| a `box-shadow: 0 0 0 1px` ring with no `border` beside it | ch06 D12 |
| `:hover` styles outside `@media (hover: hover)` (plain CSS, Tailwind 3) | ch14 M14 |
| a scrollable dialog/drawer/menu without `overscroll-behavior` | ch14 M15 |
| a sticky header with no `scroll-padding-block-start` | ch03 L19 |
| `env(safe-area-inset-*)` without `viewport-fit=cover` | ch03 L19 |
| a grid track `1fr` or flex child holding long text without `minmax(0,1fr)` / `min-width: 0` | ch03 L17 |
| a fixed `height` on a box that holds text | ch03 L17 |
| `@media (max-width …)` inside a reusable component | ch03 L20 |
| `left`/`right` margins, padding or insets on UI that ships RTL | ch03 L16 |
| directional icons with no RTL flip | ch07 I14 |
| `var(--blue-600)` / `bg-blue-600` in a component when semantic tokens exist | ch05 C13 |
| a status hue within ~15° of the accent hue | ch05 C15 |
| colour tokens under both `prefers-color-scheme` and `.dark` | ch05 C16 |
| a toggle label starting "Don't", "Disable", "Hide" | ch13 W16 |
| `toLocaleDateString()` with no locale, dates built from `getMonth()` | ch13 W15 |
| client-side route change without `document.title` and focus update | ch15 A25 |
| tooltip on a natively `disabled` control | ch15 A27 |
| `aria-hidden` on an ancestor of a button, link or input | ch15 A4 |
| a drag interaction (`onDragStart`, a dnd library) without a button alternative | ch15 A21 |
| a new variant styled for some states but not hover/focus-visible/active/disabled/loading | ch12, change-review.md §6 |
