---
name: start
description: Orchestrates the full scene-realism pipeline (intake, classify, materials, lighting-rig, target-web, verify) for a project, running only the stages whose inputs changed since the last run. Use to convert a plain-geometry scene end-to-end, or to resume a partially-completed conversion.
---

# Start

The entry point. Reads (or, on first run, creates via `intake`)
`scene/brief.yaml`, then runs each stage in order — but only the ones that
need it.

## Deciding what to (re-)run

Maintain `scene/state.json`: for each stage, a hash of its inputs at the
time it last ran successfully.

```json
{
  "intake": {"input_hash": "...", "status": "done"},
  "classify": {"input_hash": "...", "status": "done"},
  "materials": {"input_hash": "...", "status": "stale"},
  "lighting_rig": {"input_hash": null, "status": "not_run"},
  "target_web": {"input_hash": null, "status": "not_run"},
  "verify": {"input_hash": null, "status": "not_run"}
}
```

Before running a stage, hash its declared inputs (e.g. `materials`'s input
is `scene/classification.json` plus `scene/brief.yaml`'s
`materials`/`delivery` sections). If the hash matches the recorded one and
`status` is `done`, skip it and say so; otherwise run it.

## Sequence

1. If `scene/brief.yaml` doesn't exist or the user asks to redo intake,
   invoke `/scene-realism:intake`.
2. `/scene-realism:classify`
3. `/scene-realism:materials`
4. `/scene-realism:lighting-rig`
5. `/scene-realism:target-web` (v0.1: web only; a future version will branch
   here on `scene/brief.yaml`'s `targets.offline`/`targets.ar`, invoking
   `target-offline`/`target-ar` once those skills exist — see this plugin's
   `CHANGELOG.md` for what's implemented today)
6. `/scene-realism:verify`

After each stage, report its handoff message before moving to the next —
don't run silently to the end and dump one combined report; the user may
want to intervene between stages (e.g. reject a material choice).

## Handoff

After `verify`, summarize the whole run: what was classified, what
materials were sourced (with license), what the rig chose, and the overall
verify status.
