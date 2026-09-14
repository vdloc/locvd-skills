# Ch 12: Components & Design Systems

Sources: [KUL] cards, modals, dropdowns, hero, pricing, search, style guides · [PUI] ch1 design system, ch3 tokens · [TID] ch4, ch11 · [WSG] ch7–8 pattern libraries · [RUI] systems, empty states

## Core Idea
Consistency at scale comes from a system: tokens (colour, type, spacing, radius, shadow) → reusable components with every state → documented usage guidelines → templates. Component-level best practice (cards, modals, dropdowns, tabs, accordions, hero, pricing, search, empty states) is where most audit findings land.

## Frameworks Introduced
- **Design system in 3 steps** [PUI]: (1) predefined style options/tokens, (2) reusable modules (small → large → templates), (3) usage guidelines (e.g. "brand colour = interactive", "sentence case", "left-align buttons", "avoid disabled buttons", "front-load text").
- **Atomic Design** [TID, after Brad Frost]: atoms (label, input, colour, typeface) → molecules (label+input+hint; image+title+caption) → organisms (header with logo, nav, search, sign-in tools) → templates (screen types) → pages (real content). Style inheritance: fix a token once (e.g. contrast) and it propagates; avoid "UX debt" from diverging copies. UI frameworks are "a floor, not a ceiling".
- **Pattern libraries** [WSG]: live HTML/CSS patterns (not static pictures) → prevent CSS bloat, regression-test in one page, shared vocabulary; style *every* plausible HTML element (cite, abbr, tables) to avoid ugly defaults.
- **Visual Framework** [TID]: all screens share layout, margins, header, colours, type, writing style, signposts, spacing/alignment; define in one place (CSS/tokens).
- **Style guide contents** [KUL][WSG]: grid/layout, colour (primitives + tonal scales with contrast ratios), type scale & naming, spacing, shadows/blurs, iconography, imagery, components with states, editorial style (terminology, capitalisation, links, headings). Name tokens by Material/HIG-style conventions.
- **Component states** [PUI][KUL]: default · hover · pressed/active · focus · selected · disabled · loading · error · empty — every component spec lists them.
- **Cards** [KUL][TID][RUI]: anatomy header/content/footer; concise content; consistent lengths (truncate with ellipsis + full text available, or equal-height rows, min/max heights); consistent image ratio & quality; CTA clear, at bottom, with hover/active; padding 16–24px (vertical slightly larger for optical balance), 16–40px gaps, 64–96px section padding [KUL]; whole-card click target must not swallow inner actions; borders/shadows in moderation.
- **Modals** [KUL][TID][PUI]: reserve for critical, focused tasks or irreversible confirmations; clear escape routes (X, Cancel, Esc, click outside for non-destructive); short verb labels; lightbox dims background; progress for multi-step imports; no double negatives; responsive; don't use modals for routine errors (inline instead); trap & restore focus [WSG a11y].
- **Dropdowns & menus** [KUL][TID][WSG][PUI]: states (default, hover, open, selected, disabled); scroll affordance for long lists (fade last item); multi-select with count & clear; subtle shadow + stroke on light bg; long mobile lists → full-screen sheet with search; keyboard shortcuts shown for power users; nested levels with chevrons; drop-downs choose values, not trigger actions [TID]; not hover-only [WSG]; ≤~10 items else autocomplete [PUI].
- **Tabs, accordions, collapsible panels** [TID][PUI]: *Module Tabs* — similar-size modules, <10 tabs, never two rows, selected tab unmistakable (contiguous with panel, not colour-only), don't use tabs to group form sections; *Accordion* — clear titles + chevron affordance, allow multiple open, persist state; *Collapsible Panels* — if most users open it, default it open; use progressive disclosure, but important content stays visible [PUI].
- **Tooltips** [KUL][WSG][TID]: brief, supplementary only; not the sole home of critical info; reachable via keyboard focus & touch.
- **Toasts/snackbars** [KUL]: confirm & offer Undo; don't hide errors needing action in auto-dismissing toasts.
- **Hero sections** [KUL]: above the fold — value proposition, why trust, main benefits, action; F-pattern (left-aligned, text-rich) vs Z-pattern (centred, visual impact); headline immediately understandable, emotional, jargon-free; one distinct action-oriented primary CTA ("Start free trial"), subtler secondary ("Watch demo"), nav CTA distinct from both; relevant brand visuals; social proof ("Rated 4.9 by 1,500+ users", logos, guarantees) — authentic; tease continuation (peeking section/cut-off image).
- **Pricing** [KUL][PUI]: highlight recommended plan (larger, stronger border, deeper shadow, filled CTA, "Most popular" badge) without making others look irrelevant; genuine scarcity only; social proof & security badges; sticky plan header in long comparison tables; tooltips for features; annual/monthly toggle (immediate effect); charm pricing ($9), % off under ~$100 vs $ off above, precise numbers feel calculated.
- **Search component** [KUL][PUI]: prominent input ≥44px tall, clear border/fill; example placeholder; autocomplete; recent searches with clear; cancel/reset; no-results help; single-field button attached to input [PUI].
- **Empty states** [RUI]: illustration + explanation + primary CTA; hide inert controls.
- **Progress & loading** [TID]: show partial content; in-situ indicators; skeletons.
- **Settings Editor** [TID]: conventional location, grouped pages, show current values, immediate vs Save per platform convention.
- **Think outside the box** [RUI]: rich dropdowns (sections, columns, icons), selectable cards instead of plain radio lists (keep radio affordance [PUI]).

