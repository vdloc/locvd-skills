# Ref 04 — Light sources, area lights, IBL / environment & ambient lighting

Sources: **RTR3** Ch 8.2 (area lights, vector irradiance, wrap lighting), 8.3 (ambient),
8.4–8.5 (environment maps, glossy prefiltered reflection maps), 8.6 (irradiance maps,
spherical harmonics, fill lights, hemisphere lighting). **PBRT3** Ch 12.1 (blackbody, color
temperature, standard illuminants), 12.3–12.6 (point, spot, distant, area, infinite area lights).
Audit dimensions: **2.2, 2.6** · pitfalls **P-11.2a–f, P-11.7b, P-11.8d**, new **P-B.12–P-B.15**.
*three.js mapping* lines are not from the books — verify against the installed version.

## Core Idea
Split lighting the way both books do: **direct light** = few small, high-radiance sources
(sun key light, casts shadows); **indirect light** = low-frequency radiance over the whole
hemisphere (sky/environment, bounce). A scene with no indirect term looks unreal — shadowed
sides go black. Use prefiltered environment maps for glossy specular (indexed by
reflection vector) and an irradiance representation for diffuse (indexed by normal).
Every environment representation assumes **distant** lighting.

## Frameworks Introduced

- **Point/directional = approximations of area lights** (RTR3 §8.2)
  - Error grows with (a) light's solid angle from the surface and (b) surface glossiness.
    Small/far light or rough surface → approximation fine.
  - Lambertian: point light is *exact* via vector irradiance **until part of the area light
    drops below the horizon**; all Lambert differences are occlusion differences.
  - Glossy: highlight should take the **shape of the source**, edge blurred by roughness.
    A pin-point highlight on a very smooth surface is a realism tell.

- **Wrap lighting** (RTR3 eq. 8.16–8.17)
  - `E = E_L · max((cosθ + c_wrap)/(1 + c_wrap), 0)`, c_wrap 0 (point) → 1 (full hemisphere).
    Cheap area-light / subsurface look; shadows can cancel it unless softened.

- **Ambient term and its flatness** (RTR3 §8.3)
  - Constant ambient `c_amb ⊗ L_A` ignores direction *and* occlusion → "extremely flat".
    Ambient without occlusion is the #1 flat-look cause → pair with AO (ref-05).

- **Environment mapping assumptions** (RTR3 §8.4)
  - Incoming radiance depends only on direction → reflected objects/lights far away, no
    self-reflection. Store **HDR** (radiance ≫ 1).
  - **Flat surfaces reflect a tiny, magnified patch** of the env map → blurry/blocky; with
    orthographic cameras a flat mirror is one texel. Use planar reflections for floors/water.
  - Mirror Fresnel uses θ between v and n (not half vector).
  - Latitude-longitude maps oversample poles and have a seam; cube maps are uniform and
    view-independent. Localize with a proxy box (parallax-corrected cube map) for interiors.

