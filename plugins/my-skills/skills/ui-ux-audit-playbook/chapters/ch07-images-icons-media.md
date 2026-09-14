# Ch 07: Images, Icons, Video & Media

Sources: [RUI] "Working with Images" · [PUI] ch3–5 · [TID] ch5 · [WSG] ch11–12, ch6–7 · [KUL] hero visuals, cards

## Core Idea
Images must earn their weight: good photography sized for its slot, text on images with guaranteed contrast, icons drawn for their display size in one consistent style (and labelled), meaningful alt text, responsive delivery, and media the user controls.

## Frameworks Introduced
- **Use good photos** [RUI][TID]: hire a photographer or use quality stock; never design with placeholders expecting phone snaps later; avoid clichés (smiling suits, kites, sunsets) [TID]; custom beats stock; decorative images sparingly in functional GUIs.
- **Text needs consistent contrast** [RUI][PUI]: reduce image dynamics before choosing text colour.
  - Semi-transparent overlay (black for light text; e.g. 50% dark grey) [RUI][PUI]
  - Linear gradient overlay (dark grey 90% at bottom → 0% halfway up) + subtle text shadow [PUI]
  - Lower image contrast (+ adjust brightness) [RUI]; colorize: lower contrast → desaturate → multiply fill [RUI]
  - Blurred overlay [PUI]; solid text background (captions) [PUI]
  - Text shadow as soft glow (large blur, no offset) [RUI]
  - Must still meet 4.5:1 small / 3:1 large text [PUI].
- **Everything has an intended size** [RUI]: don't upscale 16–24px icons (enclose small icon in a coloured shape instead); don't downscale full screenshots (use tablet-size shot, partial crop, or simplified drawn UI); redraw logos for favicon size.
- **Beware user-uploaded content** [RUI][KUL][TID]: fixed aspect containers with `object-fit: cover`; subtle inner shadow or semi-transparent inner border to prevent bg bleed (not solid borders); consistent crops in grids; keep native aspect where it's information (personal photos) [TID].
- **Icons** [TID][PUI][KUL]: follow conventions; one visual style (all outlined or all filled, same stroke); filled often signals "selected"; don't rely on icons alone — pair with text labels; balance icon/text weight & size or lower icon contrast; lead with icon for scannable lists, trailing icon for destination hints (→, door for log out) [KUL].
- **Photo composition** [PUI][TID]: Rule of Thirds (subject on intersection, horizon on third line); gaze direction guides the eye toward headline/CTA [TID]; adjust colour temperature of decorative photos to match palette (never product photos) [PUI][KUL].
- **Image formats & delivery** [WSG]: JPEG photos (lossy; keep originals, never recompress), PNG flat art/transparency, GIF tiny flat graphics, SVG icons/diagrams (scalable; complex vector art → export raster); CSS effects instead of image files where possible ("best graphics are often no graphics"); custom icon subset rather than whole icon fonts; `srcset`/`<picture>` for responsive & 2x screens; lazy load below fold.
- **Alternative text** [WSG]: describe content & function in context, briefly. Functional images say what they do ("Play", "Acme Carpet Cleaners"); decorative/redundant → `alt=""`; complex charts/diagrams → caption + data table; `<figure>/<figcaption>`.
- **Video & audio** [WSG][TID][KUL]: user control — show title, description, duration; never autoplay; keep informational video ~3–4 min; captions (edited, not raw auto-captions), transcripts, audio description; keyboard-accessible player with visible focus and caption toggle; Touch Tools for immersive media (auto-hide controls) [TID].
- **Carousels & hero visuals** [TID][KUL]: carousel for casual browsing of equally interesting items (<10 visible, arrows move multiple, show partial next item); hero visuals must align with brand & message, be responsive; social proof near CTA.

## Key Concepts
- **Overlay**: tinted layer between image and text.
- **object-fit: cover**: crop-to-fill fixed container.
- **Intended size**: resolution/detail level an asset was drawn for [RUI].
- **Alt text**: text alternative for non-text content.
- **srcset/picture**: responsive image selection [WSG].
- **CSS pixel vs device pixel** [WSG].

