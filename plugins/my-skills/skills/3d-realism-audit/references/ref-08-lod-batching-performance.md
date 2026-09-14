# Ref 08 — Level of detail, batching, bottleneck finding, fidelity budget

Sources: **RTR3** Ch 14.7 (LOD generation/switching/selection, hysteresis), 15.2
(locating the bottleneck), 15.4.2–15.4.5 (API calls & small-batch problem, geometry,
lighting, rasterizer optimizations, depth complexity/overdraw).
Audit dimensions: **2.9, 2.10** · pitfalls **P-11.7a/c/d, P-11.8a/b**, new **P-B.25–P-B.28**.
*three.js mapping* lines are not from the books. **Currency note**: RTR3's absolute numbers
(25,000 batches/s per GHz, ~200 tris/batch breakpoint) are 2008 native D3D figures; WebGL
per-call overhead is higher, so treat them as *lower bounds on the problem*, not budgets.

## Core Idea
Realism features multiply per-draw and per-pixel cost, so **find the bottleneck before
optimizing**, then spend the budget where it's visible: fewer, bigger batches (CPU/API),
LOD by screen coverage (geometry), shader LOD and less overdraw (pixels). "A few large
meshes are much more efficient to render than many small ones."

## Frameworks Introduced

- **Locate the bottleneck by perturbing one stage** (RTR3 §15.2)
  - Application/CPU: CPU pegged? profiler; null-driver/upper-bound thinking.
  - Geometry: inflate vertex format / lengthen vertex shader → slower ⇒ geometry-bound.
  - Raster ops: drop output bit depth; **pixel shader: lower resolution** — fps rises ⇒
    fill-rate bound (beware LOD systems that also change with resolution).
  - *three.js mapping*: compare frame time at DPR 1 vs 0.5 (`gl.setPixelRatio`) — no change
    ⇒ CPU/draw-call bound; big change ⇒ shading/post bound.

- **The small-batch problem & "You get X batches per frame"** (RTR3 §15.4.2, Wloka)
  - Fixed CPU overhead per draw call regardless of size; tiny batches starve the GPU
    (2-tri batches ran 375× below GPU max throughput).
  - `X = B·C·U / F` — B ≈ 25,000 batches/s per 1 GHz CPU at 100%, C = GHz, U = CPU fraction
    for draw calls, F = target fps. Example: 3.7 GHz, 40%, 60 fps → **~616 batches/frame**.
  - Breakpoint then ≈ 130–200 triangles per batch; "a few thousand polygons per mesh is
    enough" to keep the GPU busy.
  - Fixes, all "fewer API calls": **merge static objects sharing a material**; per-vertex
    material IDs / texture atlases to merge more; **instancing** for repeated meshes;
    **sort by render state** (shader/texture/material changes are expensive).
  - Don't over-merge into branchy uber-shaders — divergent branches evaluate both sides.

- **LOD pipeline: generation → selection → switching** (RTR3 §14.7)
  - LOD applies to geometry, **textures and shaders** too (drop normal maps/specular far
    away — also removes specular speckle from undersampling, §15.4.5), and fewer skin bones.
  - Far static objects → impostors; baked normal maps preserve shading but silhouettes flatten.

- **Selection metrics** (RTR3 §14.7.2)
  - Range-based `r1 < r2 < …` (last LOD can be empty = cull).
  - **Projected area** of bounding sphere: `p = n·r / (d·(c − v))`, area πp² — resolution-
    and FOV-aware; bounding spheres mis-estimate thin/flat objects (beams, plates) → use
    box projected area.
  - **Hysteresis**: separate up/down thresholds to avoid LOD flicker at a boundary.
  - Importance, motion, focus, global polygon budget as extra factors.

- **Switching without popping** (RTR3 §14.7.1)
  - Discrete: cheapest, pops worst. **Blend LOD** (Giegl–Wimmer): draw current opaque, fade
    next over it (z-test on, z-write off, after opaques), then swap — short transitions.
  - **Alpha LOD**: fade to invisible and stop drawing (needs sorting) — or **screen-door /
    dithered noise dissolve** (no sorting). CLOD / geomorphs: smooth but vertices always move.

- **Geometry & lighting stage** (RTR3 §15.4.3–15.4.4)
  - Indexed static buffers on GPU, lowest safe precision, compressed/quantized vertices,
    cache-friendly vertex order; frustum/occlusion culling "can entirely change performance
    characteristics".
  - **Bake** diffuse lighting for static light+geometry (vertex colors/lightmaps/AO); cull
    lights by distance; replace many lights with an environment map; deferred for many lights.

