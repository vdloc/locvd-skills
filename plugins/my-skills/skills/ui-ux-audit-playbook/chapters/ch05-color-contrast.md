# Ch 05: Colour, Contrast & Palettes

Sources: [RUI] "Working with Color" · [PUI] ch3 · [KUL] colours · [TID] ch5 · [WSG] ch8, ch11

## Core Idea
Design in greyscale first, then add colour with purpose: a palette of predefined shades with *roles* (brand/interactive, text strong/weak, strokes, fills, system states), every text and UI element meeting contrast minimums, and colour never the only carrier of meaning.

## Frameworks Introduced
- **Design in greyscale / black & white first** [RUI][PUI][KUL]: spacing, size, contrast do the work; colour later enhances.
- **You need more colours than you think** [RUI]: greys 8–10 shades (no pure black; start at very dark grey); primary 5–10 shades; accents (semantic red/amber/green, highlight colours) each 5–10 shades; complex UIs ≈10 hues × 5–10 shades.
- **Define shades up front** [RUI]: no `lighten()/darken()` on the fly. Method: base 500 (works as button bg) → darkest 900 (text) & lightest 100 (tinted bg; pick edges using an alert component) → fill 700 & 300 → 800/600/400/200. Greys: darkest = darkest text; lightest = subtle off-white bg. Trust your eyes; add shades rarely.
- **Palette with rules (monochromatic)** [PUI], HSB from brand hue 230:
  | Role | Use | Light HSB | Dark HSB | Contrast rule |
  |---|---|---|---|---|
  | Brand | links, buttons (interactive only) | 230,65,85 | 230,40,99 | ≥4.5:1 vs Fill |
  | Text strong | headings, body, labels | 230,57,24 | 230,0,100 | ≥4.5:1 |
  | Text weak | supporting text | 230,27,48 | 230,5,85 | ≥4.5:1 |
  | Stroke strong | input borders, meaningful icons | 230,23,65 | 230,10,65 | ≥3:1 |
  | Stroke weak | decorative dividers | 230,5,94 | 230,15,25 | none |
  | Fill | secondary bg (tags, badges) | 230,2,98 | 230,20,15 | fg on it must pass |
  | Background | page | 0,0,100 | 230,30,10 | fg must pass |
- **Transparent palettes** [PUI]: solid tags lose prominence on grey/elevated dark surfaces → use alpha foregrounds. Light-mode black opacities ≈ Text strong 90%, Text weak ~65%, Stroke strong 45%, Stroke weak 10%, Fill 4%; dark-mode white ≈ 100/78/~60/12/6%. System colours: 100% text (4.5:1), 80% stroke strong (3:1), 20% stroke weak, 5% fill. Test against the brightest surface.
- **Primitive vs semantic tokens** [PUI]: primitives by appearance `grey.light.1000`, `green.dark.200` (0–1000, 1000 = highest contrast; insert `grey.25` between); semantic by use `[element.tone.emphasis.state]` → `text.error`, `stroke.strong`, `fill.success.weak`, `fill.hover`. Semantic tokens remap per theme.
- **HSL/HSB thinking** [RUI][PUI]: RUI prefers HSL (browsers), PUI HSB (design tools). **Don't let lightness kill saturation**: raise saturation as lightness moves from 50%. **Perceived brightness**: rotate hue ≤20–30° toward bright hues (60° yellow, 180° cyan, 300° magenta) to lighten, toward dark hues (0°, 120°, 240°) to darken — e.g. yellow → orange for dark yellow shades.
- **Greys don't have to be grey** [RUI][PUI][KUL]: tint greys with blue (cool) or yellow/orange (warm) or the brand hue (5–15% overlay trick [KUL]); boost saturation at extremes.
- **Contrast standards** —
  - WCAG 2.x AA [RUI][PUI][KUL]: text ≤18px (or <24px regular) ≥4.5:1; large text (≥24px regular or ≥18.66px/14pt bold) and UI components/meaningful graphics ≥3:1; decorative exempt. [KUL] system-status text ideally 7:1.
  - APCA Lc (WCAG 3 draft) [PUI]: 90 preferred body (14px+); 75 min body (18px+); 60 other text (24px regular/16px bold); 45 large text (36px/24px bold) & UI elements; 30 absolute min (placeholder, disabled); 15 non-text. Polarity-aware; better for dark UIs and white-on-orange. Commercial compliance: meet WCAG 2; aim to pass both.
