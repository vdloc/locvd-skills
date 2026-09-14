# Ch 03: Layout, Spacing, Grouping & Grids

Sources: [RUI] "Layout and Spacing" · [PUI] ch4 · [KUL] layouts/grids/box model · [TID] ch4 · [WSG] ch6, ch8

## Core Idea
Space is a design material: a constrained, non-linear spacing scale plus the rule "more space between groups than within them" produces order, grouping and hierarchy without extra boxes or lines.

## Frameworks Introduced
- **Gestalt grouping** [PUI][TID][WSG]: *Common region* (same container — strongest, but cluttering if overused) · *Proximity* · *Similarity* (same look ⇒ same function; make one peer slightly different to highlight it) · *Continuity* (aligned lines; break it to end a group) · *Closure* · *Figure–ground* · *Uniform connectedness*.
- **Avoid ambiguous spacing** [RUI]: whenever spacing connects elements, space *around* a group > space *within* it (label–input groups, headings need more space above than below, bullets vs line-height, horizontal chips).
- **Start with too much white space, then remove** [RUI]; dense UIs (dashboards) only as a deliberate choice. **Be generous** — when unsure, take the next step up [PUI].
- **Spacing/sizing system** [RUI]: not linear; adjacent values ≥ ~25% apart; base 16px; tight at small end. Example: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 640, 768.
  [PUI]: 8pt increments (4pt for detail): XS 8 · S 16 · M 24 · L 32 · XL 48 · XXL 80. [KUL]: 8 · 16 · 24 · 32 · 48 · 64 · 80.
- **Rectangles within rectangles / box model** [PUI][KUL]: margin, border, padding; spacing grows as you move outward. PUI rule-set: 8pt inside innermost text groups → 24pt card padding/section content → 32pt column gaps → 80pt between page sections.
- **You don't have to fill the whole screen** [RUI]: give each element the width it needs (form 600px on a 1400px canvas is fine); shrink the canvas (design at ~400px first); split into columns (supporting text beside a narrow form) instead of stretching.
- **Grids** — [PUI][KUL] 12-column main layout: columns %, gutters fixed & empty, margins; 12 cols desktop → 4 cols mobile. KUL desktop: 1440 frame, 100px margins → 1240 safe zone, 20px gutters; mobile 375px, ≥16px margins, 8px gutters, 4 cols. [RUI] **Grids are overrated**: fixed-width sidebars + flexible content; use `max-width` rather than column spans for cards so they never shrink before they must. Resolution: grid for macro layout, fixed/max widths for components.
- **Relative sizing doesn't scale** [RUI]: large elements shrink faster than small ones on small screens (h1 45px/body 18 desktop → 20–24px/14 mobile); larger buttons get proportionally more padding, smaller get tighter.
- **Alignment** [PUI][KUL][TID]: keep a straight left edge (icons above text rather than breaking it); avoid mixed alignments in one component; baseline-align mixed font sizes on a line ("$10 /month"); similar components share height on one line; elements shouldn't shift between screens.
- **Ensure the interface is unbreakable** [PUI]: design for long names, big numbers, empty & overflow; reflow instead of hiding; if truncating, keep distinguishing parts (middle truncation).
- **Screens of information** [WSG]: judge a page in viewport-high zones; top zone densest; keep critical content within ~600–700px on desktop.

## Key Concepts
- **Spacing scale / tokens**: finite ordered set of spacing values.
- **Gutter**: empty space between columns (never content) [PUI].
- **Margin (layout)**: space between content and screen edge.
- **Common region**: container-based grouping.
- **Max-width**: cap that keeps components/lines at optimal size [RUI][WSG].
- **Vertical rhythm**: consistent vertical spacing by relatedness [KUL].
- **Unbreakable UI**: layout survives extreme content [PUI].

## Mental Models
- Space expresses relationship: closer = more related. Borders and boxes are the last resort (ch06 "use fewer borders").
- Think inside-out: small spacing for inner pieces, larger for outer groups.
- Removing space is easy to see; needing more is not — so start big [RUI].
- Grid for the page, content-driven widths for components.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| L1 | Spacing values on scale | All margins/padding/gaps map to tokens; no 11/13/23/29/35px strays | RUI, PUI, KUL |
| L2 | Group > within-group spacing | Label↔input gap < gap between fields; heading space-above > space-below; list item gap > line gap | RUI, PUI |
| L3 | Containers justified | Cards/boxes only where proximity/similarity/continuity isn't enough | PUI |
| L4 | Similar ⇒ same function | Look-alike elements behave alike; non-interactive icons/badges don't look like buttons | PUI |
| L5 | Content widths sensible | Forms/text blocks not stretched full-width on large screens; `max-width` on content | RUI, WSG |
| L6 | Macro grid consistent | Page sections align to a column grid; gutters empty; margins ≥16px mobile | PUI, KUL |
| L7 | Alignment | Straight left edges; ≤1 alignment type per component; baseline alignment for mixed sizes | PUI, RUI |
| L8 | Responsive proportions | Headings shrink more than body on mobile; no em-compounded sizes | RUI |
| L9 | Unbreakable | Long strings, 0/1/1000 items, localisation (+30–40% text) don't break layout | PUI, TID |
| L10 | White space sufficient | Squint test shows distinct groups; nothing collides with edges | PUI, TID |
| L11 | Critical content early | Primary content/CTA visible in first viewport zone; no "layer cake" of logos/ads on mobile | WSG, TID |
| L12 | Touch spacing | ≥8pt between adjacent targets (16pt safe) | PUI |
| L13 | Split-pane ratio safe | In any flex/grid region with an unbounded-growth sibling (`flex-grow`/`fr` with no cap) next to a fixed-purpose sibling (controls, actions, tools), check both at a short/constrained container size: does the growth sibling stop at a sane cap, and does the fixed sibling keep a floor + visible scroll affordance instead of being pushed off-screen? Test at the shortest realistic window height, not just narrow width. | (derived; not in source books) |

