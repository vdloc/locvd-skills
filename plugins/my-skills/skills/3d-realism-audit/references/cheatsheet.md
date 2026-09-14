# Cheatsheet — book-grounded decision rules for the realism audit

One page of RTR3/PBRT3 judgment. Each line: **when → do → because**. Detail in `refNN`.

## Order of operations (never violate)
`decode inputs to linear → shade (HDR float) → blend transparents → bloom on HDR → tone map ×1 → grade (LUT) → sRGB encode ×1` (ref01, ref07)

## Decision rules
| When you see… | Do | Because (source) |
|---|---|---|
| Material is metal | `metalness 1`, color = F0 ≥ 0.5 linear (iron 0.56, Al 0.91) | metals have no body term; F0 tables (RTR3 T7.4) |
| Material is non-metal | `metalness 0`, F0≈0.04–0.05, colorless spec; albedo concrete/soil 0.15–0.4 | insulator F0 ≤ 0.05; albedo ranges (RTR3 T7.3, §7.5.4) |
| Surface "not shiny enough" | change **roughness**, never metalness/brightness hacks | NDF dominates appearance (RTR3 §7.6) |
| Distant glossy/normal-mapped parts sparkle | widen roughness in far mips (Toksvig) / specular AA | mipped normals keep narrow lobes (RTR3 §7.8.1) |
| Ground/beams blur into mush at distance | anisotropy up to max | mip footprints are square (RTR3 §6.2.2) |
| Distant textures darker than near | mip/filter in linear | gamma-space filtering (RTR3 §6.2.2) |
| Scene has constant ambient + no AO | replace with IBL/hemisphere + AO | ambient w/o occlusion is flat (RTR3 §8.3, §9.2) |
| HDRI has a visible sun **and** a directional light | drop one or align + reduce env | double key light (RTR3 §8.2 split direct/indirect) |
| Large flat smooth surface reflects env | planar reflection or raise roughness | env maps magnify a sliver on flats (RTR3 §8.4) |
| Shadow stripes on lit faces | slope/normal bias ↑ | acne (RTR3 §9.1.4) |
| Shadows detach at bases | bias ↓, tighten near/far | Peter-Panning (RTR3 §9.1.4) |
| Blocky shadows | fit frustum → casters only → mapSize → cascades | texel≈pixel order of fixes (RTR3 §9.1.4) |
| Uniform soft shadows at ground contact | PCSS or contact shadows | penumbra hardens at contact (RTR3 §9.1.4) |
| SSAO greys flat walls / halos edges | normal-hemisphere SSAO + depth-aware blur | depth-only counts under-surface samples (RTR3 §9.2.5) |
| AO darkens sunlit areas | AO → indirect term only | k_A multiplies ambient/irradiance only (RTR3 eq. 9.16) |
| Composer added | one tone-map site; output/encode pass last; half-float targets; AA pass | ref01/ref06/ref07 |
| Fog chosen | exponential in radial distance, color = horizon | Beer–Lambert; plane fog rotates (RTR3 §10.15) |
| Exposure picked by eye | check vs key 0.18 from log-average luminance | RTR3 eq. 10.8–10.10 |
| Lighting & camera predictable | fixed exposure, no auto-adapt | "clamp+exposure works surprisingly well" (RTR3 §10.11) |
| fps unchanged at half DPR | CPU/draw-call bound → merge/instance | bottleneck test (RTR3 §15.2) |
| Many meshes < ~200 tris sharing materials | merge by material / BatchedMesh | small-batch problem (RTR3 §15.4.2) |
| Transparent overlapping members | depthWrite off, back-to-front; α=0.5 is order-free; else alpha-to-coverage | over operator order (RTR3 §5.7) |

## Thresholds & defaults
| Quantity | Value | Source |
|---|---|---|
| Insulator F0 default | 0.05 (water 0.02, glass 0.03–0.08) | RTR3 T7.3 |
| Metal F0 | ≥ 0.5, usually colored | RTR3 T7.4 |
| Scattering albedo | snow ≥0.8, white paint 0.7, concrete/stone/soil 0.15–0.4, coal ~0 | RTR3 §7.5.4 |
| Point-light validity | distance ≥ 5× emitter width | RTR3 §7.1 |
| sRGB encoding gamma | ≈ 0.45 | RTR3 §5.8 |
| SH irradiance | 9 coeffs ≈ 1%; 4 for indirect-only | RTR3 §8.6.1 |
| CSM split growth | 2–3× depth per cascade | RTR3 §9.1.4 |
| SSAO | ≤16 samples, rotated per 4×4, 4×4 depth-aware blur | RTR3 §9.2.5 |
| Tone key | 0.18 (0.045–0.72) | RTR3 §10.11 |
| Bloom buffer | ½–⅛ res separable Gaussian | RTR3 §10.12 |
| Batch budget (2008 native, optimistic) | ~600/frame; ≥ few-thousand tris/batch | RTR3 §15.4.2 |
| Luminance weights | 0.2127 / 0.7152 / 0.0722 | RTR3 eq. 7.11 |
| Color temps | tungsten 2700 K, halogen 3000 K, D65 6504 K | PBRT3 §12.1 |

## Tells & smells
- **Overlapping lights overbright at overlap** → nonlinear blending somewhere (ref01).
- **Roped / dark-fringed AA edges** → resolve/blend in gamma space (ref01, ref06).
- **Pin-point highlight on a big smooth surface** → point-light approximation too crude; raise roughness or shape highlight (ref04).
- **Round highlight on a flat floor at grazing view** → reflection-vector BRDF / radially symmetric prefilter (ref02, ref04).
- **Crevices glow** → ambient without occlusion (ref04, ref05).
- **Fog changes as camera turns in place** → plane-based depth fog (ref07).
- **Everything glows** → bloom threshold ≤ 1 or LDR input (ref07).
- **fps doesn't care about resolution** → you're paying per draw call (ref08).
