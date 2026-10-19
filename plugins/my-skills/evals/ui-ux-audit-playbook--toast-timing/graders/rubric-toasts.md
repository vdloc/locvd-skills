---
type: llm
---
PASS if the answer says error toasts and toasts containing an action (the Undo toast) should not vanish after a fixed 3 seconds (they should persist until dismissed, or at least pause/extend), AND it mentions at least one of: pausing the timer on hover/focus, WCAG timing (2.2.1 Timing Adjustable), or announcing toasts through a live region (role=status / aria-live).
FAIL if it approves the 3-second auto-dismiss for errors and the Undo toast.
