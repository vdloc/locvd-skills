# Grid, widths and awkward rows

## Contents
- Choosing the column count
- Placing fields: explicit placement per layout
- Field width: snap to columns
- Half columns (8-column subdivision)
- Rows with more fields than columns (5 on a 4-column grid)
- Spacing that shows grouping
- Tablet width: 4 → 2 columns
- Worked numbers

## Choosing the column count

| Situation | Grid |
|---|---|
| Short form (sign-up, login, checkout step, under ~8 fields) | 1 column, 320–500px wide. The second column saves no time here. |
| Long data-entry form used by repeat or expert users (engineering input, admin, back office) | 4 columns on desktop → 2 at tablet width |
| Medium form, mostly free-text fields | 2 columns |
| Form + diagram/preview beside it | the form is the container: it gets 2 or 4 columns depending on the width left over (container queries) |

Multi-column is acceptable only when **each row is one idea** (b, h, L; postcode + city; tolerance min + max)
and users read rows left to right. Fields that do not belong together never share a row
just because there is space.

Evidence check: every study found (Baymard, CXL N=702, Google CHI 2014) favours one field per row,
and allows 2–3 inputs per row only for one entity. No study shows multi-column winning. A 4-column
grid for expert data entry is a density choice: keep rows to ≤ 3 inputs where you can, use the 4th
column for a 4th value of the same idea or leave it empty. See evidence.md.

## Placing fields: explicit placement per layout

Write each field's placement once per layout instead of relying on auto-flow:

```html
<div class="field" style="--c4: 3 / span 1; --c2: 1 / span 1">…</div>
```
```css
.form-grid > .field { grid-column: var(--c2, auto / span 1); }                     /* 2 columns */
@container (min-width: 720px) { .form-grid > .field { grid-column: var(--c4, auto / span 1); } }
```

Rules:
- **Every row starts on column 1.** A field that starts a row in the 4-column layout also starts at column 1 in the 2-column layout (`--c2: 1 / span …`). Others may auto-place.
- Spans are whole columns. Never `span 1.5` with a percentage width.
- When a grid of `--c4` placements is reflowed to 2 columns, re-read each row: a 3-field row becomes 2 + 1; make sure the 1 is not a stranded member of a pair.
- Do not reorder fields with `order`: the visual order must match the source order, or the tab key jumps around the screen.

## Field width: snap to columns

Two valid rules, applied in this order:

1. **Width signals the expected input** (books: FDP p.81–84, PUI p.344–345; Baymard): a postcode field must look short, a street field long. A 4-digit field stretched across 880px tells the user something false.
2. **Edges sit on column lines.** Round the content width **up** to a whole number of columns. The field still looks short (1 of 4 columns), but every left and right edge lands on one of a few vertical lines.

Content-length widths (`max-width: 140px` on each input) satisfy rule 1 and break rule 2: on the
test form they produced 8 distinct left edges and 13 right edges; snapped, 4 and 4. Users read
the ragged version as messy. The UX Movement "33-field form" example makes the same point
(22 vertical lines → 10).

| Expected input | Columns at 4-col / 880px (≈202px each) |
|---|---|
| 1–8 characters: number with unit, code, postcode, year, floor | 1 |
| Name, email, phone, short select | 1–2 (email/name usually 2) |
| Address line, title, long select labels | 2–3 |
| Free text, textarea | 4 (full row) |

If 1 column is still far too wide for a 2-character field (e.g. ~200px for "3"), that is acceptable;
do not go below the column. If a run of very short fields must sit tighter, use half columns.

## Half columns (8-column subdivision)

An 8-column grid with the same gutter shares every line of the 4-column grid
(col4 = 2 × col8 + gutter). Use it for a run of short related fields (date parts, a 5-value
cluster of small numbers, tolerances), never for a single field:

```html
<div class="form-grid form-grid--half">
  <div class="field" style="--h8: 1 / span 1; --h4: 1 / span 1">…</div>
```

The audit script reports such edges as "on sub-column lines" rather than off-grid.

## Rows with more fields than columns (5 on a 4-column grid)

Decide by meaning, in this order:

1. **Split by meaning (3 + 2).** If the 5 fields are two ideas (dimensions b, h, L; covers a, a′), make two rows, each starting at column 1, each field 1 column. Leave the rest of each row empty.
2. **Sub-groups with headings.** Same split, but give each row a sub-heading ("Dimensions", "Cover") when the form is long or the split is not self-evident. The heading explains why rows have different counts.
3. **Cluster on half columns.** If all 5 are short values of the same kind (5 small numbers), put them in one row on the 8-column subdivision (or 5 equal tracks inside a full-width sub-grid when edges matter less than unity).
4. **4 + 1 deliberately.** Acceptable fallback: the 5th field at column 1 of the next row, 1 column wide, rows inside the group closer together (20px) than groups (40px+) so it still reads as part of the group.

Never:
- **Fill** the empty cells with fields from the next group to make the row "full": it merges two meanings into one visual row and forces the group heading to lie ("Section & material").
- **Stretch** the orphan field to the full row to balance it: the widest box on the form becomes the least important, and its width lies about the data.
- Centre or right-align the orphan.
- Shrink all 5 to fit one 4-column row with ad-hoc widths: edges leave the grid.

## Spacing that shows grouping

Proximity carries the structure; use three clearly different steps:

| Gap | Typical |
|---|---|
| label → its input | 4–8px |
| row → row inside a group | 16–24px |
| sub-group → sub-group | 28–32px + sub-heading |
| group → group | 40–48px + legend/heading with a rule |

Column gutter 24px is the common choice; keep it the same everywhere in the form (fields, input
tables, sub-grids) or the lines will not match.

## Tablet width: 4 → 2 columns

- Decide columns from the **form's own width** (`container-type: inline-size` on a wrapper) when anything can sit beside the form; viewport media queries only work when the form owns the page width.
- Threshold that works with 24px gutters: 4 columns from 720px of form width, 2 columns below. This 4 → 2 rule is a convention (Carbon halves its page grid 16 → 8), not a research finding.
- Re-read every row at 2 columns (`--c2`): a 3-field row becomes 2 + 1; keep pairs together (My top | My bot), put the odd field at column 1.
- The box around the form (page or card) needs side padding ≥ the gutter whenever an input table is widened by the gutter (see input-tables.md), or the page scrolls sideways at tablet widths.

## Worked numbers

Form max-width 880px, 4 columns, gutter 24px → column = (880 − 3 × 24) / 4 = 202px.
Lines (from the form's left edge): 0, 202 | 226, 428 | 452, 654 | 678, 880.
8-column subdivision: column = (880 − 7 × 24) / 8 = 89px; lines include all of the above.
2 columns at a 712px form: column = 344px; a 4-column input table at the same width has
columns of 160px whose lines are the 2-column lines plus each column's midpoint.
