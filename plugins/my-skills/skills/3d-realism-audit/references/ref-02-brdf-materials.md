# Ref 02 — BRDFs, Fresnel, microfacets, material parameters

Sources: **RTR3** = *Real-Time Rendering* 3rd ed. (Akenine-Möller, Haines, Hoffman), Ch 7.5–7.6, 7.8.1.
**PBRT3** = *Physically Based Rendering* 3rd ed. (Pharr, Jakob, Humphreys), Ch 8.2.1, 8.3–8.5, 9.2.2.
Audit dimensions served: **2.2, 2.3** and pitfalls **P-11.3a/b**, new **P-B.1–P-B.5**.

Lines tagged *three.js mapping* are not from the books — they tie the book concept to
`MeshStandardMaterial`/`MeshPhysicalMaterial` and must be re-verified against the installed
three.js version before being quoted as fact.

## Core Idea
A material is a BRDF: specular (surface) reflectance controlled by Fresnel + a microfacet
normal distribution, plus diffuse (body) reflectance from subsurface scattering. Realism
comes from *physically meaningful, normalized parameters* in plausible ranges — not from
tuning a highlight until it "looks shiny".

## Frameworks Introduced

- **BRDF constraints — Helmholtz reciprocity + energy conservation** (RTR3 §7.5.1)
  - When to use: sanity-checking any custom shader / `onBeforeCompile` patch.
  - How: directional-hemispherical reflectance R(l) = ∫ f(l,v) cosθo dωo must be ≤ 1 for
    every l. Real-time needs *approximate* conservation; gross violation reads "too bright".
    BRDF *values* may exceed 1 (tight highlights); reflectance may not.

- **Surface vs. body reflectance** (RTR3 §7.5.2, §7.5.4)
  - Surface (specular) = Fresnel at the interface, never absorbs. Body (diffuse) = light
    that entered, scattered, and re-emerged. Metals have **no body term** (transmitted light
    absorbed within ~0.1 µm — PBRT3 §8.2.1). Insulators: body term usually dominates visually.
  - Diffuse color and specular color are different physical processes → can differ in
    color (colored plastic: white specular, pigment-colored diffuse).

- **Schlick Fresnel** (RTR3 eq. 7.33; PBRT3 §8.5)
  - `F(θ) ≈ F0 + (1 − F0)(1 − cosθ)^5`. F0 = characteristic specular color at normal
    incidence. Curve barely moves until ~60°, then rises to white at 90°.
  - In microfacet BRDFs evaluate with the **half-vector angle** αh (l·h), not n·l.
  - F0 from IOR (n1 = air ≈ 1): `F0 = ((n−1)/(n+1))²`.
  - Weak spot: metals with a pre-grazing dip (aluminum, iron) — use a 1D LUT if color shift
    matters.

