# Evals

Layout follows `claude plugin eval` (checked against `claude plugin eval
--help` and `claude plugin eval init --bare`, not guessed): one directory
per case, `evals/<skill>--<case-id>/`, containing

- `prompt.md` — frontmatter (`max_turns`, `allowed_tools`, `tags`) + the
  user prompt as the body;
- `graders/criteria.md` — frontmatter `type: llm`, `weight: 1` + the
  plain-language behavior a passing run must show, judged by an LLM grader.

Run all cases (with a no-plugin baseline arm, the default):

```
claude plugin eval scene-realism@locvd-skills
```

Filter to one skill with `--tag intake`, or one case with
`--case 'verify--*'`.

## Limits — read before trusting a score

- The cases carry only a prompt, no scaffold project (`scaffold_script`),
  so each run sees an empty working directory. They test whether the skill
  *fires and follows its own instructions* (asks instead of guessing,
  refuses to substitute an unlicensed asset, ...), not that it produces a
  correct artifact for a real scene. A scaffold with a small sample GLB is
  the next step if these prove too loose.
- `allowed_tools` is read-only plus `Skill`; nothing here downloads from
  Poly Haven or writes files.
- Not yet run. No score exists for this plugin at the time of writing.
