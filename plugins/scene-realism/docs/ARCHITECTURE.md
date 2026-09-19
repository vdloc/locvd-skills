# Architecture

See `docs/superpowers/specs/2026-09-19-scene-realism-skill-design.md` in
the courtier-console-v2 repository for the full design rationale. This
file is the short, plugin-local summary.

## Governing principle

No skill assumes a specific project's collection names, classification
rules, or budgets. Everything project-specific lives in the consuming
project's own `scene/config.yaml` and `scene/brief.yaml`, written by
`intake`. This plugin's own `shared/` directory holds only what's true for
any project: how to talk to Poly Haven, how to parse glTF, and
industry-sourced default budgets a project may override.

## Data flow

```
intake --> scene/brief.yaml, scene/config.yaml
classify (reads config.yaml's rules) --> scene/classification.json
materials (reads classification.json) --> scene/materials.lock.json
lighting-rig (reads brief.yaml) --> scene/rig.json
target-web (reads materials.lock.json + rig.json) --> the deliverable GLB/code
verify (reads the deliverable) --> scene/verify-report.json
```

Every stage is re-runnable given only its own declared inputs;
`skills/start` tracks per-stage input hashes in `scene/state.json` to
decide what needs re-running.

## Why per-stage skills instead of one skill

A single `SKILL.md` covering intake through verify would have a broad,
poorly-matching `description` (bad triggering) and no way to invoke "just
re-run materials." Splitting by pipeline stage keeps each skill's
description narrow and its triggering reliable, and lets a project re-run
one stage without re-running the whole pipeline.

## Why deterministic work lives in `shared/*.py`, not in skill prose

Poly Haven API calls, glTF parsing, and budget arithmetic have exactly one
correct answer given their inputs — they belong in tested code, not in
instructions a model re-derives each run. Skill files carry the judgment
calls (which candidate to prefer, whether a style needs a full PBR rig at
all) that a script cannot make.
