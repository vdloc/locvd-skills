# Ch 06: Depth, Elevation, Borders & Finishing Touches

Sources: [RUI] "Creating Depth", "Finishing Touches" · [PUI] ch3 depth · [KUL] shadows, gradients · [TID] ch5 styles · [WSG] ch8

## Core Idea
Depth communicates *position on a z-axis* — what floats (menus, modals), what is raised (cards, buttons), what is inset (inputs, wells). Use a small elevation system with a single light source, prefer spacing/background changes over borders, and add polish by "supercharging" existing elements rather than adding decoration.

## Frameworks Introduced
- **Emulate a light source (light from above)** [RUI][PUI][KUL]:
  - *Raised*: slightly lighter top edge (top border or inset shadow, hand-picked colour, not white overlay) + small dark shadow offset downward with small blur.
  - *Inset* (wells, inputs, checkboxes): lighter bottom edge + small dark inset shadow at top.
  - One light direction for the whole UI [KUL]. Don't chase photorealism [RUI].
- **Shadows convey elevation** [RUI]: small tight = slightly raised (buttons); medium = dropdowns; large = modals. Closer = more attention. **Elevation system of ~5 shadows** — define smallest & largest, interpolate.
  [PUI] minimal system of **2 shadows**: *Raised* (small, sharp — cards, interactive) and *Overlay* (large, soft — dropdowns, floating dialogs); shadow colour from Text-strong hue, not pure black.
- **Shadows can have two parts** [RUI][KUL]: large soft offset shadow (direct light) + tight dark small-offset shadow (ambient occlusion); the tight one fades at higher elevations.
- **Interaction via elevation** [RUI][PUI]: lift draggable item on grab; card elevates on hover; pressed button drops shadow. Think z-position, then choose shadow.
- **Depth without shadows** [RUI][PUI]: lighter than background = raised; darker = inset; white cards on grey bg read elevated; solid zero-blur offset shadows for flat styles. **Dark mode** [PUI][KUL]: shadows barely visible → elevation by progressively lighter surfaces (Base → Raised → Overlay, e.g. HSB 230,30,10 → 230,25,15 → 230,20,20) or subtle highlights.
- **Overlap elements to create layers** [RUI]: card crossing two background bands; element taller than its parent; carousel controls overlapping; overlapping images get an "invisible border" (bg-coloured gap).
- **Use fewer borders** [RUI][WSG]: replace with box-shadow outline, different background colours, or more spacing; rules thin & light if kept [WSG].
- **Supercharge the defaults** [RUI]: icon bullets (checks, padlocks), promoted quote marks, custom link underlines, brand-coloured custom checkboxes/radios.
- **Accent borders** [RUI]: colour strip on top of card, active nav, side of alert, short bar under a headline, top of layout.
- **Decorate backgrounds** [RUI][KUL]: section bg colour change; subtle gradient (hues ≤30° apart; adjacent hues [KUL]); low-contrast repeating pattern or single shape; noise/texture sparingly; keep contrast low so content stays readable.
- **Gradients** [KUL]: linear (bg, subtle primary buttons), radial (colour→transparent overlays), angular/diamond/mesh sparingly; misuse looks cheap.
- **Style trends fade** [PUI]: glassmorphism/neumorphism fail contrast & hierarchy; [TID] style families (skeuomorphic, illustrated, flat, minimal, adaptive) — pick for audience and task.
- **Don't overlook empty states** [RUI]: first interaction with a feature → illustration + emphasized CTA; hide tabs/filters that do nothing without content.
- **Think outside the box** [RUI]: dropdowns with sections/columns/icons; tables combining related columns with hierarchy/images/colour; radio lists → selectable cards (keep radio affordance, see ch09).

## Key Concepts
- **Elevation**: perceived z-distance; higher = closer, more prominent.
- **Raised / Overlay shadow tokens** [PUI].
- **Ambient vs direct shadow** [RUI].
- **Inset**: recessed look for inputs/wells.
- **Accent border**: small coloured rule adding character [RUI].
- **Empty state**: UI when there is no data yet [RUI].