- **Accessible doesn't have to mean ugly** [RUI]: *flip the contrast* (dark coloured text on light tinted bg instead of white on saturated bg); for secondary text on dark coloured panels rotate hue toward a bright hue rather than approaching white.
- **Don't rely on colour alone** [RUI][PUI][TID][WSG]: add icon/text/shape/underline/thicker border; trend cards get ▲▼ icons; charts differ by lightness as well as hue. ~8–10% of men have colour-vision deficiency.
- **Brand colour discipline** [PUI]: one brand colour on interactive elements only (never on non-interactive headings/icons); multiple brand colours → the highest-contrast one is interactive, others decorative; light brand (yellow) → use text colour for links/buttons with ≥3:1 border; brand colour with semantic meaning (red) → don't use for actions.
- **System colours** [PUI][KUL][RUI]: red error, amber/orange warning, green success (+ optional info); always with icons; text ≥4.5:1, elements ≥3:1.
- **Colour for hierarchy & mood** [PUI][TID][KUL][WSG]: saturated = important/advancing, desaturated = background/receding; red most prominent; warm = inviting, cool = calm; dark bg = dramatic/luxury; one saturated colour among muted ones directs attention; 60-30-10 (primary/neutral/accent) as a starter [KUL]; nature-derived palettes harmonize [WSG]; avoid vibrating complementary pairs (bright blue on red) [TID]; avoid pure black text on white [PUI].
- **Interaction state colours** [PUI]: opacity (hover 80%, disabled 20%, focus outline); fill swaps (menu hover=Fill, press=Stroke weak; brand button hover=Text weak, press=Text strong); transparent state layers (hover = Fill overlay, press = Stroke-weak overlay) work across themes.

## Key Concepts
- **Contrast ratio** 1:1–21:1 luminance ratio (WCAG 2).
- **APCA Lc** perceptual lightness contrast value.
- **Tint/shade** lighter/darker variants [KUL].
- **Semantic token** use-named colour mapped to primitives [PUI].
- **Monochromatic palette** variations of one hue [PUI][KUL].
- **Colour temperature** warm vs cool greys/photos [RUI][PUI].

