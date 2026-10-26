---
type: llm
---
PASS if the answer identifies at least four of these five problems with a concrete change for each:
(a) turn-taking: input/send should signal or block while the assistant responds, or queued messages must be handled visibly;
(b) the "Thinking…" status should not be read repeatedly by screen readers / should use an appropriate live region or be hidden, with streamed text announced sensibly;
(c) policy answers need sources or citations the user can check;
(d) sending an email on the user's behalf needs a preview/confirmation (approval) step and a way to undo or review;
(e) model failure needs a useful fallback path (retry, non-AI route, or preserved input), not a dead-end message.
FAIL if fewer than four are identified.
