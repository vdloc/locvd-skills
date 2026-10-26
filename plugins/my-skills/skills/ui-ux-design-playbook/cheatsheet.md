# Cheatsheet — Decisions, Thresholds, Tells

## Contents
- Thresholds & defaults
- Decision rules
- Source conflicts (defaults)
- Form conflicts (defaults)
- Trade-off matrix: validation timing [PUI]
- Tells & smells (if you see X → likely problem Y)

## Thresholds & defaults
| Thing | Default | Range / note | Src |
|---|---|---|---|
| Text contrast | ≥4.5:1 | large text (≥24px, ≥18.66px bold) ≥3:1 | PUI, RUI |
| UI component / meaningful icon / input border / focus ring | ≥3:1 | decorative exempt | PUI |
| APCA body text (optional extra check, not WCAG) | Lc 75 min, 90 preferred | UI elements 45; placeholder/disabled 30; pass WCAG 2 first | PUI |
| Touch target | 48×48 | iOS 44pt, Android 48dp; desktop button 40px tall OK with ≥44 hit | PUI, TID, KUL |
| Gap between targets | 16px | min 8px | PUI |
| Spacing scale | 4·8·12·16·24·32·48·64·80·96 | neighbours ≥~25% apart | RUI, PUI, KUL |
| Card padding / grid gap / section padding | 24 / 32 / 80 | 16–24 / 16–40 / 64–96 | PUI, KUL |
| Label→input / field→field | 4–8 / 24–32 | within ≪ between | PUI, RUI |
| Body text | 16px UI, 18px long-form | never <12px | RUI, PUI |
| Type scale | ~8–12 steps, px/rem | ratio 1.125–1.25 apps, 1.333–1.5 marketing | RUI, PUI |
| Weights | 2 (400 + 600/700) | none <400 at small sizes | RUI, PUI |
| Line length | 45–75 characters | ≈65ch; ≤80 | RUI, PUI, WSG |
| Line height | body 1.5–1.6 | headings 1.0–1.3; longer lines taller | RUI, PUI |
| Typefaces | 1 sans | ≤2 total; no decorative for text | PUI, WSG |
| Colour shades | 9 per hue (100–900) | greys 8–10 | RUI |
| Palette roles | brand, text strong/weak, stroke strong/weak, fill, bg + error/warn/success | ~7 roles | PUI |
| Shadows | 2 (raised, overlay) | up to 5 elevation levels | PUI, RUI |
| Radii | 3 (8/16/32) | never mix square+round | PUI, RUI |
| Grid | 12 cols desktop, 4 mobile | gutters 32/16, margins 80/16 | PUI, KUL |
| Primary buttons per view | 1 | 0 if no single top action | PUI, RUI |
| Top-level nav items | 5–7 | max ~7–10 | WSG |
| Simultaneous choices at one decision point | ≤4 comfortable · 5–7 group or disclose · 8+ overloaded | working-memory limit (Cowan); 1 primary + 1–2 secondary actions, rest in a menu | IMP |
| Radio vs dropdown | radios ≤5 | 6–10 radios if space; >10 autocomplete | WSG, PUI, KUL |
| Autocomplete suggestions | ≤10 | bold the difference | PUI |
| Multi-step form | ~5 questions/step | show progress + review | PUI |
| Loading feedback | >1s show indicator | >10s progress + cancel | TID, WSG |
| Animation | ~200–300ms | 100–150 small feedback · 200–300 components · 300–500 large surfaces; respect reduced motion (ch18) | TID, DUI |
| Toast | 1–2 lines, 240–360px wide, one at a time | auto-dismiss ≥5s only if non-critical and action-free; pause on hover/focus (ch16) | UXM, WCAG |
| Text styles per screen | ≤3–4 | merge styles used once or twice | DUI |
| Border widths / radii | 1 width, 2–3 radii | more needs a reason | DUI, PUI |
| Interactive control height | one height per size tier | too small: <20px desktop, <40px phone | DUI |
| Login lockout | ≥7 attempts before lockout; show-password toggle | email reset, short lockout | UXM |
| Page load (commerce) | <4s | frustration ~10s | WSG |
| Critical content desktop | within ~600–700px | top screen densest | WSG |
| Search box | ≥27 characters wide | top-right or prominent | WSG |
| Online video | 3–4 min | never autoplay | WSG |
| Sentences | <20 words | page title ≤~60 chars | PUI, WSG |
| WCAG 2.2 additions | target 24×24 min | focus not obscured, dragging alt, no re-entry, accessible auth | (WCAG 2.2; see ch15) |

