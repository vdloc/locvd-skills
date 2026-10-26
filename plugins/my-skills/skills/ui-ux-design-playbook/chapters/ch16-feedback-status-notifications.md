# Ch 16: Feedback, Status & Notifications

Sources: [UXM] Notifications & Messaging articles · [FRZ] 7.4.4 (self-descriptiveness, conformity with expectations) · [TID] ch8 response time, cancelability · [MAR] "A Modal" · [WCAG] 2.2.1, 4.1.3

## Contents
Core idea · Frameworks · Audit checks · Fix recipes · Conflicts · Anti-patterns · Takeaways

## Core Idea
Every user action gets a visible, timely response at the place it happened, and every change of system state the user did not cause is announced through a channel whose weight matches its scope and urgency. Feedback that vanishes before it can be read, interrupts for no reason, or reaches sighted users only is a defect.

## Frameworks Introduced
- **Choose the channel by scope and urgency** [UXM]:

  | Channel | Scope | Use for | Never for |
  |---|---|---|---|
  | Inline message | one field or component | validation, field help, row-level errors | page-wide state |
  | Toast / snackbar | the current user's action, transient | "Saved", "Message sent", "Item deleted · Undo" | decisions, long text, global outages |
  | Banner | global or system-wide, persistent until dismissed | outage, trial ending, policy change | reply to a single user action |
  | Modal alert | a decision needed before continuing | destructive confirmation, permission the current task needs | information the user can act on later |
- **Feedback when the screen does not change** [UXM][FRZ]: if an action leaves the user on the same screen ("Save changes"), confirm it explicitly; silence reads as failure.
- **Response time** [TID]: <0.1 s feels instant; 0.1–1 s keeps flow; >1 s show an indicator in the control ("Saving…"); ~10 s attention limit, so show progress (%, steps or what is happening) and Cancel. Skeletons for content loads, spinners for short waits, progress bars for known work; design empty, partial, full and interrupted progress states [DUI].
- **Tones** [UXM]: error/warning (red, `!` in a triangle), caution (amber `!`), success (green ✓), info (blue `i`). The icon carries the tone so it is understood before reading; colour the icon, not the whole box, and never rely on colour alone (ch05 C3). Opposite-polarity neutral surfaces make toasts and tooltips stand out on busy screens.
- **Anatomy** [UXM]: modal alert = title + icon + message + explicit buttons, no form inputs, no corner X (the decision must be conscious); banner = full width at the top, icon, dismiss X, no title needed; toast = floating, corner or bottom-centre on large screens, 1–2 lines, 240–360 px wide, one at a time, buttons stacked.
- **Confirmation dialogs** [UXM][MAR][PUI]: task-specific title ("Confirm your address", not "Confirmation"); buttons name the outcome ("Address is correct" / "Edit address", not Yes/No); show the data being confirmed prominently. For destructive actions the destructive button is quiet and placed away from the reflex path; the prominent button cancels.
- **Chained, not nested, modals** [UXM]: replace a stack of modals with one modal whose steps chain with a Back button; the only acceptable stacked modal is a destructive confirmation.
- **Status messages for assistive tech** [WCAG 4.1.3]: results, progress and errors that appear without a focus change must be exposed through `role="status"` (polite) or `role="alert"` (assertive, errors only), so screen-reader users get the same feedback.
- **Modes and status salience** [UXM "USS McCain"]: a state change that alters what controls do (steering transferred, editing locked, offline) needs several simultaneous cues (label, icon, colour, position) and a warning when one action changes other settings.

## Key Concepts
- **Scope**: who the message is about (one field, this user, everyone).
- **Persistence**: transient (auto-dismiss) vs persistent (until dismissed or resolved).
- **Live region**: an element whose changes assistive technology announces.

