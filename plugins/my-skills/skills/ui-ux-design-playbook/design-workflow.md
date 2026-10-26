# Design workflow: shape, design, build and refine UI

Use this file when the job is to make something: plan a feature's UX, design a new screen or page, redesign or restyle an existing one, build components and tokens, or refine a surface (bolder, quieter, simpler, more robust, more polished). Review rules (evidence tags, severity caps, read-only) belong to [audit-workflow.md](audit-workflow.md) and do not apply here; the always-on rules in SKILL.md do. The chapters stay the source of thresholds and recipes; this file says in what order to decide things and how to check the result before showing it.

## Contents
- 0. Pick the mode and the surface
- 1. Shape: a brief before pixels
- 2. Read the existing world
- 3. Direction: domain, signature, defaults
- 4. Content first
- 5. System: tokens, density, depth
- 6. Structure and greyscale
- 7. Components, states and interaction contracts
- 8. Motion layer
- 9. Harden
- 10. Polish
- 11. Verify before showing
- 12. Record the decisions
- Refine moves (bolder, quieter, distill, colorize, delight)
- Defaults to name before choosing
- Common mistakes

## 0. Pick the mode and the surface
| Work | Do | Skip |
|---|---|---|
| **Shape** (plan a feature, "how should this work?") | §1, then stop with a confirmed brief | code |
| **New surface or redesign** | §1–12 | — |
| **Restyle** (keep layout, change look) | §2, §3, §5, then §10–11 | rebuilding structure |
| **Refinement** inside an established look ("polish", "fix spacing", "make it bolder") | §2, the matching *Refine move*, §10–11 | §3 direction work |
| **Component or one section** | §2, §5 (reuse), §7–11 | §3 unless no direction exists |

**Refinement preserves; redesign replaces** [IMP]. Refinement keeps the incumbent identity, behaviour, copy and everything outside scope. Redesign keeps product truth, content, function and constraints, but treats the old look as evidence, not as a target to polish. Never split the difference.

