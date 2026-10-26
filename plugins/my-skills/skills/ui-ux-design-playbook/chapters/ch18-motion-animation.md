# Ch 18: Motion & Animation

Sources: [DUI] ch20 Animation · [TID] animated transitions, spinners · [UXM] toasts, carousels · [WCAG] 2.2.2, 2.3.1, 2.3.3 · design-system practice for durations (Material, Carbon and similar token sets) · [JK] interfaces skills · [EK] · [VWG] · [IB] · [RS] · [ID]

## Core Idea
Motion is functional: it gives feedback, shows where something came from or went, and shows progress. Decorative motion is the exception and must never block, distract from the task, or harm people with vestibular or seizure sensitivity.

## Frameworks Introduced
- **Three jobs of motion** [DUI][TID]: *feedback* (the press registered, the state changed), *relationship/context* (a panel slides from the button that opened it; a list item collapses where it was removed), *progress* (something is happening; how far along). Anything else is decoration: limit it [DUI].
- **Durations** (common design-system practice, not a standard): ~100–150 ms for small feedback (hover, press, toggle); ~200–300 ms for component state changes (menus, tooltips, accordions); ~300–500 ms for large surface moves (drawers, page transitions). Exits run shorter than entrances. Above ~500 ms UI motion feels slow; scale duration with distance and size.
- **Easing** [DUI]: ease-out for things entering, ease-in for leaving (see *Conflicts*: the default for UI exits is a short ease-out), ease-in-out for moving on screen; linear only for continuous loops (spinners, progress). One easing family per product, set as tokens. Overshoot/bounce only where personality allows, never on critical controls.
- **Reduced motion** [WCAG]: honour `prefers-reduced-motion: reduce`: replace movement and parallax with fades or instant changes, but keep essential progress indicators working. WCAG 2.3.3 (AAA) asks that interaction-triggered motion can be disabled.
- **Must-pass WCAG floors**: nothing flashes more than three times per second (2.3.1, A); anything that moves, blinks or scrolls automatically for more than 5 s and starts with other content can be paused, stopped or hidden (2.2.2, A), including auto-rotating carousels and animated backgrounds.
- **Attention cost** [UXM]: motion pulls the eye before anything else; use it for the one thing that needs noticing now (a toast entering), not for ambient decoration competing with the task. Parallax: few layers, never on every element [DUI].
- **Microinteractions** [DUI]: animate state changes on interactive objects only (toggle, like, add-to-cart → button becomes progress → success); avoid animating plain text or inactive objects.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| AN1 | Purposeful | Each animation gives feedback, shows a relationship or shows progress; decorative motion is rare and non-blocking | DUI, TID |
| AN2 | Duration & easing tokens | Durations from a small token set, mostly 100–500 ms; consistent easing; nothing delays the user from acting | DUI |
| AN3 | No harmful motion | No content flashes more than 3 times per second; no large-area parallax or zoom on scroll by default | WCAG 2.3.1 |
| AN4 | Reduced-motion respected | A `prefers-reduced-motion` rule exists and removes non-essential movement; progress indicators still work; tiered, not blanket: remove vestibular triggers (parallax, large-area slides, zoom, scroll-linked movement), soften other movement to a short opacity fade (≤150ms), keep opacity, colour, focus-ring and progress transitions. A blanket "zero every duration" override passes only as a stopgap and only if it exempts essential progress | WCAG 2.3.3, EK, IB |
| AN5 | Auto-motion pausable | Carousels, videos, animated banners or tickers lasting more than 5 s have pause/stop; prefer no auto-rotation | WCAG 2.2.2, UXM |
| AN6 | Motion not the only cue | State changes conveyed by motion are also conveyed statically (text, icon, position) | WCAG 1.3.3, PUI |
| AN7 | Performance | Animations use `transform`/`opacity`; no layout thrash or jank visible at 60 fps on target devices; no animation driven from `scroll`/`scrollY` events (scroll or view timelines, or `IntersectionObserver` to start and pause); no animated CSS variables on parents with many children; blur animation small (≤8px), one-shot and never on large surfaces; reads batched before writes (FLIP); off-screen loops paused; under main-thread load prefer CSS/WAAPI over rAF-driven libraries; no framework state update per frame inside `requestAnimationFrame`, `pointermove`, `scroll` or drag handlers (write `transform` through a ref or a motion value) | (engineering practice), IB, EK |
| AN8 | Interruptible state changes | Hover, toggle, open and close use CSS transitions or springs that retarget when reversed mid-flight; keyframe `animation` is kept for one-shot sequences (enter, loading), never set on a toggled class or `:hover`; gesture-driven motion (drag, flick, swipe, sheet) uses springs that start from the current on-screen value and keep release velocity; input is never locked during a transition | JK, EK, RS |
| AN9 | High-frequency stays instant | Keystrokes, row hovers, tab switches and menu items respond instantly or with ≤150ms on `opacity`/`background-color`; expressive motion only for infrequent moments (first load, success, empty state); frequent keyboard actions (shortcuts, command palette, list and menu navigation) and anything used ~100× a day do not animate at all; a dialog opened from the keyboard animates like one opened by pointer; after the first tooltip opens, neighbouring tooltips open with no delay and no animation | JK, DUI, EK, RS |
| AN10 | Enters and exits | Exits are shorter and smaller than enters (no full-height slide unless the destination means something, e.g. a drawer); an element hidden by its base rule is not revealed only by an `animation` (hidden state lives in the `from` keyframe); state swaps don't animate on first render; nothing enters from `scale(0)` (start at ≥0.9 with opacity); popovers and menus scale from their trigger (`transform-origin` at the trigger), modals stay centred; enters and exits follow the same path; a close or hover-out is never delayed; press scale stays between ~0.95 and 1 and never applies to a disabled control | JK, EK, VWG |
| AN11 | Transition scope | `transition-property` names what changes, never `all`; `will-change` only after observed first-frame stutter, naming a transform property, `opacity` or `filter` (never `all`); a theme switch does not fire every colour transition at once | JK |

