# Audit workflow: expert review of an existing UI

Use for "audit / review / critique / heuristic-evaluate this page, app, screenshot or flow" and, with [change-review.md](change-review.md), for a PR or branch. The ground rules, severity scale and report template below apply to these review modes only; designing and building follow [design-workflow.md](design-workflow.md). Book tags like [PUI] are listed under *Sources* in SKILL.md.

## Ground rules (audit and change review)
LLM auditors fail in known ways: false positives about interactions they never ran, generic findings without an element, duplicates, unreliable severity, and missed control/recall/efficiency/error-recovery problems (see `research/llm-audit-reliability.md`). These rules exist to stop that.

1. **Tag the evidence of every finding.**
   - **Measured**: a script or tool produced the value, or you read it directly from the source code (contrast ratio computed from declared colours, `user-scalable=no` in the viewport meta, a missing `<label>`).
   - **Observed**: you exercised the interaction or saw the state (pressed Tab, opened the menu, triggered the error, captured that screenshot).
   - **Inferred**: a judgement from a visual impression or an assumption about behaviour that was not exercised (what happens after a click, a colour estimated from a screenshot).
2. **Inferred findings are capped at Medium** and go under *Needs verification*, each with the test that would confirm it. Never state as fact what happens after an action you did not perform (loading, confirmation, error recovery, focus return).
3. **Name the element**: a selector, component, or quoted text, plus screen and breakpoint. A finding that cannot name an element ("high cognitive load") is dropped or rewritten until it can.
4. **Cite the rule**: a check ID (e.g. `ch09 FM3`) or a named principle. If no check covers it, label it *judgement* and give the reason.
5. **Show the severity reasoning** using the *Severity* table: impact, then frequency/reach and persistence.
6. **One finding per root defect.** Repeated symptoms of one cause are merged and counted ("14 off-scale values → no spacing scale").
7. **State the method's limit**: this is an expert review. It predicts problems; it does not prove users have them. Recommend a user test for each systemic Critical/High.
8. **Read-only**: never submit real forms, press destructive controls, or change persisted settings. Trigger validation only on dev or non-persisting forms. On a repository, don't edit source unless asked to implement the findings, and never switch the checkout.
9. **Evidence, not taste** [JK]: a deliberate, consistent project convention (a density, radius, voice, notation, no-shadow style) is not a finding, even where it differs from a number in this playbook; the same detail done two ways inside the product is. A documented convention never excuses an escalation trigger or a WCAG failure; when a shared token or guideline is the cause, report it once against that source. Zero findings is a valid result: never pad.

## Audit workflow
1. **Frame**: users and top 3 tasks; platform; screen types (overview / focus / make / do [TID]); constraints (brand, design system, WCAG target, default 2.2 AA). Note whether the product serves mainly **existing users** (radical changes to learned navigation and interaction cost them) or **new users** (redesign freely) [NAT]. Name the **product type** and its watch metric from ch01 *Product-type frame* (e-commerce, content, marketplace, B2B, social, game, internal tool, data/AI product) [MAR]; it decides which paths carry the most reach. With source access, **recon** the stack: framework, styling system, component library, design tokens, supported viewports, preview/test commands, and the project's own interface docs (`CONTRIBUTING.md`, `AGENTS.md`/`CLAUDE.md`, design-system or Storybook docs, ADRs); name what you found or that there are none [JK]. Every fix is then written in the project's idiom, never as a request to adopt another stack. If the scope is too large to inspect credibly, narrow it to one complete flow (the one the request centres on, else the entry path every user passes) and state what was excluded.
2. **Inventory**: list the screens/routes and states in scope: empty, loading, error, success, long and ugly data, logged-out, each theme [DUI]. Audit states, not just the default render. Stress only what varies [JK]: content length (empty, one word, several sentences, one unbreakable 60-character string) when the UI renders text it doesn't author; content shape (emoji, RTL and mixed direction, tall scripts, numbers in columns) when text comes from users or locales; quantity (0, 1, realistic, 10×) when it repeats over items; container (320 px, squeezed by a sibling, very wide) always; the states the component accepts; environment modes the product supports (dark, zoom, reduced motion).
3. **Collect evidence**: follow [evidence.md](evidence.md). Live or dev-server targets: screenshots at 375/768/1280 px in each theme, then run the scripts in `scripts/`:
   - **Page facts**: `metrics.js` (type, contrast, targets, names, spacing), `style-inventory.js` (style, colour, radius, border, shadow, control-height census), `alignment-grid.js` (edge and gap counts), `form-layout.js` on any form, `axe-run.js` (axe with WCAG 2.2 rules on).
   - **What a keyboard and screen-reader user meets**: `a11y-transcript.js` (role · name · state of every element in Tab order) and `focus-walk.js` (visible focus, focus hidden under sticky/fixed layers).
   - **WCAG 2.2 procedures**: `text-spacing.js`, `live-regions.js` (around an action), `wcag22-inventory.js` (login fields and paste blocking, drag-only widgets, help placement, re-asked data).
   - **Source available**: `bash scripts/code-smells.sh <dir>` lists grep-able leads (focus removed, clickable divs, zoom blocked, `transition: all`, plural hacks…) mapped to check IDs; read each in context per [code-smells.md](code-smells.md) before it becomes a finding.
   Static files or screenshots: derive the same facts from the source, or mark the check *needs verification*. Never invent a measurement. A rendering claim needs the rendered state, and a code claim needs the code: source alone cannot support a visual finding, nor a screenshot a code finding.
