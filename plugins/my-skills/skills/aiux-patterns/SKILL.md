---
name: aiux-patterns
description: "Use when designing, reviewing, or auditing an AI assistant or agent feature: chat/agent UI work, confirmation steps, showing errors/uncertainty/memory/autonomy, agent status, handoff, personalization, safety framing, or any AI feature review. One skill covering all 38 AI-UX patterns from aiuxdesign.guide — self-contained, no other skill or network fetch needed. Match the symptom to one pattern below, then read that pattern's reference file."
---

# AIUX Patterns

All 38 AI-UX patterns from [aiuxdesign.guide](https://aiuxdesign.guide), one skill. Each
pattern's full guidance (why it matters + the moves) lives in `references/<slug>.md`, kept
verbatim from the source so nothing here is paraphrased from memory. This file is the index:
match the symptom, read the one matching reference file, apply it.

**Don't read every reference file.** Match first, then read only the 1 (occasionally 2) files
that actually apply. Reading all 38 defeats the point of splitting them out.

## Procedure

1. **State the symptom in one sentence** — what was actually asked or observed, before
   naming a pattern.
2. **Match against the table below.** Pick exactly one primary pattern. If two genuinely tie,
   say so and read both — don't silently pick one. Check "Look-alikes" first if the symptom
   sounds like "it should just know" or "ask before acting" — those clusters get confused.
3. **Read `references/<slug>.md`** for the matched pattern (Read tool). Apply its moves to
   the task at hand — the smallest change that genuinely realizes the pattern, per that
   file's own closing instruction. Don't add UI the product doesn't need.
4. **No match** → say so plainly. Not every AI feature question is one of these 38; don't
   force-fit the nearest pattern.

## Look-alikes — check before committing to a match

The pattern authors flagged these overlaps explicitly:

- **Ambient Intelligence** = acts on sensed context with *no user action at all*.
  **Contextual Assistance** = inline tips attached to what the user is doing *right now*.
  **Predictive Anticipation** = pre-fills or pre-stages the user's *next step*.
  Three different triggers for what sounds like the same "it should just know" complaint —
  match on what the AI actually does (senses → acts / suggests inline / pre-fills).
- **Human-in-the-Loop** (a person must approve before an effect lands) vs. **Escalation
  Pathways** (the agent itself decides to stop and ask when unsure) vs. **Intent Preview**
  (show the plan before any of this runs) — three stages of the same action, not competing
  patterns. A single feature often needs more than one; read each in turn.
- **Graceful Handoff** (control moves between AI and human mid-task, no lost progress) is not
  Escalation Pathways or Human-in-the-Loop — handoff is about the *transition itself* staying
  smooth in both directions.

## Pattern index

### Trust & transparency
| Symptom | Pattern | Reference |
|---|---|---|
| User asks "why did it decide that" / wants reasoning shown | Explainable AI | `references/aiux-explainable-ai.md` |
| Need to show how sure the AI is / when to trust vs. verify | Confidence Visualization | `references/aiux-confidence-visualization.md` |
| User needs to see or undo what an agent changed; activity log, rollback | Action Audit Trail | `references/aiux-action-audit-trail.md` |
| User should judge an agent's plan/approach before it runs | Plan Summary | `references/aiux-plan-summary.md` |
| Users over- or under-trust the AI; autonomy should be earned over time | Trust Calibration | `references/aiux-trust-calibration.md` |
| Bias audit, fairness, accountability for automated outcomes | Responsible AI Design | `references/aiux-responsible-ai-design.md` |

### Control & autonomy
| Symptom | Pattern | Reference |
|---|---|---|
| Deciding "ask before doing" vs. "just do it", per-task permission levels | Autonomy Spectrum | `references/aiux-autonomy-spectrum.md` |
| Someone must approve/sign off before AI output takes effect | Human-in-the-Loop | `references/aiux-human-in-the-loop.md` |
| Show the plan before an agent acts; dry-run, approve/edit before execution | Intent Preview | `references/aiux-intent-preview.md` |
| Agent should pause and ask a human when unsure, not guess or interrupt constantly | Escalation Pathways | `references/aiux-escalation-pathways.md` |
| Human and AI edit the same thing at the same time; user wants to jump in mid-task | Mixed-Initiative Control | `references/aiux-mixed-initiative-control.md` |
| Users afraid to try the AI because they might break something | Safe Exploration | `references/aiux-safe-exploration.md` |

### Conversation & interaction
| Symptom | Pattern | Reference |
|---|---|---|
| Designing chat/voice interaction, composer, turn-taking | Conversational UI | `references/aiux-conversational-ui.md` |
| One input mode isn't enough: voice + touch + text + image + gesture | Multimodal Interaction | `references/aiux-multimodal-interaction.md` |
| "It forgets when I change topics"; resuming threads, parallel conversations | Context Switching | `references/aiux-context-switching.md` |
| AI should live inside the existing tool, not a separate chat app | Workspace-Native Agent Integration | `references/aiux-workspace-native-agents.md` |

### Timing of help (see Look-alikes above before picking one of these three)
| Symptom | Pattern | Reference |
|---|---|---|
| AI acts on sensed context with zero user action — or that's firing wrongly/too much | Ambient Intelligence | `references/aiux-ambient-intelligence.md` |
| Inline tips/coachmarks at the moment of need — or they've become nagging/undismissable | Contextual Assistance | `references/aiux-contextual-assistance.md` |
| Pre-filling/pre-staging the next likely action — or it's guessing wrong / over-committing | Predictive Anticipation | `references/aiux-predictive-anticipation.md` |
| A complex feature overwhelms newcomers; step-by-step walkthrough needed | Guided Learning | `references/aiux-guided-learning.md` |
| Screen/toolbar shows too much at once; advanced options bury the basics | Progressive Disclosure | `references/aiux-progressive-disclosure.md` |
| Users wait with no feedback while a quality answer generates | Progressive Enhancement | `references/aiux-progressive-enhancement.md` |

### Personalization & memory
| Symptom | Pattern | Reference |
|---|---|---|
| UI should adjust to usage — or that adaptation is destabilizing ("layout keeps moving") | Adaptive Interfaces | `references/aiux-adaptive-interfaces.md` |
| User needs to control/view/delete what the AI remembers | Selective Memory | `references/aiux-selective-memory.md` |
| User corrections should visibly improve the AI over time | Agent Reflection & Learning | `references/aiux-agent-reflection-learning.md` |
| Thumbs up/down, edit-and-learn actually changing future behavior | Feedback Loops | `references/aiux-feedback-loops.md` |
| AI responses feel slow; repeated queries should be instant | Intelligent Caching | `references/aiux-intelligent-caching.md` |

### Reliability & recovery
| Symptom | Pattern | Reference |
|---|---|---|
| Model fails, errors, or goes down; need a clear fallback/retry path | Error Recovery & Graceful Degradation | `references/aiux-error-recovery.md` |
| Control passes between AI and human mid-task with no lost progress | Graceful Handoff | `references/aiux-graceful-handoff.md` |
| Long conversations erode safety/quality; AI gets too agreeable over time | Session Degradation Prevention | `references/aiux-session-degradation-prevention.md` |

### Safety & protection
| Symptom | Pattern | Reference |
|---|---|---|
| Jailbreak/roleplay framing hiding a harmful request | Anti-Manipulation Safeguards | `references/aiux-anti-manipulation-safeguards.md` |
| Message may signal self-harm or crisis | Crisis Detection & Escalation | `references/aiux-crisis-detection-escalation.md` |
| Minors or at-risk users may be present; age gating, dependency risk | Vulnerable User Protection | `references/aiux-vulnerable-user-protection.md` |
| Data collection/consent/storage transparency for an AI feature | Privacy-First Design | `references/aiux-privacy-first-design.md` |
| Screen readers, low literacy, language diversity, motor differences | Universal Access Patterns | `references/aiux-universal-access-patterns.md` |

### Collaboration & agent status
| Symptom | Pattern | Reference |
|---|---|---|
| Multiple people share one workflow with an AI participant | Collaborative AI | `references/aiux-collaborative-ai.md` |
| AI co-creates content with the human staying the author | Augmented Creation | `references/aiux-augmented-creation.md` |
| User needs to follow long-running background agent work without watching it | Agent Status & Monitoring | `references/aiux-agent-status-monitoring.md` |

---

Pattern content pulled verbatim from [imsaif/aiux-skills](https://github.com/imsaif/aiux-skills)
(MIT-licensed, generated from aiuxdesign.guide, a library of 38 AI-UX patterns distilled from
shipped products) and vendored here so this skill has no runtime dependency on that repo or
plugin being installed. If aiuxdesign.guide revises a pattern, these references can drift —
re-sync from the source repo if a pattern's guidance feels dated.
