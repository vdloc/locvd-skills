# Ch 18: Motion & Animation

Sources: [DUI] ch20 Animation · [TID] animated transitions, spinners · [UXM] toasts, carousels · [WCAG] 2.2.2, 2.3.1, 2.3.3 · design-system practice for durations (Material, Carbon and similar token sets)

## Core Idea
Motion is functional: it gives feedback, shows where something came from or went, and shows progress. Decorative motion is the exception and must never block, distract from the task, or harm people with vestibular or seizure sensitivity.

## Frameworks Introduced
- **Three jobs of motion** [DUI][TID]: *feedback* (the press registered, the state changed), *relationship/context* (a panel slides from the button that opened it; a list item collapses where it was removed), *progress* (something is happening; how far along). Anything else is decoration: limit it [DUI].
- **Durations** (common design-system practice, not a standard): ~100–150 ms for small feedback (hover, press, toggle); ~200–300 ms for component state changes (menus, tooltips, accordions); ~300–500 ms for large surface moves (drawers, page transitions). Exits run shorter than entrances. Above ~500 ms UI motion feels slow; scale duration with distance and size.
- **Easing** [DUI]: ease-out for things entering, ease-in for leaving, ease-in-out for moving on screen; linear only for continuous loops (spinners, progress). One easing family per product, set as tokens. Overshoot/bounce only where personality allows, never on critical controls.
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
| AN4 | Reduced-motion respected | A `prefers-reduced-motion` rule exists and removes non-essential movement; progress indicators still work | WCAG 2.3.3 |
| AN5 | Auto-motion pausable | Carousels, videos, animated banners or tickers lasting more than 5 s have pause/stop; prefer no auto-rotation | WCAG 2.2.2, UXM |
| AN6 | Motion not the only cue | State changes conveyed by motion are also conveyed statically (text, icon, position) | WCAG 1.3.3, PUI |
| AN7 | Performance | Animations use `transform`/`opacity`; no layout thrash or jank visible at 60 fps on target devices | (engineering practice) |

## Fix Recipes
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

## Conflicts & Context
- **Blanket reduced-motion overrides** (zeroing every duration) also stop spinners and progress bars; exempt essential indicators, as above.
- **Delight vs speed**: brand motion is legitimate on marketing pages and onboarding, not in high-frequency task flows.

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
