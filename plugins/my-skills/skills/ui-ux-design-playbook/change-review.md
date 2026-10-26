# Change review: branch, pull request or uncommitted work

Use this mode when the target is a change (a PR, a branch, a commit range, staged or uncommitted work), not a screen. The question is "did this change make the interface worse?", so report what the change caused and stay mostly quiet about what it merely touched. Severity, evidence tags and the report template still come from [audit-workflow.md](audit-workflow.md); this file adds scope resolution, consumer expansion, the removed-lines pass and a status per finding. [JK]

## Contents
- 1. Resolve the scope
- 2. Read-only, including the checkout
- 3. Expand the diff to the surfaces it renders in
- 4. Read the removed lines
- 5. Classify every finding
- 6. Hold the change to its stated intent
- 7. Report
- Common mistakes

## 1. Resolve the scope
Read the whole diff before forming any opinion; a skimmed diff produces findings about code the next hunk already fixed.

| Target | How it resolves |
|---|---|
| none given | If `HEAD` is ahead of `git merge-base origin/<default> HEAD`: that range **plus** uncommitted work (state both counts). Else if the tree is dirty: the uncommitted work. Else: nothing to review, see below |
| `pr <n>` | `git fetch origin "pull/<n>/head:refs/remotes/pr/<n>"`; base from `gh pr view <n> --json baseRefName,baseRefOid` (never assume the default branch) |
| branch | three-dot diff against the merge base, so upstream commits are not counted as the change |
| `<a>..<b>` / `<a>...<b>` | keep the dots the user wrote; they mean different things |
| uncommitted | `git diff HEAD` **and** `git ls-files --others --exclude-standard`, or new files are silently dropped |

Record the base commit as `$BASE` and name it with its SHA. Default branch: `refs/remotes/origin/HEAD`, then `gh repo view --json defaultBranchRef`; with no remote, say which local branch you assumed.

**Nothing to review.** Never fall back to `HEAD~1..HEAD` on your own. State the facts (branch, commits ahead, last commit SHA and subject, any open PR from `gh pr status`), then offer: the open PR on this branch (first, if there is one), the last commit by SHA and subject, a target the user names, or a whole-product audit (the normal [audit-workflow.md](audit-workflow.md) audit, without statuses). Never report a review of nothing as clean.

**States that fail quietly.** Mid-rebase or mid-merge: check `git rev-parse --git-path` for `rebase-merge`, `rebase-apply`, `MERGE_HEAD`, `CHERRY_PICK_HEAD` and stop if any exists, because `git diff` succeeds and returns something that is not the change. Shallow clone (CI): `git fetch --deepen=50`, then 200, then report the base as unresolvable. Detached HEAD: name the SHA. Renames: review a move as a move (`--find-renames=40%` when moved and edited).

