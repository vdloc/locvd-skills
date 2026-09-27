# Agent Reflection & Learning

Why it matters: As AI agents gain autonomy, users struggle to understand what the agent has learned from past interactions and corrections, making it hard to trust the agent over time.

## The moves

1. **Confirm the correction, not just the intent.** Generic acknowledgements mean nothing. Name what changed: 'I'll stop suggesting X' beats 'Got it!' every time. Specificity is the only proof of learning.
2. **Separate one-time fixes from permanent rules.** Users need to know what sticks. If a correction only applies now, say so. If it changes future behavior, say that too. Ambiguity breeds repeated corrections.
3. **Make the learning history editable.** Users who can delete a bad correction trust the system more than users who cannot. Control is the fastest path to confidence in an autonomous agent.
4. **Never surface learning you cannot actually act on.** If the model is stateless, say nothing. A false memory claim destroys more trust than silence. Only show learning that is real, persistent, and verifiable.

Reference: https://aiuxdesign.guide/patterns/agent-reflection-learning

When this applies, make the smallest change that genuinely realises the pattern. Do not add UI the product does not need, and say what you changed and why.
