# Evals

Layout follows `claude plugin eval` (one directory per case, `prompt.md` + `graders/*.md`, optional `case.yaml`). Case names are prefixed with the skill they test.

## ui-ux-design-playbook

| Case | Tests | Needs `--scaffold` |
|---|---|---|
| `ui-ux-design-playbook--static-audit-recall` | finds seeded defects in `checkout.html`; findings name elements and give severity reasons; decorative `alt=""` not flagged | yes |
| `ui-ux-design-playbook--unobservable-not-high` | behaviour after "Pay now" (not observable in a static file) is not asserted as Critical/High | yes |
| `ui-ux-design-playbook--contrast-standard-current` | keeps WCAG 2 contrast as the requirement; does not claim WCAG 3 adopted APCA | no |
| `ui-ux-design-playbook--ai-chat-review` | AI panel spec: turn-taking, status announcements, sources, approval before acting, fallback | no |
| `ui-ux-design-playbook--static-account-wcag22` | WCAG 2.2 defects in `account.html`: focus hidden under a fixed cookie bar, focus outline removed, clipped title under text spacing, paste blocked on password, toast without live region, drag-only list; 3 traps | yes |
| `ui-ux-design-playbook--toast-timing` | errors and actionable toasts persist; hover/focus pause; live regions | no |

`_fixtures/checkout.html` and `_fixtures/account.html` are the seeded pages; `_fixtures/SEEDED.md` is the answer key for both and is never copied into a run. `fixture.sh` in each scaffolded case copies only its page. Both pages can also be served (`python3 -m http.server`) to exercise the Playwright scripts by hand.

Run (each run is a full Claude session on your own quota; the default is 3 runs per arm plus a no-plugin baseline arm):

```
claude plugin eval plugins/my-skills --tag ui-ux-design-playbook --scaffold --runs 1 -j 1
```

## Limits

- Regex graders check that a defect is *mentioned*, not that the fix is right; the `llm` rubric graders cover specificity, severity reasoning and false positives.
- The fixture is static: no Playwright evidence step is exercised. A served fixture with Playwright MCP needs `--allow-tools` for the MCP server.
- A UserPromptSubmit hook in this plugin (`hooks/normalize-prompt.js`) runs only in the with-plugin arm; each case appends a system-prompt line asking for standard English prose so user-level style hooks do not skew the comparison.
- `static-audit-recall` is the only case that separates the skill from plain Claude; the four topic/spec cases pass without the plugin (the skill also does not fire on them). Keep them as regression guards, not as evidence of value.

## Results (2026-10-19, judge: sonnet)

| Run | Scope | With plugin | Without | Δ | Cost |
|---|---|---|---|---|---|
| 1 | all 5 cases, 1 run/arm, first graders | 0.97 | 0.97 | 0 | $1.54 |
| 2 | `static-audit-recall`, 3 runs/arm, + `rubric-unverified-behaviour`, `rubric-root-causes`, fixed alt regex | 0.96 | 0.74 | **+0.22** | $1.95 |
| 3 | same case, with-arm only, after adding a severity-reason column to the SKILL.md report template | 1.00 (3/3) | — | — | $1.33 |
| 4 | v0.9 scripts + passes; `static-audit-recall` / new `static-account-wcag22`, 3 runs/arm | 0.96 / 0.95 | 0.78 / 0.81 | **+0.19 / +0.14** | $3.69 |

What run 2 showed: without the skill, all 3 runs stated unobservable behaviour as fact at High ("removal has no confirmation or undo") and gave no root-cause grouping. With the skill, those went under *Needs verification* and every report grouped findings by root cause. One skill run missed per-finding severity reasons; the template had no slot for it, which run 3 confirms is fixed.

Run 4: without the skill, 2 of 3 runs missed the paste-blocked password (3.3.8) and one missed the drag-only list (2.5.7); with the skill, one run missed the toast without a live region. One skill run was marked down for raising "two primaries" to High from the severity table's examples, which contradicted the new factor scoring; the examples were realigned afterwards.