## Mental Models
- Ask "where does this sit on the z-axis?" not "which shadow looks nice?" [RUI].
- Borders are the loudest way to separate; spacing and tone are quieter.
- Polish comes from upgrading what's already there, not adding ornaments [RUI].

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| D1 | Elevation tokens | 2–5 named shadows used consistently by component type (card < dropdown < modal) | RUI, PUI |
| D2 | Single light source | All shadows offset downward; no mixed directions | RUI, KUL |
| D3 | Shadow quality | Soft, low-opacity, tinted; no heavy black glows; two-layer where elevation matters | RUI, KUL |
| D4 | Borders justified | No box-in-box-in-box; separation mostly via spacing/bg; decorative rules subtle | RUI, WSG |
| D5 | Meaningful borders pass contrast | Input/checkbox/button borders ≥3:1 (decorative dividers exempt) | PUI |
| D6 | Dark-mode depth | Elevation by lighter surfaces, consistent levels across light/dark | PUI |
| D7 | Interaction feedback | Hover/drag/press states change elevation or tone appropriately | RUI, PUI |
| D8 | Decoration contrast | Background patterns/gradients don't reduce text contrast; gradients use close hues | RUI, KUL |
| D9 | Empty states designed | Every user-content view has an empty state with guidance + CTA | RUI |
| D10 | Trend risk | No glass/neumorphic surfaces where hierarchy/contrast suffer | PUI |

## Fix Recipes
```css
:root{
  --shadow-color: 222 30% 12%;
  --elev-1: 0 1px 2px hsl(var(--shadow-color) / .10), 0 1px 3px hsl(var(--shadow-color) / .08);   /* buttons, raised cards */
  --elev-2: 0 4px 6px -1px hsl(var(--shadow-color) / .10), 0 2px 4px -2px hsl(var(--shadow-color) / .08); /* hover cards */
  --elev-3: 0 10px 15px -3px hsl(var(--shadow-color) / .10), 0 4px 6px -4px hsl(var(--shadow-color) / .06); /* dropdowns */
  --elev-4: 0 20px 25px -5px hsl(var(--shadow-color) / .12), 0 8px 10px -6px hsl(var(--shadow-color) / .06); /* popovers */
  --elev-5: 0 25px 50px -12px hsl(var(--shadow-color) / .25);                                         /* modals */
}
.card{ box-shadow: var(--elev-1); transition: box-shadow .15s; }
.card:hover{ box-shadow: var(--elev-2); }
.btn:active{ box-shadow: none; translate: 0 1px; }
.input{ box-shadow: inset 0 1px 2px hsl(var(--shadow-color) / .08); border: 1px solid var(--stroke-strong); }
.alert{ border-left: 4px solid var(--blue-500); background: var(--blue-100); } /* accent border */
```
1. **Border overload** → remove inner borders; alternate bg (`--fill` vs `--bg`); increase gap; keep only borders that identify inputs.
2. **Random shadows** → map each to z-role (raised/overlay/modal) and replace with tokens.
3. **Flat UI lacks structure** → white cards on subtle grey page; or solid offset shadow.
4. **Bland page** → accent border, section bg change, icon bullets, custom checkboxes — before adding illustrations.
5. **Empty list** → illustration/icon + one-line explanation + primary CTA; hide inert filters.

## Conflicts & Context
- Number of shadow levels: 5 [RUI] vs 2 [PUI]. Small products: 2 (raised, overlay); complex apps with drag/popovers/modals: 3–5.
- Decorative effects: [KUL] shows inner shadows/gradients/strokes for flair but notes fancy buttons don't serve regular users; [PUI] warns trends age. Default to restraint.

## Anti-patterns
- **Heavy dark shadows on everything** — muddy, no hierarchy.
- **Mixed light directions** across cards [KUL].
- **Using borders to fix every separation** [RUI].
- **White-opacity highlights** that desaturate colour [RUI].
- **Busy background patterns** behind text [RUI][TID].
- **Blank "No items" empty states** [RUI].

## Worked Example
*Metric/list refinement [RUI]:* A sidebar with bordered boxes, a card list with borders between rows, and a plain "No projects" message. Steps: sidebar border removed and its bg dropped so content sits on the page; list rows separated by spacing and alternating subtle fill; project cards get `--elev-1`, raise to `--elev-2` on hover; the active nav item gets a 3px brand accent border on the left; empty state becomes an illustration, "Create your first project" primary button, and filters hidden until projects exist. Result: fewer lines, clearer layers, more polish with no new content.

## Key Takeaways
1. Elevation = z-position; 2–5 shadow tokens, one light source.
2. Prefer spacing and tone over borders.
3. Dark mode: lighter surfaces instead of shadows.
4. Polish by upgrading defaults and accent borders.
5. Design empty states as onboarding.

## Connects To
- **ch05** surfaces & tokens · **ch12** component states · **ch03** grouping by spacing · **ch07** images overlap