## Fix Recipes
1. **Define scale tokens** (pick one and stick to it):
```css
:root{
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 48px; --space-8: 64px;
  --space-9: 80px; --space-10: 96px;
}
.card        { padding: var(--space-5); }                /* 24 */
.card-stack  { display:grid; gap: var(--space-2); }       /* 8 inner */
.grid        { display:grid; gap: var(--space-6); }       /* 32 between cards */
.section     { padding-block: var(--space-9); }           /* 80 between sections */
.field       { display:grid; gap: var(--space-1); }       /* label→input 4 */
.form        { display:grid; gap: var(--space-5); }       /* field→field 24 */
```
2. **Ambiguous groups** → increase between-group gap to the next token or two; reduce within-group gap.
3. **Card soup** → remove containers where spacing + alignment already group (e.g. table rows, sidebar lists) [PUI].
4. **Stretched layouts** → `max-width` on content (e.g. 600–720px forms, ~65ch text), centre or left-align block; or add a supporting column.
5. **Fluid sidebar squashing** → fixed sidebar width (e.g. `grid-template-columns: 280px 1fr`) [RUI].
6. **Card too narrow at mid breakpoints** → `width: 100%; max-width: 500px` instead of column spans [RUI].
7. **Mixed alignment** → left-align all; if centred for short content, make the button full-width on mobile [PUI].
8. **Overflow hiding data** → allow wrap/reflow; middle-truncate with full text in tooltip/title.
9. **One flex sibling starves another at short heights** → don't give one region `flex: 1 1 auto` with only a `min-height` floor while its sibling is `flex: 0 1 auto; min-height: 0` (shrink-only, no floor) — the floored sibling freezes at its minimum and *all* remaining squeeze lands on the floorless one, silently, with no scrollbar cue until it's already gone. Either cap the growing region (`max-height`, or `flex: 0 1 <content-based-basis>` instead of unbounded grow), or give the fixed-purpose sibling its own `min-height` floor sized to its most‑used control (e.g. the first tool row), or split the parent into two independently scrolling regions so neither can zero out the other:
```css
/* before: tree can eat every pixel below its 200px floor */
.tree { flex: 1 1 auto; min-height: 200px; overflow-y: auto; }
.tools { flex: 0 1 auto; min-height: 0; overflow-y: auto; } /* no floor — starves first */

/* after: tools gets a floor sized to its content, tree yields to it */
.tree { flex: 1 1 auto; min-height: 120px; overflow-y: auto; }
.tools { flex: 0 0 auto; min-height: 180px; overflow-y: auto; } /* protected */
```

## Conflicts & Context
- 12-col grid [PUI][KUL][TID][WSG] vs "grids are overrated" [RUI] — not a real conflict: grids organise page regions; components get intrinsic/max widths.
- Base unit: 8pt [PUI][KUL] vs 4px-started non-linear scale [RUI]. Both converge on 4/8 multiples growing faster at the large end.
- Density: dashboards/data tools may use tighter scales intentionally [RUI][TID] — record as a decision, not a default.

## Anti-patterns
- **Same spacing everywhere** (e.g. 16pt between all rectangles) → cluttered, ungrouped [PUI].
- **Nudging pixels** one at a time instead of stepping on a scale [RUI].
- **Percent widths for everything** → sidebars too wide/narrow, cards oddly sized [RUI].
- **Filling 1400px because it's there** [RUI].
- **Borders to fix grouping problems** that spacing should solve [RUI].
- **Random 28/18/21/14pt spacing** in beginner work [KUL].

## Worked Example
*Landing page spacing fix [PUI]:* Before — 16pt used between every element; nav, headline, cards and footer blur together. Process: outline nested rectangles → apply 8pt inside card text (title↔description), 24pt card padding and headline↔subtitle block, 32pt between nav links and between cards (grid gutter), 80pt between page sections. Result: clear groups, calmer rhythm, same content. Codify as rules: "card padding 24, column gap 32, section padding 80".

## Key Takeaways
1. Pick a non-linear spacing scale and never leave it.
2. More space between groups than inside them.
3. Start roomy; tighten deliberately.
4. Grid for regions, max-width for components.
5. Design for the ugliest content, not the prettiest.

## Connects To
- **ch02** spacing as emphasis · **ch14** responsive layouts · **ch06** borders vs spacing · **ch12** component padding tokens