## Mental Models
- Colour is a label for *function* (interactive, status), not decoration.
- Contrast is about the actual pair on the actual surface — test tags on fills, text inside badges, icons on photos.
- Think in scales (100–900) and roles (text-strong…fill); designers pick roles, never raw hex.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| C1 | Body/secondary text contrast | ≥4.5:1 on its real background (incl. placeholder if it conveys info, links, button labels) | PUI, RUI |
| C2 | Large text & UI contrast | Large text, input borders, checkboxes/radios, focus rings, meaningful icons ≥3:1 | PUI, WCAG |
| C3 | Colour-only meaning | Errors, status, links, chart series, selected states have a non-colour cue | RUI, PUI, TID, WSG |
| C4 | Palette defined | Finite shades per hue; no ad-hoc hex/`lighten()`; roles documented | RUI, PUI |
| C5 | Brand colour = interactive | Brand/action colour not used on non-interactive text/icons | PUI |
| C6 | ≤1 action colour | Interactive elements share one colour family | PUI |
| C7 | No pure black on white for long text; no light-grey text | Dark grey (e.g. #1A1A1A-ish) | PUI |
| C8 | Grey on colour | Secondary text on coloured surfaces uses tinted same-hue colour, passes contrast | RUI |
| C9 | System colours | Error/warning/success consistent, paired with icons, passing contrast; red not used for non-destructive actions | PUI, KUL |
| C10 | Dark mode | Elevation via lighter surfaces; contrast checked (APCA recommended); no pure black bg; semantic tokens remap | PUI |
| C11 | Saturation discipline | Saturated colour reserved for emphasis; backgrounds muted | TID, WSG |
| C12 | Theme/HC robustness | Works in OS high-contrast/forced-colours; doesn't rely on background images for meaning | TID, WSG |

## Fix Recipes
1. **Build palette**: choose brand base → derive 9 shades (100–900) by hand in HSL/HSB → greys tinted → system hues → map semantic tokens:
```css
:root{
  --blue-100:hsl(214 100% 97%); --blue-500:hsl(214 84% 52%); --blue-900:hsl(222 70% 18%);
  --grey-50:hsl(220 20% 98%); --grey-200:hsl(220 16% 90%); --grey-500:hsl(220 9% 46%); --grey-900:hsl(222 30% 12%);
  --text-strong: var(--grey-900);  --text-weak: var(--grey-500);  --text-link: var(--blue-500);
  --stroke-strong: hsl(220 9% 60%); /* ≥3:1 on bg & fill */  --stroke-weak: var(--grey-200);
  --fill: var(--grey-50);  --bg: #fff;
  --fill-hover: rgb(0 0 0 / .04); --fill-press: rgb(0 0 0 / .10);
  --text-error: hsl(0 72% 42%); --fill-error-weak: hsl(0 86% 97%);
}
[data-theme="dark"]{ --bg:hsl(230 30% 10%); --fill:hsl(230 20% 15%); --text-strong:#fff; --text-weak:hsl(230 5% 85%);
  --fill-hover: rgb(255 255 255 / .06); --fill-press: rgb(255 255 255 / .12); }
```
2. **White text on light brand fails** → darken brand shade for buttons, or flip to dark text on light tint; or text-colour button + 3:1 border [RUI][PUI].
3. **Error shown only in red** → add icon + message text + thicker border + tinted bg [PUI].
4. **Washed-out light shades** → increase saturation at high lightness; rotate hue slightly.
5. **Chart series by hue only** → vary lightness too; add direct labels/markers [RUI][TID].
6. **Headings/icons in brand colour** → switch to Text strong / Stroke strong [PUI].
7. **Dark-mode tags uneven** → transparent foreground tokens instead of solid greys [PUI].

## Conflicts & Context
- HSL [RUI] vs HSB [PUI]: model choice is tooling; both reason in hue/saturation/lightness.
- Contrast algorithm: WCAG 2 is the legal baseline today; APCA better predicts dark-mode & orange cases [PUI].
- Colour psychology: [KUL] leans on associations (blue trust, orange CTA); [PUI] says not universal (culture, personal, CVD) — use as loose guidance, test with users.

## Anti-patterns
- **Five-colour palette generators** — "you can't build anything with five hex codes" [RUI].
- **35 slightly different blues** from preprocessor functions [RUI].
- **Light grey "minimal" text** [PUI][KUL].
- **Colour-only links/errors/status** [all].
- **Multiple action colours** or red as brand CTA [PUI].
- **Glass/translucent inputs on gradients** hurting legibility [KUL][PUI].
- **Fancy dark-mode shots failing contrast** [KUL].

## Worked Example
*Low-contrast "Invite editors" dialog [PUI], failures found:* close icon <3:1; secondary text <4.5:1; search field border <3:1; placeholder <4.5:1; white text on button bg <4.5:1; link text <4.5:1. Fix by applying palette roles: close icon & input border → Stroke strong; secondary text → Text weak; button bg → Brand (≥4.5:1 with white); link → Brand + underline; placeholder removed in favour of a visible label. One palette with contrast baked into its roles prevents recurrence.

## Key Takeaways
1. Greyscale first; colour = function.
2. Predefine 9-step scales and semantic roles; no ad-hoc colours.
3. 4.5:1 text, 3:1 UI/large; check real surfaces; consider APCA.
4. Never colour alone.
5. One interactive colour; brand off non-interactive elements.
6. Dark mode = lighter elevated surfaces + remapped tokens.

## Connects To
- **ch02** hierarchy · **ch06** depth via colour · **ch09** form errors · **ch11** data colour encoding · **ch15** accessibility
