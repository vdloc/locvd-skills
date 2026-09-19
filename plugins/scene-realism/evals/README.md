# Evals

Each `<skill>.eval.json` file lists test prompts and the behavior expected
of that skill, for use with `claude plugin eval`.

**Before relying on these:** the exact JSON schema `claude plugin eval`
expects was not independently confirmed against Anthropic's official
documentation while this plugin was built (see
`docs/superpowers/specs/2026-09-19-scene-realism-skill-design.md`'s "Open
questions" — the design's own research flagged this). The shape below is a
reasonable, conservative guess (id, prompt, and a plain-language expected-
behavior description, not a strict machine-checked assertion). Confirm
against `https://code.claude.com/docs/en/plugin-evals.md` and adjust the
schema before treating a pass/fail from `claude plugin eval` as
authoritative.
