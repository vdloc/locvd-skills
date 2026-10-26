---
name: ui-ux-design-playbook
description: "Use when designing, shaping, building, redesigning, restyling, refining, auditing or reviewing a web or mobile UI: planning a feature's UX, choosing a visual direction, creating screens, pages, components, design systems and tokens, making an interface bolder, quieter, simpler, more polished or production-hardened, or critiquing a live URL, dev server, screenshot, HTML/CSS, design export, PR, branch or uncommitted change against UI/UX and WCAG 2.2 AA. Covers layout, spacing, typography, colour and contrast, depth, icons, buttons, forms, navigation, tables, modals, toasts, motion, mobile and touch, RTL and i18n, AI chat panels, accessibility, UX copy, generic \"AI-made\" looks and deceptive patterns. Grounded in Refactoring UI, Practical UI, Designing Interfaces, Web Style Guide, Kuleszo's UI Components, a wider design-book library and current design-engineering practice."
---

<!-- argument-hint: [shape <feature> | design <surface> | refine <target> | audit <target> | review <pr|branch> | topic | chNN] -->

# UI/UX Design Playbook

A working playbook for designing and building interfaces, and for reviewing them: decide from the user's task and real content, systematise every value, design every state, and check the rendered result. Thresholds and recipes live in the chapters; the workflows say what to decide in what order. Source tags like [PUI] are listed under *Sources*.

## How to use this skill
- **Shape**: "plan / spec the UX of X", "how should this work?". [design-workflow.md](design-workflow.md) §1: interview, then a confirmed brief, no code.
- **Design / build**: "design / build / redesign / restyle this page, screen, flow, component or design system". [design-workflow.md](design-workflow.md) §0–12, reading ch12 plus the topic chapters it points to.
- **Refine**: "make it bolder / quieter / simpler", "polish", "harden", "add colour / delight / motion". The matching *Refine move* in [design-workflow.md](design-workflow.md), then its §10–11.
- **Audit**: "audit / review / critique this page, app, screenshot or flow". [audit-workflow.md](audit-workflow.md): ground rules, workflow, severity, report template; load only the chapters for lenses that apply.
- **Change review**: "review this PR / branch / diff / my uncommitted changes". [change-review.md](change-review.md) for scope, statuses and the removed-lines pass, then [audit-workflow.md](audit-workflow.md) on the surfaces the change renders in: step 1 recon (stack and idiom), steps 3–4 only when the change is rendered, then steps 5–10.
- **Topic**: a question about `forms`, `contrast`, `toasts`, `motion`… Read the matching chapter via the *Topic index*.
- **Chapter**: "show ch09". Read that file.

Every chapter has **Audit checks** (IDs such as FM3, C1) that double as acceptance criteria when building, **Fix recipes** (CSS/HTML) and the source conflicts. Read the chapter before asserting a threshold that is not in *Core rules* below.

## Always-on rules (every mode)
1. **The brief wins** [IMP][AFD]: honour pinned aesthetics, brands, fonts, palettes and content even when they match a listed default. Where an axis is left free, choose on purpose instead of by reflex.
2. **Evidence, not taste** [JK]: a deliberate, consistent project convention (a density, radius, voice, notation, no-shadow style) is not a defect, even where it differs from a number in this playbook; the same detail done two ways inside the product is. A documented convention never excuses a WCAG failure or an escalation trigger.
3. **Use what exists**: the project's tokens, components, primitives and idiom first; native elements before ARIA; never a migration nobody asked for [ID][KK].
4. **Real content, honest content**: design with representative material; never invent proof (customers, quotes, logos, statistics) or measurements.
5. **Look at the rendered result** at the widths and themes it ships, in its states, before calling anything done; say plainly which checks could not run.
6. **Accessibility is the floor, not a phase**: WCAG 2.2 AA from the first component (ch15), in every mode.

Review-only rules (evidence tags, the Inferred cap, severity, read-only, one finding per root defect) are in [audit-workflow.md](audit-workflow.md) and do not constrain design work. When designing, iterate against the gates in design-workflow.md §11 instead of rating your own draft.

---

