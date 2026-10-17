---
name: refactoring-web-form-layout
description: Use when refactoring, reviewing or building the visual layout of an HTML web form - multi-column or grid forms (2/4 columns), fields that look messy or misaligned, inputs with ad-hoc pixel widths, a row with more fields than columns (5 fields on a 4-column grid), tables whose cells are inputs (editable rows, add/remove row), a form with a diagram, preview or summary panel beside it, where error messages go, or adapting a form layout from desktop to tablet width.
---

# Refactoring web form layout

## Overview

A form reads as calm when **every control edge sits on a few shared vertical lines and every row
is one idea**. Width tells users what to type; the grid makes widths line up; spacing tells them
what belongs together. Everything below serves those three.

Scope is the visual layout on desktop and tablet. Out of scope: accessibility (ARIA, screen
readers, focus management, WCAG) and phone layouts. Keep whatever the source already has for
those; do not add or remove it.

Layout refactor only: keep fields, names, ids, values, wording and behaviour, with these exceptions:
- Remove `disabled` from submit and add `novalidate` (the error layout below replaces both).
- If the source has validation, move its messages into the summary + field layout. If it has none, add the summary and message slots and their CSS, but **do not invent rules** (which fields are required, formats): list them as open questions.
- A message that contradicts the value (e.g. "Required" under a filled field) is a bug: remove it and say so.

List every visible change at the end.

## Short forms: single column

Login, sign-up, single checkout step, under ~8 fields: one column, 320–500px wide, every input full
width of that column, one field per row (first and last name stacked too). Skip steps 3–8;
steps 1, 2 and 9–11 still apply (the audit should show 1 left + 1 right edge).

## When not to use

- Visual styling only (colours, radius, brand): not a layout problem.
- Spreadsheet-like editing with hundreds of rows: needs a real data-grid component, not this pattern.

## Workflow

Copy this checklist into your response and tick it off:

```
- [ ] 1. Inventory: groups, fields per group, meaning of each row, expected input length, tables, side panels
- [ ] 2. Measure before: python3 scripts/form_audit.py <page.html> (save the numbers)
- [ ] 3. Choose the grid: 1 / 2 / 4 columns, gutter, max width, container that decides the count
- [ ] 4. Rows by meaning: each row one idea, each row starts at column 1, placement per layout (--c4/--c2)
- [ ] 5. Widths: round each field's content width UP to whole columns
- [ ] 6. Awkward rows (more fields than columns): split by meaning, never fill or stretch
- [ ] 7. Input tables: same columns as the form grid, no computed columns
- [ ] 8. Side panel: sticky beside the form on wide screens, above it when narrow
- [ ] 9. Errors & submit: summary on top, message at the field, submit never disabled
- [ ] 10. Tablet: 4 -> 2 columns by the form's own width (container query); tables subdivide the 2 columns
- [ ] 11. Verify: re-run form_audit.py at its default widths (+ an error state), read the screenshots
```

Step details live in the references; read the one for the step you are on.

## Quick reference

