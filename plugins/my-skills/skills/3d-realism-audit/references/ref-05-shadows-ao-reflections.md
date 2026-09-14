# Ref 05 — Shadow maps, ambient occlusion, planar & local reflections

Sources: **RTR3** Ch 9.1.4 (shadow maps: bias, second-depth, resolution, warping, cascades,
PCF, PCSS, VSM, deep/opacity maps), 9.1.5 (shadow optimizations), 9.2 (ambient occlusion
theory, bent normals, obscurance, interreflection correction, SSAO), 9.3 (planar & curved
reflections).
Audit dimensions: **2.4, 2.5, 2.6** · pitfalls **P-11.4a–f, P-11.2e/f, P-11.5c/d**, new **P-B.16–P-B.20**.
*three.js mapping* lines are not from the books — verify against the installed version.

## Core Idea
Shadows and occlusion are the main cues for **spatial relationship and contact**. Shadow
maps trade exactness for speed: every artifact (acne, Peter-Panning, blockiness, shimmer,
leaks) comes from comparing point samples of depth at mismatched rates. Ambient occlusion
is "shadowing of ambient light" — without it indirect light is flat — but it is an
approximation that over-darkens and must not be applied to direct light.

## Frameworks Introduced

- **Shadow acne vs. Peter-Panning — the bias trade** (RTR3 §9.1.4)
  - Acne: light's depth sample represents an area, so the receiver self-shadows (moiré).
    Constant bias fails at grazing light angles → **slope-scaled bias** grows as the surface
    tilts away. No perfect setting; tune per scene.
  - Too much bias → shadow detaches ("Peter Panning", objects hover).
  - Improve precision first: **near plane as far, far plane as close** as the scene allows.
  - PCF widens the footprint → more acne; slope bias doesn't fix it; bias samples toward the
    receiver (cone-shaped sampling).

- **Second-depth (back-face) shadow maps** (RTR3 §9.1.4)
  - Render only back faces into the shadow map → front faces can't self-shadow.
  - Breaks for two-sided cutouts (fence, frond), thin objects near silhouettes, non-watertight
    meshes (don't cast fully), and **objects in contact** (light leaks — back face farther
    than receiver). Woo's midpoint (average of two nearest depths) fixes most, costs a pass.
  - *three.js mapping*: `material.shadowSide` (default back faces for single-sided materials).

- **Shadow texel ≈ screen pixel** (RTR3 §9.1.4, Resolution Enhancement)
  - **Perspective aliasing**: eye close to receiver, light far → texels magnified (blocks).
    **Projective aliasing**: receiver edge-on to light but facing viewer → stretched texels.
  - Order of fixes: fit light frustum to what the camera sees → restrict to *casters* →
    raise resolution → warp (LiSPSM/TSM; unstable, fails with "dueling frusta") →
    **cascades**.
  - **Cascaded / parallel-split shadow maps**: split view frustum; each split's depth range
    ≈ **2–3× the previous**; four 1024² beat one 2048² for wide views. Robust, scalable.
  - **Shimmer on camera move**: snap the shadow frustum to world-space texel increments.
  - Omni (point) lights need 6-view cube shadow maps; seams are the challenge.

- **Percentage-closer filtering (PCF)** (RTR3 §9.1.4)
  - Filter the **comparison results**, never average depths (mipmapping a depth map is
    meaningless). Constant kernel → uniform penumbra everywhere — **wrong at contact**:
    real shadows are sharp at contact, softer with distance.
  - **PCSS**: blocker search → `w_sample = w_light · (d_r − d_o)/d_r` → variable penumbra.
  - Regular sample grids band; **Poisson disk, randomly rotated per pixel** turns banding
    into noise (rotation pattern fixed in screen space can crawl when the view moves).

- **Variance shadow maps (VSM)** (RTR3 §9.1.4)
  - Store depth and depth² → filterable (blur, mip, MSAA). `p_max = σ²/(σ² + (t − M1)²)`,
    `σ² = M2 − M1²`. Soft for free.
  - **Light bleeding** with multiple overlapping occluders at different depths. Remap
    low p to 0 (narrows penumbra). Needs float targets. Good for terrain; risky for dense
    lattices/stacked members. ESM (exponential) reduces bleeding.

