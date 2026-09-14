# Ch 01: Foundations — Principles, Cognition, Process

Sources: [PUI] Practical UI ch1–2 · [RUI] Refactoring UI "Starting from Scratch" · [TID] Designing Interfaces ch1 · [WSG] Web Style Guide ch7–8 · [KUL] Kuleszo "Bad vs good UI"

## Core Idea
Every UI detail needs a logical, defensible reason tied to how people perceive, think, and act. Audit against usability *risk*, not taste; implement from features and systems, not from a blank shell.

## Frameworks Introduced
- **Minimise usability risk** [PUI]: judge each choice by the risk someone struggles (thin grey text, unlabeled icons, coloured non-link headings are classic risks). Cater to low vision, low literacy, reduced dexterity, cognitive load; target WCAG 2.1 AA minimum.
  - How: list every "slightly vague" element → simplify before paying for testing.
- **Interaction cost** [PUI]: sum of looking, scrolling, reading, clicking, waiting, typing, thinking, remembering. Reduce with: (1) related actions close + large (Fitts's Law, ≥48×48pt), (2) remove distractions (animated banners, pop-ups), (3) fewer choices (Hick's Law; highlight recommended).
- **Cognitive load** [PUI]: remove unnecessary styles/info/decisions; chunk; use conventional patterns; be consistent; clear hierarchy; split big tasks into steps.
- **Jakob's Law / common patterns** [PUI][WSG]: people spend most time on other sites → conventional patterns cost less to learn; innovate only at your product's unique value. Modifying a known pattern's *behaviour* is worse than inventing a new one [WSG].
- **80/20 (Pareto)** [PUI][WSG]: ~80% of use hits ~20% of features; optimise common tasks, evaluate the rest for their cost to simplicity.
- **Cognition & behaviour patterns** [TID] — design to support:
  - *Safe Exploration* (undo, predictable Back, no surprise audio/pop-ups) · *Instant Gratification* (first success in seconds; no registration wall before value) · *Satisficing* (users click the first plausible option → labels whose first-guess meaning is right, escape hatches) · *Changes in Midstream* (reentrance: keep half-finished input) · *Deferred Choices* (ask the minimum now, the rest later) · *Incremental Construction* (fast feedback loops) · *Habituation* (same gesture = same result everywhere; routine confirmations become reflex) · *Microbreaks* (fast launch, restore state) · *Spatial Memory* (don't move controls) · *Prospective Memory* (let users leave reminders; don't auto-clean) · *Streamlined Repetition* · *Keyboard Only* · *Social Proof*.
- **Three processing levels** [WSG, after Norman]: visceral (gut aesthetic judgment in ~50 ms, drives trust & perceived usability), behavioral (usability in use), reflective (meaning/value). Beauty is not optional decoration.
- **Start with a feature, not a layout** [RUI]: design one real piece of functionality (e.g. "search for a flight") before nav/shell. Detail comes later (grayscale, sharpie sketches). Work in cycles; build real thing early. **Be a pessimist**: never design functionality you can't ship; design the smallest useful version.
- **Choose a personality** [RUI]: personality comes from font (serif = classic, rounded = playful, neutral sans = plain), colour, border radius (never mix square + round), and language tone.
- **Limit your choices / systematize everything** [RUI][PUI]: predefine font sizes, weights, line heights, colours, spacing, widths, shadows, radii, border widths, opacity. Decide by elimination on a scale (try middle, compare neighbours).

## Key Concepts
- **Interaction cost**: physical + mental effort to finish a task.
- **Cognitive load**: brain power needed to use the UI.
- **Fitts's Law**: nearer + larger target → faster acquisition.
- **Hick's Law**: decision time grows with number/complexity of choices.
- **Serial Position Effect**: first and last items remembered best [PUI]; list tops/bottoms noticed most [TID].
- **Interaction states**: default, hover, press/active, focus, disabled (+ loading, selected, error) [PUI][KUL].
- **Design system**: predefined tokens + reusable modules + usage guidelines [PUI].
- **Rationale**: the stated, logical why behind a design decision [PUI].

