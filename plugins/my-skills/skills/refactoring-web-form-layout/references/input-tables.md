# Tables whose cells are inputs

## Contents
- Table or repeated field groups?
- Put the table on the form grid
- More than 3 inputs per row: the 8-column recipe
- Fitting content to the columns
- Row label, remove, add row
- Row errors
- Computed values and totals
- Tablet width
- Checklist

## Table or repeated field groups?

| Use a table of inputs when | Use repeated field groups ("Add another") when |
|---|---|
| every row has the same few short fields (2–6), mostly numbers | rows have many fields, long text, or branching |
| users compare values down a column (spans, load cases, line items) | each item is entered once and rarely compared |
| expert / repeat users | occasional users |

A plain `<table>` with a native input in each cell is the default.

## Put the table on the form grid

The table's columns must be the form's columns: same count (or 2× for the 8-column recipe), same
widths, same gutter. A table with its own column widths (auto layout, `width: 90%` inputs, collapsed
borders) adds a second set of vertical lines under a carefully aligned form. Baseline agents without
this skill did exactly that: 9 left + 9 right edges and 10 off-grid inputs on a 4-column form.

```css
.input-table {
  width: calc(100% + 2 * var(--gut));   /* border-spacing also adds a gutter at both outer edges… */
  margin: 0 calc(-1 * var(--gut));      /* …so widen by one gutter per side and pull back */
  border-collapse: separate;
  border-spacing: var(--gut) 8px;       /* horizontal = the form gutter */
  table-layout: fixed;                  /* equal columns, independent of content */
}
.input-table td input { box-sizing: border-box; width: 100%; }
```

Result: with 4 table columns on a 4-column form, every input's edges coincide with the field edges
above. At the 2-column (tablet) layout the same 4 table columns split each form column in half
exactly (the audit reports them as "sub-column lines").

**Required:** the nearest box around the form (page, or the card the form sits in) has side padding
≥ the gutter, otherwise the widened table sticks out of it (found at 760px: 8px horizontal scroll).
Wrapping the table in `overflow: hidden` clips focus rings instead.

## More than 3 inputs per row: the 8-column recipe

`<colgroup><col span="8"></colgroup>` with `table-layout: fixed`; row label `<th colspan="2">`, a text
input `<td colspan="2">`, each number one column. A 2-column cell equals one form column
(2 × col8 + gutter = col4), so label and name land on form lines and numbers on half-column lines
(quarter lines at the 2-column layout). Verified with the audit: 0 off-grid at 1000px and 760px.

```html
<table class="input-table">
  <colgroup><col span="8"></colgroup>
  <thead><tr>
    <th colspan="2">Combination</th><th colspan="2">Name</th>
    <th>N<sub>Ed</sub> (kN)</th><th>M<sub>y</sub> top (kNm)</th><th>M<sub>y</sub> bot (kNm)</th><th>M<sub>z</sub> (kNm)</th>
  </tr></thead>
  <tbody><tr>
    <th colspan="2">1 <button type="button" class="remove">✕</button></th>
    <td colspan="2"><input name="combo[0][name]"></td>
    <td><input name="combo[0][N]"></td><td><input name="combo[0][Mt]"></td>
    <td><input name="combo[0][Mb]"></td><td><input name="combo[0][Mz]"></td>
  </tr></tbody>
</table>
```

More than 6 inputs per row: reconsider repeated field groups, or split the row's data into two tables
(e.g. forces and moments).

## Fitting content to the columns

- Column 1 = row label (+ remove button). The remaining columns = inputs, one column each.
- **Drop computed columns** (q = g + p, utilisation, per-row totals) from the input table. Show them in results, the summary panel or the diagram. Read-only values between input boxes look editable or broken.
- Units go in the column header ("L (m)"), not inside every cell.
- Numbers right-aligned with `font-variant-numeric: tabular-nums`; header text aligned like its data.

## Row label, remove, add row

- **Remove** (✕) sits in the row-label cell and appears only when there are 2+ rows. Renumber rows after removal.
- **Add**: a text button under the table ("+ Add span"), left-aligned with the table. A new row copies values that usually repeat (loads from the previous span) and leaves the distinguishing value empty.
- A one-line summary in the caption ("3 spans, total length 14.5 m") gives the table a heading that stays true as rows change.

## Row errors

- One error line per row, in its own `<tr class="row-error">`, starting under the first input column (`<td></td><td colspan="3">`), so the message's left edge is a grid line.
- Inputs with a problem get the field error style (red, thicker border).
- Messages name the row: "Span 2: enter L". The error summary at the top lists them too.

## Computed values and totals

- Totals of a column go in a `tfoot` cell in the same column, or in the caption. Not both unless the table is long.
- If the user explicitly wants a computed value inside the table: put it in its own last column, plain text (no input box), right-aligned, header marked "(calculated)", and show "–" until it has been calculated. Values that go stale after an input changes must look stale (greyed, "recalculate").

## Tablet width

When the form drops to 2 columns, keep the table's column count: 4 table columns become half-columns,
8 become quarter-columns. If a quarter column is too narrow for its values (under ~70px), switch that
table to repeated field groups at this width instead of letting it scroll sideways.

## Checklist

- [ ] Table columns = form columns (count or 2×, widths, gutter); `table-layout: fixed`
- [ ] Padding ≥ gutter on the box around the form (no horizontal scroll at 760px)
- [ ] No computed/read-only columns among inputs; units in headers
- [ ] Remove only with 2+ rows; "+ Add row" under the table
- [ ] Row error line starts on a column line
- [ ] Audit: 0 off-grid; sub-column edges only inside the table
