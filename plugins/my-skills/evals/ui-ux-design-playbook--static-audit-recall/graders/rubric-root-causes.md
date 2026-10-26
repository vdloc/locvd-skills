---
type: llm
---
PASS if the report groups related findings under shared root causes (for example "no spacing/type tokens", "form built without a field component", "CSS resets removing accessibility defaults") and proposes a fix at that root level (tokens or a shared component), in addition to listing individual findings.
FAIL if it is only a flat list of individual problems, even if each one is correct.
