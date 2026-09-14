# Ch 14: Mobile, Touch & Responsive Design

Sources: [TID] ch6 · [WSG] ch6–7 · [PUI] ch1–2, ch4–5, ch7 · [KUL] grids, thumb zone · [RUI] "Shrink the canvas", relative sizing

## Core Idea
Design mobile-first: strip to what mobile users actually need, linearise content in priority order, make touch targets big and reachable, minimise typing and loads, keep navigation and "you are here" cues — then progressively enhance with fluid grids, flexible media and content-driven breakpoints.

## Frameworks Introduced
- **Challenges of mobile** [TID]: tiny screens · variable widths · touch (fat fingers) · typing is hard · harsh environments (glare, noise, motion) · location awareness · limited attention & social context.
- **How to approach a mobile design** [TID]: (1) what do mobile users need ("tell me this fact now", "entertain me for 2 minutes", "connect me", "alert me", "what's here?"); (2) strip to essence — avoid the "layer cake" of logo/ads/tabs pushing content down; full-function parity if users are mobile-only; (3) use device hardware (location, camera, voice, haptics); (4) linearise content; (5) optimise common sequences — eliminate typing, few loads/bytes, prefer one long scroll to many screens, fewer taps.
- **Design for the smallest screen first** [PUI][RUI][WSG]: forces prioritisation; start ~360–400px [RUI] / 375px iPhone mini [KUL]; then adjust upward.
- **Responsive web design** [WSG]: fluid proportional grids, flexible images (`max-width:100%`, srcset/picture), media queries; breakpoints from content, not devices; don't stretch to giant monitors (max-width); reorder by priority, not formula (sidebar items may need to be near top on mobile).
- **Mobile-first + progressive enhancement** [WSG]: everyone gets working single-column content; richer layouts add on.
- **Touch targets & reach** [PUI][TID][KUL][WSG]: ≥48×48pt (Android 48dp, iOS 44pt); spacing ≥8pt; *Generous Borders* — tappable whitespace around targets [TID]; primary CTA full-width at bottom within thumb zone; destructive/secondary actions away from easy reach [KUL]; larger phones reduce one-handed reach (Fitts) [WSG].
- **Mobile layout** [PUI][KUL][TID]: 4-column grid, 16px margins (≥16–20), 8–16px gutters; *Vertical Stack*: useful content in first ~100px, labels above fields, buttons side-by-side only if they fit at any text size.
- **Relative sizing doesn't scale** [RUI]: headings shrink more than body on small screens; switch to smaller type-scale ratio [PUI].
- **Mobile navigation** [TID][WSG][KUL][PUI]: bottom tab bar (3–5 main destinations, icons + labels, active highlighted); hamburger/menu for overflow; *Bottom Navigation* links for mobile web; keep "you are here" and footer nav so users don't bounce to home; *Filmstrip* for parallel screens with dot indicator; don't mix gesture metaphors (horizontal swipe is app/tablet, web scrolls vertically) [WSG]; make important content visible or discoverable (peek next card) [PUI].
- **Mobile patterns** [TID]: *Mobile Direct Access* (actionable first screen using location/time) · *Touch Tools* (controls on tap, auto-hide) · *Collections & Cards* · *Infinite List* · *Loading/Progress Indicators* (partial content, in-situ) · *Richly Connected Apps* (tap phone → dialer, address → maps, date → calendar).
- **Mobile essentials** [WSG]: responsive type for size *and* resolution; snappy performance (few KB CSS/JS, compressed images); easy payments (Apple Pay/PayPal — no 16-digit forms); accessible (VoiceOver/TalkBack, zoom); link to "desktop version" if content differs; click-to-call phone & address prominent; don't nag to install the app; assume portrait phones (tablets ~half landscape).
- **Don't disable pinch zoom** [WSG]: locks out low-vision users; aesthetic reasons don't justify it.
- **Input on mobile** [TID][KUL][PUI]: autocomplete, prefill, correct keyboards (`type`, `inputmode`, `autocomplete`), steppers, pickers; avoid long dropdowns → full-screen searchable sheet.
- **Load & performance** [WSG]: conversions drop when load >~4s; frustration ~10s; srcset, compression, SVG, few web fonts.

## Key Concepts
- **Mobile-first**; **progressive enhancement**; **breakpoint**; **thumb zone**; **touch target**; **viewport meta**; **layer-cake effect** [TID]; **CSS pixel** [WSG].

