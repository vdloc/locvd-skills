# Ch 09: Forms, Inputs & Validation

Sources: [PUI] ch8 · [TID] ch10 · [KUL] forms · [WSG] ch7 · [RUI] "Avoid ambiguous spacing" | **Derived sources** (not in the five books, see [research/form-page-layout-principles.md](../research/form-page-layout-principles.md)): Wroblewski/Penzo eye-tracking research, Baymard Institute field studies, NN/g articles, Apple HIG, Material Design 3, WCAG 2.2 — marked "(derived; not in source books)" in Audit Checks below

## Core Idea
Forms are work you ask of users: ask for less, lay it out as one clear downward path, label everything visibly, choose the control that minimises effort for the data type, prevent errors before they happen, and when they do, say exactly what went wrong, where, and how to fix it.

## Frameworks Introduced
- **Basics of form design** [TID]: respect time & attention; explain the purpose (why asked, how used, what they get); minimise inputs (derive city from postcode, card type from number); minimise clutter; group & title sections; show/hide long sections; strong vertical alignment; mark required vs optional consistently; descriptive labels + examples; field width previews input length; accept format variations; validate early and actionably; top-aligned labels for responsive (**except mobile landscape** — Baymard's 18-site mobile study, `baymard.com/blog/mobile-form-usability-label-position`, found the on-screen keyboard consumes 67–82% of viewport height in landscape, so switch to left-aligned labels there to keep both label and input visible while typing); internationalise; confirm success + next step; usability-test forms.
- **Single-column layout** [PUI]: consistent downward momentum, no missed fields (magnifier users); labels stacked *above* inputs (not left: zig-zag, jagged, wrapping); stack checkboxes/radios vertically; short related fields side-by-side is fine (expiry + CVC); very long → multi-step.
- **Labels close to their fields** [PUI][RUI]: label→input gap (e.g. 4–8px) much smaller than field→field gap (e.g. 24–32px). Reference implementation: Material Design 3 text-field spec (`m3.material.io/components/text-fields/specs`) ships 16dp padding above the label, 8dp below the label, 8dp above/below the input line for normal density — a concrete, shipped number set at this same ratio.
- **Diagram/illustration placed at the field it explains, not in a separate help panel** — two independent first-party sources converge: Baymard's checkout research (`baymard.com/learn/input-fields`) found 38% of test participants stalled at a credit-card "Security Code" field with no visual aid; adding an inline image of the card with the code location resolved it. NN/g (Wang, *"Few Guesses, More Success"*) documents the same pattern for a product serial-number field paired with a location illustration. Rule: when the hard part of a field is *finding* the value (physically printed somewhere), not *knowing the format*, an inline image beats text — this is a scoped exception to "no tooltips for hints" below, because the content is a location image, not a text rule that must be read before typing.
- **Standardise field width as a grouping signal, not just an input-length affordance** — Apple HIG (text fields): "use consistent widths to create a more organized layout" for related fields (first/last name share one width; address/city another) — a second use for field width alongside "match width to expected answer length" below.
- **Required & optional** —
  - [PUI] mark both: required with `*` (not red) + instruction at top, or "(required)" (safest); optional "(optional)". May skip marking for short familiar forms (login, newsletter), products with no optional fields, one-question-per-screen.
  - [KUL] mark only the minority — usually optional fields — to reduce clutter.
  - [TID] NN/g: marking required fields most usable; USWDS & GOV.UK: mark optional only.
  - [WSG] asterisk + programmatic `required`, never colour-only.
  - **Spatially separate, not just mark** — Tullis & Pons (1997), via Bargas-Avila et al. (2010) *"Simple but Crucial User Interfaces in the WWW"*: people filled required fields fastest when required and optional fields were *physically grouped apart*, independent of marking convention. Interleaved required/optional fields in one visual block is a distinct problem from unmarked fields — group required fields together, optional fields in their own section (or behind opt-in per the bullet below), don't rely on `*`/`(optional)` text alone to do this job.
- **Prefer opt-in to optional fields** [PUI]: checkbox "Receive updates via text message" reveals a required "Mobile number" (progressive disclosure).
- **Match field width to input** [PUI][TID][KUL]: postcode 4–5 chars, CVC 3–4; width sets expectation.
- **Conventional field styles** [PUI][WSG]: bordered rectangle, label above; radio circle left of label; checkbox square — keep iconic parts when customising (selectable cards still show the radio circle).
- **Hints above fields** [PUI]: tell password rules *before* typing; below-field hints get covered by autofill/keyboards; critical hints visible, not in tooltips. [TID] *Input Hints*: short, ~2pt smaller, beside/below — reconcile: place under the label, above the input.
- **No placeholder as label** [PUI][WSG]: disappears when typing, looks pre-filled, low contrast. Exception: single search field with ≥4.5:1 placeholder + accessible label. [TID] *Input Prompt* ("Choose a state") only when no good default; [KUL] floating labels acceptable if they stay visible.
- **Choosing controls** —
  | Data | Preferred control | Src |
  |---|---|---|
  | 2 options, applies on submit | single checkbox, positive phrasing ("Allow automatic updates") | PUI, WSG |
  | 2 options, immediate effect | toggle switch | PUI |
  | ≤5 options | radio buttons (always visible) | WSG (4–6), PUI |
  | ~6–10 options | radios if space allows, else select | PUI (≤10), KUL (>5 dropdown) |
  | long known list (country) | autocomplete ("start typing"), ≤~10 suggestions, bold the matched difference | PUI, TID, WSG |
  | long unfamiliar list (occupation) | split into two (industry → occupation) | PUI |
  | small numeric change | stepper: horizontal, +/− (not chevrons), ≥48pt buttons | PUI |
  | date/year of birth | typed input (with format) > giant year dropdown; date picker as helper | WSG |
  | subset from large source | List Builder (source ↔ destination) | TID |
  | complex choice in small space | Drop-down Chooser (calendar, colour grid, tree) | TID |
  | fixed-format universal data (card no.) | Structured Format (auto-advance) — never for names/addresses/phones internationally | TID |
  | variable formats (dates, phone) | Forgiving Format (parse many) | TID |
  | new password | Password Strength Meter + rules up front + show/hide toggle | TID |
- **Good Defaults & Smart Prefills** [TID]: prefill when most users won't change (location, today, known account data); never for sensitive answers (gender, citizenship, passwords). Menus default to non-actionable ("Select an item"), checkboxes unchecked [WSG].
- **Input types** [KUL]: `type=email/tel/number/url`, `inputmode`, `autocomplete` tokens → right keyboards & autofill.
- **Multi-step forms** [PUI][TID][KUL]: tell duration & what's needed upfront; chunk (30 questions → ~6 steps of 5); easiest first; progress indicator (Goal-Gradient Effect); review & edit before submit; success message + what happens next. Wizard only when the task is long/novel/branched; don't create a 2-step wizard [TID]. If steps repeat a help mechanism (contextual illustration, help link, chat trigger) across more than one step, keep it in the **same relative position** on every step — WCAG 2.2 SC 3.2.6 *Consistent Help* requires this for any help mechanism repeated across a set of pages.
- **Group related fields under headings** when you can't split [PUI].
- **Borders ≥3:1** on inputs, checkboxes, radios, toggles, steppers [PUI].
- **Validation approaches** [PUI]:
  1. *On submit*: error summary at top ("2 errors — Correct them and apply again") with links to fields; message above invalid field; red border + tinted bg + icon; don't disable submit. Simple; but late feedback.
  2. *On blur (inline)*: immediate, in context; positive confirmation possible; clear error once fixed; poor for checkbox groups; can distract.
  3. *As you type (debounced)*: for password criteria, username availability; risks premature errors.
  Mix per field. [TID][WSG]: no modal error dialogs, no separate error page; client-side validation; field-specific message next to control; summary at top for long forms (read first by screen readers).
- **Error message content** [PUI][WSG][KUL]: what happened, why, how to fix; specific ("Your password is incorrect" next to the password field); never blame; no "Oops/please/sorry"; plain language; descriptive heading & action ("Payment failed · Update your payment details and try again · [Update payment details]"). Prevent first: dropdowns for limited sets, hints, forgiving formats, autocomplete, defaults, fewer fields.
- **Floating labels & new conventions** [TID]: evaluate for your audience; test.

## Key Concepts
- **Opt-in field**: optional data requested only after explicit choice [PUI].
- **Inline validation (on blur)**.
- **Error summary**: linked list of errors atop the form.
- **Forgiving / Structured Format** [TID].
- **Goal-Gradient Effect**: motivation rises near completion [PUI].
- **Gatekeeper form**: sign-up/purchase standing between user and goal → Center Stage or Modal Panel with few distractions [TID].

## Mental Models
- Every field costs completion rate; justify each one.
- Labels are permanent, hints are prep, placeholders are decoration.
- Choose controls by *effort to answer*, not by screen tidiness.
- Validation should feel like a helpful colleague, not a border guard.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| FM1 | Field necessity | Every field justified; derivable data not asked | PUI, TID |
| FM2 | Layout | Single column; labels above; checkboxes/radios stacked; logical order; headings for groups | PUI |
| FM3 | Labels | Visible persistent `<label for>` on every control; no placeholder-only labels; no "my/your"; no instructional verbs ("Type your email") | PUI, WSG |
| FM4 | Required/optional | One consistent, explained, non-colour convention; programmatic `required` | PUI, TID, WSG |
| FM5 | Hints | Format/rules visible before input (under label); not hidden in tooltips | PUI, TID |
| FM6 | Control fit | Right control per data type (see table); no 200-item dropdowns; no dropdown for 2–4 options | PUI, WSG, TID |
| FM7 | Field sizing | Widths reflect expected length | PUI, TID |
| FM8 | Keyboards/autofill | Correct `type`, `inputmode`, `autocomplete` | KUL |
| FM9 | Contrast | Input borders ≥3:1; labels/text ≥4.5:1; focus visible | PUI |
| FM10 | Validation timing | Inline for complex fields; submit never disabled silently; no premature errors while typing | PUI, TID |
| FM11 | Error presentation | Message adjacent to field + icon + non-colour cue; summary with links for long forms; focus moves to summary/first error; announced to AT | PUI, TID, WSG |
| FM12 | Error wording | What/why/how-to-fix; no blame/jargon/"Oops"; preserved user input | PUI, WSG |
| FM13 | Long forms | Steps with progress, duration notice, review screen, success + next steps; state saved | PUI, TID |
| FM14 | Defaults | Sensible non-sensitive prefills; selects default to neutral option | TID, WSG |
| FM15 | Spacing | Label↔input ≪ field↔field | RUI, PUI |
| FM16 | Locatable-value diagram | Fields asking for a physically-located value (security code, serial number, activation code) paired with an inline image/diagram showing where to find it, not text-only hints | Baymard, NN/g (derived; not in source books) |
| FM17 | Mobile landscape labels | Labels switch to left-aligned in landscape mobile (keyboard covers 67–82% of viewport); top-aligned in portrait | Baymard (derived; not in source books) |
| FM18 | Width as grouping signal | Related fields sharing a row (name parts, address parts) use consistent widths within the group, distinct from unrelated groups | Apple HIG (derived; not in source books) |
| FM19 | Tab order | Focus order through fields follows visual/logical reading order, not DOM-arbitrary order | Apple HIG, WCAG SC 1.3.2 |
| FM20 | Required/optional grouping | Required and optional fields spatially grouped apart, not interleaved, independent of marking convention | Tullis & Pons 1997 via Bargas-Avila et al. 2010 (derived; not in source books) |

## Fix Recipes
```html
<p class="form-note">Required fields are marked with an asterisk <span aria-hidden="true">*</span></p>
<div class="field">
  <label for="email">Email <span aria-hidden="true">*</span></label>
  <p id="email-hint" class="hint">We'll send your receipt here</p>
  <input id="email" name="email" type="email" autocomplete="email" required
         aria-describedby="email-hint email-error" aria-invalid="true">
  <p id="email-error" class="error"><svg aria-hidden="true" class="icon-alert"></svg>Enter an email address like name@example.com</p>
</div>
<fieldset class="field">
  <legend>How should we contact you?</legend>
  <label><input type="radio" name="contact" value="email"> Email</label>
  <label><input type="radio" name="contact" value="sms"> SMS</label>
</fieldset>
```
```css
.form{ display:grid; gap:1.5rem; max-width:36rem; }
.field{ display:grid; gap:.375rem; }
.field input{ min-height:44px; padding:.5rem .75rem; border:1px solid var(--stroke-strong); border-radius:6px; }
.field input:focus-visible{ outline:3px solid var(--blue-500); outline-offset:1px; }
.field input[aria-invalid="true"]{ border:2px solid var(--text-error); background:var(--fill-error-weak); }
.error{ color:var(--text-error); display:flex; gap:.375rem; font-size:.875rem; }
.input-postcode{ inline-size:7ch; }
```
1. **Placeholder labels** → real labels above; move examples into hint text.
2. **Two-column form** → single column; keep only tightly related short pairs inline.
3. **Disabled submit until valid** → enable; validate on submit + on blur; summary with anchor links; focus management.
4. **Country `<select>` of 200** → autocomplete combobox with search; recent/common options first.
5. **Optional-field bloat** → remove or convert to opt-in.
6. **Vague error "Invalid input"** → specific cause + example + fix.
7. **Long survey on one page** → 5–7 themed steps, progress "Step 2 of 4", review screen.

## Conflicts & Context
- **Required vs optional marking** — [PUI] both; [KUL] minority/optional only; [TID] NN/g all required vs gov standards optional-only. Recommendation: pick one per product; if most fields are required, mark optional "(optional)" and state "All fields required unless marked optional" *only* if testing shows people read it; otherwise PUI's asterisk + note. Always programmatic `required`. **Tension**: PUI specifies the asterisk "not red," but Pauwels et al. (2009), via Bargas-Avila et al. (2010), found colour-highlighted required fields outperformed asterisk-only on speed, errors, and satisfaction in a controlled study. Not resolved here — flag as a candidate to A/B test rather than overturning PUI's default.
- **Radios vs dropdown thresholds** — ≤10 [PUI], 4–6 [WSG], dropdown >5 [KUL]. Use radios up to ~5 always, ~6–10 when vertical space allows.
- **Disabled buttons / Input Prompt** — see ch08 conflict; default to enabled + validation.
- **Hint position** — above field [PUI] vs below/beside [TID]. Prefer under the label (above input): visible before typing, not hidden by keyboard.
- **On-blur inline validation** — Baymard's field research (`baymard.com/blog/inline-form-validation`) favours on-blur inline validation (32% of e-commerce sites lack any field-level validation; on-blur catches errors while fresh in mind). Bargas-Avila et al. (2009), in a controlled lab study, found the opposite: participants shown on-blur error messages made significantly *more* errors than those shown end-of-submit/pop-up presentation, because they ignored appearing-and-disappearing inline messages. FM10 keeps on-blur as the default (Baymard's larger, more recent field sample is the better bet for most products) — but treat it as a documented open tension, not settled fact, and consider testing end-of-submit presentation if on-blur validation isn't reducing errors in your own metrics.

