# Evals

Layout follows `claude plugin eval` (one directory per case, `prompt.md` + `graders/*.md`, optional `case.yaml`). Case names are prefixed with the skill they test.

## ui-ux-audit-playbook

| Case | Tests | Needs `--scaffold` |
|---|---|---|
| `ui-ux-audit-playbook--static-audit-recall` | finds seeded defects in `checkout.html`; findings name elements and give severity reasons; decorative `alt=""` not flagged | yes |
| `ui-ux-audit-playbook--unobservable-not-high` | behaviour after "Pay now" (not observable in a static file) is not asserted as Critical/High | yes |
| `ui-ux-audit-playbook--contrast-standard-current` | keeps WCAG 2 contrast as the requirement; does not claim WCAG 3 adopted APCA | no |
| `ui-ux-audit-playbook--ai-chat-review` | AI panel spec: turn-taking, status announcements, sources, approval before acting, fallback | no |
| `ui-ux-audit-playbook--toast-timing` | errors and actionable toasts persist; hover/focus pause; live regions | no |

`_fixtures/checkout.html` is the seeded page; `_fixtures/SEEDED.md` is its answer key (16 defects, 3 traps) and is never copied into a run. `fixture.sh` in each scaffolded case copies only the page.

Run (each run is a full Claude session on your own quota; the default is 3 runs per arm plus a no-plugin baseline arm):

```
claude plugin eval plugins/my-skills --tag ui-ux-audit-playbook --scaffold --runs 1 -j 1
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

What run 2 showed: without the skill, all 3 runs stated unobservable behaviour as fact at High ("removal has no confirmation or undo") and gave no root-cause grouping. With the skill, those went under *Needs verification* and every report grouped findings by root cause. One skill run missed per-finding severity reasons; the template had no slot for it, which run 3 confirms is fixed.
