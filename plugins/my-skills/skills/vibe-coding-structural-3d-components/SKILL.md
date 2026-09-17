---
name: vibe-coding-structural-3d-components
description: Use when generating three.js/React Three Fiber geometry for structural or architectural construction elements (columns, beams, trusses, frames, connections, slabs) and the engineering parameters needed to build them correctly haven't been gathered yet — including when a request just says "make a 3D beam/column/frame" with no section, units, or axis convention specified.
---

# Vibe Coding Structural 3D Components

## Overview

AI-generated geometry for structural elements fails silently on missing
parameters, not missing code. A beam mesh renders fine with wrong units,
wrong local-axis convention, or an invented section profile — it just
doesn't match the real structure. Ask before generating, not after.

## When to Use

- Request involves 3D geometry for a construction/structural element:
  column, beam, brace, truss, slab, wall, foundation, connection/joint.
- Framework is three.js, `@react-three/fiber`, or `@react-three/drei`.
- Any of: section type, dimensions, units, axis convention, or material
  is unstated.

**Skip this** for pure visual/artistic 3D work (no real-world structural
meaning) or when the user has already supplied all fields in the Required
Fields table below in this conversation.

## Required Fields — Ask Before Generating

Ask only for fields not already given or inferable from repo context
(existing frame-config schema, prior messages, project conventions file).
Batch into one question set, don't ask one at a time.

| Field | Why it matters | Example answer |
|---|---|---|
| **Element type(s)** | column vs beam vs truss vs connection need different geometry strategy | "cột chữ nhật, dầm thép hình I" |
| **Section profile** | exact shape: rectangular/circular/custom, or steel standard (W, HSS, IPE, HEA...) | "IPE300" or "300x500mm bê tông" |
| **Dimensions + units** | mm vs m is the #1 silent-failure source | "mm" |
| **Local axis convention** | which axis is member length, which is section depth — must match existing frame-config data if repo has one | "X = length, Y = up (section depth), Z = width" |
| **Repeat count / layout** | single element vs a grid/frame → decides InstancedMesh vs individual meshes | "24 cột lặp lại theo lưới 6x4" |
| **Material/appearance** | steel/concrete/wood visual, or just placeholder gray for now | "bê tông xám, chưa cần PBR thật" |
| **Connections needed?** | joints are the highest AI-error-rate part — flag if geometry must be booleaned/CSG'd, not just placed | "có, dầm-cột góc vuông" |
| **Source of truth** | is this generated parametrically, or loaded from an IFC/GLTF file? | "gen từ code" or "load IFC export" |
| **three.js / R3F version** | pins API surface, avoids version-drift bugs | "three 0.170, r3f 9" |

If the project already has a frame-config data layer (node/member/section
schema), read it instead of asking — reuse its axis convention and units
verbatim. Never invent a convention that conflicts with existing data.

## Generation Strategy

1. **Single element** → parametric geometry function: `(sectionParams) =>
   BufferGeometry`, rebuildable on dimension change. Don't hardcode
   vertices for a shape describable by profile + extrude/lathe.
2. **Repeated elements** (columns in a grid, truss members) →
   `InstancedMesh`, one draw call per element type, not one mesh each.
3. **Real BIM data exists** (IFC file) → don't regenerate geometry by hand;
   load via `web-ifc`/`IFCLoader` and convert to three.js objects.
4. **Connections/joints** → highest error rate for AI-generated code. Write
   the joint geometry yourself first (or verify carefully), then let AI
   polish/refactor — don't let AI invent structural connection logic
   unreviewed.
5. **Iterate one element type at a time**: columns → beams → frame
   assembly → connections. Don't prompt "generate the whole building" in
   one shot; each step should render correctly before the next.

## Quick Reference

| Situation | Approach |
|---|---|
| One-off custom shape | parametric function → `ExtrudeGeometry`/`LatheGeometry` |
| Many identical members | `InstancedMesh` |
| Loading real engineering data | `web-ifc` / `IFCLoader`, not hand-modeling |
| Joint/connection geometry | hand-verify or CSG, review before trusting AI output |
| Ambiguous units/axis | ask — never assume mm vs m or which axis is "up" |

## Common Mistakes

- Assuming units (mm vs m) instead of asking — geometry renders but is
  1000x wrong scale.
- Reinventing an axis convention that conflicts with the project's
  existing frame-config schema.
- Generating one mesh per repeated element instead of `InstancedMesh` —
  fine for a handful, falls over on a real building's column count.
- Letting AI free-generate connection/joint geometry without review —
  this is where structural correctness errors concentrate.
- Prompting for the entire assembly at once instead of one element type
  at a time.
