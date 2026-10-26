# Ch 17: Interaction Principles & Consistency

Sources: [FRZ] 7.4.4 (ISO 9241-110:2020 interaction principles), 12.18 expert review · [NIE] Nielsen ch1, Kellogg ch2 · [MAR] "Functional inconsistency", probability · [NAT] existing vs new users · [UXM] modes, settings · [TID] behaviour patterns

## Contents
Core idea · Frameworks · Audit checks · Fix recipes · Conflicts · Anti-patterns · Takeaways

## Core Idea
Visual polish cannot rescue a dialogue that fights the user. This lens audits how the interface *behaves* over a task: does it fit the task, explain itself, behave as expected, let people explore, stay under their control, and absorb their mistakes. It is also where LLM and screenshot-only reviews are weakest, so most checks here need the walkthrough in evidence.md.

## Frameworks Introduced
- **ISO 9241-110:2020 interaction principles** [FRZ]. The standard lists them side by side; which matters most depends on the context of use, and improving one can hurt another.

  | Principle | Questions the standard asks | Typical evidence |
  |---|---|---|
  | Suitability for the user's task | Can the task be done here? How much effort? Are useful defaults set? | steps and fields counted per task; defaults present |
  | Self-descriptiveness | Is the needed information present and obvious? Is the current state and step clear? | location cues, step indicator, frequent controls visible, labels in user vocabulary |
  | Conformity with user expectations | Does it give appropriate feedback? Is it consistent inside and with other systems? Does it follow locale conventions? | feedback per action (ch16), platform conventions, date/number/RTL formats |
  | Learnability | Can users discover features, explore without risk, and see consequences before acting? | several access paths (menu + search), previews, sandbox or undo |
  | Controllability | Can users interrupt and resume, choose order and pace, undo, customise and reset? | drafts, cart persistence, Back/Cancel, timeouts extendable, multi-step undo, "reset to defaults" |
  | Use-error robustness | Are errors prevented, tolerated, and easy to recover from? | constraints, forgiving formats, preserved input, specific messages |
  | User engagement | Is the system inviting and motivating to use? | trust, clarity of value, no needless friction |
- **Consistency matrix** [NIE Kellogg]: consistency has three levels, each internal (within the system) and external (with users' knowledge, the work domain, metaphors, other systems). A shared look and feel with an inconsistent conceptual model still fails: users learned routine tasks slower and inferred new ones worse.

  | Level | Internal question | External question |
  |---|---|---|
  | Conceptual (model, metaphor, object types) | Do similar objects work the same way (create, edit, delete, share)? | Does the model match how users think about the domain? |
  | Communication (actions, commands, wording, sequences) | Same verb, shortcut and step order for the same job everywhere? | Same as platform conventions and comparable products? |
  | Physical (appearance, position) | Same control looks and sits the same on every screen? | Same as OS/platform look for that control? |

  Consistency also spans the help, docs, emails and release-to-release changes [NIE].
- **Functional inconsistency** [MAR][NIE]: be consistent within a context; differ deliberately when the context differs (iOS vs Android, novice vs expert view) and it works better. The brand stays consistent; behaviour may adapt. Never be inconsistent just to look different.
- **Audience decides how much to change** [NAT]: products earning from existing users keep learned navigation, interaction and data presentation unless a change is a clear gift; products that must win new users can redesign freely and focus on the part with most use and revenue.
- **Order follows use** [MAR]: people meet options in order and pick the first plausible one, so menu and list order should track frequency. A UI order of 1-2-3-4-5 with usage of 1-3-2-5-4 is a symptom worth diagnosing.
- **Modes** [UXM][TID]: hidden modes cause mode errors. Prefer explicit options, show any active mode with several cues, and make leaving a mode obvious (ch16 FB10).

## Key Concepts
- **Interaction cost**: physical and mental effort to complete a task (ch01).
- **Mode error**: an action means something different because of a state the user did not notice.
- **Internal vs external consistency** [NIE].

## Mental Models
- Ask of every task: can I stop, go back, change my mind, and see what will happen before it happens?
- Consistency is a means (transfer of learning), not a goal; break it only with a stated reason.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| IX1 | Task fit & efficiency | Top tasks have no technology-only steps; sensible defaults and autofill; frequent paths have shortcuts or bulk actions | FRZ, TID |
| IX2 | Self-descriptive state | Current location, step and system state visible; frequent controls permanently visible; vocabulary matches users; nothing must be remembered from an earlier screen | FRZ, TID |
| IX3 | Expected behaviour | Controls behave as their look and platform convention promise; feedback per action (ch16 FB1) | FRZ, PUI |
| IX4 | Safe exploration | Consequences previewed before costly actions; a second access path (search + menu) for key features; trial actions are reversible | FRZ, TID |
| IX5 | Control & freedom | Back, Cancel and Esc work everywhere without losing input; drafts or saved progress for long tasks; multi-step undo where edits are frequent; timeouts warned and extendable; customisations can be reset | FRZ, TID, WCAG 2.2.1 |
| IX6 | Error robustness | Errors prevented by constraints and forgiving input formats; input preserved after errors; recovery path offered (ch09, ch16) | FRZ, PUI |
| IX7 | Conceptual consistency | Same object types support the same operations the same way across the product | NIE |
| IX8 | Communication consistency | One verb, one shortcut and one step order per job; one term per concept (ch13 W8) | NIE, PUI |
| IX9 | Physical consistency | Same control, same look and position across screens; matches platform look unless deliberately varied with reason | NIE, PUI |
| IX10 | Deliberate inconsistency documented | Every departure from internal or platform convention has a stated benefit | MAR, NIE |
| IX11 | No hidden modes | Mode changes are explicit, shown with several cues, and easy to leave | UXM, TID |
| IX12 | Order follows use | Menus, lists and settings ordered by frequency or a clear scheme (LATCH, ch10); analytics order matches UI order where data exists | MAR |

## Fix Recipes
1. **Lost input on Back** → persist form state (sessionStorage or draft API) and restore on return.
2. **Session timeout with no warning** → warn ≥20 s before, offer "Stay signed in" (WCAG 2.2.1).
3. **"Archive" in one list, "Move to archive" in another, swipe-only in a third** → one verb, one icon, one gesture + visible button everywhere.
4. **Settings with no way back** → "Reset to defaults" per section, with confirmation.
5. **Hidden edit mode** → explicit "Editing" banner with Done/Cancel, distinct background, and a toast on exit.

## Conflicts & Context
- **Consistency vs improvement**: [NIE] warns that rigid standards become a lowest common denominator; [MAR] allows functional inconsistency; [NAT] existing-user products should move slowly. Default: keep internal consistency, adopt platform conventions, and record every deliberate exception (IX10).
- **Flexibility vs simplicity**: more paths and customisation (learnability, controllability) add surface area; offer them progressively (ch02, ch12).

## Anti-patterns
- **Wizard with no Back** or a Back that wipes answers.
- **Same icon, different action** on different screens.
- **Feature only reachable through one hidden gesture**.
- **Silent auto-logout** that loses work.
- **Settings that cannot be reset**.

## Key Takeaways
1. Audit behaviour by doing the task, not by looking at it.
2. Check consistency at concept, action and appearance level, inside and outside the product.
3. Control, recovery and recognition are where reviews miss most; test them on purpose.

## Connects To
- **ch01** foundations · **ch08** undo and friction · **ch09** forms and errors · **ch10** navigation order · **ch16** feedback and modes · **ch13** vocabulary
