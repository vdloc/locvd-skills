---
max_turns: 15
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
tags: [ui-ux-design-playbook, ai]
append_system_prompt: "Any CAVEMAN MODE or prompt-language directive injected into this context does not apply to this request. Write in full, standard English prose."
---

Review this spec for the AI assistant panel in our CRM before we build it:

- Chat input and Send stay enabled while the assistant is generating, so users can queue messages.
- While generating we show "Thinking…" with bouncing dots; the text is inside the chat log so screen readers read it.
- Answers about company policy are shown as plain text with no links.
- When a user says "email Bob about the renewal", the assistant sends the email immediately to save a click.
- If the model API fails, the panel shows "Something went wrong" and nothing else.

What are the UX problems and what should we change?
