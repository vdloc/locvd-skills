---
name: lighting-rig
description: Generates a physically-based lighting and post-processing setup (HDRI/IBL, a sun matched to the HDRI, shadows, tone mapping, ambient occlusion) for the chosen delivery target, parameterized by the project's scene brief rather than copied from any one project's numbers. Use after materials, once substances and their metalness are known.
---

# Lighting rig

Produces the environment lighting and post-processing configuration —
never copies fixed numbers from a specific past project.

## Inputs that shape the rig

- `scene/brief.yaml`'s `style.mode`: `realistic-industrial` and
  `product-clean` both want IBL + a directional sun; `stylized` and
  `technical-drawing` may want flat/no lighting instead — check with the
  user before generating a full PBR rig for a style that doesn't call for
  one.
- Whether any classified substance is metallic (from
  `scene/materials.lock.json`'s `physical_values.metallic_factor`) — a
  scene with no metal needs IBL less than one with painted and bare steel
  side by side, but IBL should still default on for `realistic-industrial`.
- The scene's own bounding box (read from the source GLB/three.js scene) —
  used to size the shadow camera frustum and the sun's distance, never a
  hardcoded extent.

## What to generate

1. **HDRI.** A local, bundled HDRI file (never a CDN preset — a scene
   should render the same air-gapped as online). If the project has none,
   ask for one or suggest a Poly Haven HDRI category matching the brief's
   style.
2. **Sun direction.** Extract the HDRI's brightest region's direction
   (documented as a manual, uncalibrated step in
   `docs/RESEARCH-REALISTIC-PIPELINE.md` §E.3 — no standard tool does this
   automatically; state this limitation to the user rather than presenting
   a guess as exact).
3. **Tone mapping.** Exactly one site. If the target renderer chain
   includes a post-processing composer, tone mapping goes inside it, not
   at the renderer level — see `shared/lessons.md`. Default to Khronos PBR
   Neutral for a CAD/product-accuracy brief, AgX for a more photographic
   look — ask which the project wants, they are not interchangeable
   defaults.
4. **Shadows.** A shadow-catcher ground plane sized to the scene's bounding
   box, `shadow.bias`/`normalBias` scaled to the shadow map's texel size
   (not a flat constant — texel size depends on the frustum extent and map
   resolution, both scene-specific).
5. **Ambient occlusion.** Recommend screen-space AO only for the higher
   quality tier in `scene/brief.yaml`'s device-tier answer; skip it
   entirely for the low-end mobile tier.

## Output

Write `scene/rig.json` recording every parameter chosen above (HDRI path,
sun direction, tone-mapping mode, shadow frustum, AO on/off) so
`target-web` can generate code from it deterministically, and so a later
`verify` run can check "did the generated code actually use these
values."

## Handoff

Tell the user the rig choices made (and any the user should confirm, like
the sun direction estimate), and that `/scene-realism:verify` is next
(after a target has produced a deliverable) or `/scene-realism:target-web`
directly.
