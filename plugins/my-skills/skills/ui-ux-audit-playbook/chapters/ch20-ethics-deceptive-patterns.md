# Ch 20: Ethics & Deceptive Patterns

Sources: [MAR] "A Simple Button" (constructive/destructive buttons, appropriate friction, ethical note), "A Page" (designing choices, be ethical) · [PUI] friction ladder · Harry Brignull's deceptive-pattern catalogue (deceptive.design) and Mathur et al.'s taxonomy

## Core Idea
Design can make the valuable action likely without making the user's own choice hard. Friction is appropriate when it protects the user from a mistake they would regret; it becomes deception when it protects the business from a choice the user is entitled to make. Deceptive patterns also carry legal risk under consumer-protection and platform rules in many markets; verify the rules for yours.

## Frameworks Introduced
- **Constructive, special and destructive actions** [MAR]: constructive actions (sign up, buy, invite) should be easy to find and press; special make-or-break actions can get a unique design; destructive actions (cancel, delete, downgrade) must stay easy to *find* but hard to trigger *by accident*: quieter styling or placement away from the reflex path, plus friction proportional to the cost (ch08 B9). Hiding them is not friction, it is obstruction.
- **Appropriate friction** [MAR][PUI]: a small deliberate step that makes the user conscious of an expensive action (two separated clicks, typed confirmation for irreversible bulk deletion). Test: would the user thank you for the friction afterwards?
- **Honest choice design** [MAR]: show only what is needed to decide, in a deliberate order; never force a choice; tell the truth about each option, so a user who only needs the cheapest plan can see that and pick it. Order effects and decoys are real; use them to clarify, not to trap.
- **Symmetry tests** (practical audit heuristics):
  - *Exit symmetry*: leaving (cancel, unsubscribe, delete account, opt out) takes no more steps, channels or persuasion than joining.
  - *Choice symmetry*: accept and decline options have comparable visual weight and plain labels.
  - *Price symmetry*: the price seen first is the price paid; mandatory fees appear up front.
- **Deceptive-pattern catalogue** (deceptive.design): comparison prevention, confirmshaming, disguised ads, fake scarcity, fake social proof, fake urgency, forced action, hard to cancel, hidden costs, hidden subscription, nagging, obstruction, preselection, sneaking (e.g. items added to cart), trick wording, visual interference, addictive design, currency confusion.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| ET1 | Exit symmetry | Cancelling, unsubscribing, downgrading and deleting the account are findable from settings and take no more effort than signing up | MAR, deceptive.design |
| ET2 | No preselection of paid or data-sharing options | Add-ons, insurance, marketing consent and data sharing start unticked | MAR, deceptive.design |
| ET3 | Honest urgency and proof | Countdowns, stock levels, "n people viewing" and reviews are real and verifiable | deceptive.design |
| ET4 | No confirmshaming or trick wording | Decline options are neutral ("No thanks"); no double negatives; checkbox wording means what it appears to mean | deceptive.design, KUL |
| ET5 | Visual parity of choices | Decline/Reject is visible and legible (≥4.5:1), not a grey link next to a bright Accept, in consent and upsell dialogs | deceptive.design, PUI |
| ET6 | Total price up front | Mandatory fees shown with the first price; no costs revealed only at the last step | deceptive.design |
| ET7 | No nagging | A dismissed prompt stays dismissed for a reasonable period; "not now" is respected | deceptive.design, HAX |
| ET8 | Friction proportional | Friction appears only where it prevents regretted mistakes, scaled to cost; undo preferred | MAR, PUI |
| ET9 | Comparisons possible | Plans and prices are presented so they can be compared (same units, same features listed) | deceptive.design, MAR |

## Fix Recipes
1. **Cancel by phone only** → "Cancel subscription" in Account › Billing, one confirmation that states what ends and when, optional (skippable) retention offer.
2. **Pre-ticked "Add protection plan (€9.99)"** → unticked option with the benefit stated plainly.
3. **"No, I don't like saving money"** → "No thanks".
4. **Cookie banner with bright Accept and grey "settings" link** → "Accept all" and "Reject all" as equal buttons, "Customise" as a third.

## Conflicts & Context
- **Retention offers** are legitimate if skippable in one step and shown once.
- **Persuasive ordering** (recommended plan first, highlighted) is fine when the recommendation is honest and the alternatives remain comparable [MAR].

## Key Takeaways
1. Make value easy and exits honest.
2. Friction protects users, never traps them.
3. Run the exit, choice and price symmetry tests on every money or data flow.

## Connects To
- **ch08** destructive actions · **ch12** pricing tables · **ch13** wording · **ch16** confirmation dialogs · **ch19** AI manipulation risks (and `aiux-patterns` anti-manipulation safeguards)
