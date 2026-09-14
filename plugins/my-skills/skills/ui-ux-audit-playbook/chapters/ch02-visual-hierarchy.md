# Ch 02: Visual Hierarchy & Emphasis

Sources: [RUI] "Hierarchy is Everything" · [PUI] ch2, ch4 · [TID] ch4–5 · [WSG] ch4, ch8 · [KUL] white space, alignment

## Core Idea
Visual hierarchy — making important things look important and secondary things recede — is the single most effective lever for a UI that feels "designed" and is fast to scan. Emphasis is relative: often you win by *de-emphasizing* competitors.

## Frameworks Introduced
- **Not all elements are equal** [RUI]: deliberately de-emphasize secondary/tertiary info; the same layout, font and colours instantly look better.
- **Size isn't everything** [RUI]: use weight and colour, not only font size. Text colours: dark (primary), grey (secondary), lighter grey (tertiary). Weights: normal 400/500 + emphasis 600/700; never <400 for UI text.
- **Hierarchy tools** [PUI]: Size · Colour (brighter/richer/warmer/higher contrast) · Contrast (style differently) · Spacing (more space around important things) · Position (top/first) · Depth (elevation).
  [TID] adds: density, background colour blocks, rhythm (lists/grids), emphasising small items via position (top, left, upper-right), contrast, whitespace.
- **Emphasize by de-emphasizing** [RUI]: if the active nav item won't pop, soften the inactive ones; if a sidebar competes, remove its background.
- **Labels are a last resort** [RUI]: format often explains data (email, phone, price); combine label+value ("12 left in stock", "3 bedrooms"); if labels are needed (dashboards), make them supporting (smaller, lighter). Exception: spec sheets where users scan for the label — emphasize label slightly.
- **Separate visual hierarchy from document hierarchy** [RUI]: `h1` is semantic, not a size mandate; section titles in apps often act like labels → small. Pick tags for meaning, style for hierarchy.
- **Balance weight and contrast** [RUI]: heavy things (solid icons, bold) → lower their contrast; light things (thin 1px soft borders) → add weight (2px) instead of darkening.
- **Semantics are secondary** [RUI]: action pyramid — one primary (solid, high contrast), a few secondary (outline/low-contrast bg), tertiary (link style). Destructive ≠ automatically big red.
- **Practical steps to improve hierarchy** [PUI]: (1) group info into sections, order items within by importance; (2) order sections by importance; (3) style each element by importance (Text strong vs Text weak, size, weight, icons, depth); (4) remove obvious labels.
- **Squint Test** [PUI]: squint / step back / zoom out / blur — the most important elements and the purpose of the screen must still read.
- **Visual flow & focal points** [TID][WSG]: few focal points (many dilute each other); implied lines (grid, gaze in photos) lead the eye; Gutenberg Z & F-pattern: primary headline at the top ("reading gravity"), top-left gets most fixations.
- **Center Stage** [TID]: primary content ≥2× the width of side panels; secondary tools cluster around it.
- **Unity, simplicity, focus** [WSG]: one clear centre of interest; overusing emphasis creates "clown's pants" (everything garish, nothing emphasized).

## Key Concepts
- **Visual hierarchy**: relative perceived importance of elements.
- **Focal point**: element the eye can't resist; strongest first.
- **Entry point**: contrast-created place where scanning begins [WSG].
- **Primary/secondary/tertiary action**: rank of actions on a screen [RUI][PUI].
- **Text strong / Text weak**: palette roles for primary vs supporting text [PUI].
- **Squint test**: blur check for hierarchy and white space [PUI].
- **Banner blindness**: users ignore anything that looks like an ad [WSG].