## Mental Models
- Think of every screen as a conversation the *user* started; your UI is the service rep who anticipates needs, uses their words, and confirms completion [TID][WSG].
- Use "risk" instead of "like/dislike" when critiquing: "this could be mistaken for a link" beats "I don't like the blue heading" [PUI].
- Minimal ≠ simple: hiding labels, actions and state makes UIs vague [PUI]. Remove until it *breaks clarity*, then stop.
- Treat aesthetics as a trust signal measured in milliseconds, not garnish [WSG].

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| F1 | Every element has a purpose | Can state a reason for each colour, line, icon, container | PUI, WSG |
| F2 | Primary task path is short | Common task possible without detours; related actions adjacent to their object | PUI, TID |
| F3 | Choices are bounded | No screen forces choice among a long undifferentiated list; recommended/popular options highlighted | PUI |
| F4 | Conventional patterns used | Links look like links, checkboxes square, inputs = labelled rectangles; platform guidelines followed unless inaccessible | PUI, WSG |
| F5 | Consistency | Same-looking things behave the same; same function looks the same across screens; icons one style | PUI, TID, KUL |
| F6 | All interaction states exist | default/hover/active/focus/disabled(+loading/error) designed for every interactive element | PUI, KUL |
| F7 | Safe exploration | Undo or recovery for destructive/expensive actions; Back behaves predictably; escape hatch from dead ends | TID, WSG |
| F8 | No blocking before value | No forced sign-up/instructions/splash before first useful action | TID |
| F9 | Values come from a system | Spacing, type, colour, radius, shadow values map to tokens (no one-off 13px, #3a3b3f…) | RUI, PUI, KUL |
| F10 | Distractions absent | No autoplay media, unrequested pop-ups, animated banners competing with task | PUI, WSG |
| F11 | Stable layout | Controls don't move between screens or reorder dynamically | TID, WSG |
| F12 | Designed for diversity | Works for low vision, keyboard-only, one-handed thumb, temporary/situational disability | PUI, WSG |

## Fix Recipes
1. **Unjustified detail** → remove it; if it must stay, rewrite as tokenised, purposeful style.
2. **High interaction cost** → move action next to its object; enlarge target to ≥48pt; replace dropdown with stepper/radios; remove steps (e.g. quantity dropdown + distant button → inline stepper with adjacent "Add to cart" [PUI]).
3. **Too many choices** → remove, group/categorise, split into steps, or recommend defaults [PUI].
4. **Inconsistency** → build/extend the token set and component library; replace one-offs.
5. **No undo** → prefer undo/trash over confirmation dialogs for frequent actions (confirmations habituate) [TID][WSG]; reserve friction for severe irreversibles (see ch08).
6. **Blank-canvas paralysis when implementing** → pick one feature, sketch in grayscale, build it, iterate; add colour/depth last [RUI][KUL].

## Conflicts & Context
- "Innovate vs convention": all five books say conventional by default; innovate only where it creates product value, and never change a known pattern's behaviour.
- Aesthetics: [PUI] warns trendy styles (glass/neumorphism) fail contrast & hierarchy; [WSG] shows aesthetics raise trust. Resolution: invest in craft *within* accessible conventions.

## Anti-patterns
- **Designing the shell first** (nav, layout) before features [RUI].
- **Implying unbuilt functionality** in mocks [RUI].
- **Trend styling** (glassmorphism, neumorphism) that kills contrast [PUI].
- **Minimalism that hides meaning** (unlabelled icons, invisible selected state, hidden share/save) [PUI].
- **Too creative**: hamburger + search + tab bar + redundant heading on one screen [KUL].
- **"Creative" navigation metaphors** — users hit Back [WSG].
- **Confirmation dialog for every action** — habituated clicks, zero protection [TID].

## Worked Example
*Practical UI fitness-app tutorial, fundamentals pass (reconstructed):* A workout detail screen had (a) a small "Inhale Good Vibes" CTA mid-screen, (b) mixed filled/outlined icons, (c) actions hidden in an overflow menu. Fixes with rationale: CTA enlarged to ≥48pt tall, moved to bottom of the screen and stretched full-width (thumb reach for either hand → lower interaction cost); icons unified to one outlined style with equal stroke (filled icons read as "selected"); share/bookmark shown directly because space existed ("people don't use what they can't see"); later the label became "Start workout" (verb + noun). Each change is traceable to a named principle — that traceability is the audit output format to copy.

## Key Takeaways
1. Critique with named risks and principles, never taste.
2. Cut interaction cost: proximity, target size, fewer choices.
3. Conventional first; systematize every value into tokens.
4. Design all states, not just the default.
5. Start implementation from one real feature, in grayscale.
6. Beauty earns trust in 50 ms — craft matters, but never at the cost of access.

## Connects To
- **ch02** hierarchy · **ch12** design systems/tokens · **ch15** accessibility · **ch08** destructive-action friction