4. **Walk the top tasks** (the step automated and LLM review skip). For each top task:
   - **Control and freedom**: try Back, Cancel, Esc, Undo and closing each overlay; check that nothing traps you or loses input.
   - **Recognition over recall**: are options, current values and context visible, or must the user remember them from a previous screen?
   - **Efficiency**: defaults, autofill, keyboard paths, shortcuts, bulk actions for repeated work.
   - **Error recovery**: trigger validation (dev or non-persisting forms only), then read the message, its placement and focus behaviour.
   - **Keyboard**: Tab through the task; note order, visible focus, traps. Judge focus rings from real Tab presses, not from computed styles: a container that draws the ring with `:has(:focus-visible)` leaves the focused element reporting no outline [UIR].
   - **Responsiveness** (when the build runs locally): measure press feedback with the Event Timing API (a `PerformanceObserver` on `event` entries; each `duration` under ~100 ms) instead of judging it from a screenshot [UIR].
   - **Persona pass** (optional, after the task walk) [IMP]: walk the primary action as two or three relevant people (a power user repeating it daily, a first-timer, someone on keyboard or screen reader) and name the exact element where each one stalls ("first-timer: icon-only sidebar, no labels"). Generic persona descriptions don't count.
   Record these as *Observed*. If you cannot run the UI, list them under *Needs verification*.
5. **Find** (pass 1): run the lenses in order (structure before paint). Load the chapter and test its checks against the evidence. For accessibility, read the `a11y-transcript.js` output line by line and ask, in plain words, whether each element's role, name and state would make sense to someone hearing it, compared with its neighbours (more effective than quoting WCAG text). Record candidates fast; judge severity later.

   | # | Lens | Chapter | # | Lens | Chapter |
   |---|---|---|---|---|---|
   | 1 | IA & navigation | ch10 | 11 | Images, icons, media | ch07 |
   | 2 | Interaction principles & consistency | ch17 | 12 | Depth & polish | ch06 |
   | 3 | Hierarchy | ch02 | 13 | Copy | ch13 |
   | 4 | Layout & spacing | ch03 | 14 | Mobile & responsive | ch14 |
   | 5 | Typography | ch04 | 15 | Accessibility | ch15 |
   | 6 | Colour & contrast | ch05 | 16 | Feedback, status & notifications | ch16 |
   | 7 | Buttons & actions | ch08 | 17 | Motion | ch18 |
   | 8 | Forms, field patterns & flows | ch09, ch21 | 18 | AI / conversational surfaces (if any) | ch19 |
   | 9 | Lists, tables, data | ch11 | 19 | Ethics & deceptive patterns | ch20 |
   | 10 | Components & system | ch12 | 20 | Foundations sanity check | ch01 |

6. **Localize** (pass 2): give every finding its evidence and place: where (screen, breakpoint, selector), the measurement or what you did and saw, the evidence tag, the rule (check ID / source), user impact, the current implementation (*before*), the fix (*after*: concrete, token-level), effort (S/M/L). For findings taken from screenshots, run `mark-elements.js`, re-take the screenshot, and cite the mark number with its selector. **Prefer the cheapest fix that works** [JK]: (1) delete (a separator that space would carry, an animation on a high-frequency interaction, ARIA a native element makes redundant); (2) use the platform (native element, native control, browser focus ring); (3) reuse an existing project token or component; (4) correct the value; (5) add something new. When the code adds what a deletion would fix, that is itself a finding.
7. **Consolidate** (pass 3), repeating until clean:
   - Merge findings that share one cause; one finding per root defect.
   - Try to falsify each survivor once more [IB]: re-open the cited source or capture and delete the finding if the rule does not govern that property and surface, counterevidence shows the difference is deliberate, the evidence supports several different corrections, or the fix would require inventing product intent.
   - Delete any that the evidence contradicts (e.g. `alt=""` on a decorative image is correct).
   - Any finding without a named element or evidence is rewritten or dropped.
8. **Rate severity** (pass 4, separate from finding): go through the consolidated list once more and score each finding with the *Severity* factors below, writing the one-line reason (e.g. "High: fails WCAG 1.4.11 on every checkout field"). A finding scored "not a problem" is deleted. Inferred findings stop at Medium and go to *Needs verification*.
9. **Diagnose root causes** [MAR][DUI]: cluster the symptoms; for each cluster, name the most likely cause that explains the most findings and the fix at token or component level. Order fixes by severity × reach, and put widespread, cheap fixes first.
10. **Report** using the template below.

