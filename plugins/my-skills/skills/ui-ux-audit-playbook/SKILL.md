---
name: ui-ux-audit-playbook
description: "Use when auditing, reviewing, critiquing or heuristic-evaluating an existing web or mobile UI (live URL, dev server, screenshot, HTML/CSS, design export or PR), or when building screens, components and design tokens that must meet UI/UX and WCAG 2.2 AA standards: layout, spacing, typography, colour and contrast, buttons, forms, navigation, tables, modals, toasts and alerts, motion, AI chat panels, accessibility, deceptive patterns. Produces severity-ranked, evidence-tagged findings with token-level fixes, grounded in Refactoring UI, Practical UI, Designing Interfaces, Web Style Guide, Kuleszo's UI Components and a wider design-book library."
---

<!-- argument-hint: [audit <target> | implement <feature> | topic | chNN] -->

# UI/UX Audit & Implementation Playbook

An expert-review playbook: measure before judging, test each fact against a named check, and report only what the evidence supports. Book tags like [PUI] are listed under *Sources*.

## How to use this skill
- **Audit**: "audit/review/critique this page, app, screenshot or PR". Follow the *Ground rules* and *Audit workflow*, loading only the chapters for lenses that apply.
- **Implement**: "build/redesign X". Follow the *Implement workflow*; read ch12 plus the relevant topic chapters first.
- **Topic**: a question about `forms`, `contrast`, `toasts`, `navigation`… Read the matching chapter via the *Topic index*.
- **Chapter**: "show ch09". Read that file.

Every chapter has **Audit checks** (IDs such as FM3, C1) with pass criteria, **Fix recipes** (CSS/HTML) and the source conflicts. Read the chapter before asserting a threshold that is not in *Core rules* below.

---

## Ground rules (every audit)
LLM auditors fail in known ways: false positives about interactions they never ran, generic findings without an element, duplicates, unreliable severity, and missed control/recall/efficiency/error-recovery problems (see `research/llm-audit-reliability.md`). These rules exist to stop that.

1. **Tag the evidence of every finding.**
   - **Measured**: a script or tool produced the value, or you read it directly from the source code (contrast ratio computed from declared colours, `user-scalable=no` in the viewport meta, a missing `<label>`).
   - **Observed**: you exercised the interaction or saw the state (pressed Tab, opened the menu, triggered the error, captured that screenshot).
   - **Inferred**: a judgement from a visual impression or an assumption about behaviour that was not exercised (what happens after a click, a colour estimated from a screenshot).
2. **Inferred findings are capped at Medium** and go under *Needs verification*, each with the test that would confirm it. Never state as fact what happens after an action you did not perform (loading, confirmation, error recovery, focus return).
3. **Name the element**: a selector, component, or quoted text, plus screen and breakpoint. A finding that cannot name an element ("high cognitive load") is dropped or rewritten until it can.
4. **Cite the rule**: a check ID (e.g. `ch09 FM3`) or a named principle. If no check covers it, label it *judgement* and give the reason.
5. **Show the severity reasoning** using the *Severity* table: impact, then frequency/reach and persistence.
6. **One finding per root defect.** Repeated symptoms of one cause are merged and counted ("14 off-scale values → no spacing scale").
7. **State the method's limit**: this is an expert review. It predicts problems; it does not prove users have them. Recommend a user test for each systemic Critical/High.
8. **Read-only**: never submit real forms, press destructive controls, or change persisted settings. Trigger validation only on dev or non-persisting forms.

## Audit workflow
1. **Frame**: users and top 3 tasks; platform; screen types (overview / focus / make / do [TID]); constraints (brand, design system, WCAG target, default 2.2 AA). Note whether the product serves mainly **existing users** (radical changes to learned navigation and interaction cost them) or **new users** (redesign freely) [NAT], and what the business needs users to do [MAR].
2. **Inventory**: list the screens/routes and states in scope: empty, loading, error, success, long and ugly data, logged-out, each theme [DUI]. Audit states, not just the default render.
3. **Collect evidence**: follow [evidence.md](evidence.md). Live or dev-server targets: screenshots at 375/768/1280 px in each theme, accessibility snapshot, then run the scripts in `scripts/`: `metrics.js` (type, contrast, targets, spacing), `style-inventory.js` (style, colour, radius, border, shadow, control-height census), `alignment-grid.js` (edge and gap counts), and `form-layout.js` on any form. Static files or screenshots: derive the same facts from the source, or mark the check *needs verification*. Never invent a measurement.
4. **Walk the top tasks** (the step automated and LLM review skip). For each top task:
   - **Control and freedom**: try Back, Cancel, Esc, Undo and closing each overlay; check that nothing traps you or loses input.
   - **Recognition over recall**: are options, current values and context visible, or must the user remember them from a previous screen?
   - **Efficiency**: defaults, autofill, keyboard paths, shortcuts, bulk actions for repeated work.
   - **Error recovery**: trigger validation (dev or non-persisting forms only), then read the message, its placement and focus behaviour.
   - **Keyboard**: Tab through the task; note order, visible focus, traps.
   Record these as *Observed*. If you cannot run the UI, list them under *Needs verification*.