**Exclude machine-authored paths** and name them in the scope block: lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock*`, `Cargo.lock`, `poetry.lock`, `uv.lock`…), snapshots (`__snapshots__/`, `*.snap`), build output (`dist/`, `build/`, `.next/`, `coverage/`, `storybook-static/`, `*.min.*`, `*.map`), generated sources (`*.gen.ts`, `*.generated.*`), vendored code, binaries. Use pathspecs with glob magic (`':(glob,exclude)**/dist/**'`) and check the count dropped by exactly what you named. A font or image *referenced* by changed code stays in scope through that code (typography, `alt`, outlines).

## 2. Read-only, including the checkout
`git fetch` writes only to `.git` and is allowed. `gh pr checkout`, `git checkout`, `git switch` and `git stash` rewrite files the author has open and are never allowed. Read the head with `git show <head-ref>:path` and cite line numbers against that ref (declare it and its SHA in the scope block). `git grep <pattern> <head-ref>` searches the reviewed revision; plain `git grep` searches the working tree.

Rendered checks are opt-in in this mode. Mark visual and runtime claims *Needs verification* unless the project has a cheap preview or the user asks for a rendered review. For `working` or a local branch, render in place; for anything else, use a throwaway worktree (`git worktree add /tmp/review-<n> refs/remotes/pr/<n>`) and remove it afterwards. Then run the Playwright sequence in [evidence.md](evidence.md) against it.

## 3. Expand the diff to the surfaces it renders in
A changed file is evidence, not the review subject; its **blast radius** is the set of screens it renders in.
- Expand one hop (direct importers and callers). Expand a second hop only for design tokens, theme values and shared primitives (search the token *name*, since consumers reference it without importing a file).
- Review at most five consumers, ordered: route and layout entry points first (`app/**/page.*`, `pages/**`, `routes/**`…), then by importer count, then by proximity. State how many you did not expand; an unstated cutoff reads as completeness.

## 4. Read the removed lines
Regressions are invisible in the post-change state. Search only the `-` side so additions cannot mask a removal:

```bash
git diff -U0 "$BASE" <head-ref> -- . <exclusions> \
  | grep -E '^-' | grep -vE '^--- (a/|/dev/null)' \
  | grep -E 'aria-|role=|alt=|htmlFor|for=|scope=|focus|outline|tabindex|prefers-|lang=|dir=|text-wrap|line-clamp|overflow-wrap|tabular-nums|font-feature|autocomplete|inset-|-inline|-block'
```

Leave `<head-ref>` off when the target includes uncommitted work. Then read each hit in its hunk, because `-U0` hides the element it came from.

| Removed | Lens | What may have been lost |
|---|---|---|
| `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-live`, `role=` | ch15 A4, ch16 | accessible name, description or announcement |
| `alt=`, `<label`, `for=`/`htmlFor`, `scope=` | ch15 A9, A13 | programmatic association of image, field or table cell |
| `<button>`, `<a>`, `<nav>`, `<main>`, `<ul>` replaced by `div`/`span` | ch15 A3, A5 | keyboard and assistive-technology behaviour |
| `:focus-visible`, `:focus`, `outline`, `tabindex` | ch15 A1, A2 | visible focus, place in the Tab order |
| `prefers-reduced-motion` | ch18 AN4 | motion now ignores the user's setting |
| `prefers-contrast`, `forced-colors` | ch05 C12, ch15 A17 | high-contrast support |
| `autocomplete`, `inputmode`, `type=` on inputs | ch09, ch15 A20 | autofill, keyboard, accessible authentication |
| logical properties swapped for `left`/`right` | ch03 L16 | RTL mirroring |
| `lang=`, `dir=` | ch04 T19 | language and direction metadata |
| `text-wrap`, `line-clamp`, `overflow-wrap`, `tabular-nums`, `font-feature-settings` | ch04 | wrapping, truncation, numeral alignment |
| a colour token swapped for a literal or a lighter token | ch05 C1, C13 | contrast may now fail: measure it |
| a user-facing string deleted or shortened | ch13 | a label, error or empty state lost information |

**Equivalent replacements clear the signal**; drop a removal one of these explains: `aria-label` → `aria-labelledby` pointing at visible text; `role="button"` dropped because the element became a `<button>`; `outline` replaced by a `box-shadow` ring on the same `:focus-visible` selector; `tabindex="0"` dropped from a now-native control; a literal replaced by a token of the same value; a physical property replaced by its logical one (that is the fix); a string moved into the translation catalogue. Removed strings and swapped colour tokens have no reliable pattern: read those hunks.

## 5. Classify every finding
| Status | Meaning |
|---|---|
| **Introduced** | the change created it |
| **Regression** | the change weakened something that was correct before |
| **Pre-existing** | present before the change and not made worse by it |

Status by **cause, not location**: a finding caused by a changed line is Introduced or Regression wherever it surfaces, including an untouched consumer of a changed token; one the change neither created nor worsened is Pre-existing even three lines from a hunk. When unsure whether a line predates the change, `git blame -L <n>,<n> "$BASE"..<head-ref> -- <file>`: a `^` prefix means unchanged since the base; for uncommitted work drop the range and look for `Not Committed Yet`.

## 6. Hold the change to its stated intent
Read the PR title and body, the linked issue and the commit subjects, then check the interface delivers what they claim. This is how you find the **incomplete** change, which a surface review misses because it only inspects states that exist:
- a new variant, size or theme applied to some of hover, focus-visible, active, disabled, loading, selected but not all (ch12, ch08);
- a new user-facing string with no entry in the project's translation catalogue (ch13);
- a new component with no empty, loading, error, disabled or narrow-width state (ch16, ch14);
- a control added to one surface but not to the siblings that carry its peers (ch17 consistency).

Scope creep is a process question, not an interface finding.

## 7. Report
Open with a scope block, then use the [audit-workflow.md](audit-workflow.md) report template with two changes: a **Status** column in Findings, and a short **Pre-existing** section (at most three, highest first, stated as not this change's responsibility).

| Field | Example |
|---|---|
| Target | `pr 482` / `branch` / `working` / range as entered |
| Base ref | `origin/main` at `a1b2c3d` |
| Head ref | `refs/remotes/pr/482` at `e4f5g6h` |
| Commits | 7 committed, 2 files uncommitted |
| Files in scope | 12 after exclusions |
| Excluded | `pnpm-lock.yaml`, `src/__snapshots__/` |
| Surfaces expanded | `CheckoutPage`, `SettingsPanel`; 3 further `Button` consumers not expanded |

In the Coverage table, a lens with nothing in the change scope is `Not reviewed: no evidence in the change scope`, a coverage statement rather than a gap. **Verdict** (change reviews only): **Block** while any Critical or High finding with status Introduced or Regression remains; otherwise **Approve**, naming every lens marked Not reviewed. A change whose only findings are Pre-existing is an Approve. Correctness, tests, security and performance belong to the general code review: name such a concern once and point there.

## Common mistakes
| Mistake | Fix |
|---|---|
| Scope counts only uncommitted files while `HEAD` is ahead of the merge base | Review the branch range plus uncommitted work, with both counts |
| Reviewing `HEAD~1..HEAD` the user never chose | State the facts and offer the routes in *Nothing to review* |
| PR diffed against `main` when it targets `release/2.0` | Use the PR's own `baseRefOid` |
| A changed shared component with no consumer listed | Expand to its consumers and name the ones skipped |
| A deleted `aria-label`, `outline` or `prefers-reduced-motion` with neither finding nor note | Run the removed-lines pass |
| A Regression whose removed attribute reappears elsewhere in the diff | Check the equivalent replacements first |
| An untouched consumer of a changed token marked Pre-existing | The change caused it: Introduced or Regression |
| `gh pr checkout` or `git switch` in the command log | Fetch the ref and read files with `git show` |
| Cited line numbers taken from the working tree | Cite against the head ref named in the scope block |
