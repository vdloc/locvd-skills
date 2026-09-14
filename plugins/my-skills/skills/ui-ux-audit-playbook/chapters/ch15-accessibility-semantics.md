# Ch 15: Accessibility, Semantic Markup & Universal Usability

Sources: [WSG] ch5–7, ch9–12 · [PUI] ch1, ch3, ch7–8 · [TID] ch1 Keyboard Only, ch5 accessibility, ch8 keyboard · [KUL] contrast & keyboard · [RUI] colour

## Core Idea
Accessibility is usability for everyone, including temporary and situational limits: semantic native HTML, perceivable content (contrast, alternatives, no colour-only meaning), keyboard/touch/AT operability with visible focus, content that adapts to user settings and zoom, and clear, forgiving interaction. It's also a legal requirement in many places and good for business [PUI].

## Frameworks Introduced
- **Good accessibility = great usability** [PUI]: design for permanent (blindness, low vision, colour blindness, motor, cognitive), temporary (injury) and situational (glare, one hand) disabilities; target WCAG 2.1 AA minimum; include disabled users in testing.
- **Assistive technology awareness** [PUI][WSG]: *screen readers* (keyboard step-through or swipe/drag; hear headings/links/buttons out of context) and *screen magnifiers* (see a small portion — keep related things close, left-align buttons, don't put critical actions far right) — magnifiers more common than readers [PUI]; also voice control, switch devices, high-contrast modes, inverted colours, user style sheets [WSG][TID].
- **Semantic markup** [WSG]: tags for meaning (h1–h6 by hierarchy, p, ul/ol/dl, table with th, blockquote, cite, abbr, time, figure/figcaption, em/strong); HTML5 landmarks (`header`, `nav`, `main`, `aside`, `footer`) / ARIA landmarks; logical source order (identity → nav → main → related → footer) so unstyled pages, screen readers and SEO work; no visual characters as decoration.
- **Native first; ARIA as last resort** [WSG]: WCAG 4.1.2 *Name, Role, Value* is automatic for native controls. Custom widget checklist: focusable · operable by keyboard · expected keys (Space/Enter for buttons, arrows in menus/tabs) · clear focus indication · associated text label · correct role · states & properties (`aria-expanded`, `aria-checked`, `aria-invalid`) · colour contrast · works in high-contrast mode. Follow WAI-ARIA Authoring Practices patterns.
- **Buttons vs links** [WSG]: links navigate, buttons act; don't fake one with the other.
- **Keyboard Only** [TID][WSG][KUL]: every feature reachable & operable by keyboard; logical Tab order; arrow keys in lists; Enter/Space activation; default buttons; shortcuts documented; drag-and-drop has a keyboard alternative; test with mouse unplugged; design focus states.
- **No hover-only interactions** [WSG]: touch & keyboard users can't hover — menus/tooltips must open on click/focus.
- **Perceivable** — contrast (4.5:1 text, 3:1 large text & UI components/meaningful graphics; APCA as supplementary) [PUI][RUI][KUL]; never colour alone (links underlined, errors with icon+text, charts with lightness/labels) [all]; alt text (functional says what it does, decorative `alt=""`, complex → caption + data) [WSG]; captions, transcripts, audio description; no autoplay [WSG].
- **Adaptable** [WSG]: relative units; respect user default font size; reflow at 200–400% zoom without horizontal scroll; never disable pinch zoom; support OS high-contrast/forced colours [TID]; `prefers-reduced-motion`.
- **Operable targets** [PUI][TID]: ≥44–48px, spacing ≥8px; extend hit area beyond small visuals.
- **Understandable** [PUI][WSG]: plain language; consistent navigation & terminology; labels & instructions visible (not placeholder); errors identified in text with suggestions; required fields programmatically marked; avoid disabled buttons that give no reason (not focusable, low contrast) [PUI].
- **Headings & links read out of context** [PUI][WSG]: screen-reader users skim lists of headings and links — make each descriptive and front-loaded.
- **Media players** [WSG]: all controls keyboard-operable with visible focus and announced names; caption toggle reachable; captions accurate.
- **Enterprise / long-use apps** [TID]: support high-contrast themes; reduce fatigue (tone down saturation & contrast extremes in all-day tools); strip distractions in high-stress UIs.
- **Testing** [WSG][PUI]: keyboard-only pass; screen reader pass (VoiceOver+Bluetooth keyboard on iOS, TalkBack, NVDA); zoom 200%; contrast tools (Stark, A11Y Contrast Checker [KUL]); grayscale/colour-blind simulation; validator; usability tests with diverse users.

## Key Concepts
- **WCAG 2.x AA**; **POUR** (perceivable, operable, understandable, robust).
- **Accessible name / role / state**.
- **Landmark**; **source order**; **focus-visible**; **skip link**.
- **Screen reader / screen magnifier**.
- **Reflow**; **forced-colors / high contrast mode**.

## Mental Models
- If you use the right HTML element, most accessibility is free; every custom widget is a maintenance contract [WSG].
- Try the interface with one sense or input removed (no mouse, no colour, no sight, 400% zoom).
- A11y fixes almost always improve the experience for everyone (captions in noisy rooms, contrast in sunlight).

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| A1 | Keyboard reach | All interactive elements reachable via Tab in logical order; no traps (except intentional modal trap with Esc) | TID, WSG |
| A2 | Focus visible | Clear focus indicator ≥3:1 on all focusable elements; not removed by `outline:none` | WSG, PUI |
| A3 | Native semantics | Buttons/links/inputs are native elements; no clickable divs/spans | WSG |
| A4 | Names & states | Every control has accessible name (label, text, `aria-label`); states exposed (expanded, selected, invalid) | WSG |
| A5 | Landmarks & headings | header/nav/main/footer present; one h1; heading levels not skipped for style | WSG |
| A6 | Skip link / source order | Skip-to-content link; DOM order matches visual reading order | WSG |
| A7 | Contrast | Text 4.5:1; large text & UI/graphics 3:1 | PUI, RUI, KUL |
| A8 | Colour independence | Links, errors, required fields, status, charts have non-colour cues | PUI, WSG, RUI |
| A9 | Text alternatives | Informative images alt; decorative `alt=""`; icon-only buttons named; charts summarised | WSG |
| A10 | Media | Captions/transcripts; no autoplay; accessible player controls | WSG |
| A11 | Zoom & reflow | 200% text zoom & 320px width without loss or horizontal scroll; pinch zoom enabled | WSG |
| A12 | Hover/gesture independence | Hover/swipe/drag features have click/tap/keyboard equivalents | WSG, TID |
| A13 | Forms | Programmatic labels; required indicated in text & code; errors announced & linked; hints associated | WSG, PUI |
| A14 | Targets | ≥44px (min 24px with spacing) | PUI, TID |
| A15 | Motion & time | Respects reduced motion; no flashing; timeouts extendable | (WCAG; TID animation guidance) |
| A16 | Custom widgets | Follow ARIA APG keyboard models (menus, tabs, dialogs, comboboxes) | WSG |
| A17 | High contrast | Usable in forced-colors mode (borders/icons don't vanish) | TID, WSG |

## Fix Recipes
```html
<a class="skip-link" href="#main">Skip to main content</a>
<header>…</header>
<nav aria-label="Main">…</nav>
<main id="main" tabindex="-1"><h1>Invoices</h1>…</main>
<footer>…</footer>

<button type="button" class="icon-btn" aria-label="Close dialog"><svg aria-hidden="true" focusable="false">…</svg></button>
<button type="button" aria-expanded="false" aria-controls="filters">Filters</button>
<img src="chart.png" alt="Revenue rose 18% from Q1 to Q4 2025"> <!-- plus data table for details -->
<img src="divider.svg" alt="">
```
```css
.skip-link{ position:absolute; left:-9999px; } .skip-link:focus{ left:1rem; top:1rem; z-index:9999; }
:focus-visible{ outline:3px solid var(--blue-500); outline-offset:2px; }
a:where(p a, li a){ text-decoration:underline; text-underline-offset:.15em; }
@media (forced-colors: active){ .btn, .input{ border:1px solid ButtonText; } }
@media (prefers-reduced-motion: reduce){ *{ animation-duration:.01ms !important; transition-duration:.01ms !important; } }
```
1. **`<div onclick>`** → `<button>`; **`<a href="#">` actions** → `<button>`.
2. **`outline: none`** → `:focus-visible` style meeting 3:1.
3. **Icon-only controls** → visible label or `aria-label` + `aria-hidden` SVG.
4. **Placeholder-only inputs** → `<label for>`; hints via `aria-describedby`.
5. **Custom select/menu** → native `<select>`/`<details>` or APG-compliant combobox/menu button.
6. **Colour-only error** → text message + icon + `aria-invalid` + summary with focus.
7. **Modal** → `<dialog>`/proper focus trap, labelled title, Esc closes, focus returns to trigger.
8. **Zoom blocked** → remove viewport restrictions; replace fixed px containers with fluid/max widths.

## Conflicts & Context
- Book-era references: [WSG] cites WCAG 2.0 and [PUI] WCAG 2.1 AA; current baseline is WCAG 2.2 AA (adds focus appearance/not obscured, target size minimum 24×24, dragging alternatives, accessible authentication, consistent help, redundant entry). Design standard of 44–48px targets exceeds it.
- APCA [PUI] is draft — use alongside, not instead of, WCAG 2 ratios for compliance.

## Anti-patterns
- **Removing focus outlines** for aesthetics.
- **Disabling pinch zoom**; **removing link underlines** for looks [WSG].
- **Hover-only menus/tooltips** [WSG].
- **Custom controls without roles/keys** [WSG].
- **Placeholder labels; colour-only errors** [PUI].
- **Text characters as decoration** read aloud [WSG].
- **Disabled buttons that can't be focused or explained** [PUI].

## Worked Example
*Custom checkbox [WSG]:* A styled `<span class="checkbox">` toggled by click. Problems: not focusable, no role/state, Space does nothing, screen readers announce nothing, invisible in high-contrast mode. Fix: use a real `<input type="checkbox" id="terms">` with `<label for="terms">I agree to the terms and conditions</label>`; visually style via `appearance:none` + brand colour for checked state, 3:1 border, `:focus-visible` ring; now name ("I agree…"), role (checkbox), state (checked) are exposed automatically and Space toggles it — with far less code to maintain.

## Key Takeaways
1. Native HTML first; ARIA only to fill true gaps.
2. Keyboard, focus, names, states — test without a mouse.
3. Contrast + non-colour cues + alt text + captions.
4. Respect zoom, text size, motion and contrast preferences.
5. Headings, links, labels must make sense out of context.

## Connects To
- **ch05** contrast · **ch09** accessible forms · **ch08** buttons vs links · **ch07** alt/media · **ch14** zoom & touch