5. **Run the lenses in order** (structure before paint). Load the chapter, test its checks against the evidence:

   | # | Lens | Chapter | # | Lens | Chapter |
   |---|---|---|---|---|---|
   | 1 | IA & navigation | ch10 | 11 | Images, icons, media | ch07 |
   | 2 | Interaction principles & consistency | ch17 | 12 | Depth & polish | ch06 |
   | 3 | Hierarchy | ch02 | 13 | Copy | ch13 |
   | 4 | Layout & spacing | ch03 | 14 | Mobile & responsive | ch14 |
   | 5 | Typography | ch04 | 15 | Accessibility | ch15 |
   | 6 | Colour & contrast | ch05 | 16 | Feedback, status & notifications | ch16 |
   | 7 | Buttons & actions | ch08 | 17 | Motion | ch18 |
   | 8 | Forms | ch09 | 18 | AI / conversational surfaces (if any) | ch19 |
   | 9 | Lists, tables, data | ch11 | 19 | Ethics & deceptive patterns | ch20 |
   | 10 | Components & system | ch12 | 20 | Foundations sanity check | ch01 |

6. **Record each finding**: ID · severity with its one-line reason (e.g. "High: fails WCAG 1.4.11 on every checkout field") · evidence tag · where (screen, breakpoint, selector) · evidence (measurement or what you did and saw) · rule (check ID / source) · user impact · fix (concrete, token-level) · effort (S/M/L).
7. **Verify and deduplicate** (repeat until clean):
   - Each Critical/High: is the evidence tag Measured or Observed, and is the element named? If not, downgrade to Medium and move it to *Needs verification*.
   - Merge findings that share one cause; delete any that the evidence contradicts (e.g. `alt=""` on a decorative image is correct).
   - Each severity has its reasoning written down.
8. **Diagnose root causes** [MAR][DUI]: cluster the symptoms; for each cluster, name the most likely cause that explains the most findings and the fix at token or component level. Order fixes by severity × reach, and put widespread, cheap fixes first.
9. **Report** using the template below.

### Severity
Start from **impact**, then adjust one level for **frequency/reach** (core path every visit, or most users → up; rare path → down) and **persistence** (repeated pain → up; learnable once → down). Any WCAG A/AA failure is at least **High**; it is **Critical** when it stops some users from completing a core task. Inferred findings stop at Medium.

| Level | Impact | Examples |
|---|---|---|
| **Critical** | Blocks a core task (for everyone or for a group such as keyboard or screen-reader users), or causes loss of data or money | unlabeled fields, keyboard trap, body text below 3:1, zoom disabled, destructive action without recovery |
| **High** | Any other WCAG A/AA failure on a core flow; significant errors, confusion or exclusion; blocks a secondary task | colour-only errors (1.4.1), targets under 24 px (2.5.8), disabled submit without reason, two primaries, hidden nav |
| **Medium** | Friction, inconsistency, slower scanning | off-scale spacing, ten font sizes, vague link text, weak hierarchy |
| **Low** | Polish | shadow inconsistency, minor misalignment, missing empty-state delight |

### Report template
```
# UI/UX audit: <product/screen> (<date>)
Scope · Users & top tasks · Audience (existing/new) · Method (tools, breakpoints, states, what was exercised) · Standard (WCAG 2.2 AA + playbook)
Method limit: expert review; findings are predictions to validate with users, not test results.
## Summary: 3–5 bullet verdict | Critical n · High n · Medium n · Low n
## Systemic issues (root cause → findings it explains → token/component fix)
## Findings
| ID | Sev: why (impact; reach/persistence) | Evidence | Where | Issue & evidence | Rule (check/src) | Fix | Effort |
## Quick wins (≤1 day)
## Recommended tokens/components
## Needs verification (finding → test that would confirm it)
## Suggested user validation (task test, 5-second test, or analytics check per systemic issue)
```

