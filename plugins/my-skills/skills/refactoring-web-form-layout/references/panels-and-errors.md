# Side panels, errors and submit

## Contents
- Form with a diagram, preview or summary beside it
- Linking fields and the diagram
- Error summary
- Error message at the field
- Errors in a grid row
- Submit, buttons and actions
- Labels, hints, units

## Form with a diagram, preview or summary beside it

Typical cases: engineering calculators (section sketch), configurators (product preview),
checkout (order summary), editors (live preview).

Layout:
- Wide (≥ ~1100px viewport): two columns, `minmax(0, var(--form-max)) minmax(320px, 1fr)`. Form left, panel right, `position: sticky; top: 24px; max-height: calc(100vh - 48px); overflow: auto` so the panel stays in view while the form scrolls. Put `align-items: start` on the parent or sticky does nothing.
- The form's column count comes from **its own width** (`.form-shell { container-type: inline-size }`). Between ~1100 and ~1250px the panel takes space and the form drops from 4 to 2 columns automatically; a viewport media query would keep 4 squeezed columns.
- Below ~1100px: one column of content. Decide where the panel goes by what it does:
  - Reference the user needs while typing (sketch with symbols b, h, L): **above** the form, no wider than the form, height capped, with a "Hide sketch" toggle.
  - Result or summary of what was entered (order summary, output preview): **below** the form.
- Keep the DOM order the same as the order on screen at narrow widths; at wide widths place the panel with `grid-column`/`grid-row`. Do not use `order`.
- Cap the diagram's height (`max-height` on the svg) so a tall drawing cannot push the form below the fold.

## Linking fields and the diagram

- Use the diagram's symbols in the labels ("Width b", "Span L") and the units in the field suffix.
- Optional, high value for engineering forms: focusing a field highlights its dimension on the diagram; hovering a dimension highlights the field. Both directions, same colour.
- A text line under the diagram restating the current values ("b × h = 220 × 500 mm, L = 6 m") lets users check numbers without reading the drawing.
- Computed values (q = g + p, utilisation, reactions) belong in the panel or a results block, not in the inputs area. Mark them stale when an input changes after the last calculation.

## Error summary

On submit with errors:
1. A summary box at the top of the form: heading "There is a problem", a list of links, one per error, worded like the field message. Clicking a link scrolls to the field and puts the cursor in it.
2. Scroll the summary into view.
3. Prefix the page title: "(2 errors) RC beam check" (visible in the browser tab).
4. Hide the summary when there are no errors; same place for client and server errors.

## Error message at the field

- Default position: **between the label (and hint) and the input**; the on-screen keyboard and autofill cannot cover it (FDP, GOV.UK). Some books put it below the input; if the project already does that consistently, keep it.
- Never colour alone: text + thicker red border (+ icon if the design system has one).
- Validate on submit; after an error is shown, re-check that field as the user types and clear the message when fixed.
- A message must describe the actual problem. Do not keep a "Required" message under a field that has a value.

## Errors in a grid row

When one field in a row grows a message and its neighbours do not, the inputs drift out of line.
Keep the message in the field's column and make the input boxes level:

```css
.field   { display: flex; flex-direction: column; }
.control { margin-top: auto; }   /* label + hint + message above; the box is pushed to the row bottom */
```

With the message below the input instead, reserve the line (`min-height` on the message slot) or
accept that rows grow; never let one input jump up.

## Submit, buttons and actions

- `<form novalidate>` and validate in the form's `submit` handler (Enter submits too). Do not disable the submit button until the form is valid: users cannot see why it is disabled.
- A valid submit does what the source did; do not change it.
- Primary action first, left-aligned on the form's left edge, directly after the last field; secondary as an outlined button next to it. (Some systems put the forward action on the right; follow the product's existing convention if it has one, consistently.)
- Avoid a Reset button; if the source has one, keep it secondary and visually weaker than submit.
- "Add row" / "Add another" is a text-style button under the thing it adds to.

## Labels, hints, units

- Visible label above every control, left-aligned, sentence case; no placeholder-as-label; no floating labels.
- Hint text between label and input, smaller and muted.
- Units: in the label ("L (m)") or as a suffix inside the input; in tables, in the column header.
- Mark optional fields "(optional)" rather than starring every required one, but only when the source says which fields are optional.
