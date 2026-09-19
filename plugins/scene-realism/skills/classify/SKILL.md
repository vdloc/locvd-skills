---
name: classify
description: Maps each part in a 3D scene to a real-world substance (painted steel, cast concrete, galvanized steel, glass, fabric, ...) using the project's own classification rules in scene/config.yaml, asking for and recording a new rule whenever a part matches none. Use after intake, or whenever new part types appear in the source.
---

# Classify

Turns a list of parts into a list of (part name, substance) pairs, so
`materials` (next stage) knows what to source PBR textures *for*, and so
`lighting-rig` knows which parts are metal (need an environment reflection)
versus not.

## Rule kind is project-configurable

`scene/config.yaml`'s `classification_rules` is a list of `{match, kind,
substance}` entries. `match` differs by the source kind recorded in
`scene/brief.yaml`:

- **three.js / GLB source:** `kind: name-prefix`, e.g. `match:
  "Steel_Beam_", substance: "painted-steel"`.
- **IFC/BIM source:** `kind: ifc-class`, e.g. `match: "IfcColumn",
  substance: "painted-steel"`. (Full IFC support is staged for a later
  plugin version per the design's Phasing section — this rule kind is
  defined now so a project can start recording IFC rules even before that
  target ships.)

Never assume `name-prefix` is the only kind. If `scene/config.yaml` has no
rules yet (first run), infer a starting set from the detected part names or
IFC classes, present it for confirmation, and write it — this is the same
"detect, then confirm" pattern `intake` uses.

## Handling an unmatched part

A part that matches no rule is **never silently defaulted to a generic
material**. Ask what it is (offer the nearest few real-world substances as
options), then:

1. Add a new rule to `scene/config.yaml` covering it (and, where sensible,
   its likely siblings — e.g. every part sharing its name prefix).
2. Re-run classification so the same question is never asked twice for the
   same kind of part.

## Output

Write `scene/classification.json`:

```json
{
  "parts": {
    "Steel_Beam_L01_A2-A3": "painted-steel",
    "Concrete_Pad_Foundation_A1": "cast-concrete"
  },
  "unclassified": []
}
```

`unclassified` must be empty before handing off to `materials` — if it
isn't, classification isn't done; go back to "Handling an unmatched part."

## Handoff

Tell the user how many parts were classified into how many distinct
substances, and that `/scene-realism:materials` is next.