- **Prefiltered glossy reflection maps** (RTR3 §8.5)
  - Store env map convolved with increasingly wide lobes in successive mip levels; pick
    level from roughness. Filter across cube faces (GPU won't).
  - Use the **coarser** of (roughness level, hardware minification level) to avoid aliasing.
  - Radially symmetric prefiltering is wrong at grazing angles and on **flat floors**
    (should stretch — half-vector behavior, ref-02) and ignores the horizon cut.
  - Importance-sampled filtering (Colbert & Křivánek, 20–40 taps) supports arbitrary BRDFs.
  - *three.js mapping*: PMREM (`PMREMGenerator`) = this prefiltered mip chain for GGX.

- **Irradiance environment maps / SH9** (RTR3 §8.6, §8.6.1)
  - Diffuse lighting = env map convolved with clamped cosine over the hemisphere, indexed by
    **normal**, very low resolution OK.
  - **9 RGB SH coefficients ≈ 1% accuracy** (Ramamoorthi–Hanrahan); 4 (bands 0–1) often
    enough for indirect-only. Radiance→irradiance = per-band constant scaling.
  - SH ringing: color shifts/bright blobs on the dark side under extreme, high-contrast
    lighting (a sun baked into the env) — fine when env holds indirect only.
  - Dynamic env maps for irradiance can be tiny, but small bright sources "fall between
    texels" and flicker → render them as large cards.
  - *three.js mapping*: `LightProbe` / SH irradiance; PMREM lowest-roughness mips double as diffuse.

- **Separate direct from indirect** (RTR3 §8.2 end)
  - Direct: small solid angle, high radiance → analytic lights + shadow maps.
    Indirect: broad, moderate → env/irradiance maps. Even offline renderers split them.
  - Corollary: **don't leave the sun in the HDRI and also add a sun directional light** —
    double-counted key light, or unshadowed sun specular from the env.

- **Fill lights, hemisphere, ambient cube** (RTR3 §8.6.2–8.6.3)
  - Fill lights (no specular) beat constant ambient: shading varies with orientation.
    Three-point: key, fill, rim. Bidirectional: fill = negated key.
  - **Hemisphere light**: `E = π[(1+cosθ)/2 · L_sky + (1−cosθ)/2 · L_ground]` — cheap two-color
    irradiance for outdoor sky + ground bounce. *three.js mapping*: `HemisphereLight`.
  - Ambient cube (Valve): 6 irradiance values blended by n².

- **Light color from physics** (PBRT3 §12.1)
  - Tungsten ~2700 K, halogen ~3000 K, fluorescent 2700–6500 K, D65 daylight ≈ 6504 K
    (mid-day European sun). >5000 K "cool", 2700–3000 K "warm". Illuminant A ≈ 2856 K.
  - Blackbody exitance ∝ T⁴ (Stefan–Boltzmann): doubling T → 16× energy.

- **Light power bookkeeping** (PBRT3 §12.3–12.4)
  - Point: Φ = 4πI. Spot: Φ ≈ 2πI(1 − ½(cos falloffStart + cos totalWidth)); cone solid angle
    = 2π(1 − cosθ). Narrowing a spot at fixed *intensity* reduces power; at fixed *power*
    raises intensity — decide which the artist is tuning.
  - Distant light: shadow ray extent 2× scene bounding-sphere radius.

## Key Concepts
- **Solid angle ω_L** of a light — decides point vs. area treatment.
- **Vector irradiance** — summed incoming radiance vectors; turns Lambert area lights into a point light.
- **Environment map / light probe** — directional HDR radiance table.
- **Reflection map** — env map prefiltered by a BRDF lobe (outgoing radiance).
- **Irradiance map** — cosine-convolved env map (indexed by normal).
- **Spherical harmonics / zonal harmonics** — orthonormal sphere basis; SH9 for irradiance.
- **Fill / key / rim light** — cinematic three-point roles.
- **Color temperature** — blackbody temperature matching a source's spectrum.

## Reference Tables

| Need | Representation (RTR3) | Indexed by | Resolution | *three.js mapping* |
|---|---|---|---|---|
| Mirror/glossy specular | prefiltered cube mip chain | reflection vector + roughness | high | `scene.environment` → PMREM |
| Diffuse indirect | irradiance map / SH9 | normal | very low / 9 coeffs | PMREM low mips / `LightProbe` |
| Outdoor cheap indirect | hemisphere two-color | normal·up | 2 colors | `HemisphereLight` |
| Floor/water mirror | planar reflection | — | screen | `Reflector` / `MeshReflectorMaterial` |
| Sun | directional + shadow map | — | — | `DirectionalLight castShadow` |

| Source | Color temp (PBRT3) |
|---|---|
| Tungsten incandescent | ~2700 K |
| Tungsten halogen | ~3000 K |
| Fluorescent | 2700–6500 K |
| Illuminant A | 2856 K |
| D65 daylight | ~6504 K |

## Worked Example — outdoor steel frame: HDRI + sun
Current branch: local HDRI `<Environment files background>`, one `directionalLight
castShadow`, `ambientLight` fill, FogExp2.
1. **Double key?** Inspect the HDRI: if it contains a visible sun disc, the env already
   delivers unshadowed sun specular/diffuse, and the directional light adds a second sun.
   Either use a sun-less (or sun-clipped) HDRI with the directional light as key, or align
   the directional light to the HDRI sun direction and reduce env intensity.
2. **Ambient light on top of IBL** = constant, unoccluded, direction-less extra — RTR3 §8.3's
   flatness. Prefer removing `ambientLight`, or replace with `HemisphereLight` tinted
   sky/ground, and let AO handle crevices.
3. **Ground slab/flat plates** reflect a magnified sliver of the env (RTR3 §8.4): if a
   polished slab is wanted, planar reflection; for rough concrete, IBL is fine.
4. **Sun color**: directional light near white for D65 noon; warm (≈3000–4000 K look) only for
   low sun — and then the sky HDRI must also be a low-sun capture, or colors disagree.
5. **Smooth galvanized highlights** should show the sun's shape, not a pin-prick: roughness
   too low on large flat steel → increase or accept an env-driven glint.

## Anti-patterns
- **Constant ambient as the only indirect** — flat, crevices glow.
- **Sun in HDRI + directional sun** — double key, conflicting shadows.
- **Radially-blurred env on flat floors** — round, wrong reflections.
- **LDR (8-bit) environment maps** — highlights and sky clip; no real HDR reflections.
- **Low-res dynamic probe with small bright lights** — flicker/dropout.
- **Treating nearby large lights as points** (<5× size away) — hard shadows and pin highlights where soft/shaped expected.
- **Mixing color temperatures without intent** — warm key with noon-blue sky reads fake.

## Key Takeaways
1. Direct = few analytic lights with shadows; indirect = env/irradiance. Never double-count.
2. Constant ambient without occlusion is flat — replace with IBL/hemisphere + AO.
3. Environment reflections assume distance; flat and nearby surfaces need other techniques.
4. Roughness selects prefiltered mip; take the coarser of roughness and minification level.
5. Match light color temperature to the environment capture.

## Connects To
- **ref-05**: shadows for direct, AO for indirect occlusion.
- **ref-02**: prefiltering uses the material NDF; Fresnel scales env specular.
- **ref-07**: HDR env radiance needs exposure/tone mapping.
- Research doc **§4, §11.2**.