- **Shadow cost optimizations** (RTR3 §9.1.5)
  - Low-LOD proxy shadow casters; cull lights by influence volume; lights inside the
    frustum only need in-frustum casters (not true for lights outside); coalesce distant lights.
  - Shadows are hard to judge for correctness → shortcuts are rarely noticed; **absence**
    of contact shadow is noticed.

- **Ambient occlusion definition** (RTR3 §9.2.1–9.2.2)
  - `k_A = (1/π) ∫ v(l) cosθ dω` ∈ [0,1]; creases dark, and orientation matters (unoccluded
    directions near the normal count more).
  - Shading: `L_o = c_amb/π ⊗ k_A·πL_A + Σ v(l_k) f ⊗ E_Lk cosθ` → **k_A multiplies only the
    indirect term**; direct lights use their own shadows.
  - **Bent normal** = cosine-weighted mean unoccluded direction; use it to index the
    irradiance map (ILM). AO on glossy/specular env is incorrect but sometimes acceptable.
  - Include the **ground plane** in the visibility test → AO doubles as contact shadow.

- **Obscurance & interreflection correction** (RTR3 §9.2.3–9.2.4)
  - Pure visibility fails in closed spaces (everything k_A = 0). **Obscurance** ρ(distance):
    0 at contact → 1 beyond `d_max` — practical, faster, hand-tuned d_max.
  - AO is darker than GI because blocked directions aren't black. Stewart–Langer brighten:
    `k'_A = k_A / (1 − c_amb(1 − k_A))` — high-albedo surfaces get less darkening.

