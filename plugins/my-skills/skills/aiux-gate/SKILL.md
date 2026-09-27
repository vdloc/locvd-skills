---
name: aiux-gate
description: "Use when designing, reviewing, or auditing an AI assistant or agent feature and it's unclear which AI-UX pattern applies: chat/agent UI work, 'does this need a confirmation step', 'how should errors/uncertainty/memory/autonomy be shown', or any AI feature review. Routes to the single matching pattern from imsaif/aiux-skills (38 patterns) instead of guessing or applying all of them — a gate, not a pattern library itself."
---

# AIUX Gate

A router, not a pattern library. This skill holds one thing: a table mapping symptoms to the
one `aiux-*` skill from [imsaif/aiux-skills](https://github.com/imsaif/aiux-skills) that owns
that pattern. It never re-implements a pattern's guidance from memory — the real content
always comes from the source (installed skill, or fetched live).

**Why a gate exists at all:** the 38 `aiux-*` skills already each carry their own strong
"Use when" trigger and can fire on their own once installed. The gate is for the two cases
where that isn't enough:
1. The full 38-skill pack isn't installed, and installing all of it is overkill for one
   question — the gate answers directly by fetching just the one matching skill.
2. Several patterns look plausible at once (this repo deliberately disambiguates a few —
   see the "Look-alikes" note below) — the gate picks the one that actually fits instead of
   applying all of them or guessing.

## Routing procedure

1. **State the symptom in one sentence** before matching — what the user described, in their
   words. Don't skip straight to a pattern name.
2. **Match against the table below.** Pick exactly one primary pattern. If two genuinely tie,
   say so and name both — don't silently pick one.
3. **Check whether the matched skill is installed** (look for `aiux-<slug>` in the available
   skills listing for this session).
   - **Installed** → invoke it with the `Skill` tool by its exact name. Stop here; let it do
     the work.
   - **Not installed** → fetch its guidance directly:
     `https://raw.githubusercontent.com/imsaif/aiux-skills/main/aiux-<slug>/SKILL.md`
     (WebFetch or `curl`). Apply the moves it describes to the task at hand. Tell the user
     which pattern you used and that installing the pack (see below) would let it trigger on
     its own next time — one line, not a sales pitch.
4. **Never fabricate a pattern's content.** If the fetch fails and the skill isn't installed,
   say so plainly and link the pattern page instead of improvising generic AI-UX advice under
   the pattern's name.
5. **No match found** → say so. Don't force-fit the nearest pattern; not every AI feature
   question is one of these 38.

## Install the full pack (tell the user once, if relevant)

```
npx skills add imsaif/aiux-skills
```
or as a Claude Code plugin:
```
/plugin marketplace add imsaif/aiux-skills
/plugin install aiux@aiux-skills
```
Only mention this when it's actually useful to them (e.g. they hit this gate more than once) —
not on every single route.

## Look-alikes — check these before committing to a match

The pattern authors flagged these overlaps explicitly; the gate exists partly to enforce them:

- **Ambient Intelligence** = acts on sensed context with *no user action at all*.
  **Contextual Assistance** = inline tips attached to what the user is doing *right now*.
  **Predictive Anticipation** = pre-fills or pre-stages the user's *next step*.
  Three different triggers for what sounds like the same "it should just know" complaint —
  match on what the AI actually does (senses → acts / suggests inline / pre-fills), not on
  the vibe of the request.
- **Human-in-the-Loop** (a person must approve before an effect lands) vs. **Escalation
  Pathways** (the agent itself decides to stop and ask when unsure) vs. **Intent Preview**
  (show the plan before any of this runs) — these are three stages of the same action, not
  three competing patterns. A single feature often needs more than one; route to each in turn
  rather than picking whichever sounds closest.
- **Graceful Handoff** (control moves between AI and human, mid-task, no lost progress) is not
  **Escalation Pathways** (agent-initiated pause to ask) or **Human-in-the-Loop** (approval
  gate) — handoff is about the *transition itself* staying smooth in both directions.

## Routing table

### Trust & transparency
| Symptom | Skill |
|---|---|
| User asks "why did it decide that" / wants reasoning shown | `aiux-explainable-ai` |
| Need to show how sure the AI is / when to trust vs. verify | `aiux-confidence-visualization` |
| User needs to see or undo what an agent changed; activity log, rollback | `aiux-action-audit-trail` |
| User should judge an agent's plan/approach before it runs | `aiux-plan-summary` |
| Users over- or under-trust the AI; autonomy should be earned over time | `aiux-trust-calibration` |
| Bias audit, fairness, accountability for automated outcomes | `aiux-responsible-ai-design` |

### Control & autonomy
| Symptom | Skill |
|---|---|
| Deciding "ask before doing" vs. "just do it", per-task permission levels | `aiux-autonomy-spectrum` |
| Someone must approve/sign off before AI output takes effect | `aiux-human-in-the-loop` |
| Show the plan before an agent acts; dry-run, approve/edit before execution | `aiux-intent-preview` |
| Agent should pause and ask a human when unsure, not guess or interrupt constantly | `aiux-escalation-pathways` |
| Human and AI edit the same thing at the same time; user wants to jump in mid-task | `aiux-mixed-initiative-control` |
| Users afraid to try the AI because they might break something | `aiux-safe-exploration` |

### Conversation & interaction
| Symptom | Skill |
|---|---|
| Designing chat/voice interaction, composer, turn-taking | `aiux-conversational-ui` |
| One input mode isn't enough: voice + touch + text + image + gesture | `aiux-multimodal-interaction` |
| "It forgets when I change topics"; resuming threads, parallel conversations | `aiux-context-switching` |
| AI should live inside the existing tool, not a separate chat app | `aiux-workspace-native-agents` |

### Timing of help (see Look-alikes above before picking one of these three)
| Symptom | Skill |
|---|---|
| AI acts on sensed context with zero user action — or that's firing wrongly/too much | `aiux-ambient-intelligence` |
| Inline tips/coachmarks at the moment of need — or they've become nagging/undismissable | `aiux-contextual-assistance` |
| Pre-filling/pre-staging the next likely action — or it's guessing wrong / over-committing | `aiux-predictive-anticipation` |
| A complex feature overwhelms newcomers; step-by-step walkthrough needed | `aiux-guided-learning` |
| Screen/toolbar shows too much at once; advanced options bury the basics | `aiux-progressive-disclosure` |
| Users wait with no feedback while a quality answer generates | `aiux-progressive-enhancement` |

### Personalization & memory
| Symptom | Skill |
|---|---|
| UI should adjust to usage — or that adaptation is destabilizing ("layout keeps moving") | `aiux-adaptive-interfaces` |
| User needs to control/view/delete what the AI remembers | `aiux-selective-memory` |
| User corrections should visibly improve the AI over time | `aiux-agent-reflection-learning` |
| Thumbs up/down, edit-and-learn actually changing future behavior | `aiux-feedback-loops` |
| AI responses feel slow; repeated queries should be instant | `aiux-intelligent-caching` |

### Reliability & recovery
| Symptom | Skill |
|---|---|
| Model fails, errors, or goes down; need a clear fallback/retry path | `aiux-error-recovery` |
| Control passes between AI and human mid-task with no lost progress | `aiux-graceful-handoff` |
| Long conversations erode safety/quality; AI gets too agreeable over time | `aiux-session-degradation-prevention` |

### Safety & protection
| Symptom | Skill |
|---|---|
| Jailbreak/roleplay framing hiding a harmful request | `aiux-anti-manipulation-safeguards` |
| Message may signal self-harm or crisis | `aiux-crisis-detection-escalation` |
| Minors or at-risk users may be present; age gating, dependency risk | `aiux-vulnerable-user-protection` |
| Data collection/consent/storage transparency for an AI feature | `aiux-privacy-first-design` |
| Screen readers, low literacy, language diversity, motor differences | `aiux-universal-access-patterns` |

### Collaboration & agent status
| Symptom | Skill |
|---|---|
| Multiple people share one workflow with an AI participant | `aiux-collaborative-ai` |
| AI co-creates content with the human staying the author | `aiux-augmented-creation` |
| User needs to follow long-running background agent work without watching it | `aiux-agent-status-monitoring` |

---

Patterns generated from [aiuxdesign.guide](https://aiuxdesign.guide), distilled from shipped
AI products. This gate is maintained separately from that repo — if `imsaif/aiux-skills` adds
or renames a pattern, this table can drift; re-check the source repo if a route feels off.
