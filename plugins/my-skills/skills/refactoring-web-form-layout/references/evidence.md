# Evidence behind the rules

## Contents
- How to read this file
- Rules and what they rest on
- Conflicts between sources
- Measured in testing this skill
- Sources

## How to read this file

Evidence types, strongest first: **study** (measured with users), **system** (a published design
system's rule, usually backed by its own research), **book** (author's guidance), **measured** (our own
audit numbers while building and testing this skill), **reasoning** (follows from the grid
arithmetic; no user data).

Book codes are page indexes in the PDFs in `/home/vdloc/Documents/DesignBooks/` (see
`/home/vdloc/Documents/DesignBooks/Web_Form_Design_Knowledge.md` for the full notes):
FDP = Silver, *Form Design Patterns*; PUI = Dannaway, *Practical UI* 2e; UXM = *UX Movement '25*;
DUI = Malewicz, *Designing User Interfaces*; UDP = Filipiuk, *UI Design Principles*;
KUL = Kuleszo, *Better UI Components 3.0*; PED = *UI Pedia*; UXP = *UXPeak Playbook*;
FRZ = Franz & Kauer-Franz, *Usability and UX Design*.

Web research notes (primary sources, quotes, URLs): `references/web-sources.md` in this skill. The book notes file lives only on the author's machine.

## Rules and what they rest on

| Rule | Sources | Type |
|---|---|---|
| Short forms: one column | PUI p.331; UDP p.161; DUI p.242–243; PED p.426–427 | book |
| Long expert forms may use rows of related fields, one idea per row | UXM "Right and Wrong Way to Design a Multi-Column Form", "2-Column Grid"; PUI p.334–335 (short related fields side by side) | book |
| Don't stretch a form to the viewport; ~320–500px for one column | DUI p.242; UXP p.130–131 | book |
| Field width signals the expected input length | FDP p.81–84 (citing Baymard); PUI p.344–345; UDP p.143; DUI p.244; UXP p.115–116; KUL p.106; FRZ p.450 | book (+ study via Baymard) |
| Few shared vertical edges (align field edges) | UXM "33 Field Form" (22 → 10 vertical lines) | book |
| Round widths up to whole columns (snap) | reconciles the two rules above; user feedback in this project ("content widths look messy"); audit 8 + 13 edges → 4 + 4 | measured + reasoning |
| 8-column subdivision shares every 4-column line | col4 = 2 × col8 + gutter | reasoning |
| 5 fields on 4 columns: split by meaning, never fill with another group or stretch the orphan | grouping by proximity: PUI p.352, p.362; UDP p.165; DUI p.258; width rule above | book + reasoning |
| Spacing steps: label→input < row→row < group→group | PUI p.352 (4pt vs 32pt); UXP p.13 (12px vs 32px); DUI p.235 | book |
| Labels above the field, left-aligned | FDP p.33 (Penzo eye-tracking); PUI p.332–333; DUI p.240–241 | book (+ study via Penzo) |
| No floating labels / placeholder as label | FDP p.27–29; UXM "Top-Aligned vs Infield" | book |
| Group with a heading; no nested boxes/fieldsets | FDP p.86–87, p.193–194; PUI p.362 | book |
| Repeated rows: Remove only with 2+ rows; Add another pattern | FDP p.352–373 | book |
| Input table on the form grid (border-spacing = gutter, widened by one gutter) | audit: table own columns 9 + 9 edges, 10 off-grid → 0 off-grid | measured |
| Box around the form needs side padding ≥ gutter | audit found 8px horizontal scroll at 760px in our own demo | measured |
| Computed values out of the input table | inputs vs outputs distinction; user decision in this project (q column removed) | reasoning |
| Form + panel: form left, panel sticky right, panel order by role when narrow | FDP p.119–121 (order summary beside form on desktop, below on narrow) | book |
| Column count from the form's own width when a panel shares the row | GREEN test: form drops 4 → 2 beside the panel at 1120px and stays on grid | measured |
| Error summary on top + message at each field | FDP p.53–60; PUI p.365–366 | book |
| Error message between label and input | FDP p.58–59; PUI p.366 | book |
| Inputs in a row stay level when one shows an error (`margin-top: auto`) | DUI p.234 and UXM "2-Column Grid" (reserve space, no layout shift); our fix in form_grid2.html | book + measured |
| Never colour alone for errors | FDP p.55, p.59; PUI p.366; PED p.412; KUL p.104 | book |
| Submit never disabled; `novalidate`; validate on the submit event | FDP p.51–53, p.65; PUI p.307; PED p.302 | book |
| Primary button first, left-aligned with the form | FDP p.49–50; PUI p.312–316 | book |
| Mark optional fields, not required ones | FDP p.80; UDP p.164; DUI p.256; KUL p.103 | book |

### From primary web sources

Full quotes, URLs and verification notes: `references/web-sources.md`
(48 sources, accessed 2026-10-17).

