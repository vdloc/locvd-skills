# Cheatsheet — Decisions, Thresholds, Tells

## Thresholds & defaults
| Thing | Default | Range / note | Src |
|---|---|---|---|
| Text contrast | ≥4.5:1 | large text (≥24px, ≥18.66px bold) ≥3:1 | PUI, RUI |
| UI component / meaningful icon / input border / focus ring | ≥3:1 | decorative exempt | PUI |
| APCA body text | Lc 75 min, 90 preferred | UI elements 45; placeholder/disabled 30 | PUI |
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
| Radio vs dropdown | radios ≤5 | 6–10 radios if space; >10 autocomplete | WSG, PUI, KUL |
| Autocomplete suggestions | ≤10 | bold the difference | PUI |
| Multi-step form | ~5 questions/step | show progress + review | PUI |
| Loading feedback | >1s show indicator | >10s progress + cancel | TID, WSG |
| Animation | ~200–300ms | local, interruptible; respect reduced motion | TID |
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
