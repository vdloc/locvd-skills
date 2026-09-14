# Ref 01 — Radiometry, color, and the linear/gamma pipeline

Sources: **RTR3** Ch 7.1–7.3 (radiometry, photometry, colorimetry), Ch 5.8 (gamma correction).
**PBRT3** Ch 5.2.2 (RGB/XYZ), 5.4 (radiometry, luminance table), 7.9.3 (image output).
Audit dimensions: **2.1, 2.7** · pitfalls **P-11.1a/b/c, P-11.9e**, new **P-B.6, P-B.7**.
*three.js mapping* lines not from books — verify against installed version.

## Core Idea
Shading math correct only on **linear radiance**. Every nonlinear input (sRGB textures,
picked colors, vertex colors) decode to linear before shading. Display transfer function (sRGB encode) apply **exactly once, at very end** —
after tone mapping + all post-processing.

## Frameworks Introduced

- **The four radiometric quantities** (PBRT3 §5.4; RTR3 §7.1)
  - Flux Φ (W) → irradiance E (W/m²) → intensity I (W/sr) → radiance L (W/(m²·sr)).
  - Radiance = what cameras/eyes measure + what shader outputs per pixel; **invariant with distance** (ignoring fog). Irradiance from point source falls as 1/r².
  - Photometric twins: lumen, lux, candela, nit (cd/m²). *three.js mapping*: physically
    based light units (candela for point/spot, lux for directional) since r155.

- **"Five-times" rule** (RTR3 §7.1, from Lambert)
  - Light = point (inverse-square) only when distance ≥ 5× emitter width.
    Closer → need area light (see ref-04).

- **Linear-space rule / encode last** (RTR3 §5.8)
  - Convert nonlinear *inputs* to linear (sRGB textures, color constants, vertex colors) —
    **never convert already-linear twice**.
  - Apply encoding transfer function "at the final stage of rendering … and not before.
    If post-processing is applied after gamma correction, post-processing effects will be
    computed in nonlinear space". Tone mapping before gamma, always.
  - Intermediate buffers *may* be nonlinear if low precision (less banding) but must
    decode before next effect uses them.
  - Mipmap generation must respect nonlinear encoding (filter in linear).

- **Encoding vs display gamma** (RTR3 §5.8)
  - sRGB encoding gamma ≈ 0.45 (≈1/2.2); display ≈ 2.5 → end-to-end ≈ 1.125 (bright office).
    Renderer job = encoding gamma. End-to-end ≠ 1 on purpose (surround effect).

- **Gamma-wrong symptoms** (RTR3 §5.8, Fig. 5.39–5.41)
  - Overlapping lights overbrighten in overlap.
  - Antialiased edges look "roped" (midtones too dark).
  - Blending/MSAA resolved in nonlinear space → wrong edge weights.

- **RGB is a gamut, not a spectrum** (RTR3 §7.3; PBRT3 §5.2)
  - Same RGB shows different SPDs on different screens; multiplying RGBs ≠ multiplying
    spectra, but "works surprisingly well" in practice. Out-of-gamut → negative/over-1
    channels; clamp or map.

- **Luminance weights** (RTR3 eq. 7.11; PBRT3 RGBToXYZ)
  - `Y = 0.212671 R + 0.715160 G + 0.072169 B` (linear, Rec.709/sRGB primaries).
    Old `0.30/0.59/0.11` = NTSC-phosphor legacy — wrong for sRGB. Use for bloom
    thresholds, auto-exposure, SSAO luminance influence.

- **Masking** (RTR3 §7.3)
  - High-frequency, high-contrast texture hides banding + shading artifacts → less
    effort needed there. Smooth, uniform-color surfaces expose every flaw.

## Key Concepts
- **Radiance** — power per projected area per solid angle; per-pixel quantity.
- **Irradiance** — incident power per area; what light meter (lux) measures.
- **Steradian** — solid angle unit; sphere = 4π sr, hemisphere = 2π sr.
- **Metamers** — different spectra, same perceived color.
- **Gamut** — triangle of displayable chromaticities; sRGB small one.
- **White point D65** — white sRGB matrices assume.
- **Encoding transfer function** — scene-linear → stored code values (sRGB ≈ x^0.45).

## Reference Tables

Luminance (PBRT3 Table 5.1; RTR3 §7.2):

| Condition | cd/m² (nits) |
|---|---|
| Sun at horizon | 600,000 |
| 60 W bulb | 120,000 |
| Clear sky | 8,000 |
| Typical office | 100–1,000 |
| Computer display | 1–100 (PBRT3) · LCD 150–280 (RTR3, 2008) |
| Street lighting | 1–10 |
| Cloudy moonlight | 0.25 |

Sky-to-display ratio ≈ 80×+, sun ≈ 6000×: HDR scene → LDR display **requires** tone
mapping (ref-07); no light-intensity tweak removes need.

Linear sRGB → XYZ (RTR3 eq. 7.10 = PBRT3):
```
X = 0.412453 R + 0.357580 G + 0.180423 B
Y = 0.212671 R + 0.715160 G + 0.072169 B
Z = 0.019334 R + 0.119193 G + 0.950227 B
```

## Worked Example — RTR3's gamma example, extended to a WebGL audit
RTR3: linear pixel (0.3, 0.5, 0.6) → ^0.45 → (0.582, 0.732, 0.794) → ×255 → (148, 187, 203).
Stored values much brighter than linear numbers; correct.

Audit path through three.js frame:
1. Base-color texture PNG (authored sRGB) → must tag sRGB so sampler decodes
   to linear (**P-11.1b** — data maps untagged).
2. `color="#888888"` prop → three.js `Color` from hex decodes sRGB→linear (ColorManagement
   on) → linear ≈ 0.246, *not* 0.533. Reviewer expecting "mid-grey albedo 0.5" wrong.
3. Shading in linear → tone mapping (renderer or composer, once — **P-11.5b**) →
   sRGB encode once at output (**P-11.1a**).
4. With `EffectComposer`: effects between render and output must get linear HDR
   (half-float target — **P-11.9e**); output/encode pass must be last (**P-B.6**).
5. Symptom test: two spotlights overlap on ground. Overlap visibly
   overbright/"hot" vs sum → nonlinear blend somewhere.

## Anti-patterns
- **Post effect after encode** — bloom/SSAO/grading on sRGB values; halos, wrong falloff.
- **Double decode** — hex color manually `convertSRGBToLinear()`'d when three.js already did.
- **8-bit linear render targets** — banding in darks; keep intermediates half-float or dither.
- **NTSC luma weights** (0.30/0.59/0.11) in custom luminance code.
- **Tuning light intensity to fix clipping** — clipping = tone-mapping/exposure problem.

## Key Takeaways
1. Linear in, linear math, one encode at end — after tone mapping + all post.
2. Every color source needs declared color space: textures, props, vertex colors, CSS vars.
3. Real scene luminance spans 10⁵+; display ~10². Tone mapping mandatory for realism.
4. Lights = points only beyond 5× their size.
5. Luminance = 0.2127R + 0.7152G + 0.0722B on linear values.

## Connects To
- **ref-02**: F0/albedo tables = linear values.
- **ref-07**: tone mapping/exposure operates on linear HDR buffer.
- **ref-03**: mipmaps + filtering must happen in linear.
- Research doc **§1, §2, §11.1**.