## Mental Models
- Use colour contrast + weight before size; size-only hierarchy makes headings huge and captions unreadable [RUI].
- Think "what should the eye hit 1st, 2nd, 3rd, last?" and verify with the squint test.
- Treat labels as scaffolding — remove when format or context already explains [RUI].
- A page with everything emphasized has no hierarchy — subtract before you add.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| H1 | Squint/blur test | Primary heading, primary action, and screen purpose identifiable when blurred | PUI |
| H2 | One primary action | ≤1 solid primary button per view; others secondary/tertiary | RUI, PUI |
| H3 | Text roles limited | 2–3 text colours (primary/secondary/tertiary); 2 weights for body UI; no weight <400 for small text | RUI, PUI |
| H4 | Supporting text de-emphasized via colour/weight, not tiny size | Secondary text ≥ body-small token and ≥4.5:1 | RUI, PUI |
| H5 | Grey text only on white/neutral | On coloured bg, secondary text is hand-picked same-hue tint/shade — not grey, not white@opacity | RUI |
| H6 | Label:value clutter | No mass "Label: value" lists where format/context suffices | RUI |
| H7 | Section titles sized by role | App section titles don't overpower their content | RUI |
| H8 | Heavy icons balanced | Icons next to text use softer colour (e.g. Stroke strong) or match weight/size | RUI, PUI |
| H9 | Focal points few | ≤ a handful of competing high-contrast elements per screen; value-prop narrative uninterrupted | TID, WSG |
| H10 | Price/CTA placement | Key decision info (price, CTA) grouped, prominent, often sticky on mobile | PUI |
| H11 | Nothing looks like an ad | Important content isn't boxed/loud like a banner | WSG |
| H12 | Non-interactive ≠ interactive look | Badges/icons/headings don't mimic buttons or links | PUI |

## Fix Recipes
1. **Flat hierarchy (table of equal-weight fields)** → apply PUI steps: section → order → style. E.g. property card: name large bold Text strong; location smaller regular Text weak; star icons for rating; sticky elevated bottom bar with primary "Book now" + price last (serial position); details as outlined icons (Stroke strong) + Text-weak labels; delete "Description:" label.
2. **Primary doesn't stand out** → first lower contrast of competitors (inactive tabs, secondary buttons → outline/tertiary), then add solid brand fill to the primary.
3. **Oversized headings** → reduce size one step, increase weight or darken colour instead.
4. **Grey text on coloured background** → pick same hue as background, adjust saturation/lightness until contrast is reduced but ≥4.5:1 (or rotate hue toward cyan/magenta/yellow to brighten, see ch05).
5. **Icon overpowering label** → set icon colour to a softer token; or use outlined icons.
6. **Soft 1px border invisible** → 2px at same colour rather than darkening.
7. **Multiple primary buttons** → keep one; others secondary; equal-importance choices both secondary (avoid bias) [PUI].

```css
/* Hierarchy via colour/weight tokens, not size alone */
.title    { font: 600 1.125rem/1.4 var(--font-ui); color: var(--text-strong); }
.meta     { font: 400 0.875rem/1.5 var(--font-ui); color: var(--text-weak); }   /* still ≥4.5:1 */
.tertiary { font: 400 0.875rem/1.5 var(--font-ui); color: var(--text-subtle); } /* only non-essential text */
```

## Conflicts & Context
- Link emphasis: [RUI] "not every link needs a colour" in link-dense UIs; [PUI][WSG] underline inline body links for colour-blind users. Resolution: nav, cards, tabs need no link styling; links inside running text must be underlined (or otherwise non-colour-distinguished).
- Destructive actions: see ch08 (secondary on the page, red & primary only in the confirmation step).

## Anti-patterns
- **Size-only hierarchy** (giant titles, 11px captions) [RUI].
- **Opacity-white text on colour** — dull, disabled look, bleeds over images [RUI].
- **Coloured non-link headings** mistaken for links [PUI].
- **Multiple primary buttons** — "if everything is important, nothing is" [PUI].
- **Home page split among stakeholders** → noisy fail [WSG].
- **Jumbled focal points** (weather-site example) [TID].

## Worked Example
*Hero banner, before → after [PUI]:* Before — eyebrow text, headline, subtitle and two buttons all similar size/weight/colour; the eye wanders. After — small uppercase-tracked eyebrow ("Investment seminar") in Text weak; headline large bold Text strong; subtitle regular Text weak with max ~65ch; primary solid brand "Get started" + secondary outline "Learn more"; generous space above the buttons. Squint test: headline then primary CTA read first. Nothing new was added — only size, colour, contrast and spacing changed.

## Key Takeaways
1. Hierarchy first: decide importance order before styling.
2. Use colour + weight; size last.
3. De-emphasize competitors instead of shouting louder.
4. One primary action per view.
5. Replace labels with self-describing values where possible.
6. Verify with the squint test.

## Connects To
- **ch05** colour palette roles · **ch08** button weights · **ch03** spacing as grouping · **ch04** type scale