## Decision rules
- **Hierarchy weak?** De-emphasize competitors → then weight/colour → size last. [RUI]
- **Need separation?** Spacing → background tint → shadow → border (last). [RUI]
- **Text on colour?** Same-hue tint/shade, not grey, not white@opacity. [RUI]
- **White text on brand fails?** Darker shade, or flip: dark text on light tint. [RUI]
- **Link inside running text?** Underline. Nav/cards/tabs? No underline needed. [PUI][WSG]
- **Action not available?** Remove & explain › lock icon + reason › enabled + validate › (last) disabled with explanation, focusable. [PUI]
- **Destructive action?** Page: tertiary. Frequent & reversible: do it + Undo toast. Severe: confirm (red primary, consequence text); account-level: + required checkbox. [PUI][RUI][TID]
- **Choose control:** 2 opts on submit → checkbox · immediate → toggle · ≤5 → radios · long known → autocomplete · long unknown → split lists · small number → stepper · fixed universal format → structured fields · varied format → forgiving input. [PUI][TID][WSG]
- **Required fields:** mostly required → mark optional "(optional)" or asterisk+note; always programmatic `required`; never colour-only. [PUI][KUL][TID]
- **Validate when?** Complex/criteria fields: as-you-type (debounced) · most fields: on blur · always: on submit with summary. [PUI]
- **Where to show list details?** Wide screen → split view · compare → inlay · mobile → drilldown + prev/next. [TID]
- **Long list?** Goal-directed → pagination + count · feed → load more/infinite · sorted names → type-ahead/letter rail. [TID]
- **Chart?** Compare/time → bar/line · part-to-whole few items → stacked bar · exact values → table · many dimensions → small multiples. Avoid gauges/3D/pies for comparison. [TID]
- **Modal?** Only for focused subtask or irreversible confirm; otherwise inline or page. [KUL][TID]
- **Grid vs fixed?** Page regions on 12-col; components get max-width / fixed widths. [PUI][RUI]
- **Mobile nav?** 3–5 destinations → labelled bottom tab bar; more → menu + clear current location. [TID][WSG]
- **Icon alone?** Only universal (search, close, menu) + accessible name; otherwise add label. [TID][PUI]
- **Custom widget?** Native element restyled › ARIA APG pattern › custom (must be focusable, keyboard, named, stateful, contrast, forced-colors). [WSG]
- **Multiple panel sections, same visual weight?** Order by use-frequency, not build order — tools/actions used every session outrank settings/metadata set once. [ch12 S13]
- **Same fact rendered in two places?** One must be the control, the other a visible reference to it (position, style, or explicit link) — not two independent read-outs that can drift. [ch12 S14]
- **Two panels doing a structurally similar job?** Give both the same disclosure treatment (mount-on-demand + collapse-to-overlay); an asymmetry there is usually why only one of them turns out fragile under space pressure. [ch12 S15, ch03 L13]