## Core rules (usable without loading chapters)
**Principles**: minimise usability risk; every detail needs a reason; minimise interaction cost (Fitts, Hick) and cognitive load; use conventional patterns (Jakob's law) and never change a known pattern's *behaviour*; systematise every value; design all states. Beauty earns trust in ~50 ms, never at the cost of access. [PUI][RUI][TID][WSG]

**Interaction** (ISO 9241-110): suits the task, self-descriptive, matches expectations, learnable, controllable (interrupt, resume, undo, pace), robust to use errors, engaging. No hidden modes. Consistency on three levels: concept, action, appearance. [FRZ][NIE][UXM]

**Hierarchy**: decide the importance order first; de-emphasise competitors; colour and weight before size; ≤1 primary action; labels last resort; squint test. [RUI][PUI]

**Space**: non-linear scale (4·8·12·16·24·32·48·64·80·96); more space between groups than within; start generous; containers only when proximity, similarity or alignment fail; few distinct alignment edges and gap values; 12-col grid for regions, max-width for components; design for ugly data. [RUI][PUI][KUL][FRZ]

**Type**: one sans family (≤2), 2 weights, a hand-tuned scale in px/rem; 16 px UI, 18 px long-form; 45–75 ch; unitless line-height ≥1.5 body (≥1.4 for anything that wraps), tighter headings; left-aligned; sentence case; tracked caps only for tiny labels; ≤3–4 text styles per screen; `tabular-nums` on changing numbers; truncation always has a way back; `lang`/`dir` set. [RUI][PUI][WSG][DUI][JK]

**Colour**: greyscale first; 9-step shades; semantic roles (brand/interactive, text strong/weak, stroke strong/weak, fill, bg, error/warning/success); brand colour only on interactive elements; WCAG 2 contrast 4.5:1 text, 3:1 large text and UI; never colour alone; tinted greys; dark mode = lighter elevated surfaces + remapped tokens, desaturated accents; components use semantic tokens, never primitives or literals; one hue, one meaning; measure the pair as rendered (alpha, images, both themes). [RUI][PUI][UXM][JK]

**Actions**: primary solid / secondary outline / tertiary underlined; distinguishable in greyscale; verb + noun labels; 44–48 px targets 8–16 px apart (WCAG floor 24 px); avoid disabled buttons (validate and explain); destructive = quiet on the page, never hidden; confirmation proportional to severity; undo preferred; `<button>` acts, `<a>` navigates. [PUI][RUI][TID][WSG][MAR]

**Forms**: ask less; no confirm-email/password fields (Show/Hide instead); dates by date type; single column; labels above and persistent; hints before input; no placeholder labels; control by answer effort (checkbox / toggle / radios ≤5 / autocomplete / stepper); one required/optional convention + `required`; inline + submit validation; specific adjacent errors with icon; multi-step with progress and review. [PUI][TID][WSG][KUL][FDP]

**Feedback**: every action gets a response at the place of action; match the channel to scope: inline (field), toast (local, transient), banner (global, persistent), modal alert (decision needed now); status messages use `role=status`/`alert`; errors and toasts with actions persist; never a dead end. [UXM][TID][FRZ]

**Navigation & IA**: user vocabulary, MECE categories, card-sort tested; short distances; visible primary nav ordered by use; current location, breadcrumbs, escape hatches; search + browse; state in URLs; menus keyboard and touch operable. [TID][WSG][MAR]

**Components**: tokens → components → guidelines → templates (atomic); modals only for focused or irreversible tasks, with Esc and focus return, chained not nested; dropdowns choose values, not actions; tabs one row with clear selection; cards consistent ratio, truncation and CTA; empty states onboard. [KUL][TID][PUI][RUI][WSG][UXM]

**Motion**: decide by frequency first (keyboard and 100+-a-day actions never animate); animate only to give feedback, show relationships or show progress; springs for user-driven gestures, easing for system changes; 100–500 ms, shorter for small or frequent changes; high-frequency interactions (typing, row hover, tab switch) instant or ≤150 ms; interactive state via interruptible transitions, keyframes only for one-shot sequences; exits shorter than enters; name transitioned properties, never `all`; consistent easing; honour `prefers-reduced-motion` (fade instead of move); nothing flashes more than 3 times a second; anything that moves for more than 5 s can be paused. [DUI][TID][WCAG][JK]

**Mobile**: mobile-first; platform baseline before the first component (viewport-fit, per-scheme theme-color, 16 px inputs, `touch-action: manipulation`, hover only on hover-capable pointers, `dvh`/`svh`), tested on a real phone; strip to essentials; no layer cake; thumb-zone primary CTA; bottom sheets rather than centred modals; minimise typing, taps and bytes; labelled bottom nav for 3–5 destinations; never block zoom. [TID][WSG][PUI][UXM][EK]

**AI surfaces**: clear turn-taking; honest status while generating, not re-announced by screen readers; sources the user can check; preview and approve before acting for the user; a deterministic fallback when the model fails. [CHM]

**Accessibility**: native semantics first, ARIA last; keyboard + visible focus; names, roles, states; alt text; captions; reflow at zoom; no hover-only; headings and links meaningful out of context. [WSG][PUI]

**Copy**: concise, plain, front-loaded, sentence case, consistent terms, numerals; links describe destinations; errors say what, why and how to fix without blame; content first; tone matches the stakes; toggles named for their ON state; strings built whole with locale plural rules, never concatenated. [PUI][WSG][JK]

**Layout mechanics**: logical properties for anything that mirrors; `min-height`/`max-width` instead of fixed boxes around text; `minmax(0,1fr)` and `min-width: 0` so long content can shrink; `dvh` for full-height mobile panes; container queries for reusable components; every hidden or truncated thing has a visible cue and a way back. [JK]

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
| [ch21](chapters/ch21-field-patterns-flows.md) | Field patterns & common flows | names, email, passwords, phone, address, payment, dates, upload, search, login/signup, checkout, filters, bulk actions, quick form checklist |

## Topic index
- **Design brief / UX spec / "how should this work?"** → design-workflow.md §1
- **Visual direction / "looks generic, templated, AI-made"** → design-workflow.md §3, *Defaults to name before choosing*
- **Landing / marketing page, hero, page copy** → design-workflow.md §3–4, ch12, ch02
- **Dashboard / app screen / admin / settings** → design-workflow.md §0, §5, ch11, ch17
- **Interaction contract / optimistic UI / save, cancel, undo behaviour** → design-workflow.md §7, ch16, ch17
- **Bolder / quieter / simplify / colorize / delight / polish** → design-workflow.md *Refine moves*, §10
- **Edge cases / hardening / worst-case data** → design-workflow.md §9, ch03 L9, ch21
- **Should this animate? springs vs easing / durations** → design-workflow.md §8, ch18
- **Mobile web feels like a website, not an app** → ch14 (M14–M18)
- **Accordion / tabs / collapsible** → ch12, ch02
- **AI chat / assistant / agent / copilot** → ch19 (then the `aiux-patterns` skill if installed)
- **Alerts / banners / toasts / snackbars** → ch16
- **Alignment / baseline / design grid** → ch03, ch04
- **Alt text / captions** → ch07, ch15
- **Animation / transitions / reduced motion** → ch18
- **Consistency / standards / modes** → ch17, ch01
- **Contrast (WCAG 2, APCA)** → ch05, ch15
- **Autocomplete / dropdown / radios** → ch09, ch12
- **Address / payment / card / date of birth / phone fields** → ch21
- **Login / signup / password / forgot password** → ch21, ch15 (A20)
- **File upload / drag and drop files** → ch21, ch16
- **Filters / bulk actions** → ch21, ch11
- **Product type (e-commerce, marketplace, B2B, internal tool…)** → ch01
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
- **PR / branch / diff review, regressions** → change-review.md
- **Code smells / static source audit / grep** → code-smells.md
- **RTL / i18n / translation growth / plurals / `lang`** → ch03 (L16, L20), ch04 (T19), ch07 (I14), ch13 (W15)
- **Truncation / line-clamp / overflow** → ch04 (T18), ch03 (L17, L18)
- **Theme switching / dark-mode tokens / P3 gamut** → ch05 (C16), ch18 (AN11)
- **Icon stroke / icon states / optical alignment** → ch07 (I12–I14)
- **Hover on touch / overscroll in overlays** → ch14 (M14, M15)
- **SPA route change focus / dialogs / disabled vs aria-disabled** → ch15 (A25–A27)

## Supporting files
- [design-workflow.md](design-workflow.md): shape → direction → content → system → structure → components and interaction contracts → motion → harden → polish → verify; refine moves; defaults to name before choosing
- [audit-workflow.md](audit-workflow.md): review ground rules, the 10-step audit, severity scale and escalation triggers, report template
- [evidence.md](evidence.md): Playwright MCP evidence sequence, how to run the scripts, how to read their output
- `scripts/`: 11 page functions for `browser_evaluate` (metrics, style inventory, alignment grid, form layout, axe run, accessibility transcript, focus walk, text spacing, live regions, WCAG 2.2 inventory, element marks); evidence.md says when to run each and how to read it. Plus one shell scanner for source trees, `bash scripts/code-smells.sh <dir>` (needs ripgrep)
- [change-review.md](change-review.md): PR / branch / uncommitted-change review: scope resolution, read-only rules, blast radius, removed-lines pass, Introduced/Regression/Pre-existing, verdict
- [code-smells.md](code-smells.md): grep-able source patterns mapped to check IDs, with fixes and known false positives
- [cheatsheet.md](cheatsheet.md): thresholds, decision rules, source conflicts, smell → problem map
- [patterns.md](patterns.md): ~90 named patterns (Tidwell + RUI/PUI techniques) with when/how
- [glossary.md](glossary.md): terms with chapter refs
- [research/form-page-layout-principles.md](research/form-page-layout-principles.md): form layout evidence behind ch03/ch09 (Wroblewski, Penzo, Baymard, NN/g, HIG, Material 3, WCAG 2.2)
- [research/llm-audit-reliability.md](research/llm-audit-reliability.md): why the audit *Ground rules* exist (measured LLM-auditor failure modes)

## Sources
Core: Refactoring UI [RUI] · Practical UI 2e [PUI] · Designing Interfaces 3e [TID] · Web Style Guide 4e [WSG] · How to Design Better UI Components 3.0 [KUL].
Library: Franz & Kauer-Franz, *Usability and UX Design* [FRZ] · Marsh, *UX for Business* [MAR] · Nielsen (ed.), *Coordinating User Interfaces for Consistency* [NIE] · Malewicz, *Designing User Interfaces* [DUI] · *UX Movement* [UXM] · Michel, *From Buttons to Conversations* [CHM] · Natoli, *Fixing the Enterprise UX Process* [NAT] · Silver, *Form Design Patterns* [FDP].
Design-engineering practice (agent skills catalogued at ui-skills.com, paraphrased; read 2026-10-26): Vercel Web Interface Guidelines [VWG] · Emil Kowalski (design-eng, animation review, mobile-native, break-ui) [EK] · Paul Bakaus, *Impeccable* (shape, layout, typeset, polish, harden, distill, bolder, quieter, colorize, delight) [IMP] · Karl Koch (subtractive design, affordances, semantic HTML, real-content design, interaction contracts, design for repetition, write-first design, system evolution, product delight) [KK] · Leon Lin, *taste-skill* [TS] · *interface-design* (dammyjay93) [ID] · Anthropic *frontend-design* [AFD] · ibelick UI skills [IB] · Raphael Salaja (animation principles, springs) [RS] · AccessLint [AL] · *ui-review* / *token-mapping* (arla6ka) [UIR] · *interactive-hit-areas* (millionco) [MCH] · Meng To (landing and pricing pages) [MGT] · Elaya Design, *landing-page-design* [ELY] · nextlevelbuilder *design-system* [NLB].
Practice: Krehel, *interfaces* agent skills (github.com/jakubkrehel/skills, MIT; jakub.kr, interfaces.dev) [JK]: implementation-level CSS/HTML checks, escalation triggers, fix-preference ladder, change-review method. Its exact motion and shadow values are one designer's defaults, used here only in Fix Recipes, never as pass criteria.
Standards: WCAG 2.2 [WCAG], ISO 9241-110:2020.

## Scope & limits
Synthesised from the books and skills above, not verbatim; exact motion, shadow and stagger values from practitioner skills are starting points, never pass criteria. Where books conflict, the chapter states both positions and a default (also listed in cheatsheet.md); choose per product and record the decision. WCAG 2.2 AA is the conformance target; WCAG 3 is an unfinished draft whose contrast method is undecided, so APCA is at most an extra design check, never a replacement for WCAG 2 contrast. Verify legal requirements for your market. Figma setup, video production, SEO and marketing strategy are only lightly covered. The skill cannot measure what it cannot see: ask for screenshots, code or tool output, and pair findings with user testing.
