# Ch 21: Field Patterns & Common Flows

Sources: [FDP] Silver, *Form Design Patterns* · [UXM] UX Movement forms and login articles · [PUI] ch8 · [UXP] bonus tips · [DUI] ch17 · [FRZ] 11.6 (ISO 9241-161 elements) · [NIE] · [PED] forms · [MAR] "A Flow" · [CHM] ch2 · Synthesised in the library notes `Web_Form_Design_Knowledge.md`

## Contents
- Core idea
- Specific fields (names, email, passwords, phone, address, payment, dates, times, file upload, search)
- Flows (login and signup, checkout, filters, bulk actions)
- Audit checks (FP1–FP16)
- Quick form checklist
- Conflicts

## Core Idea
ch09 covers how any form is built; this chapter covers the fields and flows that every product re-implements and most get wrong in the same ways. Each pattern has a known best default; departures need a reason.

## Specific fields
- **Names** — ask only if needed [FDP]. One "Full name" field is the inclusive default (double surnames, family-name-first orders, single names); split fields only when a system truly needs parts [UXM] (PED prefers splitting). Never validate against a Latin-letters pattern.
- **Email** — `type=email`, `autocomplete=email`, say why you ask ("We'll send your receipt here") [FDP]. **No "Confirm email" field**: it doubles typing and still lets typos through; use a large, readable input instead [UXM]. Autocorrect and autocapitalise off.
- **Passwords** — **no "Confirm password" field**; give a **Show/Hide toggle** (`<button type="button">` switching `type`, labelled "Show password", or `aria-pressed`) [FDP][UXP][UXM][DUI]. Show the rules *before* typing, in the hint, **on login too**; a live checklist that ticks off met rules (above the field, so the keyboard doesn't hide it) is fine [FDP][PUI][UXP]. Never block paste; `autocomplete="new-password"` on signup, `"current-password"` on login (ch15 A20).
- **Phone** — `type=tel`, `autocomplete=tel`, optional unless needed and say why ("The courier texts you on delivery day") [FDP]. One field with a forgiving, localised format; **never split into 3 boxes** [UXM]. Errors name the expected length for the chosen country [UXM].
- **Address** — postcode lookup with a "Enter address manually" fallback; narrow postcode field; city/state filled from postcode where reliable [FDP][UXM]; verify and suggest corrections instead of rejecting [FRZ]. Billing: **"Same as delivery address" checked by default**, revealing the billing fields when unchecked [FDP]. Country: autocomplete, not a 200-item select [UXM].
- **Payment** — minimum fields (number, expiry, CVC; name only if required); card number as a text field with `inputmode=numeric`, `autocomplete=cc-number`, spaces every 4 digits; expiry **one field in the card's MM/YY format**; CVC short with the hint "Last 3 digits on the back of the card"; no "Valid from" [FDP][UXM][UXP]. Final button names the commitment: **"Pay €129.00"** or "Place order", never "Continue" [FDP][PUI].
- **Dates** — choose by date type [FDP]: *dates on documents* (expiry, passport) match the document format; *memorable dates* (birth) = three text boxes Day / Month / Year in a `fieldset`/`legend`, `inputmode=numeric`, not three selects (they allow 31 Feb); *near-future dates* (bookings) = a date picker, inline below the input, keyboard grid (`role=grid`, arrows, Esc), echoing the chosen date as text [FDP][FRZ]. Always state the format and day/month order [PED][FRZ]; keep one format across the product [NIE].
- **Times** — no 24-option selects; "HH:MM" fields with AM/PM or 24 h per locale, "From/To" labels, an Open/Closed toggle that hides times when closed, "+" to add a slot [UXM]; offer common times as suggestions that still accept typing [FRZ].
- **File upload** — start from the native `<input type=file>` with the normal label/hint/error; restyling it as a button breaks names, hints and errors [FDP]. State constraints up front ("PNG, JPG or PDF, up to 10 MB each"). Drag and drop only as an enhancement: dashed drop zone, whole zone clickable, highlight on drag-over, picker still available [FDP][UXM]. Per-file progress, then name + size + Remove; errors name the file and the limit ("photo.heic is too big. Files must be smaller than 10 MB."); announce states in a live region [FDP]. Hint where files usually are on the device [FDP].
- **Search** — search everything or label the scope ("Search products"); `role=search`, a (visually hidden) label, a real submit button with the magnifier inside it; single-field search may put the button inline to the right [FDP][PUI]. Results keep the query, show the count, offer sort; pagination or "Show more", not infinite scroll by default [FDP]. Track zero-result queries and design the no-results state (suggestions, spelling, browse) (ch10 N7).

## Flows
- **Login and signup** [FDP][UXM]
  - One form per page; don't put login and registration side by side; link to the other form at the top.
  - Label the identifier the way registration did ("Email address", or "Email or username" if both work); accept the identifiers users actually have.
  - Distinct wording pairs: "Sign in" ↔ "Create account" (or Log in ↔ Log out), consistent across URLs, headings, buttons; make signup look different from login ("Welcome back" vs "Create your account").
  - Show/Hide password, rules visible on both forms; no split one-character code boxes that auto-advance unless the platform's one-time-code autofill works.
  - "Forgot password?" must not sit between the identifier and password fields (it steals Tab) or between password and submit: put it before the form or after the button. Submit is the last control.
  - Remember by default ("Keep me signed in" or a timeout choice) rather than an unchecked "Remember me"; allow several attempts before lockout and send a reset link automatically [UXM].
  - Social sign-in: ≤4 providers, plain buttons with the provider's logo, privacy reassurance ("We never post without asking") [UXM][FDP].
  - Signup asks for account data only; profile and survey questions move to onboarding [UXM]. Terms acceptance by wording ("By creating an account you agree to…") or an unticked box — never pre-ticked (ch20 ET2).
- **Checkout** [FDP][MAR]
  - Guest checkout always; offer account creation on the confirmation page with its benefit.
  - Order: email → delivery address → delivery options (radios with price and time in the label, cheapest-standard preselected) → payment → review ("Check your order") → confirmation.
  - Total cost, shipping and fees visible before payment (ch20 ET6); the final button states the amount.
  - Diagnose drop-off from the **last step backwards**: losing a user at payment costs most [MAR].
- **Filters** [FDP][UXM]
  - Only when results are many. Batch filters (choose several, then Apply) with real checkboxes and radios; if filters apply instantly, announce the result count in a live region, keep the back button working (state in the URL), and never auto-submit on change of a radio group (WCAG 3.2.2).
  - Show active filters as removable chips above results, plus "Clear all"; selected options stay checked in place.
  - Mobile: a filter sheet with a visible "Show 24 results" button.
- **Bulk actions** [FDP] — a checkbox per row with a hidden label naming the row; "Select all" as a button; actions above the list, enabled once something is selected (or explain why not); success message with Undo.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| FP1 | No confirm fields | No "Confirm email" / "Confirm password"; password has a Show/Hide toggle | FDP, UXM, UXP, DUI |
| FP2 | Password rules visible | Rules shown before typing on signup and login; live checklist optional | FDP, PUI |
| FP3 | Autofill-ready | Correct `type`, `inputmode`, `autocomplete` on name, email, tel, address, cc-*, one-time-code, current/new-password | FDP, KUL |
| FP4 | No split inputs | Phone, card number, name and codes are single fields, unless a platform one-time-code field autofills | UXM, FDP |
| FP5 | Inclusive names | One full-name field unless parts are truly needed; no character-set validation | UXM, FDP |
| FP6 | Address entry | Lookup with manual fallback; billing "same as delivery" checked by default; country by autocomplete | FDP, UXM |
| FP7 | Payment fields | Minimum fields; MM/YY single expiry; CVC hint; final button names the amount or "Place order" | FDP, UXM, PUI |
| FP8 | Date control fits date type | Document dates match the document; birth dates as three text boxes in a fieldset; near dates use an accessible picker; format stated | FDP, FRZ, PED |
| FP9 | Upload is native-first | Native input visible or properly labelled; constraints stated before choosing; per-file progress and errors that name file and limit; drag-and-drop optional | FDP, UXM |
| FP10 | Search form | Labelled, `role=search`, real submit button; results keep query, show count, handle no results | FDP, PUI |
| FP11 | Login form order | Identifier → password → submit with nothing focusable in between; forgot-password before the form or after the button | FDP |
| FP12 | Login/signup distinct | Separate pages; distinct, consistent wording pairs; distinct titles and visuals | FDP, UXM |
| FP13 | Signup minimal | Account data only; consent not pre-ticked; guest path where a purchase is involved | UXM, FDP |
| FP14 | Checkout transparency | Costs before payment; delivery options with price + time; review step; confirmation with next steps | FDP, MAR |
| FP15 | Filters honest | Batch apply or announced live results; active filters removable; state in URL; no auto-submit on radio change | FDP, WCAG 3.2.2 |
| FP16 | Bulk actions | Row checkboxes named; select-all button; actions near the list; Undo after success | FDP |

## Quick form checklist
Use this as a last pass over any form (expands ch09 FM1–FM26 and the checks above):
- Every field justified; profile/survey questions after signup; optional fields last or removed.
- Long forms split into steps of related questions, easiest first; time and documents needed stated up front.
- Visible label above each field (sentence case, no "my", no "Enter…"); hints visible; placeholders only for format examples.
- Width matches expected input; one column, or justified short pairs.
- Correct `type`, `autocomplete`, keyboard; autocorrect off for usernames and emails.
- Radios for few options, autocomplete for long lists, steppers for small counts, dates by date type.
- Forgiving input: trim spaces, accept separators, case-insensitive codes.
- Error summary with links + inline errors + "(n errors)" in the page title; icon + text, never colour alone; messages say what and how to fix, no "invalid", "please" or "oops".
- Entered data never lost on error, Back or timeout.
- One primary button with a specific verb; no Reset button; submit enabled (or disabled with a visible reason and still focusable).
- Success shown and announced; destructive actions get friction proportional to risk, plus Undo.
- Field borders ≥3:1; input text ≥16 px; visible focus; `fieldset`/`legend` for groups; `aria-invalid` on errors; no auto-tabbing; no auto-submit on change.

## Conflicts
Form-specific disagreements between the books (label style, hint and error position, required/optional marking, chips vs radios, splitting inputs, DOB entry, forgot-password placement, signup wording, progress bars) are tabulated with defaults in cheatsheet.md → *Form conflicts*.

## Connects To
- **ch09** form structure and validation · **ch15** A20 accessible authentication · **ch16** upload and status messages · **ch20** consent and hidden costs · **ch10** search · **ch11** filters and bulk actions on tables