## Source conflicts (defaults)
| Topic | Position A | Position B | Default |
|---|---|---|---|
| Brand colour on buttons | brand colour = interactive colour [PUI] | use a blue action colour, keep brand for highlights [UXM] | one action colour family that passes 4.5:1 for labels; brand hue if it passes, else a dedicated action hue |
| Disabled submit | avoid, validate on submit [PUI] | enable only when required fields are filled (login) [UXM]; temporarily disabled with guidance [KUL] | enabled + validation; if disabled, explain and keep focusable (ch08 B7) |
| Toast auto-dismiss | 2–5s, 3s ideal [UXM] | WCAG 2.2.1 timing concerns (practitioners disagree) | ch16 FB3 |
| Consistency | follow standards, transfer learning [NIE] | functional inconsistency across contexts [MAR] | internal + platform consistency; document exceptions (ch17 IX10) |
| Contrast method | APCA preferred for dark UI [PUI] | WCAG 2 is the requirement; APCA not in WCAG 3 draft | pass WCAG 2; APCA optional |
| Icon labels | label non-universal icons [TID][PUI] | universal icons may stand alone [UXM] | label unless the icon is universal in context (search, close, menu, home); accessible name always |
| Carousels | low engagement [common view] | fine with thumbnails/segments, no auto-rotate [UXM] | avoid for key content; if used: visible controls, "See all", no auto-advance (ch18 AN5) |
| Expert review vs testing | audit finds issues fast [DUI] | expert review never the only evaluation [FRZ] | audit, then validate systemic Critical/High with users |
| Ignoring reduced motion: severity | High on sight [JK] | 2.3.3 is AAA, so not a High floor [WCAG] | High for large-area/vestibular motion or when 2.2.2/2.3.1 also fail; otherwise Medium (ch18) |
| Reduced-motion fallback | instant change [WCAG practice] | short opacity cross-fade [JK] | cross-fade ≤150 ms for state changes; remove parallax and autoplay (ch18) |
| Press feedback and motion values | exact house values: press scale 0.96, `cubic-bezier(0.2,0,0,1)`, 100 ms stagger, spring bounce 0 [JK] | any consistent token set [DUI] | consistency is the check (ch18 AN2); house values are a starting point, never a finding |
| Press scale | 0.96 [JK] | 0.97 [EK][ID] · 0.98 [RS] | any one value in 0.95–0.98, used consistently; never on disabled controls (ch18) |
| Stagger | ~100 ms between semantic chunks of one entrance [JK] | 30–80 ms (≤50 ms [RS]) between list items [EK][ID] | different jobs: chunks ~100 ms, list items 30–80 ms; never block input (ch18) |
| Exit easing | ease-in for exits [DUI][RS] | never ease-in for UI [EK] | short ease-out / ease-in-out; ease-in only for elements leaving the screen, ≤200 ms (ch18) |
| Duration ceiling | UI motion under 300 ms [EK][RS] | 300–500 ms for large surfaces [DUI] | ≤300 ms for frequently triggered motion; 300–500 ms only for drawers and full-screen sheets (ch18) |
| How much motion | none unless asked [IB] | a required motion layer on marketing pages [TS] | by visitor mode: Operate = only where it explains a change; Persuade may carry a layer (design-workflow.md §8) |
| `user-select: none` | on touch controls, stops long-press label selection [EK] | flagged on text and layout roots [JK] | controls and drag handles only (ch14 M18, code-smells S18) |
| Title vs sentence case for buttons and headings | Title Case [VWG][DUI] | sentence case [PUI][FDP] | sentence case (ch13 W4) |
| Hit target "WCAG" size | 44×44 called the WCAG rule [ID] | 24×24 is the 2.5.8 AA floor; 44 is AAA 2.5.5 | 24 px floor is the failure line; 44–48 px is the design target (ch15 A14) |
| Landing-page structure | a standard sequence: hero, problem, benefits, how it works, proof, FAQ, risk reversal, final CTA [MGT][ELY] | sections follow the page's argument; the stock sequence is a generic tell [TS] | write the claims first; use the sequence as a checklist of objections to answer, not as the order (design-workflow.md §4) |
| Fixed house values (approved font list, Tailwind-only scales, banned icon sets, mandatory sections) | strict per-skill house rules [ELY][TS] | the project's own system [JK] | not adopted as rules; the brief and the project's system decide |
| Hard spacing/size numbers | playbook thresholds | project's own scale or density [JK] | use the project's tokens; a differing but consistent value is not a finding; a clip, overlap or misread group is |
| Target size above 24 px | 44–48 px is the rule [PUI][TID] | 44/40 px are heuristics, 24 px (2.5.8) is the AA floor [JK] | below 24 px: WCAG failure (High); 24–44 px on touch: Medium recommendation |
| Shadow vs border for cards | fewer borders, use spacing/shadow [RUI] | shadow rings instead of depth borders, real borders on inputs/dividers [JK] | agree; keep a transparent border under rings for forced colours (ch06 D12) |

## Form conflicts (defaults)
| Topic | Position A | Position B | Default |
|---|---|---|---|
| Label style | above the field, outside it; no floating labels [FDP][PUI][DUI] | infield top-aligned or floating labels acceptable [UXM][UDP][KUL] | above, outside; floating only if the label stays visible |
| Hint position | above the input [FDP][PUI] | below the input, replaced by the error [UXM] | under the label, above the input |
| Inline error position | above the input [FDP][PUI] | below the input [DUI][UXM] | one position per form, never mixed (ch09 FM26) |
| Required/optional | mark optional only [FDP][UDP][DUI][KUL][UXM] | mark both [PUI] | mark the minority; always set `required` |
| Choice layout | stacked radios/checkboxes [PUI][KUL][DUI] | horizontal chips scan faster, bigger targets [UXM] | stacked for forms; chips for filters and quick picks, keyboard-operable |
| Validation timing | on submit only [FDP] | on blur / as you type per question [PUI][UDP][PED][UXP] | submit always; on-blur for format-sensitive fields; no errors while typing |
| Splitting inputs | never split name, phone, card, address [UXM] | split name or DOB for clarity [PED]; DOB as 3 boxes [FDP]; code boxes [UXP] | single fields; DOB three boxes in a fieldset |
| Button alignment | left, primary first [FDP][PUI] | forward right, back left [FRZ][UXP] | one convention per product (ch08 conflicts) |
| Placeholders | avoid except search [FDP][PUI][DUI] | format-only placeholders useful [UXM][KUL] | format example in the hint; placeholder at most a format sample |
| Forgot-password link | before the form [FDP] | login footer [UXM] | never between identifier, password and submit |
| Signup wording | Register / Join / Sign up all fine [FDP] | "Sign up" ambiguous, use "Create account" [UXM] | "Create account" paired with "Sign in" |
| Label case | sentence case [FDP] | Title Case [DUI] | sentence case (ch13 W4) |
| Progress bar | heading "Step 3 of 4" instead [FDP] | always show progress [PUI][DUI][KUL][UDP] | step text always; a bar when there are more than 3 steps |

