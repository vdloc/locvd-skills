# Ch 04: Typography

Sources: [RUI] "Designing Text" · [PUI] ch5 · [TID] ch5 · [WSG] ch9 · [KUL] style guides

## Core Idea
Readable UI type comes from a small, hand-tuned system: one (maybe two) quality typefaces, a constrained type scale, few weights, line length ~45–75 characters, line height inversely proportional to size, left alignment, and semantic markup that lets the text adapt to users.

## Frameworks Introduced
- **Use good fonts** [RUI]: neutral sans is safest; system font stack is a valid choice; ignore families with <5 weights (filter ≥10 styles incl. italics); avoid condensed/short-x-height faces for UI text; popularity is a proxy for quality; steal from sites that care.
- **Single sans serif** [PUI] for legibility, neutrality, simplicity; optional second face for headings only to add personality (serif = classic/established; rounded = soft/playful; casual script = handmade; formal script = elegant; light sans = luxury). [WSG]: ≤2 typefaces (one serif, one sans) or one family varying weight/size; stay mainstream; *never* decorative/display faces for text. [TID]: never pair two similar typefaces; display faces never for UI controls/body.
- **Type scale** —
  - [RUI] hand-crafted (avoid fractional modular values, too few steps): 12 · 14 · 16 · 18 · 20 · 24 · 30 · 36 · 48 · 60 · 72; px or rem, **never em** (nesting compounds).
  - [PUI] ratio scale from 16px base, rounded (1.067 minor second … 1.2 minor third … 1.5 perfect fifth … 1.618); small ratios for dense apps/dashboards, large for marketing; smaller ratio on mobile; line-heights on a 4pt grid. Example (1.2): H1 40/48 · H2 32/40 · H3 24/32 · H4 20/28 · Small 16/24 · Tiny 14/20.
  - [KUL] example desktop: d1 72 · d2 64 · h1 56 · h2 48 · h3 40 · h4 32 · h5 24 · h6 20 · title 18 · body 16/14 · caption 13 · chip 12; mobile per Apple HIG Dynamic Type / Material.
