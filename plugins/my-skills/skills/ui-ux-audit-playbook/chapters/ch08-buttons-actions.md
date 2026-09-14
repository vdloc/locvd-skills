# Ch 08: Buttons, Actions & Commands

Sources: [PUI] ch7 · [RUI] "Semantics are secondary" · [KUL] buttons · [TID] ch8 · [WSG] ch7

## Core Idea
Actions need a visible hierarchy (one primary, some secondary, few tertiary) that doesn't depend on colour, labels that say exactly what happens (verb + noun), generous targets, predictable placement, all states, and friction proportional to how destructive an action is — with undo preferred over nagging.

## Frameworks Introduced
- **Three button weights** [PUI][RUI][KUL]:
  - *Primary*: solid brand fill, white/contrasting text — the single most important action.
  - *Secondary*: outline (brand border + brand text) or low-contrast bg — clear but not prominent; avoid light-grey look (reads disabled) and solid fills of another colour (competes).
  - *Tertiary*: link style, underlined — discoverable, unobtrusive.
- **Button design guidelines** [PUI]: hierarchy not colour-dependent; button shape ≥3:1 against bg; label ≥4.5:1; identical-style buttons ≥3:1 from each other; target ≥48×48pt (WCAG AAA 44×44; Apple 44pt, Material 48dp) [PUI][TID][KUL]; ≥8pt between (16pt safe); desktop buttons may be 32–40px tall [KUL] but keep hit area ≥40–44px incl. "invisible padding" on links & list items [KUL].
- **Anatomy** [KUL]: label 14–20px; horizontal padding ≈ 2× vertical; height 40–48px (32–60 range); round sizes so text centres; radius per personality (round = friendly, sharp = formal) — consistent across button types [PUI][RUI].
- **Nine common button mistakes** [PUI]: secondary fill <3:1 (no border); light-grey secondary (looks disabled, text <4.5:1, border <3:1); primary & secondary differ only by colour; identical-style buttons <3:1 from each other; tertiary identified by colour only; inconsistent shapes between weights; primary & secondary equal visual weight.
- **Use of weights** [PUI]: one primary per screen (none if no single most important action); equal-importance alternatives → both secondary (no bias); tertiary for low-importance, repeated, or destructive actions.
- **Semantics are secondary** [RUI]: destructive isn't automatically big-red — keep it secondary/tertiary on the page; make it primary + red *inside the confirmation step*.
- **Friction for destructive actions** [PUI]: *Initial* (less prominent, farther, progressive disclosure — don't colour red) → *Light* (confirm "Delete message?" [Delete message][Cancel]) → *Moderate* (red confirmation + consequence "You won't be able to recover it") → *Heavy* (red + required checkbox "I confirm…" before the button works) → **allow undo** ("Message deleted · Restore"). [TID][WSG]: frequent confirmations become habituated → prefer undo/trash, confirm only truly irreversible actions (e.g. empty trash).
- **Avoid disabled buttons** [PUI]: they strand users (no reason shown), are low contrast, not focusable. Alternatives: enable & validate on submit; remove unavailable actions and explain; lock icon + explanation (premium features); if you must disable — adjacent message/tooltip explaining how to enable, keep it keyboard-focusable.
- **Button placement** —
  - [PUI] left-align, order most → least important (F-pattern, magnifier users, less travel); mobile: stack full-width most important on top; multi-step forms: primary left, tertiary "Back" at top-left (not beside Next); single-field forms (search/subscribe): button attached right of input; dialogs: left or right but consistent.
  - [TID] *Prominent Done Button / Assumed Next Step*: looks like a real button, at the end of the visual flow near the last field, specific text label.
  - [KUL] mobile: primary within thumb reach; destructive/supportive out of easy reach.
- **Labels** [PUI][KUL][WSG][TID]: verb + noun ("Save post", "Download PDF", "Start free trial"); never "OK/Yes/No/Submit/Click here"; meaningful out of context (screen reader button lists); Smart Menu Items name the object ("Undo typing", "Delete 3 files") [TID]; avoid double negatives in confirmations ("Are you sure you don't want to keep…? Yes/No") [KUL].
- **Icons in buttons** [KUL][PUI]: icon + text pairs balanced in weight/size (or icon lower contrast); lead icon for recognition, trail for direction.
- **States** [PUI][KUL]: default · hover (opacity 80% / fill shift / lift) · pressed · focus (visible outline) · disabled · loading ("Saving…" + spinner, prevents double submit) · success. State changes noticeable but not jarring.
- **Buttons vs links** [WSG]: links navigate, buttons act; a link styled as a button still behaves like a link (Space scrolls) → use `<button>` for actions, `<a href>` for navigation.
- **Action presentation patterns** [TID]: *Button Groups* (2–5 related actions, same treatment, don't mix scopes, beside the objects they affect — bottom of long lists is a blind spot) · *Hover/Pop-up Tools* (desktop only; instant, no reflow) · *Action Panel* (always-visible task-grouped actions) · *Preview* before costly actions · *Spinners & Loading Indicators* · *Cancelability* · *Multilevel Undo* · *Command History* · *Macros*. Drop-down controls are for choosing values, not triggering actions [TID].
- **Response-time thresholds** [TID]: <0.1s feels instant · 0.1–1s noticeable, flow kept · >1–2s show indicator · ~10s attention limit → progress with % / time remaining / what's happening / Cancel. Frustration threshold ~10s [WSG].

## Key Concepts
- **Action hierarchy / button weights**.
- **Target area vs visual bounds**: hit area may exceed drawn button [PUI].
- **Friction**: deliberately added interaction cost [PUI].
- **Habituation**: automatic dismissal of repeated dialogs [TID].
- **Assumed next step**: the obvious concluding action [TID].
- **Cancelability**: immediate side-effect-free stop [TID].

## Mental Models
- If users need to read surrounding text to know what a button does, the label failed.
- Primary = "what most people should do next"; everything else steps down.
- Protect with reversibility first, friction second, warnings last.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| B1 | Single primary | ≤1 primary per view/dialog; equal choices not biased | PUI, RUI |
| B2 | Hierarchy without colour | Weights distinguishable in greyscale (fill vs outline vs underline) | PUI |
| B3 | Contrast | Label ≥4.5:1; button boundary ≥3:1 vs bg; secondary not light grey | PUI |
| B4 | Targets | ≥44–48px hit area (incl. tertiary links, icon buttons, list rows); ≥8px separation | PUI, TID, KUL |
| B5 | Labels | Verb + noun; no OK/Yes/No/Submit/Click here; understandable out of context | PUI, KUL, WSG |
| B6 | States | hover, active, focus-visible, disabled/locked, loading present & distinct | PUI, KUL |
| B7 | Disabled usage | No unexplained disabled submits; alternatives or explanation + focusable | PUI |
| B8 | Placement consistency | Same order/alignment pattern across forms/dialogs; primary near last input; mobile primary reachable | PUI, TID, KUL |
| B9 | Destructive handling | Not primary on page; confirmation proportional to severity; undo where possible; red reserved for destructive | PUI, RUI, TID |
| B10 | Semantics | `<button>` for actions, `<a>` for navigation; no clickable divs | WSG |
| B11 | Feedback timing | Loading indicator >1s; progress + cancel for long ops; UI not frozen | TID |
| B12 | Consistent shape | Same radius/height family across weights and sizes | PUI, KUL |

## Fix Recipes
```css
.btn{ display:inline-flex; align-items:center; gap:.5rem; min-height:44px; padding:.625rem 1.25rem;
  border-radius:8px; font:600 1rem/1.25 var(--font-ui); border:2px solid transparent; cursor:pointer; }
.btn-primary  { background:var(--blue-600); color:#fff; }
.btn-primary:hover  { background:var(--blue-700); }
.btn-secondary{ background:transparent; color:var(--blue-700); border-color:var(--blue-600); }
.btn-tertiary { background:none; color:var(--blue-700); text-decoration:underline; text-underline-offset:.2em; padding-inline:.25rem; }
.btn:focus-visible{ outline:3px solid var(--blue-500); outline-offset:2px; }
.btn[aria-busy="true"]{ pointer-events:none; opacity:.8; }
.btn-group{ display:flex; flex-wrap:wrap; gap:1rem; }                 /* 16px between */
@media (max-width:600px){ .btn-group{ flex-direction:column; } .btn-group .btn{ width:100%; } }
```
1. **Competing primaries** → keep one; demote others to secondary/tertiary.
2. **"OK / Cancel"** → "Delete account / Keep account" or "Save changes / Cancel".
3. **Disabled submit** → enable; on submit show error summary + inline messages (ch09).
4. **Big red delete on page** → tertiary "Delete project" → confirmation dialog with red primary + consequence text (+ checkbox for account deletion) → toast with Undo when feasible.
5. **Tiny icon buttons** → 44px hit box via padding or pseudo-element; visible target outline where helpful.
6. **Link-as-button** (`<a href="#" onclick>`) → `<button type="button">`.
7. **Slow action** → optimistic UI or spinner in the button ("Saving…"), progress + Cancel for >10s.

## Conflicts & Context
- Alignment: [PUI] left-aligned primary-first (web forms, magnifier users) vs OS dialog conventions (macOS primary right, Windows left) and [TID] "Done at end of flow (often bottom-right)". Pick one convention per product and apply everywhere; for long web forms prefer left-aligned under the fields.
- Disabled buttons: [PUI] avoid; [KUL] allows temporarily disabled Continue with sufficient contrast + toast guidance; [TID] Input Prompt pattern disables until filled; [WSG] mentions submit active only when complete in dynamic forms. Default: avoid; if used, explain why and how to enable.
- Minimum target: 48pt [PUI], 44pt iOS / 48dp Android [TID][KUL]; WCAG 2.2 AA minimum 24×24 with spacing — treat 44–48 as the design standard.

## Anti-patterns
- **Ghost buttons in light grey** (look disabled) [PUI].
- **Buttons distinguished only by hue** [PUI].
- **Vague labels** "Submit", "Learn more" ×3, "Click here" [PUI][WSG].
- **Disabled buttons without explanation** [PUI].
- **Back button beside Next at bottom** (accidental data loss) [PUI].
- **Confirm-everything dialogs** [TID].
- **Using dropdown selects to trigger actions** [TID].
- **Hover-only action reveal on touch devices** [TID][WSG].

## Worked Example
*"Invite editors" panel [PUI]:* Three "Remove" buttons styled red and bold competed with "Send invite". Fix: "Send invite" = solid primary; each "Remove" = underlined tertiary (less prominent, reduces mis-taps); removing an owner triggers a light confirmation "Remove Jon from editors? [Remove editor] [Cancel]"; deleting the whole article escalates to moderate friction (red dialog + "You won't be able to recover it"), and account deletion to heavy friction (required confirmation checkbox). A "Message deleted · Restore message" toast is offered where the backend supports undo.

## Key Takeaways
1. One primary; hierarchy visible in greyscale.
2. Verb + noun labels, meaningful out of context.
3. 44–48px targets, 8–16px apart, all states designed.
4. Don't disable — validate and explain.
5. Friction scales with destructiveness; undo beats confirm.

## Connects To
- **ch09** forms & validation · **ch02** hierarchy · **ch15** keyboard/focus · **ch12** modals & menus