## Trade-off matrix: validation timing [PUI]
| Approach | Feedback speed | Build cost | Risk |
|---|---|---|---|
| On submit | late | low | overwhelm, lost context |
| On blur | immediate | medium | distraction; bad for groups |
| As you type | instant | high | premature errors |

## Tells & smells (if you see X → likely problem Y)
- Several solid buttons in one card → broken action hierarchy (ch08)
- Placeholder text in every input → missing labels, low contrast (ch09)
- Light grey text "for elegance" → contrast failure (ch05)
- Borders around nearly everything → spacing system missing (ch03, ch06)
- 10+ distinct font sizes in CSS → no type scale (ch04)
- `outline: none` in CSS → invisible keyboard focus (ch15)
- `<div onclick>` / `<a href="#">` → broken semantics (ch15)
- `user-scalable=no` → zoom blocked (ch14)
- Hamburger on desktop with 4 items → hidden navigation (ch10)
- "Learn more" repeated / "Click here" → poor link scent (ch13)
- Red used for brand CTA → conflicts with error semantics (ch05)
- Disabled submit with no message → stranded users (ch08)
- Title Case Headings Everywhere → scanning friction (ch13)
- Centered paragraphs / justified body → readability loss (ch04)
- Cards with ragged heights & mismatched image ratios → missing truncation/aspect rules (ch12)
- Gauges and 3D pies on dashboard → decorative data (ch11)
- Error shown only as red border → colour-only meaning (ch09, ch15)
- Mixed filled + outline icons → inconsistent icon semantics (ch07)
- Carousel autoplay / video autoplay → loss of user control (ch07)
- Empty table shows just "No data" → missed onboarding (ch06)
- Sibling panel has `flex-grow` + only a `min-height` floor next to a `flex: 0 1 auto; min-height: 0` sibling → the floorless one gets starved to zero at short window heights, tools/actions vanish below the fold with no scroll cue — only shows up when you actually shrink the window (ch03 L13)
- Many one-off text styles / colours in `style-inventory.js` → no tokens, design drift (DUI audit) → ch12 S1
- Many distinct left edges or gaps in `alignment-grid.js` → no grid or spacing scale → ch03 L15
- "Saved" with nothing visible → missing feedback → ch16 FB1
- Modal opened from a modal → nested modals → ch16 FB9
- Cancel takes a phone call, signup takes a click → hard to cancel → ch20 ET1
- Assistant acts without preview → no approval step → ch19 CV5
- Same object edited three different ways → conceptual inconsistency → ch17 IX7
- `transition-all` on every button → animates colours on theme flips, layout on resize → ch18 AN11
- `outline-none` with no `focus-visible:` beside it → invisible keyboard focus → ch15 A2
- `{msg && <div role="status">}` → announcement often lost → ch15 A23
- `"You have " + n + " items"` / `n === 1 ? "" : "s"` → breaks in translation → ch13 W15
- `margin-left` / `left:` across a product that ships Arabic or Hebrew → broken mirror → ch03 L16
- Truncated names with no tooltip, expand or detail view → content unreachable → ch04 T18, ch03 L18
- Horizontal scroller with no peeking item or arrow → hidden content → ch03 L18
- Hover styles stuck after a tap on phones → `:hover` outside `@media (hover: hover)` → ch14 M14
- Toggle labelled "Don't show again"-style negatives in settings → double negative → ch13 W16
- PR removes `aria-label` / `prefers-reduced-motion` / `outline` with no replacement → regression → change-review.md §4
- Every section fades and slides up on scroll, every card lifts on hover → motion by default, not by purpose → ch18 AN9, design-workflow.md §8
- Same rounded card, radius and soft shadow on every block; eyebrow label over every heading → generated-UI defaults (a design choice to question, not an audit finding) → design-workflow.md *Defaults to name before choosing*
- Gap between chart bars or list rows where hover flickers off → dead zone between targets → ch15 A28
- Web app on a phone: gray flash on tap, page zooms into inputs, hover stuck after tap → missing platform baseline → ch14 M14, M16–M18
