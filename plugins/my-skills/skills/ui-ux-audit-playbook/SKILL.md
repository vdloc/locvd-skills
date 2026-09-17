---
name: ui-ux-audit-playbook
description: "Audit existing web/mobile interface or implement new UI vs five UI/UX books: Refactoring UI (Wathan & Schoger), Practical UI (Dannaway), Designing Interfaces 3e (Tidwell et al.), Web Style Guide 4e (Lynch & Horton), How to Design Better UI Components (Kuleszo). Use for UI/UX audit, design review w/ severity-ranked findings, checklist-driven fix pass, or build screens/components/design tokens (spacing, type scale, colour palette, buttons, forms, navigation, tables, modals, accessibility) per those books' thresholds/patterns."
---

<!-- argument-hint: [audit <target> | implement <feature> | topic | chNN] -->

# UI/UX Audit & Implementation Playbook
**Sources**: Refactoring UI [RUI] · Practical UI 2e [PUI] · Designing Interfaces 3e [TID] · Web Style Guide 4e [WSG] · How to Design Better UI Components 3.0 [KUL] · plus derived sources in ch03/ch09 (Wroblewski/Penzo, Baymard, NN/g, Apple HIG, Material Design 3, WCAG 2.2 — see [ui-ux-audit-playbook/research/form-page-layout-principles.md](research/form-page-layout-principles.md)) | **Topic chapters**: 15 | **Generated**: 2026-09-14 · **form/diagram layout revision**: 2026-09-17

## How to Use This Skill
- **Audit** — "audit this page/app/screenshot/PR": run *Audit workflow*; load chapters for lenses that apply.
- **Implement** — "build/redesign X": run *Implement workflow*; load ch12 + relevant topic chapters first.
- **Topic** — ask about `forms`, `contrast`, `navigation`…; read matching chapter via Topic Index.
- **Chapter** — ask for `ch09`.
Each chapter has **Audit Checks** (IDs like FM3, C1) w/ pass criteria + **Fix Recipes** (CSS/HTML) + source conflicts. Read relevant chapter before asserting threshold not listed below.

---