| Topic | Rule |
|---|---|
| Columns | Long expert data entry: 4 → 2. Short/public forms: 1 column. Never stretch to the viewport; max ~880px for 4 columns |
| Rows | One idea per row (b, h, L / postcode + city), preferably ≤ 3 inputs. Unrelated fields never share a row to "use the space" |
| Placement | Explicit per layout: `style="--c4: 3 / span 1; --c2: 1 / span 1"`. A row-starting field restarts at column 1 in every layout |
| Width | Expected length, then **rounded up to whole columns**. 1 col: numbers, codes, postcode. 2: name, email. 4: free text |
| Half columns | Only for a run of short related fields: 8-column subdivision shares every 4-column line |
| 5 fields, 4 columns | 1) split 3 + 2 by meaning, 2) add sub-headings, 3) cluster on half columns if all short & alike, 4) 4 + 1 with the 5th at column 1 |
| Spacing | label→input 4–8px < row→row 16–24px < group→group 40px+ with a heading. Gutter 24px everywhere |
| Labels | Visible, above the input, left-aligned; units in the label or a suffix; hint between label and input |
| Alignment | Labels of different heights in one row: `.control { margin-top: auto }` keeps inputs level |
| Groups | One heading (`<fieldset><legend>` or a heading) per group; sub-heading for sub-groups; no boxes inside boxes |
| Input table | Table columns = form columns; `border-spacing: var(--gut)`; widened by one gutter per side; the box around the form (page or card) has side padding ≥ gutter |
| Table rows | Row label in column 1 with its remove ✕; Remove only with 2+ rows; "+ Add row" under the table; drop computed columns |
| Side panel | Form left (its own container), panel right `position: sticky`; below ~1100px: panel above the form, compact, collapsible |
| Errors | Summary at the top of the form listing every error as a link; message between label/hint and input (default; keep the project's convention if it has one); red border + text |
| Submit | Never disabled; primary first, left-aligned with the form edge, right after the last field |
| Tablet | Same groups and rows; 4 → 2 columns from the form's width; a 4-column input table keeps 4 columns on the half lines |

## References

- **references/grid-and-widths.md**: column count, explicit placement, snapping, half columns, the 5-on-4 decision, spacing, breakpoints, worked numbers. Steps 3–6, 10.
- **references/input-tables.md**: tables of inputs on the grid, the 8-column recipe, add/remove rows, row errors, computed values. Step 7.
- **references/panels-and-errors.md**: side diagram/preview panel, error summary and field messages, submit and buttons. Steps 8–9.
- **references/evidence.md**: what each rule rests on (studies, design systems, books) and where sources disagree. Read when you must justify a decision or a rule seems to conflict with the project.
- **references/web-sources.md**: the full web research behind evidence.md (quotes, URLs, verification notes, 48 sources). Read only to check a specific claim.

## Assets and script

Paths are relative to this skill's base directory (shown when the skill loads); copy assets into the project, run the script from anywhere with its full path.

- **assets/form-grid.css**: grid with container-query breakpoints, field placement vars, half grid, input table on the grid, side panel, error summary. Copy the parts you need.
- **assets/example-form.html**: one complete form using it (groups, 5-field split, input table with add/remove and row errors, sketch panel, summary). Open it next to the CSS to see the markup contract.
- **scripts/form_audit.py**: `python3 scripts/form_audit.py PAGE.html [--widths 1280,1000,760] [--grid ".form-grid"] [--query "..."] [--before-js "..."] [--shots DIR]`. Needs only Python 3 and Chrome. Reports distinct left/right edges, off-grid controls, sub-column edges, disabled submit and horizontal overflow per width; `--before-js` can submit the form to audit the error state. Default widths cover panel-beside-form (1280), 4 columns (1000) and 2 columns (760); add others with `--widths`. It writes a temporary `.form_audit_<pid>.html` next to the page and deletes it. Run `--help` for details.

Read the audit like this: fewer distinct edges is better (a 4-column form should show about 4 left and 4 right edges per width); "off-grid" must be 0; "sub-column" is fine for an input table or half grid; any horizontal overflow is a bug.

## Common mistakes

| Mistake | Fix |
|---|---|
| Auto-flow fills rows in DOM order: material and geometry share a row | Write rows by meaning; place each field explicitly |
| Orphan field stretched to the full row, or gap filled with the next group's fields | Split by meaning (3 + 2), or leave the cells empty |
| Inputs keep per-field pixel widths (`style="width:80px"`) | Remove them; span whole columns |
| Table of inputs gets its own column widths (auto layout, `width: 90%`) | Put it on the form grid (input-tables.md) |
| Computed/read-only column (utilisation, totals) inside the input table | Move it to results, summary or the diagram |
| Table widened by the gutter inside a page or card with smaller side padding | Padding ≥ gutter on the nearest box around the form; audit at 760px |
| Viewport media queries for a form that shares the row with a panel | Container queries on the form wrapper |
| `order` used to move the panel, so tab order jumps around the screen | Change DOM order instead; place with `grid-column` |
| Submit `disabled` until valid; browser validation bubbles | Enabled submit, `novalidate`, summary + field messages |
| Buttons pushed right in a footer bar, primary last | Primary first, left, aligned with the form's left edge |
| Declaring done from one screenshot | Audit every default width and an error state; read every screenshot |