## Mental Models
- Fix the image, not the text: tame the background until any text colour works [RUI].
- Icons are words with poor vocabulary — add labels unless universally known [TID][PUI].
- Every image is a download and a sentence for screen reader users: justify both.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| I1 | Text on images | Contrast ≥4.5:1 (≥3:1 large) across the whole text area, all breakpoints | PUI, RUI |
| I2 | Image quality & relevance | No placeholders/clichés; decorative images don't distract from task | RUI, TID |
| I3 | Scaling artefacts | No upscaled small icons, shrunken detailed screenshots, blurry logos/favicons | RUI |
| I4 | UGC containment | Uploaded images in fixed-ratio containers, cropped consistently, no bg bleed | RUI, KUL |
| I5 | Icon consistency | One style/stroke/size set; filled vs outline carries consistent meaning | PUI, TID |
| I6 | Icon labels | Non-universal icons have visible text labels (or at minimum accessible names + tooltips) | TID, PUI, WSG |
| I7 | Meaningful icon contrast | Icons conveying info/actions ≥3:1; icons on photos get solid backing | PUI |
| I8 | Alt text | Informative images described; decorative `alt=""`; charts have text/data equivalent | WSG |
| I9 | Delivery | Correct formats; responsive sizes/2x via srcset; SVG for icons; images compressed; lazy-loaded | WSG |
| I10 | Media control | No autoplay with sound (prefer none); duration shown; captions & transcript; keyboard-operable player | WSG |
| I11 | Photo composition | Subject/gaze leads toward content; decorative photo temperature fits palette | PUI, TID |

## Fix Recipes
```html
<picture>
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w" sizes="(max-width: 700px) 100vw, 1200px">
  <img src="hero-1200.jpg" srcset="hero-800.jpg 800w, hero-1600.jpg 1600w" sizes="(max-width: 700px) 100vw, 1200px"
       width="1200" height="630" alt="Two people loading boxes into a moving van" loading="lazy" decoding="async">
</picture>
```
```css
.hero{ position:relative; }
.hero::after{ content:""; position:absolute; inset:0;
  background: linear-gradient(to top, hsl(222 30% 10% / .9), hsl(222 30% 10% / 0) 55%); }
.hero h1{ position:relative; color:#fff; text-shadow: 0 0 24px hsl(0 0% 0% / .35); }
.avatar{ aspect-ratio:1; object-fit:cover; border-radius:50%; box-shadow: inset 0 0 0 1px hsl(0 0% 0% / .08); }
.feature-icon{ display:grid; place-items:center; inline-size:48px; block-size:48px; border-radius:12px;
  background: var(--blue-100); color: var(--blue-700); } /* small icon, larger shape */
```
1. **Illegible hero text** → gradient/solid overlay or lower image contrast; re-measure contrast at text location.
2. **Chunky scaled-up icons** → keep icon at 20–24px inside a 48px tinted shape.
3. **Mixed icon sets** → pick one library/style; replace outliers; standardise size tokens (16/20/24).
4. **Icon-only toolbar** → add labels (or labels on hover/focus + `aria-label` as minimum for universal icons only).
5. **Missing/poor alt** → write purpose-based alt; decorative images `alt=""`; add captions/tables for charts.
6. **Autoplay hero video** → poster image + play button with duration; captions track.

## Conflicts & Context
- Icon labels: [TID][PUI][WSG] favour always-visible text; mobile tab bars may use icon+short label; icon-only acceptable only for truly universal glyphs (search, close, menu) and still needs an accessible name.
- Icon position in buttons: leading for recognition/scan, trailing for direction — context dependent [KUL].

## Anti-patterns
- **White text slapped on busy photos** [PUI][RUI].
- **Stock-photo clichés** [TID].
- **Shrunken full-app screenshots** with 4px text [RUI].
- **Solid borders around user avatars** clashing with image colours [RUI].
- **Mystery-meat icon navigation** [TID][PUI].
- **Autoplaying video** (screen readers must hunt for stop) [WSG].
- **Text baked into images** (invisible to search & assistive tech) [WSG].

## Worked Example
*Fitness app photo & icons [PUI]:* Icons overlaying a workout photo had <3:1 contrast and tiny tap areas → given solid white circular backgrounds with Stroke-strong icons (passes 3:1 on any photo, larger target). The instructor portrait was centred and static → recomposed with the face on a rule-of-thirds intersection and the horizon on the upper third line for a sense of motion. Star ratings got darker borders to reach 3:1.

## Key Takeaways
1. Tame the image before placing text; verify contrast.
2. Draw/choose assets for their display size.
3. One icon style; label non-obvious icons.
4. Purposeful alt text; decorative = empty alt.
5. Responsive, compressed delivery; no autoplay; captions.

## Connects To
- **ch05** contrast · **ch12** cards/hero/carousel components · **ch15** alt & media accessibility · **ch14** mobile performance