## Anti-patterns
- **Placeholder as label** [PUI][WSG].
- **Labels left of inputs with jagged alignment** [PUI].
- **Horizontal radio rows** (mis-taps) [PUI][KUL].
- **Low-contrast borderless inputs** [PUI].
- **Error pages / modal error dialogs** [TID].
- **Colour-only error states** [PUI].
- **Negative checkbox labels** ("Don't send me emails") [PUI].
- **Structured Format for names/phones internationally** [TID].
- **Translucent inputs on gradients** [KUL].

## Worked Example
*Registration form rebuild [PUI]:* Before — two columns (Street/City, State/Postcode), placeholders as labels, optional "Mobile number" field, disabled "Pay" until complete, errors only as red borders. After — intro line "Required fields are marked with an asterisk *"; single column; labels above with 4pt gap, 32pt between fields; postcode input sized to 4 digits; mobile number removed and replaced by checkbox "Receive updates via text message" that reveals a required mobile field; "Pay $99.00" always enabled; on submit an error summary "2 errors were found" links to fields; each invalid field gets an error message above it, red border, tinted bg and alert icon; password rules shown in a hint before typing. Finally a success screen: "Thanks for registering — you'll receive an email confirmation shortly."

## Key Takeaways
1. Fewer fields; single column; labels above.
2. Visible labels always; hints before input; no placeholder labels.
3. Pick controls by answering effort.
4. Consistent required/optional convention, programmatic too.
5. Inline + submit validation; specific, adjacent, accessible errors; never silent disabled submit.
6. Chunk long forms with progress, review and success.

## Connects To
- **ch08** buttons & disabled states · **ch13** error copy · **ch15** labels/ARIA/focus · **ch03** spacing, L14 diagram-proximity/reading-order (general case of FM16/FM19)