## Key Concepts
- **Token** (primitive, semantic) [PUI].
- **Component library / UI kit** [PUI][KUL].
- **Atomic design levels** [TID].
- **Pattern library** (live code) [WSG].
- **UX debt** [TID].
- **Lightbox / modal panel** [TID].

## Mental Models
- Design the system, not the screen [TID].
- A component isn't done until every state and edge content is specified.
- Conventions are components users already learned — only restyle, never re-behave [WSG].

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| S1 | Token coverage | Colour, type, spacing, radius, shadow, z-index, motion defined & used; ≤~3 radius sizes | PUI, KUL |
| S2 | Duplicate components | One button/input/card family; no near-identical variants | TID, WSG |
| S3 | State completeness | Each interactive component has hover/active/focus/disabled/loading/error/empty specs | PUI, KUL |
| S4 | Card consistency | Same image ratio, truncation rules, CTA placement; nested interactive elements reachable | KUL |
| S5 | Modal usage | Only for focused/critical tasks; Esc/X/Cancel; focus trapped & restored; background inert; no modal-on-modal | KUL, TID |
| S6 | Dropdown usability | Not for actions; keyboard navigable; long lists searchable; mobile sheet | TID, KUL, WSG |
| S7 | Tabs/accordion | Clear selected state; ≤1 row tabs; panels labelled; state persists | TID |
| S8 | Hero effectiveness | Value prop clear in 5 s; single primary CTA; social proof; readable text over imagery | KUL |
| S9 | Pricing clarity | Recommended plan distinguished; features comparable; honest urgency | KUL |
| S10 | Empty/loading/error | Present for every data-driven component | RUI, TID |
| S11 | Documentation | Usage guidelines + editorial rules exist and match implementation | PUI, WSG |
| S12 | Framework fit | UI kit customised to brand; conventions preserved; no ugly defaults for rare elements | TID, WSG |

## Fix Recipes
```css
:root{
  --radius-sm:8px; --radius-md:16px; --radius-lg:32px;   /* small/medium/large elements [PUI] */
  --z-dropdown:1000; --z-sticky:1100; --z-overlay:1300; --z-modal:1400; --z-toast:1500;
  --dur-fast:120ms; --dur-base:200ms; --dur-slow:300ms; --ease:cubic-bezier(.2,.8,.2,1);
}
.card{ display:grid; grid-template-rows:auto 1fr auto; gap:.5rem; padding:1.5rem 1.25rem; border-radius:var(--radius-md); }
.card img{ aspect-ratio:16/9; object-fit:cover; border-radius:var(--radius-sm); }
.card h3{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.plan--recommended{ transform:scale(1.03); border:2px solid var(--blue-600); box-shadow:var(--elev-3); }
@media (prefers-reduced-motion: reduce){ *{ transition-duration:.01ms !important; animation:none !important; } }
```
```html
<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete project?</h2>
  <p>This permanently removes 24 files. You can't undo this.</p>
  <form method="dialog" class="btn-group">
    <button value="delete" class="btn btn-danger">Delete project</button>
    <button value="cancel" class="btn btn-secondary" autofocus>Cancel</button>
  </form>
</dialog>
```
1. **Component sprawl** → inventory screenshots of every button/input/card; merge into one spec each; replace usages; lint for raw values.
2. **Inconsistent cards** → fixed image ratio, line-clamp titles, CTA pinned to bottom via grid rows.
3. **Modal for everything** → inline editing/expansion or dedicated page; keep modal for confirmations & short focused tasks.
4. **Hover-only dropdown** → click/tap disclosure with keyboard support; searchable sheet on mobile.
5. **Hero with three equal CTAs** → one primary, one secondary, rest to nav or below the fold.
6. **Missing states** → add a state matrix to the library and visual regression stories (default/hover/focus/active/disabled/loading/error/empty).

## Conflicts & Context
- Custom vs native components: [WSG] native HTML first (accessibility, maintenance); [KUL][RUI] encourage visual flair — style native elements rather than rebuilding them.
- Radius scale: 8/16/32 [PUI] is a suggestion; the rule is "few sizes, consistent personality" [RUI].

## Anti-patterns
- **Copy-pasted component variants drifting apart** (UX debt) [TID].
- **Static style-guide pictures out of sync with code** [WSG].
- **Modals for routine errors or marketing interruptions** [KUL][PUI].
- **Double-row tabs**; colour-only selected tab [TID].
- **Fake urgency/scarcity** in pricing [KUL].
- **Critical info only in tooltips** [PUI][WSG].

## Worked Example
*Pricing section [PUI + KUL]:* Three tiers $10/$20/$30 per month looked identical. Fix: middle tier slightly larger, higher-contrast 2px border, deeper shadow, filled primary "Choose Pro" while others get secondary buttons, "Most popular" badge; an "Pay annually and save 10%" toggle switch updates prices immediately; features aligned row-by-row with tooltips for jargon; sticky plan names/prices header in the long comparison table; testimonial + "Join 50,000+ designers" social proof above; genuine money-back guarantee note under CTAs.

## Key Takeaways
1. Tokens → components → guidelines → templates.
2. Specify every state and edge case per component.
3. Modals, dropdowns, tabs, tooltips have strict usage rules — follow them.
4. Hero: one message, one primary CTA, social proof.
5. Keep library as live code; restyle conventions, never re-behave.

## Connects To
- **ch05** colour tokens · **ch04** type tokens · **ch03** spacing tokens · **ch08** buttons · **ch15** dialog/menu accessibility
