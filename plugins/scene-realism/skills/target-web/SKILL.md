---
name: target-web
description: Packages a scene's geometry, the materials.lock.json textures, and the lighting rig into a web deliverable — a GLB (with Draco/meshopt and KTX2/WebP recommendations from verify) plus three.js/react-three-fiber loading and lighting code. Use once materials and lighting-rig have both produced their output files, to produce the actual web-facing artifact.
---

# Target: web (three.js / react-three-fiber)

Turns `scene/materials.lock.json` and `scene/rig.json` into the actual
deliverable: a packaged GLB and the three.js/R3F code that loads and lights
it.

## Packaging the GLB

Do not join, flatten, instance, or palette meshes unless
`scene/brief.yaml`'s `interaction.parts_individually_selectable` is
`false` — those operations are opt-in exactly because they can destroy
per-part selection or animation (see `shared/lessons.md` and
`docs/RESEARCH-REALISTIC-PIPELINE.md` §C.3/§C.4 for why `gltf-transform
optimize` itself defaults them off).

Recommend, rather than unconditionally apply, compression choices based on
what `verify` measured:

- If `verify`'s `gpu_texture_mb` gate warned or failed, recommend KTX2
  (Basis Universal) over WebP/JPEG/PNG for the textures — WebP still ships
  fully decompressed to the GPU (see
  `docs/RESEARCH-REALISTIC-PIPELINE.md` §C.2), so it does not fix a
  texture-memory budget problem the way KTX2 can.
- Recommend Draco or meshopt for geometry compression per that same
  research section's trade-off table; do not silently pick one — ask which
  the project prefers if both are viable, since the trade-off (decode cost
  vs. compression ratio) depends on the target device tier already
  recorded in the brief.

## Generating loading and lighting code

Generate three.js/R3F code (not this plugin's own runtime — the code is
written *into the user's project*) that:

1. Loads the GLB with the appropriate loader (Draco/meshopt decoder paths
   matching whatever `scene/rig.json` and the packaging step above chose).
2. Sets up the HDRI, sun, shadow, tone-mapping, and AO exactly as recorded
   in `scene/rig.json` — the generated code's job is to *apply* `rig.json`,
   not to reinterpret or re-derive it.
3. Uses `frameloop="demand"` (R3F) with a whole-store invalidate pattern if
   the project already has a state store — read the existing project's
   state-management pattern first rather than introducing a new one.

## Handoff

Tell the user the GLB was written (path + size), which compression choices
were applied or recommended-but-deferred, and that
`/scene-realism:verify` should run against the result next.