- **Weights** [RUI][PUI]: two weights (regular 400/500 + bold/semibold 600/700); thin/heavy only at large sizes.
- **Line length** — [RUI] 45–75 characters (≈20–35em); [PUI] 40–80 incl. spaces; [WSG] ~66 characters / ~12 words; [TID] 10–12 words. Cap paragraph width even inside wide content areas.
- **Line-height is proportional** [RUI][PUI]: ≥1.5 for body (1.5–2), taller for long lines/dark heavy faces/large-looking faces; large headings ~1–1.3. Keep the visual gap consistent as size grows.
- **Body size** [PUI]: long-form body ≥18px (arm's-length reading); UI body 16px base [RUI]; don't go below ~10pt; allow users to enlarge [TID][WSG].
- **Baseline, not center** [RUI][PUI] for mixed sizes on one line.
- **Align with readability in mind** [RUI][PUI][WSG]: left-align (ragged right); centre only headings/≤2–3 lines; right-align numbers in tables; justified text only with hyphenation (web: avoid — rivers, dyslexia).
- **Letter-spacing** [RUI][PUI][WSG]: trust the face; tighten large headlines set in text faces; add tracking to ALL CAPS (e.g. +0.05em/2px); kern display pairs.
- **Not every link needs a colour** [RUI]: link-dense UIs → weight/darker colour, underline on hover for ancillary links. But inline body links: underline [PUI][WSG].
- **Emphasis one parameter at a time** [WSG]: bigger *or* bolder, not bigger + bold + caps; italics for titles/foreign words, not blocks; never underline non-links; avoid coloured text inside paragraphs (reads as link).
- **Case** [PUI][WSG]: sentence case (down style) for headings, buttons, labels; Title Case only for document titles/proper names; ALL CAPS only for short labels — small, bold, tracked.
- **Semantic typography** [WSG][RUI]: headings by information hierarchy (not look); lists for related items; no text characters as decoration (pipes, brackets, asterisks get read aloud); relative units so user zoom/preferences reflow the layout.

## Key Concepts
- **x-height**: lowercase letter height; taller = more legible small [PUI][WSG].
- **Measure**: line length in characters.
- **Leading / line-height**: baseline-to-baseline spacing.
- **Tracking / kerning**: overall vs pair letter spacing [TID][WSG].
- **Modular vs hand-crafted scale** [RUI][PUI].
- **System font stack**: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif` [RUI].
- **Down style**: sentence-case headings [WSG].

## Mental Models
- Think of type as the UI's main texture and voice [TID]; a messy type system reads as an untrustworthy product [WSG].
- Line-height and font-size move in opposite directions; line-height and line length move together.
- Weight + colour carry hierarchy; the scale just provides stops.
- Never pick an HTML heading level for its default size.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| T1 | Typeface count | ≤2 families; no decorative/display face for body/UI | PUI, WSG, TID |
| T2 | Face quality | ≥5 weights (or system stack); decent x-height; digits vs l/1, 0/O distinguishable | RUI, TID |
| T3 | Scale adherence | All sizes from a defined scale (≈8–12 steps); units px/rem, no nested em | RUI, PUI, KUL |
| T4 | Weights | ≤2–3 weights in UI; no <400 below ~24px | RUI, PUI |
| T5 | Body size | UI body ≥16px; long reading ≥18px; smallest text ≥12px and legible | PUI, RUI |
| T6 | Measure | Paragraph max-width ≈45–75ch (≤80) | RUI, PUI, WSG |
| T7 | Line-height | Body ≥1.5; headings 1.0–1.3; consistent visual gaps | RUI, PUI |
| T8 | Alignment | Body left-aligned; no centred paragraphs >3 lines; no justified web body; numbers right-aligned in tables | RUI, PUI, WSG |
| T9 | Case | Sentence case for UI text; caps only for short tracked labels | PUI, WSG |
| T10 | Emphasis discipline | One emphasis parameter per level; no underlined non-links; no coloured words mid-paragraph | WSG |
| T11 | Text contrast | Body ≥4.5:1; large (≥24px regular / ≥18.66px bold) ≥3:1; no pure black on white for long text | PUI, WSG |
| T12 | Semantic headings | Logical h1→h2→h3 order matches info hierarchy; one visible h1 per page | WSG |
| T13 | Scales with user settings | Root font respects user default; 200% zoom reflows without horizontal scroll | WSG |
| T14 | Web font cost | ≤2 families / few weights loaded; fallback stack declared | WSG |

## Fix Recipes
1. **Token set** (adapt values):
```css
:root{
  --font-ui: Inter, -apple-system, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  --text-xs: .75rem;  --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.125rem;
  --text-xl: 1.25rem; --text-2xl: 1.5rem; --text-3xl: 1.875rem; --text-4xl: 2.25rem; --text-5xl: 3rem;
  --leading-tight: 1.2; --leading-snug: 1.35; --leading-body: 1.6;
}
html { font-size: 100%; }                 /* respect user default */
body { font: 400 var(--text-base)/var(--leading-body) var(--font-ui); }
h1   { font-size: var(--text-4xl); line-height: var(--leading-tight); font-weight: 700; letter-spacing: -0.02em; }
.prose p { max-width: 65ch; }
.eyebrow { font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
```
2. **Too many sizes** → inventory all computed sizes; map each to nearest scale step; delete the rest.
3. **Long lines** → `max-width: 65ch` on text blocks; split into columns only for non-continuous content.
4. **Cramped headings / loose captions** → decrease heading line-height, increase small-text line-height.
5. **Low x-height face** (e.g. League Spartan) → switch to taller x-height (e.g. Inter) for body [PUI].
6. **Light weight for de-emphasis** → regular weight + softer colour or smaller step [RUI].
7. **ALL-CAPS labels** → sentence case, or small bold with tracking.
8. **Headings chosen by size** → re-level by hierarchy; restyle via classes.

## Conflicts & Context
- Scale method: modular ratio [PUI] vs hand-picked [RUI]. Use a ratio to seed, then round and add missing steps.
- Serif vs sans for body: [TID] serif for dense print-like reading; [PUI] sans default; [WSG] "pointless debate — judge in context". For UIs, sans; long-form editorial can use a quality serif.
- Body size: 16 [RUI][KUL] vs ≥18 for long body [PUI]; old 12pt [TID] predates high-density screens — follow 16/18.
- Link styling: see ch02 conflict note.

## Anti-patterns
- **Every size from 10–24px used somewhere** [RUI].
- **Thin grey text** looking "sleek" [PUI].
- **Centred multi-line paragraphs**, justified web text [PUI][WSG].
- **Title Case Everywhere** — "initial caps cause pointless bumps" [WSG].
- **Scaling headline with em relative to body** (35px h1 on mobile) [RUI].
- **Pipes/asterisks as visual separators** read aloud by screen readers [WSG].
- **Loading five web-font families** — slow pages [WSG].

## Worked Example
*Fitness-app typography pass [PUI]:* detailed serif heading → same sans as body; League Spartan (low x-height) → Inter; trainer name light weight → regular (still ≥4.5:1 Text weak); centred description → left-aligned; body line-height 1.0 → 1.5; title "Morning Yoga Workout" → "Morning yoga workout" (sentence case); instructor name uppercase → normal case. Each change reduces decoding effort without touching layout.

## Key Takeaways
1. One sans family, two weights, one scale.
2. 16px UI / 18px long-form, 45–75ch, line-height ≥1.5.
3. Left-align; sentence case; tracked caps only for tiny labels.
4. Hierarchy from weight & colour; size from the scale.
5. Semantic, relative, zoom-proof type.

## Connects To
- **ch02** hierarchy · **ch05** text contrast · **ch13** copy & case · **ch15** semantic markup & zoom