- **Microfacet (Torrance–Sparrow) BRDF** (RTR3 §7.5.6; PBRT3 §8.4.4)
  - `f = D(h) · G(l,v) · F(αh) / (4 cosθi cosθo)`.
  - D = normal distribution function (NDF) — **most important term for appearance**;
    presence of F next; visibility/G least (Ashikhmin's analysis, RTR3 §7.6).
  - Derivation is independent of the NDF and Fresnel choice → same form for metals and
    dielectrics.

- **NDF choice: Trowbridge–Reitz vs. Beckmann** (PBRT3 §8.4.2)
  - Trowbridge–Reitz has **longer tails** (falls off slower away from n) and matches many
    real surfaces well. *three.js mapping*: this is GGX, the NDF in `MeshStandardMaterial`.
  - Anisotropic variants use αx, αy interpolated on an ellipse; need consistent tangents.

- **Smith masking-shadowing** (PBRT3 §8.4.3)
  - `G1(ω) = 1/(1+Λ(ω))`; Trowbridge–Reitz `Λ = (−1 + √(1 + α² tan²θ))/2`.
  - Separable `G1(o)·G1(i)` **underestimates** G; height-correlated
    `G = 1/(1 + Λ(o) + Λ(i))` is the accurate default. Rougher α → G falls to 0 faster at
    grazing.

- **BRDF normalization** (RTR3 §7.6)
  - Multiply a lobe so its color parameter equals its max reflectance. Without it,
    changing roughness silently changes brightness — tighter highlight loses energy.
    Normalized Blinn-Phong: `(m+8)/(8π) · cos^m θh`. Always use normalized forms; cost is ~0.

- **Half-vector over reflection-vector** (RTR3 §7.5.7)
  - Half-vector BRDFs elongate highlights at glancing angles on flat surfaces — matches
    photographs; reflection-vector (Phong) gives wrong round highlights on floors/slabs.

- **Fresnel-coupled diffuse** (RTR3 §7.5.4; PBRT3 §8.5 FresnelBlend)
  - Light reflected at the surface is unavailable to the body: `c_diff = (1 − c_spec)·ρ`,
    or angle-dependent `(1 − F(θi))·ρ/π`. Glossy-coat-over-diffuse (varnish, paint) goes
    specular-dominated toward grazing.

- **Oren–Nayar rough diffuse** (RTR3 eq. 7.57; PBRT3 §8.4.1)
  - Lambert looks wrong for rough matte (concrete, soil, moon): real rough surfaces
    retro-reflect and look flatter. σ = std-dev of facet angle; σ≈0.52 rad (30°) = "very
    rough". *three.js mapping*: not built in; Lambert diffuse only.

## Key Concepts
- **F0 / RF(0°)** — specular reflectance at normal incidence; the only Schlick parameter.
- **Scattering albedo ρ** — fraction of entering light that escapes; body color.
- **NDF D(h)** — distribution of microfacet normals; roughness lives here.
- **Geometry / visibility term** — G/(cosθi cosθo); shadowing + masking + foreshortening.
- **Dielectric / conductor** — real IOR (1–3) vs complex IOR η+ik.
- **Critical angle / TIR** — `sinθc = n2/n1`; internal reflection only in insulators.
- **SVBRDF** — BRDF whose parameters vary over the surface (texture-driven).
- **Meso vs. micro scale** — triangles (macro) → textures/normal maps (meso) → BRDF (micro,
  sub-pixel). Which scale a detail lives at depends on viewing distance (RTR3 §7.8.1).

## Reference Tables

F0 — insulators (RTR3 Table 7.3):

| Material | F0 linear | F0 sRGB |
|---|---|---|
| Water | 0.02 | 0.15 |
| Plastic / glass (low) | 0.03 | 0.21 |
| Plastic (high) | 0.05 | 0.24 |
| Glass (high) / ruby | 0.08 | 0.31 |
| Diamond | 0.17 | 0.45 |

Unknown insulator default: **0.05** (RTR3). *three.js mapping*: `MeshStandardMaterial`
uses 0.04 for `metalness=0` (`ior` 1.5 on `MeshPhysicalMaterial`) — close enough; don't fight it.

F0 — metals (RTR3 Table 7.4), linear RGB:

| Metal | F0 linear | sRGB |
|---|---|---|
| Gold | 1.00, 0.71, 0.29 | 1.00, 0.86, 0.57 |
| Silver | 0.95, 0.93, 0.88 | 0.98, 0.97, 0.95 |
| Copper | 0.95, 0.64, 0.54 | 0.98, 0.82, 0.76 |
| Iron | 0.56, 0.57, 0.58 | 0.77, 0.78, 0.78 |
| Aluminum | 0.91, 0.92, 0.92 | 0.96, 0.96, 0.97 |

Metals: F0 almost always ≥ 0.5. *three.js mapping*: with `metalness=1`, `color` **is** F0 →
bare/galvanized steel ≈ iron row, not white, not mid-grey below 0.5.

IOR (PBRT3 Table 8.1): ice 1.31, water 1.333, fused quartz 1.46, glass 1.5–1.6,
sapphire 1.77, diamond 2.42.

Scattering albedo ρ (diffuse reflectance) (RTR3 §7.5.4): fresh snow ≥ 0.8, white paint
≈ 0.7, **concrete / stone / soil 0.15–0.4**, coal ≈ 0.

## Worked Example — auditing a steel-frame material set
Scene: galvanized steel beams, concrete footings, painted bolts (this repo's GLB).

1. **Classify** each material: steel = conductor → `metalness 1`, no diffuse; concrete and
   paint = insulators → `metalness 0`.
2. **Specular color**: steel `color` ≈ linear (0.56, 0.57, 0.58) (iron row). A value of
   0.45/0.60 metalness (current bolt/weld factors) is a blend of two physical regimes —
   flag under P-11.3a unless it's a texel-edge transition.
3. **Diffuse color**: concrete albedo linear 0.15–0.4. If the base color texture's mean,
   *after* sRGB decode, is > 0.5 linear, the concrete will glow under IBL — flag P-B.2.
4. **Roughness carries finish**, not metalness: galvanized ≈ rough, fresh paint smoother.
5. **Check highlight shape** on the flat ground/slab at a grazing camera: half-vector
   BRDF must elongate highlights (GGX does); a round glint indicates a custom Phong patch.

## Anti-patterns
- **Mid metalness as "shininess"** — metals and dielectrics are different regimes (no body term vs. body term).
- **Albedo > ~0.9 or < ~0.02 on ordinary surfaces** — breaks energy balance; too bright under IBL, or unnaturally black.
- **Colored F0 on insulators** — insulator specular is colorless; color comes from body.
- **Un-normalized lobes** in custom shaders — roughness edits change brightness.
- **Porting academic BRDFs without the π factor** — real-time lights often fold 1/π into light intensity; a paper BRDF may need ×π (RTR3 §7.5.4).
- **Dropping Fresnel** (Ward-style constant specular) — surfaces diverge from real materials at grazing.

## Key Takeaways
1. Metals: `metalness 1`, color = F0 ≥ 0.5 (tabled). Insulators: `metalness 0`, F0 ≈ 0.04–0.05, colorless.
2. Diffuse albedo for rough building materials sits in 0.15–0.4 linear.
3. Roughness (NDF width) is the dominant appearance control — spend texture/detail there.
4. Energy: reflectance ≤ 1; specular stolen from diffuse; normalized lobes only.
5. Glancing views are where fake materials show — test shots at grazing angles.

## Connects To
- **ref-03**: normal-map mip filtering changes effective roughness (Toksvig).
- **ref-01**: F0/albedo tables are *linear*; authoring in sRGB needs decode.
- **ref-04**: IBL specular pre-filtering uses the same NDF.
