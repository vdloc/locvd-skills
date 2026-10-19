# Ch 19: AI & Conversational Surfaces

Sources: [CHM] Chad Michel, *From Buttons to Conversations*: ch3 "Eight conversational patterns", ch5 "Five rules of adding AI" · Microsoft Research, *Guidelines for Human-AI Interaction* (Amershi et al., CHI 2019; HAX Toolkit) · [WCAG] 4.1.3

## Scope
This lens covers the conversational surface itself: chat panels, assistants, copilots and agents embedded in a product. For the 38 AI-UX patterns (explainability, confidence, autonomy, human-in-the-loop, audit trails, handoff…) use the **`aiux-patterns`** skill if it is installed: state the symptom, match one pattern, read that one reference. Everything else in this playbook (contrast, focus, layout, copy) applies to AI surfaces unchanged.

## Core Idea
"Just adding chat" can be worse than the forms and buttons it replaces [CHM]. A good AI surface makes turn-taking obvious, is honest about what it is doing, shows where answers come from, never acts for the user without a reviewable step, and always leaves a deterministic path when the model fails.

## Frameworks Introduced
- **Eight conversational patterns** [CHM]:
  1. *Accessibility first*: conversation is mostly text, so it should work well with screen readers; offer voice in and out where it helps.
  2. *Clear turn-taking*: the user always knows whether the assistant is responding and when they can send; responses that expect a reply end with a clear question ("Ready to send?").
  3. *Processing indication and streaming*: a short "Thinking" status is fine for about a second; beyond that, stream the answer or show state-specific status ("Searching policies", "Waiting on the calendar service"). Hide decorative status from screen readers, and do not announce streamed text that may still change; announce the completed answer.
  4. *Quick replies*: offer the likely next responses as chips; they save typing and reveal features (progressive disclosure).
  5. *Sources*: ground factual answers with links to the source and a quoted snippet, placed under the answer and styled as links.
  6. *Persistent context*: do not make users restate what the conversation or product already knows (the contact just created, the preferred time).
  7. *Rich responses / dynamic forms*: comparisons and numbers belong in tables, charts or inline forms, not paragraphs.
  8. *Multi-modal and long memory*: degrade by modality (voice: short sentences, no tables or links). An agent that acts on the user's behalf keeps an approval trail: the user reviews, confirms or overrides before execution.
- **Five rules for adding AI to an existing app** [CHM]: start tiny; bridge (run the new path beside the old); lock down security from day one; pass as much context as possible; always keep a deterministic fallback.
- **Human-AI interaction guidelines** (Amershi et al. 2019): 18 guidelines grouped by when they apply: initially (make clear what the system can do and how well), during interaction, when wrong (support efficient correction, dismissal and recovery; scope services when in doubt; make clear why it acted), and over time (remember recent interactions, learn cautiously, give global controls, notify about changes). Use the HAX Toolkit for the full list and examples.

## Audit Checks
| # | Check | Pass criterion | Src |
|---|---|---|---|
| CV1 | Capabilities stated | Entry point says what the assistant can and cannot do; example prompts or quick replies shown | CHM, HAX |
| CV2 | Turn-taking | While a response is generating, the input shows it (disabled or queued visibly) and a Stop control exists | CHM |
| CV3 | Honest status | Status reflects the real step; streamed or final text announced once via a live region; decorative "Thinking" hidden from AT | CHM, WCAG 4.1.3 |
| CV4 | Sources | Factual or policy answers link to sources with a snippet; generated content is labelled as such where it matters | CHM, HAX |
| CV5 | Approval before acting | Any action with effects outside the chat (send, buy, delete, change data) shows a preview and needs confirmation; actions are logged and undoable where possible | CHM, aiux-patterns |
| CV6 | Correction & dismissal | Users can edit, regenerate, dismiss or give feedback on an answer cheaply | HAX |
| CV7 | Fallback | Model or tool failure leaves the user a working path (retry with preserved input, the classic form, a human) and a specific message | CHM, ch16 FB11 |
| CV8 | Context carried | The assistant uses what the product already knows; users are not asked to retype IDs or recent objects | CHM |
| CV9 | Structured output | Comparisons, numbers and multi-field input use tables, charts or inline forms, all keyboard-operable | CHM, ch11 |
| CV10 | Global controls & memory | Users can see, edit or turn off what is remembered and how the assistant behaves | HAX |

## Fix Recipes
```html
<div class="chat" aria-busy="true">
  <ol class="log" aria-live="polite" aria-relevant="additions"> … completed messages only … </ol>
  <p class="status" aria-hidden="true">Searching policies…</p>          <!-- visual status only -->
  <form class="composer"><textarea aria-label="Message"></textarea>
    <button type="submit" disabled>Send</button><button type="button">Stop generating</button></form>
</div>
```
1. **Agent sends email directly** → draft card with To/Subject/Body, [Send email] [Edit] [Cancel]; after sending, "Email sent · Undo" for a short window.
2. **"Something went wrong"** → "The assistant couldn't reach the policy service. [Try again] [Open the policy library]", input preserved.
3. **Paragraph comparing three plans** → inline comparison table with the recommended plan marked and its reason.

## Conflicts & Context
- **Disable input while generating** [CHM] vs letting users queue the next message: either is acceptable if the state is visible and a Stop control exists.
- **Playful status messages** [CHM] add personality but cost consistency and can mislead about what is happening; prefer status tied to real steps.

## Key Takeaways
1. Obvious turns, honest status, visible sources.
2. Preview and approve before any action with effects; keep an audit trail.
3. Always keep a non-AI path.

## Connects To
- **`aiux-patterns`** skill (38 AI-UX patterns) · **ch16** status and live regions · **ch20** manipulation risks · **ch15** accessibility · **ch13** copy