| Rule | Sources | Type |
|---|---|---|
| One field per row by default | Baymard 2023; CXL/Speero 2016 (N=702, desktop, single column ~13% faster: 102.3 vs 117.8 s, p = 0.004, time only); Basel/Google CHI 2014 guideline 6; NN/g 2016; Atlassian, Carbon, Polaris, USWDS | study (qualitative + one timed A/B) + system |
| Only 2–3 inputs share a row, and only for one entity (date, name parts, city/state/ZIP, card) | Baymard 2023; Carbon; Polaris | study (qualitative) + system |
| Never put unrelated fields side by side | Polaris; Baymard 2021; Atlassian | study (qualitative) + system |
| Width signals expected length; size by content, then snap to the grid or a width token | Baymard 2010; NN/g; Basel/Google guideline 7; GOV.UK `govuk-input--width-2…30`; USWDS 5–50ex; Atlassian 75/150/250/350/500px; Carbon (snap to grid) | study (qualitative) + system |
| Cap the form column (GOV.UK two-thirds, ≤ ~75 characters per line); never full width on large screens | GOV.UK; Material 3; USWDS | system |
| Labels visible, above, left-aligned | Penzo 2006 (eye tracking); Wroblewski 2007; Basel/Google guideline 5; GOV.UK; Carbon; Atlassian | study (small or unstated N) + system |
| No placeholder as label; floating labels never usability-tested | Baymard 2013; NN/g 2014 (Material allows floating) | study (qualitative) + system |
| Label closer to its own field than to the next; bigger gaps between groups | NN/g 2013; Carbon spacing tokens | opinion + system |
| In a shared row, align the input boxes, not the labels | Carbon | system |
| Related fields that overflow a row: wrap at a minimum width (Polaris 220px) or split by sub-group | Polaris; Baymard/Carbon cap of 2–3 per row; "avoid orphans" is inference | system + inference |
| Desktop: form two-thirds + aside one-third; narrower: one pane | GOV.UK layout; Material 3 breakpoints | system |
| Sticky aside only works if no ancestor has `overflow` set and it fits the viewport | MDN `position: sticky` | spec docs |
| Error summary at the top of the main area, linking to each field | GOV.UK error summary | system |
| Inline error attached to its own field, never inside the input | GOV.UK (above the input); Carbon, Material, NN/g (below) | system |
| An error must not shift neighbouring fields (swap hint for error, or reserve space) | Material 3 | system |
| Inline validation numbers: +22% success, −22% errors, +31% satisfaction, −42% completion time (Etre 2009) | Wroblewski, A List Apart 2009 (slides say "completions") | study |
| Repeated small sets: a table or numbered groups; complex items: add-to-a-list loop | MOJ "Add another", MOJ "Add to a list", DWP | system |
| No inline-edit (read ↔ edit) controls inside a submit form | Atlassian | system |
| Subgrid for row alignment (Baseline Sept 2023); container queries for forms reused in panels | MDN; caniuse | spec docs |
| 4 → 2 field columns at tablet width | Carbon page grid 16 → 8 (a page rule, not a form rule) | **convention only, no direct source** |

## Conflicts between sources

| Topic | Position A | Position B | This skill |
|---|---|---|---|
| Columns | Single column (PUI, UDP, DUI, PED; Baymard, CXL N=702, Google, NN/g, most design systems) | Multi-column with horizontal logical flow (UXM; practitioner opinion only, no study shows it winning) | 1 column for short forms. Rows of 3–4 short values of one entity only for long expert data entry: **weakly supported**, a choice for density, not an evidence-backed rule |
| Values per row | 2–3 inputs per row, one entity (Baymard, Carbon, Polaris) | 4 short numbers per row on a 4-column grid (this skill) | Prefer ≤ 3 per row; 4 only when all are short values of one idea (b, h, a, a′ are not: split them) |
| Field width | By expected length (FDP, PUI, Baymard, NN/g, Google, USWDS, Atlassian) | Full container width (GOV.UK default fluid input) | Expected length rounded up to whole columns (Carbon does the same) |
| Error position | Above the input (FDP, PUI, GOV.UK) | Below the input (DUI, UXM, Carbon, Material, NN/g); right side (Google g17) | Above by default; keep the project's convention if consistent. No comparative study exists |
| Error summary | Required, even for one error (GOV.UK, FDP) | Optional, never the only signal (NN/g); server errors only (Carbon) | Use it for forms long enough to scroll |
| Button alignment | Left, primary first (FDP, PUI) | Forward action right (FRZ, UXP) | Left by default; keep an existing product convention |
| Label style | Above, outside the field (FDP, PUI, DUI) | Infield top-aligned (UXM); floating acceptable (UDP, KUL) | Above, outside |
| Validation timing | On submit (FDP) | Inline / per question (PUI, UDP, PED, KUL) | On submit, then live re-check of fields already in error |

## Measured in testing this skill

Same task ("refactor this steel-column form, 4 columns on desktop, keep fields, table and diagram"):

| | Without skill (baseline) | With skill |
|---|---|---|
| Edges at 1000px (left / right) | 9 / 9 | 6 / 6 (4 / 4 + the table's half-column numbers) |
| Off-grid controls at 1000px | 10 (table had its own columns) | 0 |
| Rows | auto-flow in source order: Profile, Size, Grade, Height / ky, kz | split by meaning: Profile, Size, Grade / H, ky, kz with sub-headings |
| Computed Utilisation column | kept in the input table | moved to the panel |
| Submit | stayed disabled | enabled, summary + field messages |
| Buttons | right-aligned footer, primary last | primary first, left |

Counter-example (6-control sign-up form) with the skill: stayed one column, 1 left + 1 right edge.

## Sources

Books: see the codes above and `/home/vdloc/Documents/DesignBooks/Web_Form_Design_Knowledge.md`.
Web: `references/web-sources.md`.