## Mental Models
- Feedback answers three questions: did it work, what changed, what can I do now.
- The more a message demands, the more it interrupts; make the interruption match the stakes.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| FB1 | Every action answered | Each action produces visible feedback within 1 s at the place of action; same-screen saves are confirmed | UXM, TID, FRZ |
| FB2 | Channel fits scope | Field issues inline; transient personal results as toasts; global state as banners; modal alerts only when a decision blocks progress | UXM |
| FB3 | Persistence fits content | Errors, toasts with an action (Undo, Retry) and anything longer than ~2 lines persist until dismissed; auto-dismissing toasts pause on hover and focus | UXM, WCAG 2.2.1 |
| FB4 | Announced to AT | Dynamic status uses `role="status"`/`aria-live="polite"`; errors `role="alert"`; "thinking/loading" text is not re-announced repeatedly | WCAG 4.1.3 |
| FB5 | Tone legible without colour | Each message has a tone icon and wording; text contrast ≥4.5:1 on its surface | UXM, PUI |
| FB6 | Waiting is explained | Indicator after 1 s; progress + Cancel beyond ~10 s; skeletons keep layout stable; interrupted progress has a recovery action | TID, DUI |
| FB7 | One toast at a time | New toast replaces or queues the old; stacks never cover content or controls | UXM |
| FB8 | Confirmation wording | Task-specific title, outcome-named buttons, the data under confirmation shown | UXM, PUI |
| FB9 | No nested modals | Multi-step modal work chains inside one modal with Back; only destructive confirmation stacks | UXM |
| FB10 | Mode changes salient | Any mode that changes control behaviour is shown with more than one cue and announced; side effects on other settings are warned | UXM, FRZ |
| FB11 | No dead ends | Every error message offers a next step (retry, edit, contact, alternative path) | FRZ, CHM |

## Fix Recipes
```html
<!-- polite status region: render once, update its text -->
<div id="toast" class="toast" role="status" aria-live="polite" aria-atomic="true"></div>
<!-- errors that need immediate attention -->
<div class="toast toast--error" role="alert">Payment failed. Card was declined. <button>Try another card</button></div>
```
```js
// auto-dismiss only non-critical toasts, and pause while hovered or focused (WCAG 2.2.1)
function showToast(el, text, { persist = false, ms = 5000 } = {}) {
  el.textContent = text; el.hidden = false;
  if (persist) return;                                 // errors and toasts with actions stay
  let t = setTimeout(hide, ms);
  const pause = () => clearTimeout(t), resume = () => { clearTimeout(t); t = setTimeout(hide, ms); };
  for (const [ev, fn] of [['mouseenter', pause], ['focusin', pause], ['mouseleave', resume], ['focusout', resume]])
    el.addEventListener(ev, fn);
  function hide() { el.hidden = true; }  // real code: remove the listeners here too
}
```
1. **"Saved" with no feedback** → toast "Changes saved" (`role="status"`), or inline "Saved 2 s ago" next to the button.
2. **Modal for a non-blocking warning** → banner (global) or persistent toast (personal).
3. **Yes/No confirmation** → "Delete 3 files?" [Delete files] [Keep files] + consequence line.
4. **Spinner for a 20 s export** → progress bar with step text and Cancel; email when done if longer.

## Conflicts & Context
- **Toast timing**: [UXM] 2–5 s auto-dismiss (3 s ideal) vs WCAG 2.2.1 Timing Adjustable. Whether a purely informational toast is a "time limit" is disputed among accessibility practitioners. Default: auto-dismiss only short, non-critical, action-free toasts, at ≥5 s, pausing on hover/focus; errors and actionable toasts persist.
- **Toast position**: [UXM] bottom/top centre on large screens (corners are missed) vs platform conventions (Material bottom-left/centre). Pick one per product; keep it clear of primary controls and mobile bottom navigation.
- **Disabled submit**: see ch08 B7; feedback on submit beats a silent disabled button.

## Anti-patterns
- **Silent success**: settings saved with no sign [UXM].
- **Modal alert for information** users can act on later [UXM].
- **Disappearing error toast** that takes the only explanation with it.
- **"Something went wrong"** with no cause or next step [FRZ].
- **Whole-box colour fills** for every tone, making text contrast inconsistent [UXM].
- **Nested modals** four deep [UXM].

## Key Takeaways
1. Respond to every action where it happened.
2. Match channel, tone and persistence to scope and stakes.
3. Errors and actionable messages persist; announce status to assistive tech.

## Connects To
- **ch08** buttons, loading states, destructive friction · **ch09** validation · **ch12** modals · **ch15** live regions · **ch19** AI status while generating