## Fix Recipes
Tokens plus a **stopgap** reduced-motion override for a codebase with motion scattered everywhere. It satisfies AN4 only because it exempts essential progress; replace it with the tiered version in recipe 4 (a short opacity fade, movement added only under `no-preference`) as each component is touched.
```css
:root { --dur-fast: 120ms; --dur-base: 220ms; --dur-slow: 360ms;
        --ease-out: cubic-bezier(.2,.8,.2,1); --ease-in: cubic-bezier(.4,0,1,1); }
.menu { transition: opacity var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out); }
.menu[hidden] { opacity: 0; transform: translateY(-4px); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important;
                           transition-duration: 1ms !important; scroll-behavior: auto !important; }
  .spinner, .progress-bar { animation-duration: revert !important; animation-iteration-count: revert !important; } /* keep essential progress */
}
```
1. **Auto-rotating hero carousel** → static first slide + visible controls, or pause button and no auto-advance.
2. **600 ms page transitions** → 250–350 ms, ease-out, crossfade under reduced motion.
3. **Bouncing "Thinking…" dots for 20 s** → progress text that changes with the actual step (ch16, ch19).

4. **Implementation details** [JK] (the values are one designer's defaults; any consistent token set passes AN2):
```css
/* interruptible: reverses smoothly if clicked again mid-flight */
.drawer { transform: translateX(-100%); transition: transform 200ms ease-out; }
.drawer.open { transform: none; }

/* reduced motion: keep a short opacity fade, add movement only when allowed */
.panel { transition: opacity 150ms ease-out; }
@media (prefers-reduced-motion: no-preference) {
  .panel { transition-property: opacity, translate, scale; transition-duration: 300ms; }
}

/* entering from display:none (popover, dialog) */
[popover] { opacity: 0; translate: 0 12px; transition: opacity 150ms, translate 150ms, display 150ms allow-discrete, overlay 150ms allow-discrete; }
[popover]:popover-open { opacity: 1; translate: 0 0; }
@starting-style { [popover]:popover-open { opacity: 0; translate: 0 12px; } }

.button { transition-property: scale, background-color; transition-duration: 150ms; }
.button:not(:disabled):active { scale: 0.96; }   /* house default; never scale a disabled control */
```
- **Subtle exit** [JK]: a closing drawer need not travel its full width; animate `x` partway (about `-70%`) and let `opacity` and a small `blur` finish the job, so the exit asks for less attention than the enter.
- **Theme switch**: add a temporary `*{transition:none!important}` stylesheet, flip the theme, force a style flush (`document.body.offsetHeight`), remove the sheet after two animation frames (`next-themes`: `disableTransitionOnChange`).
- **Motion library**: `<MotionConfig reducedMotion="user">` turns off transform/layout animation and keeps opacity; `AnimatePresence initial={false}` around a state swap (not around an intended entrance).
- **Staged entrance** (infrequent only): split into title / description / actions, stagger ~100ms, each fading in with a small `translateY` and blur.

5. **Animation decision order** [EK][RS]: frequency (100+/day → none; tens/day → minimal; occasional → standard; rare → may delight) → purpose (feedback, spatial consistency, state, preventing a jump, explanation) → driver (user gesture → spring; system change → easing; time → linear) → easing (enter/interactive: a strong ease-out such as `cubic-bezier(0.23, 1, 0.32, 1)`; on-screen movement: ease-in-out; hover/colour: ease) → duration (press 100–160ms, tooltip 125–200, dropdown 150–250, modal/drawer 200–500). If it feels slow, shorten the duration before sharpening the curve.
```css
.popover { transform-origin: var(--transform-origin); }      /* Radix / Base UI expose the trigger-relative origin */
.popover[data-starting-style], .popover[data-ending-style] { opacity: 0; transform: scale(0.96); }
.tooltip[data-instant] { transition-duration: 0ms; }         /* subsequent tooltips: no delay, no animation */
@media (hover: hover) and (pointer: fine) { .card:hover { transform: translateY(-2px); } }
```
```jsx
// framer-motion / motion: shorthand x/y run on the main thread; a transform string can stay smooth under load
<motion.div animate={{ transform: "translateX(100px)" }} />
// drag release keeps the gesture's velocity
onDragEnd={(e, info) => animate(el, { x: 0 }, { type: "spring", velocity: info.velocity.x })}
```

## Conflicts & Context
- **Blanket reduced-motion overrides** (zeroing every duration) also stop spinners and progress bars; exempt essential indicators, as above.
- **Delight vs speed**: brand motion is legitimate on marketing pages and onboarding, not in high-frequency task flows.
- **Severity of ignoring reduced motion**: [JK] treats motion that ignores `prefers-reduced-motion` as High on sight; WCAG makes interaction-triggered motion (2.3.3) AAA, which this playbook does not floor at High. Default: **High** when large-area or vestibular-trigger motion (parallax, zoom, full-screen slides, scroll-linked movement) ignores the setting, or when it also breaks a WCAG A/AA rule (2.2.2 pause, 2.3.1 flashes); otherwise **Medium**.
- **Reduced-motion fallback**: instant change [WCAG practice] vs short opacity cross-fade [JK]. Default: cross-fade (≤150ms) for state changes so the change is still visible; kill parallax and autoplay entirely.
- **Press scale**: 0.96 [JK] · 0.97 [EK][ID] · 0.98 [RS]; all agree never below ~0.95 and never on a disabled control. Default: any one value in 0.95–0.98, used consistently (AN2); none is a finding on its own.
- **Stagger**: ~100ms between the semantic chunks of one entrance (title → text → actions) [JK] vs 30–80ms (≤50ms [RS]) between items of a list [EK][ID]. Different jobs, not a disagreement; keep the total short and never block input.
- **Exit easing**: ease-in for exits [DUI][RS] vs never ease-in for UI because it delays the first visible frame [EK]. Default: exits use a short ease-out or ease-in-out; reserve ease-in for elements leaving the screen entirely, kept ≤200ms.
- **Duration ceiling**: "UI motion under 300ms" [EK][RS] vs 300–500ms for large surfaces (this chapter). Default: ≤300ms for anything a user triggers often; 300–500ms only for large surfaces such as drawers and full-screen sheets.
- **How much motion**: none unless asked [IB] vs a required motion layer on marketing pages [TS]. Default by visitor mode (design-workflow.md §0, §8): Operate surfaces add motion only where it explains a change; Persuade pages may carry a motion layer.

## Anti-patterns
- Animation that must finish before the next input is accepted.
- Motion used as the only state cue (a shaking field with no error text).
- Scroll-jacking and heavy parallax.
- Auto-playing carousels with dot-only indicators [UXM].

## Key Takeaways
1. Animate to inform: feedback, relationship, progress.
2. Short, consistent, token-based durations and easing.
3. Respect reduced motion; never flash; let users pause anything that keeps moving.

## Connects To
- **ch16** feedback and progress · **ch12** components and tokens · **ch15** accessibility · **ch07** media
