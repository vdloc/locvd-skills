---
name: intake
description: Detects a 3D project's source type and existing structure, asks only what can't be inferred (visual style, delivery targets, device tier, whether parts must stay individually selectable/animatable, licensing policy), and writes scene/brief.yaml and a first-cut scene/config.yaml. Use at the start of a scene-realism conversion, or whenever scene/brief.yaml doesn't exist yet or the user wants to redo it.
---

# Intake

Turns "make this scene realistic" into a written, validated
`scene/brief.yaml` inside the **user's project** (never inside this
plugin) — the file every later stage reads instead of re-asking.

## What to detect automatically (never ask these)

1. **Source kind.** Look for: three.js/R3F source files (`*.tsx`/`*.ts`
   importing `three` or `@react-three/fiber`), a `.gltf`/`.glb` file, an
   `.ifc` file, a `.step`/`.stp` file, or a Blender `.blend` file. If more
   than one is present, ask which is the source of truth.
2. **Existing structure.** If the source is a GLB, read its node names and
   any `extras`/custom properties (a `verify_budgets.parse_glb` call, then
   inspect `gltf["nodes"]` and `gltf.get("extensions", {})`) to see whether
   unique names, a type field, and layer/collection grouping already exist.
   If the source is three.js code, grep for a part registry, a `name`
   prop pattern, or a type/layer enum.
3. **Rough scale.** Count nodes-with-a-mesh (draw-call proxy) or,
   for three.js source, count distinct geometry-creating calls.

Present what was detected and ask the user to confirm or correct it in one
message, rather than re-asking for facts already read from the project.

## What to ask (these can't be inferred)

Ask one at a time, multiple-choice where possible:

1. **Visual style** — `realistic-industrial`, `product-clean`, `stylized`,
   or `technical-drawing` (and: does the project need to switch between
   modes at runtime, like an engineering-vs-realistic toggle?).
2. **Delivery targets** — web (glTF/three.js) is assumed on; ask whether
   offline-render or AR export matter too (v0.1 of this plugin only
   *implements* web — see the plugin's `CHANGELOG.md` — but the brief
   should still record the real want for later versions).
3. **Interaction requirement** — must every part stay individually
   selectable? Individually animatable? This is not cosmetic: it decides
   whether later stages may ever join/merge meshes. Default to "yes,
   preserve per-part identity" unless told otherwise — that default is
   reversible, joining meshes after the fact is not.
4. **Device tier** — is a low-end mobile GPU in scope? This sets the
   default `budgets` block (see `shared/budgets.yaml` in this plugin).
5. **Licensing policy** — CC0-only (default; nothing to check later) or
   "allow attribution-required sources" (then `materials` must record and
   surface attribution requirements per chosen asset).

## Writing the brief

Assemble the answers into a `scene/brief.yaml` in the user's project,
following `shared/scene-brief.schema.json` in this plugin
(`${CLAUDE_PLUGIN_ROOT}/shared/scene-brief.schema.json`). Before writing,
validate it:

```bash
python3 -c "
import sys, yaml
sys.path.insert(0, '${CLAUDE_PLUGIN_ROOT}/shared')
from validate_brief import validate_brief
brief = yaml.safe_load(open('scene/brief.yaml'))
errors = validate_brief(brief)
if errors:
    print('\n'.join(errors)); sys.exit(1)
print('brief valid')
"
```

If validation fails, fix the brief and re-run — never hand an invalid brief
to a later stage.

## Writing the first-cut config

`scene/config.yaml` starts with just the `budgets` block, copied from
`shared/budgets.yaml` and overridden per the device-tier answer above; its
`classification_rules` section starts empty and is filled in by `classify`
as it encounters parts (see `skills/classify/SKILL.md`). Do not pre-fill
classification rules here — `intake` doesn't know the project's part
taxonomy yet, `classify` does, incrementally.

## Handoff

Tell the user the brief is written and validated, and that
`/scene-realism:classify` (or `/scene-realism:start` to run the whole
pipeline) is next.