## Mental Models
- Mobile isn't a smaller desktop; it's a different context with distracted, one-handed, on-the-go users.
- If it doesn't fit on mobile, ask whether it's needed at all [PUI][WSG].
- Fingers don't get smaller when screens get sharper [WSG].

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| M1 | Viewport & zoom | `width=device-width`; pinch zoom allowed; no horizontal scroll at 320–360px | WSG |
| M2 | Content priority | Primary content/action visible in first screen; no stacked logo/ad/banner layer cake | TID, WSG |
| M3 | Targets | ≥44–48px; ≥8px apart; tappable whitespace; no tiny inline links as sole action | PUI, TID |
| M4 | Reach | Primary CTA in thumb zone (bottom/full-width); destructive actions not in easy reach | PUI, KUL |
| M5 | Navigation | Main destinations reachable (tab bar 3–5 w/ labels or clear menu); current location indicated; footer/section nav | TID, WSG |
| M6 | Typing minimised | Right keyboards, autofill, autocomplete, defaults, pickers | TID, KUL |
| M7 | Responsive type | Headings scaled down more than body; body ≥16px (prevents iOS zoom on inputs) | RUI, PUI |
| M8 | Layout | Single column; labels above; buttons stack full-width; 16px+ margins | PUI, KUL |
| M9 | Breakpoints | Content-driven; tablet not a stretched phone; large screens max-width | WSG |
| M10 | Performance | Images sized per viewport; LCP fast; minimal blocking JS/CSS/fonts | WSG |
| M11 | Gestures | Every gesture has a visible alternative; no hover-only features; swipe not required for core tasks | WSG, TID |
| M12 | Device integration | Phone/address/date tappable; share/camera where relevant | TID, WSG |
| M13 | Orientation & text size | Works portrait & landscape; OS text-size increase doesn't break layout | WSG, TID |

## Fix Recipes
```html
<meta name="viewport" content="width=device-width, initial-scale=1">  <!-- never maximum-scale=1 / user-scalable=no -->
```
```css
.container{ width:min(100% - 2rem, 72rem); margin-inline:auto; }             /* 16px gutters mobile, max width desktop */
.layout{ display:grid; gap:1.5rem; }
@media (min-width: 48rem){ .layout{ grid-template-columns: 16rem 1fr; } }     /* sidebar appears when content fits */
.sticky-cta{ position:sticky; bottom:0; padding:1rem; background:var(--bg); box-shadow:var(--elev-3); }
.sticky-cta .btn{ width:100%; min-height:48px; }
h1{ font-size: clamp(1.5rem, 1.1rem + 2vw, 2.75rem); }                         /* shrinks faster than body */
input, select, textarea{ font-size:1rem; }                                    /* avoid iOS auto-zoom */
.tap-target{ position:relative; } .tap-target::after{ content:""; position:absolute; inset:-12px; } /* expand hit area */
```
1. **Desktop page crammed into phone** → list must-haves; hide nothing essential; reorder by priority; collapse secondary into disclosures.
2. **Tiny links/icons** → enlarge hit areas; add spacing; convert text links in lists to full-row targets.
3. **Hamburger hiding 3 key sections** → bottom tab bar with labels.
4. **Long forms on mobile** → steps, autofill, wallet payments, numeric keyboards.
5. **Zoom disabled** → remove `user-scalable=no/maximum-scale`.
6. **Heavy hero image** → responsive `srcset`, smaller mobile crop, lazy-load below the fold.

## Conflicts & Context
- Stripped "mobile site" [TID early advice] vs full experience [WSG]: modern consensus — same content & functions, prioritised & progressively disclosed; offer desktop layout toggle only if parity is impossible.
- Hamburger acceptance: fine on small screens [TID][WSG], but visible labels win when 3–5 destinations fit [PUI].

## Anti-patterns
- **Layer cake header** consuming the first screen [TID].
- **Disabled pinch zoom** [WSG].
- **Hover-dependent UI on touch** [WSG].
- **App-install nag interstitials** [WSG].
- **Side-by-side buttons that wrap/overflow** with localisation or large text [TID].
- **Tiny close icons in corners** [PUI].

## Worked Example
*Booking app bottom bar [PUI + TID]:* A property detail page on mobile hid the price and "Book now" below a long description. Fix: essential info (name, rating, key facts) in the first screen; description truncated with a descriptive "Read full description" link; a sticky, elevated bottom bar holds the price (last position, remembered) and a full-width primary "Book now" ≥48pt tall in the thumb zone; the phone number and address are tappable (dialer/maps); images use `srcset` so the phone downloads a small crop; pinch zoom remains enabled.

## Key Takeaways
1. Start at ~360–400px; prioritise ruthlessly.
2. 44–48px targets, thumb-reachable primary actions.
3. Reduce typing, taps, loads, bytes.
4. Keep navigation and location cues on mobile.
5. Fluid, content-driven breakpoints; never block zoom.

## Connects To
- **ch03** grids · **ch09** mobile inputs · **ch10** mobile navigation · **ch07** responsive images · **ch15** zoom & AT
