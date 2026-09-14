# Ref 07 — Tone mapping, exposure, HDR, bloom/glare, color grading, fog & aerial perspective

Sources: **RTR3** Ch 10.10 (color correction/LUTs), 10.11 (tone mapping, HDR imaging &
lighting), 10.12 (lens flare & bloom), 10.15 (fog, aerial perspective).
**PBRT3** Ch 7.9.3 (image output: sRGB after scaling), Further Reading on tone reproduction.
Audit dimensions: **2.7** · pitfalls **P-11.2c, P-11.5a/b/e, P-11.9b/e**, new **P-B.6, P-B.21–P-B.24**.
*three.js mapping* lines are not from the books. **Currency note**: RTR3 (2008) predates
ACES Filmic and AgX; use it for principles (key, log-average, white point, order of
operations), not for choosing between modern curves.

## Core Idea
Scene luminance spans many orders of magnitude; displays span ~2. Tone mapping is the
**last scene-referred step**: compute in linear HDR, apply exposure/tone curve once (after
blending), then gamma-encode. Bloom, flare and fog are *cues* that something is bright or
far — convincing only when driven by physically ranged HDR values, and clichés otherwise.

## Frameworks Introduced

- **Pipeline order** (RTR3 §10.11, §5.8; PBRT3 §7.9.3)
  - Shade (linear HDR, float buffer) → blend transparents → bloom/glare on HDR → tone map
    (+ exposure) → color grade (LUT) → sRGB encode → display.
  - **Tone map after blending**. On-the-fly (per-object) tone mapping allows low-precision
    buffers but repeats per overdraw and breaks alpha blending.
  - Nonlinear tone curves worsen roping on AA edges; resolve MSAA *after* tone mapping the
    samples for best edges (Persson).

- **Exposure & scene key** (RTR3 §10.11, Reinhard)
  - Log-average luminance `L̄w = exp( (1/N) Σ log(δ + Lw(x,y)) )`, δ ≈ 0.0001 — plain average
    is dominated by a few bright pixels.
  - Scale: `L = (a / L̄w) · Lw`. **Key a**: normal ≈ **0.18**, high-key up to 0.72, low-key
    down to 0.045. Key ≈ exposure.
  - Compress: `Ld = L/(1+L)`; with white point: `Ld = L(1 + L/L²white)/(1+L)` — values ≥
    L_white burn to white, midtones nearly linear.
  - "Maximum to white" fails: one bright pixel darkens everything.

- **Adaptation** (RTR3 eq. 10.9)
  - `L̄'w = L̄prev + c(L̄w − L̄prev)`, c ≈ 0.04/frame at 30 fps; frame-rate independent form
    uses `1 − pow(c, t/30)`. Also denoises the luminance estimate.

- **Simplest operators** (RTR3 §10.11)
  - Clamp + fixed exposure "works surprisingly well" when lighting and camera are
    predictable (e.g., a fixed outdoor sun + HDRI viewer). Adaptive only when lighting varies.
  - Histogram equalization over-exaggerates contrast.

- **HDR inputs matter as much as output** (RTR3 §10.11.1)
  - 8-bit environment maps can't hold both light sources and bounce light: shiny brass
    (70% reflective) and ebony (5%) can't both look right from one LDR env. Use float/RGBE/
    half-float (OpenEXR, `.hdr`). R11G11B10 float is a compact output HDR target.

- **Bloom recipe** (RTR3 §10.12)
  - Bright-pass (keep only over-threshold pixels, soft knee) → downsample ½ to ⅛ →
    separable Gaussian blur → scale → **additive** composite. Low-res blur + bilinear
    upsample widens it cheaply.
  - Physically: scattering in eye/lens (and CCD overflow). Purpose: signal brightness
    beyond display range. Overuse = "interactive computer graphics cliché".
  - Flares: sprites along light→screen-center line, size/opacity by distance from center,
    attenuated by **occlusion query of the light's visible area** (use next frame).

- **Color correction via LUT** (RTR3 §10.10)
  - Arbitrary per-pixel grade → 1D LUT per channel or ~32³ 3D LUT with trilinear lookup;
    >8-bit precision to avoid banding. Grade after tone mapping (display-referred).

- **Fog models** (RTR3 §10.15)
  - `c_p = f·c_s + (1 − f)·c_f`. Linear: `f = (z_end − z)/(z_end − z_start)`.
    **Exponential `f = e^(−d·z)` is physically justified** (Beer–Lambert).
    Squared exponential `f = e^(−(d·z)²)` is an artistic falloff (clear near, sudden far).
  - Use **linear depth**, not raw nonlinear z-buffer values; prefer **radial (Euclidean)
    distance** over view-plane depth — plane-based fog changes when the camera rotates and
    is thinner at screen edges.
  - Fog is a crude stand-in for **aerial perspective** (color and intensity vary with sun
    angle and view direction; sky color is the limit case). Preetham/Hoffman–Preetham
    analytic sky + aerial perspective for clear skies.
  - Fog hides far-plane clipping and doubles as depth cue.
  - Layered (height) fog and volumetric fog use thickness between eye and surface.