## Audit workflow
1. **Frame** — users & primary tasks; platform (web/mobile/desktop app); screen types (overview/focus/make/do [TID]); constraints (brand, design system, WCAG target — default WCAG 2.2 AA).
2. **Collect evidence** — live/dev-server target: follow [evidence.md](evidence.md): Playwright MCP screenshots (375/768/1280px, both modes), accessibility snapshot, focus-order pass, metrics `browser_evaluate` script (font sizes, contrast fails, small targets, off-grid spacing), zoom/reflow check, optional axe injection. **If the page has a form**: also run evidence.md's form-layout snippet — capture label position, column count, field widths, required/optional spatial clustering, and diagram/image adjacency to fields *before* running the Forms lens (§3 below, lens 7); ch09/ch03's checks test this captured arrangement against design principles, they are not a freeform visual impression. Static screenshots/code only: greyscale + squint/blur test, manual measurement from DOM/CSS — for forms, still enumerate the same facts (label position per field, column count, what's beside each field) by reading the DOM/CSS directly. Never invent measurements — mark "needs verification" when can't measure.
3. **Run lenses in order** (structure before paint):
   1. IA & navigation — ch10 · 2. Hierarchy — ch02 · 3. Layout & spacing — ch03 · 4. Typography — ch04 · 5. Colour & contrast — ch05 · 6. Buttons & actions — ch08 · 7. Forms — ch09 · 8. Lists/tables/data — ch11 · 9. Components & system consistency — ch12 · 10. Images/icons/media — ch07 · 11. Depth & polish — ch06 · 12. Copy — ch13 · 13. Mobile/responsive — ch14 · 14. Accessibility — ch15 · 15. Foundations sanity check (interaction cost, consistency, states) — ch01
4. **Record each finding**: ID · severity · location (screen/selector) · evidence (measurement, screenshot ref) · rule violated (check ID + source tag) · user impact · fix (concrete, token-level) · effort (S/M/L).
5. **Prioritise** by severity × reach × effort; group systemic issues (e.g. "no spacing scale" explains 14 symptoms) before one-offs.
6. **Report** (template below); end w/ quick wins + systemic recommendations (tokens, components).

### Severity scale
| Level | Meaning | Examples |
|---|---|---|
| **Critical** | Blocks task or fails legal/WCAG AA for core flow | unlabeled form fields, keyboard trap, text <3:1, zoom disabled, destructive action w/o recovery |
| **High** | Significant errors, confusion or exclusion | colour-only errors, disabled submit w/o reason, multiple primaries, hidden nav, targets <32px |
| **Medium** | Friction, inconsistency, slower scanning | off-scale spacing, 10 font sizes, vague link text, weak hierarchy |
| **Low** | Polish | shadow inconsistency, minor alignment, missing accent/empty-state delight |

### Report template
```
# UI/UX Audit — <product/screen> (<date>)
Scope · Users & tasks · Method (tools, breakpoints) · Standard (WCAG 2.2 AA + playbook)
## Summary: <3–5 bullet verdict> | Critical n · High n · Medium n · Low n
## Systemic issues (root causes)
## Findings
| ID | Sev | Where | Issue & evidence | Rule (check/src) | Fix | Effort |
## Quick wins (≤1 day)   ## Recommended tokens/components   ## Open questions / needs verification
```

## Implement workflow
1. **Start from feature, not shell** [RUI]; list real content & edge cases (longest name, 0/1/many items, errors) [PUI].
2. **Tokens first** (ch12): spacing scale, type scale, colour palette w/ semantic roles + dark mode, radii, shadows/elevation, breakpoints, motion. No raw values in components.
3. **Structure**: IA & labels (ch10) → semantic HTML + landmarks + source order (ch15) → grid & widths (ch03).
4. **Greyscale layout** — hierarchy via size/weight/spacing (ch02) → add colour purposefully (ch05).
5. **Components w/ all states** — default, hover, active, focus-visible, disabled/locked, loading, error, empty (ch08, ch09, ch12).
6. **Copy pass** (ch13) → **responsive/mobile pass** (ch14) → **polish** (ch06–07).
7. **Verify** w/ audit checks for touched chapters; include keyboard, contrast, zoom, long-content tests.

---

## Core Frameworks (use w/o loading chapters)
**Principles** — Minimise usability risk; every detail needs rationale; minimise interaction cost (Fitts, Hick) & cognitive load; use conventional patterns (Jakob's Law), never change known pattern's *behaviour*; systematize every value; design all states; beauty earns trust in ~50ms but never at cost of access. [PUI][RUI][TID][WSG]

**Hierarchy** — Decide importance order first; de-emphasize competitors; colour & weight before size; ≤1 primary action; labels last resort; squint test. [RUI][PUI]

**Space** — Non-linear scale (4·8·12·16·24·32·48·64·80·96); more space between groups than within; start generous; containers only when proximity/similarity/alignment fail; 12-col grid for regions, max-width for components; design for ugly data. [RUI][PUI][KUL]

**Type** — 1 sans family (≤2), 2 weights, hand-tuned scale in px/rem; 16px UI / 18px long-form; 45–75ch; line-height ≥1.5 body, tighter headings; left-aligned; sentence case; tracked caps only for tiny labels. [RUI][PUI][WSG]

**Colour** — Greyscale first; 9-step shades; semantic roles (brand/interactive, text strong/weak, stroke strong/weak, fill, bg, error/warning/success); brand colour only on interactive elements; 4.5:1 text, 3:1 large/UI; never colour alone; tinted greys; dark mode = lighter elevated surfaces + remapped tokens. [RUI][PUI]

**Actions** — Primary solid / secondary outline / tertiary underlined; greyscale-distinguishable; verb+noun labels; 44–48px targets 8–16px apart; avoid disabled buttons (validate & explain); destructive = tertiary on page, confirmation proportional to severity, undo preferred; `<button>` acts, `<a>` navigates. [PUI][RUI][TID][WSG]

**Forms** — Ask less; single column; labels above & persistent; hints before input; no placeholder labels; control by answer effort (checkbox/toggle/radios ≤5/autocomplete/stepper); consistent required/optional convention + `required`; inline + submit validation; specific adjacent errors w/ icon; multi-step w/ progress & review. [PUI][TID][WSG][KUL]

**Navigation & IA** — User vocabulary, MECE categories, card-sort tested; short distances; visible primary nav; current location, breadcrumbs, escape hatches; search + browse; state in URLs; menus keyboard/touch operable. [TID][WSG]

**Components** — Tokens → components → guidelines → templates (atomic); modals only for focused/irreversible tasks w/ Esc & focus return; dropdowns choose values not actions; tabs single row w/ clear selection; cards consistent ratio/truncation/CTA; empty states onboard. [KUL][TID][PUI][RUI][WSG]

**Mobile** — Mobile-first; strip to essentials; no layer cake; thumb-zone primary CTA; minimise typing/taps/bytes; labelled bottom nav for 3–5 destinations; never block zoom. [TID][WSG][PUI]

**Accessibility** — Native semantics first, ARIA last; keyboard + visible focus; names/roles/states; alt text; captions; reflow at zoom; no hover-only; headings & links meaningful out of context. [WSG][PUI]

**Copy** — Concise, plain, front-loaded, sentence case, consistent terms, numerals; links describe destinations; errors say what/why/fix w/o blame; content first (no welcome fluff). [PUI][WSG]

---

## Chapter Index
| # | Topic | Key frameworks |
|---|---|---|
| [ch01](chapters/ch01-foundations-principles.md) | Foundations & cognition | usability risk, interaction cost, TID behaviour patterns, start w/ feature |
| [ch02](chapters/ch02-visual-hierarchy.md) | Visual hierarchy | de-emphasize, labels last resort, action pyramid, squint test |
| [ch03](chapters/ch03-layout-spacing-grids.md) | Layout, spacing, grids | spacing scale, Gestalt grouping, grids vs max-width, unbreakable UI |
| [ch04](chapters/ch04-typography.md) | Typography | type scale, measure, line-height, case, font choice |
| [ch05](chapters/ch05-color-contrast.md) | Colour & contrast | shade scales, palette roles, semantic tokens, WCAG/APCA, dark mode |
| [ch06](chapters/ch06-depth-borders-finishing.md) | Depth & finishing | elevation tokens, light source, fewer borders, empty states |
| [ch07](chapters/ch07-images-icons-media.md) | Images, icons, media | text on images, intended size, alt text, formats, video control |
| [ch08](chapters/ch08-buttons-actions.md) | Buttons & actions | 3 weights, disabled alternatives, friction ladder, placement |
| [ch09](chapters/ch09-forms-input.md) | Forms & validation | single column, labels, control choice, validation approaches |
| [ch10](chapters/ch10-navigation-ia.md) | Navigation & IA | MECE, LATCH, card sorting, signposts, scent, search |
| [ch11](chapters/ch11-lists-tables-data.md) | Lists, tables, data | split view/drilldown/inlay, pagination, preattentive encoding, dashboards |
| [ch12](chapters/ch12-components-design-systems.md) | Components & design systems | tokens, atomic design, cards, modals, dropdowns, hero, pricing, panel section ordering, disclosure symmetry |
| [ch13](chapters/ch13-copywriting-content.md) | Copywriting & content | concise, front-load, inverted pyramid, link & error copy |
| [ch14](chapters/ch14-mobile-responsive.md) | Mobile & responsive | mobile-first, thumb zone, vertical stack, responsive web design |
| [ch15](chapters/ch15-accessibility-semantics.md) | Accessibility & semantics | native first, keyboard/focus, landmarks, reflow, ARIA checklist |

## Topic Index
- **Accordion / tabs / collapsible** → ch12, ch02
- **Alignment / baseline** → ch03, ch04
- **Alt text / captions** → ch07, ch15
- **APCA / WCAG contrast** → ch05, ch15
- **Autocomplete / dropdown / radios** → ch09, ch12
- **Border radius / personality** → ch01, ch06, ch12
- **Breadcrumbs / wayfinding** → ch10
- **Button hierarchy / labels / disabled** → ch08
- **Card sorting / taxonomy** → ch10
- **Cards / carousel / thumbnail grid** → ch11, ch12, ch07
- **Charts / dashboards / datatips** → ch11
- **Cognitive load / interaction cost** → ch01
- **Dark mode / transparent colours** → ch05, ch06
- **Design tokens / design system / atomic** → ch12, ch05, ch03, ch04
- **Destructive actions / undo / confirmation** → ch08, ch01
- **Empty states** → ch06, ch12
- **Error messages / validation** → ch09, ch13
- **Focus / keyboard / ARIA** → ch15
- **Gestalt grouping / white space** → ch03
- **Grids / breakpoints / responsive** → ch03, ch14
- **Hero section / landing page** → ch12, ch02
- **Icons** → ch07, ch02
- **Line length / line height / type scale** → ch04
- **Link styling / link text** → ch02, ch13, ch10
- **Loading / progress / response time** → ch08, ch14
- **Mobile navigation / touch targets / thumb zone** → ch14, ch08
- **Modals / dialogs** → ch12, ch10
- **Palette / shades / semantic colour** → ch05
- **Pricing tables** → ch12
- **Search UX** → ch10, ch12
- **Shadows / elevation** → ch06
- **Tables / sorting / pagination** → ch11
- **Text on images / photos** → ch07
- **Wizard / multi-step forms** → ch09, ch10
- **Writing style / sentence case / plain language** → ch13

## Supporting Files
- [cheatsheet.md](cheatsheet.md) — thresholds, decision rules, trade-offs, smell→problem map
- [patterns.md](patterns.md) — ~90 named patterns (Tidwell + RUI/PUI techniques) w/ when/how
- [glossary.md](glossary.md) — terms w/ chapter refs
- [evidence.md](evidence.md) — Playwright MCP evidence-collection sequence + computed-style metrics script

## Scope & Limits
Synthesised from five books (2016–2024 editions); not verbatim text. Where books conflict, chapters state both + give default — choose per product, document decision. Standards moved since publication (e.g. WCAG 2.2, APCA still draft) — verify legal requirements. Figma-specific setup, video production, SEO/CMS, marketing strategy only lightly covered. Pair w/ project design-system docs + real user testing; skill can't measure what it can't see — request screenshots/code or tool output. Images in source PDFs (mockups, before/after figures) not read; examples reconstructed from text.