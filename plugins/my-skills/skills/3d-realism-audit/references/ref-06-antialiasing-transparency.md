# Ref 06 — Sampling theory, antialiasing, transparency & compositing

Sources: **RTR3** Ch 5.6 (sampling/filtering, screen-based AA), 5.7 (transparency, alpha,
compositing). **PBRT3** Ch 7.1 (sampling theory), 7.8 (image reconstruction).
Audit dimensions: **2.8**, transparent parts in **P-11.3e** · pitfalls **P-11.6a/b/c**, new **P-B.8, P-B.9**.
*three.js mapping* lines are not from the books.

## Core Idea
Rendering is point sampling of a non-bandlimited signal (edges, shadow borders, sharp
highlights) — aliasing cannot be eliminated, only traded for blur or noise. Transparency
via the over operator is **order-dependent**; the Z-buffer stores one surface per pixel, so
correctness needs sorting or order-independent tricks.

## Frameworks Introduced

- **Sampling theorem / Nyquist** (RTR3 §5.6.1; PBRT3 §7.1)
  - Sample rate must exceed 2× the signal's max frequency. Geometry edges have effectively
    infinite frequency → no finite sample count fixes it. Textures *are* bandlimitable
    (mipmaps, ref-03).
  - Aliasing sources in a raster: edges, sub-pixel objects, flickering highlights,
    minified textures, temporal (strobing motion).

- **Reconstruction filters** (RTR3 §5.6.1)
  - Box (worst, stair-step) < tent (linear, slope kinks) < sinc (ideal, infinite, negative
    lobes). Practical: windowed/Gaussian-like. Filter area must be 1.
  - **Minification needs a wider filter** (sinc(x/a)): blur first, then resample.

- **Supersampling vs multisampling** (RTR3 §5.6.2)
  - SSAA/FSAA: shade every sample — costly, simple.
  - **MSAA**: coverage/depth per sample, shading once per fragment → fixes geometry edges,
    **not** shader aliasing (specular flicker, alpha-test edges, normal-map sparkle).
  - Sample pattern matters more than count: rotated grid (RGSS) / N-rooks beat regular
    grids for near-horizontal/vertical edges, which humans notice most (Naiman).
  - Stochastic/jittered/interleaved sampling swaps structured aliasing for noise the eye
    forgives. *(Conceptual root of TAA's jitter — P-11.6c.)*
  - **Adaptive refinement**: accumulate more samples while the view is static.
    *three.js mapping*: progressive/accumulated render when camera stops.

- **Resolve in linear space** (RTR3 §5.8 cross-ref)
  - AA weights assume linear radiance; resolving after sRGB encode → roping edges.

- **Over operator & sorting** (RTR3 §5.7)
  - `c_o = α_s c_s + (1 − α_s) c_d`. Render opaque first, then transparent **back-to-front**.
  - Centroid sort per object ≠ correct per pixel; interpenetrating/self-overlapping meshes
    break any object sort.
  - Fallback when sorting is incomplete: **depth test on, depth write off** for transparents
    so all remain visible; optionally render back faces then front faces.
  - Exception: two overlapping layers at α = 0.5 are order-independent.
  - Exact: depth peeling (one pass per layer; stop when a pass writes ~0 pixels).
  - **Screen-door / alpha-to-coverage**: make transparents opaque at subpixel level →
    no sorting; looks best at 50%, only one convincing layer.

- **Premultiplied alpha** (RTR3 §5.7)
  - `c_o = c'_s + (1 − α_s) c_d`; filtering/interpolation is only correct on premultiplied
    colors. Unpremultiplied (e.g., PNG) must be converted before filtering/blending.

- **Filter vs. cover** (RTR3 §5.7)
  - Alpha blending models *coverage*. Physically, colored glass **multiplies** the
    background by transmittance and **adds** its own reflection — needs dual-source blend or
    a transmission path (`MeshPhysicalMaterial.transmission`, used sparingly — P-11.3d).

- **Additive blending** — order-free, good for glow; wrong for transparency (no filtering), saturates when layered.

## Key Concepts
- **Nyquist limit** — half the sampling rate; frequencies above alias.
- **Bandlimited** — no content above a frequency; geometry edges never are.
- **MSAA / CSAA** — per-sample coverage, shared shading.
- **Centroid sampling** — shift shading sample inside coverage; can break derivatives.
- **Depth peeling** — multipass order-independent transparency.
- **Alpha to coverage** — alpha converted to MSAA coverage mask.
- **Premultiplied (associated) alpha** — RGB already scaled by α.

## Reference Tables

| Technique | Fixes | Doesn't fix | Cost | Sorting needed |
|---|---|---|---|---|
| MSAA (context `antialias`) | geometry edges | shader/specular/texture aliasing | memory ×N, shading ×1 | — |
| SSAA / DPR>1 | everything | — | shading ×N² | — |
| Post AA (FXAA/SMAA) | edges in final image | sub-pixel crawl, specular | cheap | — |
| Temporal (TAA) | all, over time | ghosting on discontinuous motion | cheap + history | — |
| Alpha blend (over) | soft transparency | order artifacts | cheap | yes |
| Alpha to coverage | cutout edges (foliage, grating) | >1 layer, non-50% look | MSAA | no |
| Depth peeling | exact OIT | — | 1 pass/layer | no |

## Worked Example — this repo's translucent structural parts
`ROLE_BY_KIND` marks foundation/column/beam as `'translucent'` in flat modes (P-11.3e).
1. Every translucent mesh is a separate draw sorted by three.js per **object** (centroid
   depth) → where a column passes through a beam, per-pixel order is wrong on one side.
2. RTR3 fallback already partly present: `depthWrite={!transparent}` ✓ keeps all visible.
3. Uniform opacity 0.3 is *not* the order-independent 0.5 case → artifacts remain possible.
4. Options by cost: (a) leave as-is once visually confirmed acceptable; (b) `renderOrder` on
   observed bad pairs; (c) opacity 0.5 where the look allows; (d) alpha-to-coverage
   (`alphaToCoverage: true`, needs MSAA) for a dither-like order-free look.
5. Verify with a screenshot where a column visibly penetrates a beam, rotating 180°.

## Anti-patterns
- **Assuming MSAA fixes flicker** — specular/normal-map sparkle is shading aliasing (ref-03 Toksvig).
- **Composer without AA** — render-target pipeline drops context MSAA (P-11.6a).
- **Depth write on transparent parts** — hides whatever renders behind later.
- **Filtering unpremultiplied RGBA** — dark/bright fringes on cutouts.
- **Additive blending for glass** — nothing behind is filtered.

## Key Takeaways
1. Pick AA per aliasing *type*: edges (MSAA/SMAA), shading (roughness filtering), textures (mips/aniso), temporal (TAA, beware ghosting).
2. Resolve and blend in linear.
3. Transparent: opaque first, back-to-front, depth test on / write off; sort errors inside one mesh are unfixable by object sort.
4. Premultiply before filtering alpha content.
5. Humans notice near-horizontal/vertical edge aliasing most — test long beams near axis-aligned.

## Connects To
- **ref-03**: texture minification = the bandlimitable case.
- **ref-01**: linear resolve.
- **ref-08**: DPR and sample count trade against frame budget.
- Research doc **§8, §11.6, §11.3e**.