- **Rasterizer stage & overdraw** (RTR3 §15.4.5)
  - Backface culling on closed meshes (≈50% fewer rasterized tris).
  - **Depth complexity** visualization (additive blend, z off). Opaque overdraw for random
    order averages H(n) = 1 + ½ + … + 1/n (depth 4 → 2.08 draws; 11 → 3.02).
  - Rough **front-to-back sort** or early-z prepass for expensive pixel shaders.
  - Compressed textures in native formats; shader LOD by distance.

## Key Concepts
- **Batch / draw call** — one API submission.
- **Small-batch problem** — CPU per-call overhead dominates.
- **Instancing** — one call, many copies with per-instance data.
- **State sorting** — group by shader/material/texture.
- **LOD selection / switching / hysteresis** — which level / how to change / anti-flicker band.
- **Impostor** — image-based stand-in for distant objects.
- **Depth complexity vs overdraw** — surfaces per pixel vs pixels actually shaded more than once.
- **Early-z pass** — depth-only prepass to skip hidden shading.

## Reference Tables

| Symptom | Likely bound | Test (RTR3) | Fix |
|---|---|---|---|
| fps unchanged at half resolution | CPU / draw calls | lower DPR | merge by material, instance, cull |
| fps scales with resolution | pixel / post | lower DPR | shader LOD, cheaper post, lower post res |
| fps scales with vertex format/count | geometry | inflate vertices | LOD, simplification, culling |
| shadow pass ≈ main pass cost | shadow draws | toggle castShadow | merged/low-LOD proxy casters |

| Technique | Pops | Extra cost | Sorting |
|---|---|---|---|
| Discrete LOD | yes | none | no |
| Blend LOD | no | 2 LODs during transition | faded LOD after opaques |
| Alpha LOD | no | transparency | yes |
| Dither dissolve | no (noisy) | none | no |
| Geomorph / CLOD | no | per-vertex interp | no |

*three.js mapping*: `THREE.LOD` (range-based, `addLevel(obj, distance, hysteresis)`),
drei `<Detailed>`; `InstancedMesh`, `BatchedMesh`, `BufferGeometryUtils.mergeGeometries`;
`renderer.info.render.calls` for the batch count.

## Worked Example — 3362 meshes, 7 materials, 28.6 ms
Current branch (SKILL.md Step 1 baseline): Draco GLB → 3362 meshes sharing 7
`MeshStandardMaterial`s, ~6725 calls/frame (main + shadow), ~423k tris, iGPU, 28.6 ms median.
1. **Batch math**: 423k / 3362 ≈ **126 tris per mesh** — at or below RTR3's 130–200
   API-bound breakpoint, on WebGL (worse overhead). Even RTR3's optimistic ~616 batches/frame
   is exceeded ~11×. Strong prior: CPU/draw-call bound.
2. **Confirm first** (RTR3 §15.2): measure frame time at DPR 1 vs 0.5 and with
   `castShadow` off. If DPR barely changes time but shadows halve it → draw calls.
3. **Merge by material**: static structure + 7 materials → ~7 merged meshes (≈14 calls with
   shadow). Keep per-part identity via a vertex attribute/ID texture if selection/explode needs
   it (RTR3's per-vertex ID trick); or `BatchedMesh` to keep per-object transforms.
4. **Instancing** for true repeats (identical bolts, base plates) if geometry is shared.
5. **Shadow pass**: cast shadows from merged or simplified proxies.
6. **Shader LOD**: bolts far away → drop normal map sampling / specular detail (less
   shimmer too, ref-03).
7. Re-measure: realism features (SSAO, bloom) should be priced *after* batching, not before.

## Anti-patterns
- **Optimizing without locating the bottleneck** — e.g., lowering shadow map res when draw calls dominate.
- **Hundreds of tiny meshes** with identical materials — the classic small-batch trap.
- **Uber-shader with heavy branches** created by over-merging.
- **LOD by bounding-sphere distance for long thin members** — wrong level.
- **No hysteresis** — LOD flicker at thresholds while orbiting.
- **Alpha-faded LODs mixed with unsorted transparents** — sorting artifacts.
- **Unculled far lights / per-object light loops** when env map would do.

## Key Takeaways
1. Measure: resolution test separates pixel-bound from CPU-bound.
2. Draw calls are the first budget; merge by material, instance repeats, sort by state.
3. LOD geometry, textures and shaders by projected size, with hysteresis.
4. Bake what never changes (lighting/AO for static structure) instead of recomputing.
5. Price every realism feature after batching; re-measure each cycle.

## Connects To
- **ref-05**: shadow pass draw cost, proxy casters.
- **ref-03**: texture compression, far-LOD specular aliasing.
- **ref-06**: DPR/AA cost trade.
- Research doc **§9, §11.7, §11.8**.
