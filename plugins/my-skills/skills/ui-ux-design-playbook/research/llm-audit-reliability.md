# Why the ground rules exist: measured failure modes of LLM UI auditors

Background for audit-workflow.md *Ground rules* and the walkthrough step. Read when you need to justify or adjust those rules.

## Contents
- What the studies found
- What the books say about expert review
- How each ground rule answers a failure

## What the studies found
- **Guerino et al., "Can GPT-4o Evaluate Usability Like Human Experts?" (INTERACT 2025, arXiv 2506.16345).** GPT-4o reviewed 20 screenshots of a web system with a structured prompt (role, context, step-by-step reasoning, rubric, CSV output) and was compared with three HCI experts (66 issues).
  - 111 raw findings: 38.7 % duplicates; 24.3 % of the rest were false positives.
  - Only 21.2 % of the experts' issues were found (14/66); 27 new issues were found.
  - False-positive types: disagreements (not a problem), *assumptions about interactions it could not observe in static images* (feedback, confirmation: the real system had them), and generic claims ("high cognitive load") too vague to verify.
  - Better than experts on aesthetic/minimalist design and match with the real world; much worse on user control and freedom, recognition rather than recall, flexibility and efficiency; found nothing for helping users recognise, diagnose and recover from errors.
  - Authors' advice: use the model for a first pass, keep humans in the loop, ask for concrete examples.
- **Severity agreement (arXiv 2512.04262, 2025).** GPT-4o is fairly consistent at detecting that an issue exists, but exact severity agreement was 56 % with near-zero Krippendorff's alpha: severity needs explicit reasoning and human review.
- **Prompting strategies (SAST 2025, 12 web UIs).** Few-shot prompting gave the best precision/recall balance; chain-of-thought raised recall but also false positives.
- **Synthetic heuristic evaluation (arXiv 2507.02306).** Reports higher recall than five aggregated experts on two apps: results depend heavily on setup, which is why measured evidence matters more than the model's impression.
- **Human evaluators disagree too.** Heuristic-evaluation literature recommends several independent evaluators (commonly 3–5), consolidated afterwards; a single evaluator's severity ratings are unreliable.

## What the books say about expert review
- [FRZ] 12.18: an expert review is a structured method: give evaluators the same material, use heuristics or guiding questions rather than free impressions, evaluate individually, then consolidate; results must be understandable without the evaluator present. 12.3: expert review must never be the only evaluation; whether the solution solves the user's problem needs users.
- [MAR] diagnostic design: treat observations as symptoms, cluster them, explain the cluster with the most likely cause, then test it.
- [DUI] UI audit: inventory screens and states first, count styles, fix the widespread and easy problems first.

## How each ground rule answers a failure
| Failure | Rule |
|---|---|
| Claims about interactions never run | Evidence tags; Inferred capped at Medium; walkthrough log (evidence.md) |
| Generic findings | Name the element or drop the finding |
| Duplicates | One finding per root defect; verify-and-dedupe step |
| Unreliable severity | Severity reasoning: impact, then frequency/reach and persistence |
| Weak recall on control, recognition, efficiency, error recovery | Walkthrough step 4 targets exactly these; ch17 lens |
| Single-opinion bias | State the method limit; recommend user validation for systemic Critical/High |