### Severity
Rate after all findings are collected, from the consolidated list: one evaluator's ratings made while hunting are unreliable [NN/g]. Score three factors, then apply the floors.

| Factor | Values |
|---|---|
| **Impact** | blocks the task or loses data/money (4) · causes errors or excludes a user group (3) · slows or confuses (2) · cosmetic (1) · not a problem (0 → delete) |
| **Reach** | core path, most users or every visit (+1) · some users or screens (0) · rare path (−1) |
| **Persistence** | hits users every time (+0) · learnable once, easy workaround (−1) |

Total 5 = Critical, 4 = High, 2–3 = Medium, 1 or less = Low (impact 0 is deleted whatever the total). Examples: unlabeled checkout field 4+1+0 = 5; colour-only error 3+1+0 = 4; vague link text 2+0+0 = 2; shadow inconsistency 1+0+0 = 1. The factor total decides the level; the examples in the table below are illustrations and never raise a score. Floors and caps: any WCAG A/AA failure is at least **High**, and **Critical** when it stops some users from completing a core task; Inferred findings are capped at Medium.

**Escalation triggers** [JK]: once Measured or Observed, these are at least **High** however minor the surface (the Inferred cap still wins): an interactive control with no accessible name; a keyboard-reachable control with no visible focus; a pointer path with no keyboard path; content or a control clipped, overlapped or unreachable at 320 px or 200 % zoom; body or control text failing its contrast ratio; meaning carried by colour alone; a destructive action with no confirmation, undo or distinct treatment; truncated content with no way to the full value; content past a scroll edge or behind a disclosure with no visible cue; an error that names no way to recover; a semantic colour used against its meaning (danger hue on a non-destructive action); a state change carried only by motion. Large-area motion that ignores `prefers-reduced-motion` is High; other reduced-motion gaps are Medium (cheatsheet conflict). List trigger findings first in the report.

| Level | Impact | Examples |
|---|---|---|
| **Critical** | Blocks a core task (for everyone or for a group such as keyboard or screen-reader users), or causes loss of data or money | unlabeled fields, keyboard trap, focus indicator removed on a core flow, body text below 3:1, zoom disabled, destructive action without recovery |
| **High** | Any other WCAG A/AA failure on a core flow; significant errors, confusion or exclusion; blocks a secondary task | colour-only errors (1.4.1), targets under 24 px (2.5.8), status messages not announced (4.1.3), unexplained disabled button on a secondary flow |
| **Medium** | Friction, inconsistency, slower scanning | two competing primary buttons, nav hidden behind a hamburger on desktop, off-scale spacing, ten font sizes, vague link text |
| **Low** | Polish | shadow inconsistency, minor misalignment, missing empty-state delight |

### Report template
```
# UI/UX audit: <product/screen> (<date>)
Scope · Users & top tasks · Audience (existing/new) · Method (tools, breakpoints, states, what was exercised) · Standard (WCAG 2.2 AA + playbook)
Method limit: expert review; findings are predictions to validate with users, not test results.
Recon (source audits): stack · tokens · component library · project interface docs found (or none)
Ready to ship: yes · yes, with fixes · no (n Critical/High) · no, pending <check that settles an Inferred blocker>   [UIR]
## Summary: 3–5 bullet verdict | Critical n · High n · Medium n · Low n
## What works (2–4 strengths worth keeping, so fixes don't break them)
## Coverage
| Lens | Evidence inspected (screens, files, scripts, interactions) | Result: n findings · Clear · Not reviewed (why) |
## Systemic issues (root cause → findings it explains → token/component fix)
## Findings (escalation triggers first, then by severity × reach; one row per root cause with every location)
| ID | Sev: why (impact; reach/persistence) | Evidence | Where | Issue & before (current) | Rule (check/src) | After (fix) | Effort |
## Quick wins (≤1 day)
## Recommended tokens/components
## Design specificity (optional, judgement, not severity-rated): authored for this product, or interchangeable with its category? Name the defaults it leans on (design-workflow.md *Defaults to name before choosing*) and the one change that would most raise its character
## Needs verification (finding → test that would confirm it)
## WCAG conformance (when asked for one): per success criterion, pass or fail only where Measured/Observed; everything else, and every criterion no sampled page exercised, is *undetermined* and goes to a person with assistive technology, never to "pass" [AL]
## Suggested user validation (task test, 5-second test, or analytics check per systemic issue)
```
*Clear* means inspected with no actionable finding; a lens whose evidence cell names no screen, file, script or interaction is *Not reviewed*, never Clear. Never imply uninspected surfaces were reviewed. With no findings, write "No actionable interface findings" and keep the Coverage and Method sections. Change reviews add a scope block, a Status column and a Block/Approve verdict ([change-review.md](change-review.md)).