## Implement workflow
1. **Start from the feature, not the shell** [RUI]; list real content and edge cases: longest name, 0/1/many items, errors [PUI].
2. **Tokens first** (ch12): spacing scale, type scale, colour palette with semantic roles and dark mode, radii, elevation, breakpoints, motion durations and easing (ch18). No raw values in components.
3. **Structure**: IA and labels (ch10) → semantic HTML, landmarks, source order (ch15) → grid and widths (ch03).
4. **Greyscale layout**: hierarchy through size, weight and spacing (ch02), then add colour with purpose (ch05).
5. **Components with every state**: default, hover, active, focus-visible, disabled, loading, error, empty, success (ch08, ch09, ch12); feedback channel chosen per ch16.
6. **Interaction review** (ch17): undo/cancel paths, no hidden modes, consistent conceptual model. **AI surfaces** follow ch19.
7. **Copy** (ch13) → **responsive/mobile** (ch14) → **motion** with reduced-motion fallback (ch18) → **polish** (ch06–07) → **ethics check** (ch20).
8. **Verify**: run the audit checks for every chapter touched, and run `scripts/metrics.js` and `scripts/style-inventory.js` on the result. Include keyboard, contrast, zoom and long-content tests.

---

## Core rules (usable without loading chapters)
**Principles**: minimise usability risk; every detail needs a reason; minimise interaction cost (Fitts, Hick) and cognitive load; use conventional patterns (Jakob's law) and never change a known pattern's *behaviour*; systematise every value; design all states. Beauty earns trust in ~50 ms, never at the cost of access. [PUI][RUI][TID][WSG]

**Interaction** (ISO 9241-110): suits the task, self-descriptive, matches expectations, learnable, controllable (interrupt, resume, undo, pace), robust to use errors, engaging. No hidden modes. Consistency on three levels: concept, action, appearance. [FRZ][NIE][UXM]

**Hierarchy**: decide the importance order first; de-emphasise competitors; colour and weight before size; ≤1 primary action; labels last resort; squint test. [RUI][PUI]

**Space**: non-linear scale (4·8·12·16·24·32·48·64·80·96); more space between groups than within; start generous; containers only when proximity, similarity or alignment fail; few distinct alignment edges and gap values; 12-col grid for regions, max-width for components; design for ugly data. [RUI][PUI][KUL][FRZ]

**Type**: one sans family (≤2), 2 weights, a hand-tuned scale in px/rem; 16 px UI, 18 px long-form; 45–75 ch; line-height ≥1.5 body, tighter headings; left-aligned; sentence case; tracked caps only for tiny labels; ≤3–4 text styles per screen. [RUI][PUI][WSG][DUI]

**Colour**: greyscale first; 9-step shades; semantic roles (brand/interactive, text strong/weak, stroke strong/weak, fill, bg, error/warning/success); brand colour only on interactive elements; WCAG 2 contrast 4.5:1 text, 3:1 large text and UI; never colour alone; tinted greys; dark mode = lighter elevated surfaces + remapped tokens, desaturated accents. [RUI][PUI][UXM]

**Actions**: primary solid / secondary outline / tertiary underlined; distinguishable in greyscale; verb + noun labels; 44–48 px targets 8–16 px apart (WCAG floor 24 px); avoid disabled buttons (validate and explain); destructive = quiet on the page, never hidden; confirmation proportional to severity; undo preferred; `<button>` acts, `<a>` navigates. [PUI][RUI][TID][WSG][MAR]

**Forms**: ask less; single column; labels above and persistent; hints before input; no placeholder labels; control by answer effort (checkbox / toggle / radios ≤5 / autocomplete / stepper); one required/optional convention + `required`; inline + submit validation; specific adjacent errors with icon; multi-step with progress and review. [PUI][TID][WSG][KUL][FDP]

**Feedback**: every action gets a response at the place of action; match the channel to scope: inline (field), toast (local, transient), banner (global, persistent), modal alert (decision needed now); status messages use `role=status`/`alert`; errors and toasts with actions persist; never a dead end. [UXM][TID][FRZ]

**Navigation & IA**: user vocabulary, MECE categories, card-sort tested; short distances; visible primary nav ordered by use; current location, breadcrumbs, escape hatches; search + browse; state in URLs; menus keyboard and touch operable. [TID][WSG][MAR]

**Components**: tokens → components → guidelines → templates (atomic); modals only for focused or irreversible tasks, with Esc and focus return, chained not nested; dropdowns choose values, not actions; tabs one row with clear selection; cards consistent ratio, truncation and CTA; empty states onboard. [KUL][TID][PUI][RUI][WSG][UXM]

**Motion**: animate only to give feedback, show relationships or show progress; 100–500 ms, shorter for small or frequent changes; consistent easing; honour `prefers-reduced-motion`; nothing flashes more than 3 times a second; anything that moves for more than 5 s can be paused. [DUI][TID][WCAG]

**Mobile**: mobile-first; strip to essentials; no layer cake; thumb-zone primary CTA; bottom sheets rather than centred modals; minimise typing, taps and bytes; labelled bottom nav for 3–5 destinations; never block zoom. [TID][WSG][PUI][UXM]

**AI surfaces**: clear turn-taking; honest status while generating, not re-announced by screen readers; sources the user can check; preview and approve before acting for the user; a deterministic fallback when the model fails. [CHM]

**Accessibility**: native semantics first, ARIA last; keyboard + visible focus; names, roles, states; alt text; captions; reflow at zoom; no hover-only; headings and links meaningful out of context. [WSG][PUI]

**Copy**: concise, plain, front-loaded, sentence case, consistent terms, numerals; links describe destinations; errors say what, why and how to fix without blame; content first. [PUI][WSG]

**Ethics**: persuade with the truth, never trap: cancelling is as easy as signing up, no pre-ticked paid add-ons, no fake urgency or confirmshaming, the easy choice is not the costly one. [MAR][ch20]

---

## Chapter index
| # | Topic | Key frameworks |
|---|---|---|
| [ch01](chapters/ch01-foundations-principles.md) | Foundations & cognition | usability risk, interaction cost, TID behaviour patterns, start with the feature |
| [ch02](chapters/ch02-visual-hierarchy.md) | Visual hierarchy | de-emphasise, labels last resort, action pyramid, squint test |
| [ch03](chapters/ch03-layout-spacing-grids.md) | Layout, spacing, grids | spacing scale, Gestalt grouping, design-grid count, unbreakable UI |
| [ch04](chapters/ch04-typography.md) | Typography | type scale, measure, line-height, case, font choice |
| [ch05](chapters/ch05-color-contrast.md) | Colour & contrast | shade scales, palette roles, semantic tokens, WCAG contrast, dark mode |
| [ch06](chapters/ch06-depth-borders-finishing.md) | Depth & finishing | elevation tokens, light source, fewer borders, empty states |
| [ch07](chapters/ch07-images-icons-media.md) | Images, icons, media | text on images, intended size, alt text, formats, video control |
| [ch08](chapters/ch08-buttons-actions.md) | Buttons & actions | 3 weights, disabled alternatives, friction ladder, placement |
| [ch09](chapters/ch09-forms-input.md) | Forms & validation | single column, labels, control choice, validation, input tables |
| [ch10](chapters/ch10-navigation-ia.md) | Navigation & IA | MECE, LATCH, card sorting, signposts, scent, search |
| [ch11](chapters/ch11-lists-tables-data.md) | Lists, tables, data | split view / drilldown / inlay, pagination, preattentive encoding, dashboards |
| [ch12](chapters/ch12-components-design-systems.md) | Components & design systems | tokens, atomic design, cards, modals, dropdowns, hero, pricing |
| [ch13](chapters/ch13-copywriting-content.md) | Copywriting & content | concise, front-load, inverted pyramid, link and error copy |
| [ch14](chapters/ch14-mobile-responsive.md) | Mobile & responsive | mobile-first, thumb zone, vertical stack, responsive web design |
| [ch15](chapters/ch15-accessibility-semantics.md) | Accessibility & semantics | native first, keyboard/focus, landmarks, reflow, ARIA checklist |
| [ch16](chapters/ch16-feedback-status-notifications.md) | Feedback, status & notifications | inline / toast / banner / modal alert, tones, live regions, loading, progress |
| [ch17](chapters/ch17-interaction-principles-consistency.md) | Interaction principles & consistency | ISO 9241-110 seven principles, consistency matrix, modes, controllability |
| [ch18](chapters/ch18-motion-animation.md) | Motion & animation | purpose, duration, easing, reduced motion, flashing, pause |
| [ch19](chapters/ch19-ai-conversational-ui.md) | AI & conversational surfaces | turn-taking, streaming status, sources, approval, fallback |
| [ch20](chapters/ch20-ethics-deceptive-patterns.md) | Ethics & deceptive patterns | appropriate friction, cancellation symmetry, deceptive-pattern list |

## Topic index
- **Accordion / tabs / collapsible** → ch12, ch02
- **AI chat / assistant / agent / copilot** → ch19 (then the `aiux-patterns` skill if installed)
- **Alerts / banners / toasts / snackbars** → ch16
- **Alignment / baseline / design grid** → ch03, ch04
- **Alt text / captions** → ch07, ch15
- **Animation / transitions / reduced motion** → ch18
- **Consistency / standards / modes** → ch17, ch01
- **Contrast (WCAG 2, APCA)** → ch05, ch15
- **Autocomplete / dropdown / radios** → ch09, ch12
- **Border radius / personality** → ch01, ch06, ch12
- **Breadcrumbs / wayfinding** → ch10
- **Button hierarchy / labels / disabled** → ch08
- **Card sorting / taxonomy** → ch10
- **Cards / carousel / thumbnail grid** → ch11, ch12, ch07
- **Cancellation / dark patterns / pre-ticked boxes / urgency** → ch20
- **Charts / dashboards / datatips** → ch11
- **Cognitive load / interaction cost** → ch01
- **Confirmation dialogs / destructive actions / undo** → ch08, ch16, ch17
- **Dark mode / transparent colours** → ch05, ch06
- **Design tokens / design system / atomic** → ch12, ch05, ch03, ch04
- **Empty states** → ch06, ch12
- **Error messages / validation** → ch09, ch13, ch16
- **Focus / keyboard / ARIA** → ch15
- **Gestalt grouping / white space** → ch03
- **Grids / breakpoints / responsive** → ch03, ch14
- **Hero section / landing page** → ch12, ch02
- **Icons** → ch07, ch02
- **Input tables / repeating rows / form grid layout** → ch09 (then the `refactoring-web-form-layout` skill if installed)
- **Line length / line height / type scale** → ch04
- **Link styling / link text** → ch02, ch13, ch10
- **Loading / progress / skeletons / response time** → ch16, ch08, ch14
- **Mobile navigation / touch targets / thumb zone / bottom sheet** → ch14, ch08
- **Modals / dialogs (nested, chained)** → ch12, ch16, ch10
- **Palette / shades / semantic colour** → ch05
- **Pricing tables / plan choice** → ch12, ch20
- **Search UX** → ch10, ch12
- **Settings pages** → ch17, ch12
- **Shadows / elevation** → ch06
- **Tables / sorting / pagination** → ch11
- **Text on images / photos** → ch07
- **Wizard / multi-step forms** → ch09, ch10
- **Writing style / sentence case / plain language** → ch13

## Supporting files
- [evidence.md](evidence.md): Playwright MCP evidence sequence, how to run the scripts, how to read their output
- `scripts/metrics.js`, `scripts/style-inventory.js`, `scripts/alignment-grid.js`, `scripts/form-layout.js`: page functions for `browser_evaluate` (see evidence.md)
- [cheatsheet.md](cheatsheet.md): thresholds, decision rules, source conflicts, smell → problem map
- [patterns.md](patterns.md): ~90 named patterns (Tidwell + RUI/PUI techniques) with when/how
- [glossary.md](glossary.md): terms with chapter refs
- [research/form-page-layout-principles.md](research/form-page-layout-principles.md): form layout evidence behind ch03/ch09 (Wroblewski, Penzo, Baymard, NN/g, HIG, Material 3, WCAG 2.2)
- [research/llm-audit-reliability.md](research/llm-audit-reliability.md): why the *Ground rules* exist (measured LLM-auditor failure modes)

## Sources
Core: Refactoring UI [RUI] · Practical UI 2e [PUI] · Designing Interfaces 3e [TID] · Web Style Guide 4e [WSG] · How to Design Better UI Components 3.0 [KUL].
Library: Franz & Kauer-Franz, *Usability and UX Design* [FRZ] · Marsh, *UX for Business* [MAR] · Nielsen (ed.), *Coordinating User Interfaces for Consistency* [NIE] · Malewicz, *Designing User Interfaces* [DUI] · *UX Movement* [UXM] · Michel, *From Buttons to Conversations* [CHM] · Natoli, *Fixing the Enterprise UX Process* [NAT] · Silver, *Form Design Patterns* [FDP].
Standards: WCAG 2.2 [WCAG], ISO 9241-110:2020.

## Scope & limits
Synthesised from the books above, not verbatim. Where books conflict, the chapter states both positions and a default (also listed in cheatsheet.md); choose per product and record the decision. WCAG 2.2 AA is the conformance target; WCAG 3 is an unfinished draft whose contrast method is undecided, so APCA is at most an extra design check, never a replacement for WCAG 2 contrast. Verify legal requirements for your market. Figma setup, video production, SEO and marketing strategy are only lightly covered. The skill cannot measure what it cannot see: ask for screenshots, code or tool output, and pair findings with user testing.