## Key Concepts
- **Tone mapping / tone reproduction** — HDR scene → display range.
- **Global vs local operator** — same curve everywhere vs neighborhood-adaptive.
- **Key value a** — target mid-grey (0.18 normal).
- **Log-average luminance** — geometric mean, robust exposure estimator.
- **L_white** — smallest luminance mapped to pure white.
- **Light adaptation** — temporal exposure smoothing.
- **Bright-pass / bloom / glare / lens flare** — overexposure cues.
- **3D LUT grade** — tabulated color transform.
- **Beer–Lambert** — exponential attenuation with distance.
- **Radial fog / aerial perspective** — distance-true fog / physically scattered atmosphere.

## Reference Tables

| Parameter | RTR3 value |
|---|---|
| Key a (normal / high / low) | 0.18 / ≤0.72 / ≥0.045 |
| δ in log-average | 0.0001 |
| Adaptation rate c | ~0.04 per frame @30 fps |
| Bloom buffer | ½×½ to ⅛×⅛ res, separable Gaussian |
| 3D LUT size | ~32³, >8-bit |
| Coastal water transmission / m | (30%, 73%, 63%) RGB |

| Fog | Formula | Physical? | *three.js mapping* |
|---|---|---|---|
| Linear | (z_end − z)/(z_end − z_start) | no | `Fog(color, near, far)` |
| Exponential | e^(−d·z) | **yes** (Beer–Lambert) | no built-in class — custom fog chunk |
| Squared exp | e^(−(d·z)²) | no | `FogExp2(color, density)` |

*three.js mapping*: built-in fog uses view-space depth (plane-based) — verify in `fog_vertex`
chunk; radial fog requires a shader patch.

## Worked Example — exposure & fog for the outdoor steel frame
Current branch: AgX, exposure 0.8 (via `ToneMappingSwitch`), FogExp2, local HDRI, no
postprocessing package.
1. **Order**: renderer-level tone mapping with no composer → blending before tone map ✓,
   single encode ✓. Adding `EffectComposer` later must keep exactly one tone-map site
   (P-11.5b) and the output pass last (P-B.6).
2. **Exposure 0.8 is a key choice**: check the render's log-average luminance against
   a ≈ 0.18 for a daylight site. If the concrete/grey steel reads darker than a mid-grey card
   under the HDRI sun, exposure is low, not the lights.
3. **Predictable lighting** (static sun + HDRI, orbit camera) → fixed exposure is the right
   call per RTR3; auto-adaptation would pump as the sky enters/leaves the view.
4. **Fog**: FogExp2 = squared-exponential — artistic, not physical. For a site-scale scene,
   exponential (Beer–Lambert) with small density gives truer aerial fade; plane-based depth
   makes far corners of the frame foggier/clearer as the camera rotates — test by rotating
   in place and watching a distant member's fog change.
5. **Fog color** should match the HDRI horizon color at that heading; a flat grey fog against
   a blue horizon reads fake (aerial perspective varies with view direction).
6. **Bloom** (if added): galvanized highlights must exceed the threshold only where the sun
   reflects — `luminanceThreshold ≈ 1` post-exposure; bloom everything (threshold 0) is the
   cliché (P-11.5a).

## Anti-patterns
- **Clamping HDR as the "tone mapper" with unpredictable lighting** — blown highlights, crushed shadows.
- **Tone mapping before transparent blending** — halos/darkening at transparent edges.
- **Tone mapping twice** (renderer + composer) — washed out, low contrast.
- **Arithmetic-mean exposure** — sky pixels dictate exposure.
- **LDR env maps** — reflections and lighting can't be simultaneously right.
- **Bloom from LDR/clamped values** — everything white glows equally.
- **Squared-exp fog assumed physical**; **z-buffer depth fog** — wrong falloff, rotation-dependent.
- **Grading before tone mapping** or in 8-bit LUTs — banding, shifts.

## Key Takeaways
1. Linear HDR → blend → bloom → tone map (once) → grade → encode (once).
2. Set exposure from log-average luminance to key ≈ 0.18; fixed exposure is fine for fixed lighting.
3. Environment maps and render targets must be HDR/float for highlights and bloom to mean anything.
4. Bloom = bright-pass, low-res separable blur, additive; subtle.
5. Physical fog is exponential in true (radial) distance; match fog color to horizon.

## Connects To
- **ref-01**: linear pipeline and final encode.
- **ref-04**: HDR environment radiance and sun intensity.
- **ref-06**: roping from nonlinear operators.
- Research doc **§2, §7, §11.5, §11.9e**.