**Visitor mode** decides how much expression the surface earns [IMP], and it is chosen per surface, not per product (a tool's landing page is Persuade; its settings page is Operate):

| Mode | The visitor… | Examples | Ambition shows as |
|---|---|---|---|
| **Persuade** | decides and acts | landing, pricing, campaign | a point of view, real imagery, one memorable move, a motion layer |
| **Operate** | completes a task | app screens, dashboards, editors, settings, admin | precision, density chosen on purpose, known patterns, near-zero motion on frequent actions |
| **Read** | understands something | docs, articles, help, changelog | structure for comprehension, measure, rhythm |
| **Experience** | is inside the work | portfolio, gallery, showcase | the artefact leads; the interface recedes |

Map it to ch01's *Product-type frame* for the watch metric. A page is read and scrolled; an app screen is worked in [TS]. Apply page habits (big type, fields of colour, a signature moment) to Persuade/Experience and app habits (quiet borders, repeated panels, small labels) to Operate.

## 1. Shape: a brief before pixels
Skip this when the request already pins the job, audience, scope and content; restate it in three to five bullets instead. Otherwise interview [IMP]:
- Ask two or three related questions per round, then wait. One round is normal; a second only when answers expose a material gap. Assert the likely reading and invite correction instead of dumping a questionnaire.
- **Round 1, purpose and people**: what is this for; who arrives, in what situation and state of mind; the one thing they must understand or do; what is uniquely true here that a neighbouring product could not claim.
- **Round 2, material and boundaries** (only if open): real content and data with min/typical/max ranges; which states matter (first run, empty, loading, error, success, permissions, overflow, expert use); fidelity and breadth; what must not change; binding platform, accessibility, localisation and performance constraints.
- Never ask for CSS values or offer canned aesthetic lanes.

Write the smallest useful brief: **job and audience · outcome and proof · direction (once §3 decides it) · scope and anti-goals · states and content ranges · interaction and layout intent · constraints and open decisions** a builder must not invent [IMP]. When the decision is uncertain, add one hypothesis line: "We believe [change] will produce [outcome] because [reason]" [KK]. In Shape mode, present the brief, get a yes or one correction, and stop.

## 2. Read the existing world
- Recon as in [audit-workflow.md](audit-workflow.md) step 1: framework, styling system, component library, tokens, supported viewports, preview command, `DESIGN.md` / design-system docs / Storybook. A missing `DESIGN.md` does not make a project greenfield; the shipped UI is the visual authority [IMP].
- **Use what exists** [ID]. Controls: native HTML → a trusted headless primitive (Radix, React Aria, Base UI, Ark, Headless UI, or the stack's equivalent) → hand-roll only as a last resort, and then own the full keyboard, focus, ARIA, click-outside and scroll-lock contract. Styling: the project's system and variants → extract a component on the second real reuse → semantic tokens → one-off utilities only for genuine one-offs. Never mix two primitive systems in one interaction surface [IB].
- **System evolution** [KK]: when the system doesn't fit, choose the smallest change: reuse as-is → compose existing parts → add a property or variant (only for a coherent, recurring difference) → change the shared contract → add a distinct pattern. Visual similarity alone doesn't mean two things share a component (a selectable card with bulk actions is not a navigation card).

## 3. Direction: domain, signature, defaults
For a new surface, a redesign or a restyle. Inside an established look, skip to §4.
1. **Intent in words that mean something** [ID]: who exactly (not "users"), the verb they must accomplish, and what it should feel like ("warm like a notebook", "dense like a trading floor"; never "clean and modern"). Intent must be systemic: every token follows it.
2. **Explore the domain before any visual thinking** [ID][TS]:
   - **Domain**: at least five concepts, metaphors or terms from this product's world.
   - **Inventory**: eight to twelve things that belong to this client and no competitor: its name and what it means, its place, its numbers, its constraint, its materials, its rituals, the printed things of its world.
   - **Colour world**: at least five colours that exist naturally in that world.
   - **Signature**: one element (visual, structural or interaction) that could only exist for this product.
   - **Defaults**: the three obvious choices for this kind of interface, visual and structural, named so they can be rejected on purpose (see *Defaults to name before choosing*).
3. **The idea sentence** (Persuade/Experience) [TS]: "On this page, **[something from the inventory]** becomes **[the device the composition uses]**." Run the **competitor test**: put the nearest real competitor in the sentence; if it still works, the idea belongs to the category, not the client. Give the page one **live thing** made from the idea (pick an option and see the result, a real calculator, today's status) that uses real content, works with a thumb, and has a plain fallback.
4. **A compact token plan** [AFD]: four to six named colours with roles, the typefaces and their roles, a layout concept as one sentence plus an ASCII wireframe (with alignment), and two or three principles that make this surface unique.
5. **Review the plan against the brief before code** [AFD]: any part you would have produced for any similar prompt is a default, not a choice; revise it and say what changed. The brief's own words always win, including when it asks for one of the defaults.
6. **Propose and confirm** when the direction is ambiguous or costly to change: Domain · Colour world · Signature · Rejecting (default → alternative, ×3) · Direction, then ask one question [ID]. Show, don't describe, when you can: write a small specimen (swatches, type scale in the real face, the signature component) to a local file or a scratch route. Publishing it anywhere needs the user's yes.
7. **Spend boldness in one place** [AFD]: one element is the memorable thing; everything around it is quiet and disciplined. Before leaving, remove one accessory.

## 4. Content first
- **Design from real material** [KK][RUI]: use supplied content; when examples are thin, make clearly labelled synthetic fixtures that reproduce the variation that matters (uneven titles, missing images or fields, mixed status, similar names, few/many/no records). Don't force equal copy lengths to rescue a rigid card grid; don't fill absence with fake filler. Distinguish missing, loading and failure.
- **Write the argument** (Persuade) [TS]: list the page as claims with proof, one line per section; the claims decide which sections exist and their order. Delete a section with no claim. This is how a page escapes hero → logos → three features → testimonial → pricing → CTA.
- **Copy deck before markup** [TS][AFD]: every headline fits two lines at every width (≈32 characters is safe at a confident size); one supporting sentence directly under it says plainly what the thing is; one primary action named for what it does; the first screen answers the visitor's first question in large type; every section delivers its full content. Sample details are fine where the brief leaves gaps (list them for confirmation); **proof is never invented**: no customers, quotes, reviews, logos, press or statistics.
- **Persuade-page checklist** [MGT][ELY] (a checklist of questions to answer, not a section order; the argument above decides the order): one offer, one audience, one primary action; the hero mirrors the promise of the traffic source (ad, search, email); benefits before features, and specific ("4 hours to 15 minutes", not "streamline"); proof placed next to the claim it supports; at least one risk reversal (trial, free plan, cancel anytime, guarantee) where the offer has one; objections answered in their own section (FAQ earlier for high-friction offers); a final CTA identical to the first; decide indexing (ad-only and time-bound pages `noindex`).
- **Pricing pages** (ch12, ch20) [MGT]: at most three plans with one subtly recommended; a monthly/annual toggle with the real saving; 3–6 limits that actually differ per plan; one CTA verb per motion used consistently; a comparison grouped by area, not a spreadsheet; stacked cards on mobile, never a sideways-scrolling table; FAQ for cancellation, limits, discounts and procurement; no surprise fees or fake anchoring.
- **Content realism** [ELY]: no lorem ipsum, "John Doe" or "Acme Corp"; no suspiciously round numbers in samples; no stock hype words ("elevate", "seamless", "unleash", "next-gen", "game-changer"); sentence-case headings; no exclamation marks in success messages.
- Interface copy follows ch13: names from the user's world, one name per action through the whole flow ("Publish" → toast "Published"), errors that say what happened and how to fix it, empty states that invite the next action.

## 5. System: tokens, density, depth
Tokens before components (ch12 S-checks, ch03, ch04, ch05, ch06, ch18). Decide, don't inherit:
- **Type scale is a ratio** [ID]: ~1.2 dense/calm, ~1.25 most product UI, ~1.333 expressive; from a 14–16 px body, round to whole pixels. Hierarchy uses **size, weight and colour together**: one 14 px size can hold three tiers through weight and opacity. Persuade pages work with two or three visible sizes (one very large, one small); five on a page is the ceiling [TS]. Four text levels: primary, secondary, tertiary, muted.
- **Density in px, chosen once** [ID]: a tool panel at 12–16 px padding reads workbench-tight, 24 px reads like a brochure; hold the chosen number everywhere. Proportions state relationships (a 280 px sidebar serves content; 360 px makes it a peer).
- **Colour distribution** [ID][IMP]: roughly 60 / 30 / 10 (dominant neutral, secondary tone, accent); one accent with intent; gray builds structure, colour communicates. Roles, not swatches: canvas and elevated surfaces, text levels, action/focus/selection, borders, status, data. Dark mode is composed, not inverted.
- **Depth: choose one strategy and commit** [ID]: borders only (dense tools) · subtle shadows · layered shadows · surface tone steps. Elevation steps are a few points of lightness apart; sidebars share the canvas colour; inputs sit slightly darker (inset); popovers are one level above their parent; low-alpha borders over solid hex. Radius is a scale (small for controls, medium for cards, large for modals).
- **Three tiers when the system is shared** [NLB]: primitive (raw values) → semantic (purpose) → component (`--button-bg: var(--color-accent-solid)`) so one component can be tuned without touching the semantic layer.
- **Extracting a system from an app that already ships** [UIR]: the app's own look is the source (invent no value it doesn't have unless a design source was chosen and a sample confirmed); capture every surface in every state at the narrowest and widest width before any edit; cluster raw values by role and map them purpose first, then value (a gray used as text maps to text tokens even if a border token has the same hex); build the most-used component family end to end and show it before fanning out; move one pilot flow and compare before/after captures, where an unexplained difference is a defect.
- **Control tokens** separate from surface tokens (input background, border, focus) so controls tune independently.
- Token names should evoke the product's world, not a template (`--ink`, `--parchment` vs `--gray-700`, `--surface-2`) [ID]; ch05 C13's semantic-tier rule still applies.
- A greenfield mobile web app ships ch14's platform baseline (M16–M18: viewport meta, `viewport-fit=cover` only together with `env(safe-area-inset-*)` padding, per-scheme `theme-color`, tap-highlight off with a real `:active`, 16 px inputs, `touch-action: manipulation`, hover behind `(hover: hover) and (pointer: fine)`) before the first component [EK].

## 6. Structure and greyscale
1. IA and labels (ch10) → semantic HTML, landmarks, source order (ch15) → grid and widths (ch03). Native elements by job [KK]: performs an action → `button`; goes somewhere → `a[href]`; reveals related content → `details` or a disclosure button; temporary overlay task → `dialog` / popover; collects input → native controls inside `form`.
2. **Greyscale layout first** [RUI]: hierarchy through size, weight and spacing (ch02), then colour with purpose (ch05).
3. **One focal point per view** [ID]: name the element the user came for and make it win (size, contrast, position or the space around it); demote the rest on purpose.
4. **Spatial thesis** [IMP]: name the primary reading or task path, what groups and what separates, what leads and what supports, the density, and how structure changes across containers, viewports, inputs and content extremes. Rhythm comes from deliberate contrast between tight and generous intervals, not one gap repeated. Repeated cards or columns must be genuinely equivalent, not a framework default.
5. **Fullness and frame** (Persuade) [TS]: equal outer margins at every width; no section huddled on one side with the other half empty; no blank stretch taller than about half a screen (one deliberate rest per page at most); a clear `h1` on the first screen and a heading on every section; neighbouring sections don't share a layout.

## 7. Components, states and interaction contracts
- **Every state** (ch08, ch09, ch12, ch16): default, hover, active, focus-visible, disabled, loading, error, empty, success. Missing states are the fastest tell of an unfinished interface. A busy button keeps its idle label and size, shows a spinner inside the same box and sets `aria-busy`, rather than swapping the text to "Saving…" and changing width [UIR].
- **Affordances** [KK]: visual cues match real behaviour; essential actions never depend on hover; disabled looks *and behaves* disabled; every interactive element has a perceptible state change; hit areas fit the input method (ch15 A14, A28).
- **Interaction contract** for any consequential interaction the mockup leaves open [KK]:

  | Element | Resolve |
  |---|---|
  | Entry and trigger | preconditions, inputs, what starts the operation |
  | State and feedback | what changes immediately, what is pending, what confirms completion |
  | Ownership and persistence | where the true value lives, when it commits, what survives leaving and returning |
  | Interruption | what Cancel, Esc, navigation, another input or a second submit mean |
  | Failure and recovery | what stays intact, how failure is explained, how the person continues |
  | Focus and access | keyboard path, focus movement, accessible names, reduced-motion equivalent |

  Separate cancelling an edit, cancelling a request and undoing a committed change; never promise a cancel that can't reverse a remote effect. Optimistic UI needs a failure and reconciliation story. Check overlapping actions that real use can reach: double submit, editing during a pending save, an older response arriving after a newer one.
- **Design for repetition** [KK] when the flow is used often: find what accumulates (re-entering context, repeated navigation, item-by-item operations, waiting for non-essential effects, repeated confirmations, interrupted work) and add retained settings, direct paths, batch actions or saved drafts, while keeping the ordinary path understandable and the current context visible. Faster paths (shortcuts, presets) are additive and discoverable, never the only way.
- **Interaction review** (ch17): undo and cancel paths, no hidden modes, one conceptual model with consistent concept, action and appearance across the product.
- AI surfaces follow ch19; ethics checks follow ch20.

## 8. Motion layer
Write a short **motion thesis** first [IMP]: the one focal moment that deserves authorship (if any, and from this product, not a generic fade-and-rise), the state or layout changes that need continuity, the controls that need feedback, and the budget for expensive effects. Then decide each animation in this order [EK]:
1. **Should it animate at all?** By frequency: 100+ times a day (keyboard shortcuts, command palette) → never; tens of times a day (hover, list navigation) → remove or minimise; occasional (modals, drawers, toasts) → standard; rare or first-time (onboarding, a milestone) → may add delight. Keyboard-initiated actions don't animate.
2. **What is it for?** Feedback, spatial consistency (enters and exits along the same path, anchored to its trigger), state indication, preventing a jarring jump, explanation. "Looks cool" on a frequent path is not a purpose.
3. **Who is driving?** User-driven (drag, flick, gesture) → a spring that keeps velocity and can be grabbed mid-flight; system-driven (state change, feedback) → an easing curve; time representation (progress) → linear; high-frequency → none [RS].
4. **Easing and duration**: entering and interactive → a strong ease-out; moving on screen → ease-in-out; colour/hover → ease. UI motion mostly 150–250 ms (press 100–160, tooltips 125–200, dropdowns 150–250, modals/drawers 200–500); if it feels slow, shorten the duration before sharpening the curve. Exits run shorter than enters; never delay a close or a hover-out.
5. **Craft details**: press feedback on `:active` / pointer-down (ch18); nothing appears from `scale(0)` (start ≥0.9 with opacity); popovers scale from their trigger (`transform-origin` at the trigger; modals stay centred); after the first tooltip opens, neighbouring tooltips open instantly; stagger list items 30–80 ms and semantic chunks of one entrance ~100 ms, never blocking input.
6. **Cheapest tool that works** [EK]: a CSS transition (hover, press, class or attribute toggles) → `@starting-style` (entry on mount) → a CSS animation (predetermined motion that must stay smooth while the page is busy) → WAAPI (programmatic control) → the project's motion library (springs, layout and exit animations, gestures). Never add a dependency for a fade; keep content visible in its default state so a failed script hides nothing [IMP].
7. **Budget by visitor mode**: Operate surfaces add motion only where it explains a change; Persuade pages may carry a motion layer (one signature move, staged section entrances, feedback on every control, one moving picture) [TS]. Either way: transform and opacity, a reduced-motion version that keeps the content and drops the travel (ch18 *Conflicts*), and the page must look finished with motion off.

## 9. Harden
Before polish, break it on purpose (ch03 L9, L17–L18, ch04 T18, ch16, ch21) [IMP][EK]:
- **Content**: empty, one character, 100+ character names, emoji, RTL and mixed direction, CJK, huge numbers, 1 item (plural forms), 1,000+ items. Truncation decision [EK]: **wrap** what identifies something (names, titles in a detail view); **truncate at the end** secondary metadata, always with a way to the full text; **truncate in the middle** values that differ at the end (file names, paths, emails on one domain); **clamp** multi-line previews in cards; **never truncate** numbers, amounts, dates or anything compared.
- **Errors**: offline, slow, timeout; 400 → field errors, 401 → sign in, 403 → permission state, 404 → not-found state, 429 → rate-limit message, 500 → generic error with support path; user input preserved on every error; one failing component never blanks the screen.
- **Concurrency and gestures**: double submit, optimistic update with rollback; a second pointer mid-drag, `pointercancel`, lost capture or window blur ends the drag cleanly and the next drag works.
- **Locale**: `Intl` for dates, numbers, currency and plurals; German-length strings; logical properties; locale digits and calendars where the market needs them.
- **Permissions and read-only** states explain why.
- Put the worst-case data behind a dev-only toggle or fixture route so it can be re-checked, and remove it when asked.

## 10. Polish
Classify each inconsistency before fixing it [IMP]: **missing token** (the system needs a reusable value) · **one-off implementation** (a shared component should replace it) · **conceptual mismatch** (flow or IA differs from comparable areas) · **local defect**. Fix the cause at the narrowest correct level, in this order: broken or blocked tasks and misleading state → missing states → flow, hierarchy, responsive and system drift → visual and motion inconsistency → code and asset cleanup. Polish is refinement, never a hidden redesign; if the concept is wrong, say so. Then apply the detail checks in ch04 (T15–T21), ch06 (D11–D13), ch07 (I12–I14), ch14 (M14–M18) and ch18 (AN8–AN11).

## 11. Verify before showing
Look at the rendered result at the widths it ships (phone, intermediate, wide), batch the fixes from one look, then look again; three rounds at most [IMP][TS]. Gates, iterated against, not severity-rated:

| Gate | Pass when |
|---|---|
| **Squint** | blurred, the primary, secondary and major groups still read in order; nothing jumps out harshly [RUI][ID] |
| **Swap** | swapping your typeface for the usual one or your layout for a stock template would change something; where it wouldn't, you defaulted [ID] |
| **Signature** | you can point to five specific places the signature appears [ID] |
| **Token** | read aloud, the token names belong to this product's world [ID] |
| **Skeleton** | with the copy removed, the structure still says what each section is and why it matters [IMP] |
| **Competitor** | the idea sentence fails when a competitor's name is put in it [TS] |
| **Five-second** | a stranger reading the first screen for five seconds can say what this is and what to do [TS] |
| **Quality floor** | responsive to 320 px, visible keyboard focus, reduced motion honoured, contrast passes, states exist [AFD] |
| **Ship list** (public pages) | `<title>`, meta description and social image; favicon; a branded 404; privacy and terms links; skip link; current page marked in the nav; no link pointing at `#`; a way back from every page [ELY] |

Then run the audit checks for every chapter touched, `scripts/metrics.js` and `scripts/style-inventory.js` on the rendered result, and `bash scripts/code-smells.sh` on the changed source (all described in [evidence.md](evidence.md)). Include keyboard, contrast, zoom, long-content, RTL (if shipped) and reduced-motion tests. Touch behaviour (sticky hover, tap delay, safe areas, the keyboard, rubber-banding) needs a real phone; say which fixes were verified only from code [EK]. Claim only checks you ran.

## 12. Record the decisions
Offer to save the decisions for later sessions in the project's own place (`DESIGN.md`, a design-system doc, or a short `system.md`): direction and feel, depth strategy, spacing base and density, type ratio and roles, colour roles, key component measurements (e.g. "Button primary: 36 px high, 12/16 padding, 6 px radius, 14/500"), and the defaults deliberately rejected [ID]. Keep it short; update it when implementation teaches something different [KK].

## Refine moves
Each keeps the established world and touches only the named target [IMP]:
- **Bolder**: find what the neighbouring sections already do at full strength (display type, the motif, density shifts) and bring the target up to it in the system's own vocabulary; one decisive move, made completely, with everything around it quieter. No new colours, fonts, radii or primitives without asking. Reaching for more effects is the opposite of bold.
- **Quieter**: reduce saturation and variety, weights (900 → 600, 700 → 500), decoration, layering, motion distance; keep a few anchors and the point of view. Quiet without intent collapses into generic gray-on-white.
- **Distill** [IMP][KK]: list what the screen must accomplish; mark everything that doesn't serve that list; remove, demote or disclose it progressively; stop when further removal would hide a needed decision or affordance. Keep one primary action, never cards inside cards, no copy that repeats what the UI already shows. Simplicity is removing obstacles, not features.
- **Colorize**: name the temperature, the dominant relationship and the dose first; let the strongest colour own a role or region rather than scatter as accents; keep the primary action's colour for the action; data gets lightness, shape or labels as well as hue.
- **Delight** [KK][IMP]: one sentence on what the user should feel and why it belongs to this product, then the smallest thing that delivers it at a moment that earns it (first use, completion, recovery, mastery). Invest first in reliability, speed, empty states and clarity; celebration scales with effort and consequence; still pleasant on the tenth use; never delays the task.
- **Polish** and **Harden**: §10 and §9.

## Defaults to name before choosing
Generated UI clusters around these [AFD][TS][ID]. Each is legitimate when the brief asks for it or the product's world supports it; they are listed so a free axis isn't spent on them by reflex. They are generation guidance, **never audit findings or code smells**.
- Palettes: warm cream ground with a serif display and a terracotta/clay accent; near-black with one acid-green or vermilion accent; violet/indigo gradients; tinted near-black standing in for black.
- Layout kits: the SaaS card kit (identical rounded cards, one radius everywhere, the same soft gray shadow, gradient washes); icon-topped feature cards in a row of three; broadsheet hairline grids; the stock section sequence; a centred hero over a gradient blob.
- Chrome: tracked all-caps eyebrow labels above every heading; pill badges above the headline; `01 / 02 / 03` numbering on content that isn't a sequence; meta strings joined with middle dots; `→` appended to every link; monospace for small data labels; one accent word in a headline set in italic or colour; glass panels and floating pill navigation.
- Motion: a fade-and-slide-up on every section and a hover lift on every card, instead of one orchestrated moment and motion that answers actions.
- Product UI: the same sidebar width, card grid and icon-number-label metric boxes on every dashboard; a 9–16 px "soft" radius by reflex.

## Common mistakes
| Mistake | Fix |
|---|---|
| Starting from the app shell or a template | Start from the feature and its real content [RUI] |
| A direction described in adjectives ("clean, modern") | Domain, inventory, signature, rejected defaults, then the idea sentence |
| Ornament removed, nothing added in its place, page reads thin | Fill with scale, the full content, real pictures of the subject's world, or a field of colour [TS] |
| Invented testimonials, logos or statistics to fill a section | Mark the content gap and ask; never fabricate proof |
| Hand-rolled dropdown next to the project's accessible primitive | Use what exists (§2) |
| Polish pass that quietly changes the concept | Say the concept is wrong and propose a redesign |
| Animating everything that moves | The frequency gate in §8 |
| Applying review severity to your own draft | Iterate against the §11 gates; audit the result only when asked |