- **Screen-space AO (Crytek SSAO)** (RTR3 §9.2.5)
  - Z-buffer-only sphere sampling; ≤ ~16 samples/pixel though ~200 needed → rotate pattern
    per 4×4 block → noise → **depth-aware 4×4 blur** (don't blur across discontinuities).
  - Depth-only sampling counts samples *under* the surface → **flat surfaces darken, edges
    brighten**; fix with normals (hemisphere) or clamp ratio ≤ 0.5 ×2.
  - Screen-space only sees visible depth: occluders off-screen or behind vanish.
  - Unsharp-masked depth (Luft) = cheap, stylized pseudo-AO.

- **Planar reflections** (RTR3 §9.3.1)
  - Reflect camera (or geometry) through the plane, **clip at the plane** (user clip plane)
    so objects behind the mirror don't appear, **stencil to the reflector's footprint**, flip
    culling winding, reflect lights too. Fade reflected objects with distance from plane for
    realism; normal-map the lookup for rippled water. Recursive reflections via previous
    frame's env maps.

## Key Concepts
- **Shadow acne / Peter-Panning** — under- / over-biased depth comparison.
- **Slope-scaled bias / normal offset** — bias grows with tilt from light.
- **Perspective vs projective aliasing** — magnified vs stretched shadow texels.
- **CSM / PSSM** — depth-split cascades.
- **PCF / PCSS / VSM / ESM** — filtered comparison / variable penumbra / variance / exponential.
- **Umbra / penumbra** — full vs partial occlusion of an area light.
- **Ambient occlusion k_A / bent normal / obscurance** — see above.
- **Contact shadow** — occlusion right at touching surfaces.

## Reference Tables

| Artifact | Cause | First fix (RTR3) |
|---|---|---|
| Moiré/stripes on lit faces | acne (under-bias) | slope-scaled bias / normal offset |
| Shadow detached from base | Peter-Panning (over-bias) | reduce bias; tighten near/far |
| Blocky edges near camera | perspective aliasing | fit frustum to view & casters → resolution → cascades |
| Shadows swim when orbiting | frustum refits each frame | snap to texel grid |
| Light through joints/contacts | second-depth leak, thin geometry | front faces + bias, thicker proxies |
| Uniformly blurry shadows | constant PCF kernel | PCSS or smaller kernel near contact |
| Lit areas inside stacked shadows | VSM bleeding | PCF, ESM, or bleed remap |
| Flat surfaces grey, edges halo | depth-only SSAO | normal-hemisphere SSAO, clamp, depth-aware blur |
| Crevices black vs photo | AO ignores interreflection | Stewart–Langer k'_A, obscurance |

| Shadow technique | Soft | Contact-hardening | Cost | Failure |
|---|---|---|---|---|
| Hard map | no | — | 1 tap | aliasing |
| PCF (fixed) | uniform | no | N taps | acne, uniform blur |
| PCSS | yes | **yes** | search + N taps | noise, cost |
| VSM | yes | with SAT | 1 tap + blur | light bleeding |

*three.js mapping*: `BasicShadowMap` (hard), `PCFShadowMap`, `PCFSoftShadowMap`, `VSMShadowMap`;
`shadow.bias`, `shadow.normalBias`, `shadow.radius` (PCF/VSM), `shadow.blurSamples` (VSM);
no built-in CSM (addons `CSM`). Drei `ContactShadows` / `AccumulativeShadows` = baked/approx contact.

## Worked Example — steel frame on a site, sun shadow audit
Current branch: one `directionalLight castShadow`, tight frustum, texel-scaled normalBias,
`PCFSoftShadowMap`, `ContactShadows` when `quality === 'high'`, no ground slab.
1. **Frustum fit** ✓ tight to model bounds (RTR3's first fix). Static fit → no shimmer; if
   the frustum ever follows the camera, snap to texel grid.
2. **Bias**: texel-scaled normalBias is the slope-scale idea ✓. Verify at low sun angle —
   acne appears first on the long flange faces nearly parallel to the light.
3. **Contact**: base plates/columns meet the ground; PCF soft kernel is uniform → bases
   look slightly floating. `ContactShadows` supplies contact darkening — but only on `high`;
   on `balanced` (the stuck default) there's no contact cue → squint-test "Grounded?" fails.
4. **Leaks**: bolts through plates, beams into columns = contact/interpenetration → watch for
   light slivers at connections if `shadowSide` renders back faces.
5. **AO**: no SSAO/baked AO; connection nodes and beam-column pockets should be darkest
   indirect regions. RTR3: AO multiplies **only** env/ambient, never the sun. Include ground
   in AO so it doubles as contact shadow when SSAO is added.
6. **ambientLight + no AO** = RTR3 §8.3/§9.2 flatness pair — fix together.
7. **Count**: shadow pass doubles draw calls (measured ~6725 total) — low-LOD proxy
   casters (merged members) are RTR3's optimization.

## Anti-patterns
- **Averaging/mipmapping depth maps** — meaningless occlusion.
- **Constant bias everywhere** — acne at grazing or floating objects.
- **Raising mapSize before fitting the frustum** — wastes texels (P-11.4b).
- **Fixed-width soft shadows at contact** — floating look.
- **AO applied to direct light or specular** — dirty, double-shadowed look.
- **Depth-only SSAO without normals** — grey flat walls, bright halos.
- **VSM on dense overlapping lattices** — bleeding.
- **Planar reflection without clip plane/stencil** — impossible reflections visible outside the mirror.

## Key Takeaways
1. Fit shadow frustum to receivers/casters, tighten near/far, *then* resolution, then cascades.
2. Bias is slope-dependent and scene-tuned; check grazing faces and contact points.
3. Real penumbrae harden at contact — use PCSS/contact shadows where objects touch the ground.
4. AO modulates indirect only; include ground; correct over-darkening on bright albedo.
5. Screen-space AO needs normals and depth-aware blur; it can't see off-screen occluders.

## Connects To
- **ref-04**: which light is direct (shadowed) vs indirect (AO'd).
- **ref-06**: PCF sampling patterns = stochastic sampling.
- **ref-08**: shadow pass draw-call cost, proxy casters.
- Research doc **§5, §6, §11.4, §11.5c/d**.
