# Ref 03 — Texture filtering, compression, alpha maps, normal/bump maps

Sources: **RTR3** Ch 6.2.1–6.2.2 (magnification/minification, mipmaps, anisotropic),
6.2.6 (compression), 6.6 (alpha mapping), 6.7 (bump & normal mapping), 7.8.1 (mipmapping
BRDF and normal maps). **PBRT3** Ch 7.1 (aliasing sources), 7.8 (reconstruction filters),
9.3 (bump mapping), 10.4.3–10.4.5 (MIP maps, triangle & EWA filters).
Audit dimensions: **2.3, 2.9** · pitfalls **P-11.3b/c, P-11.7b**, new **P-B.3, P-B.10, P-B.11**.
*three.js mapping* lines are not from the books — verify against the installed version.

## Core Idea
A texture is a signal. **Minification** needs prefiltering (mipmaps, anisotropic probes);
**magnification** needs reconstruction (bilinear/bicubic, detail textures). Linear filters
are only correct for inputs that affect the final color linearly — color maps, yes; normals
and roughness, **no**. Filtering them naively makes distant surfaces sparkle and change gloss.

## Frameworks Introduced

- **One texel per pixel** (RTR3 §6.2.2)
  - Nyquist for textures: at most ~1 texel per pixel footprint. Choose mip level d from
    texture-coordinate derivatives; trilinear = bilinear in two levels + lerp between.
  - **LOD bias**: + blurrier (aliased synthetic images), − sharper (already-soft photos).

- **Good mipmaps** (RTR3 §6.2.2)
  - 2×2 box downsampling is "one of the worst filters possible"; prefer Gaussian/Lanczos/
    Kaiser. Watch edges: wrap vs. clamp.
  - **Filter sRGB textures in linear**, re-encode for storage — otherwise distant objects
    get darker and lose contrast.

- **Anisotropic filtering** (RTR3 §6.2.2; PBRT3 §10.4.5 EWA)
  - Mipmaps fetch square footprints → overblur surfaces seen edge-on (ground planes, long
    beams, slabs). Anisotropic: pick d from the **short** axis, take several probes along
    the long axis. Costs no extra memory. EWA (elliptical, Gaussian-weighted) is the
    high-quality reference.
  - *three.js mapping*: `texture.anisotropy` defaults to 1 → set up to
    `renderer.capabilities.getMaxAnisotropy()` on ground/structural maps (P-11.3c).

- **Magnification detail** (RTR3 §6.2.1)
  - Bilinear blurs; add a **detail texture** at a different scale for close-ups (gravel,
    concrete pores, galvanizing spangle). Remap/threshold for crisp edges; **signed
    distance-field alpha** (Green/Valve) for crisp decals, signage, text.

- **Alpha maps: blend vs. test vs. coverage** (RTR3 §6.6)
  - Blend: soft edges, needs sorting, no discard. Test: any order, discards, but binary and
    **gets no MSAA** (same alpha for all samples), ripples under magnification.
  - **Alpha to coverage**: order-free, MSAA-smoothed cutout edges (grating, mesh fences,
    foliage) — best of both for cutouts.

- **Detail scales: macro / meso / micro** (RTR3 §6.7, §7.8.1)
  - Triangles → normal/bump maps → BRDF roughness. Same feature changes category with
    distance; the mip chain is where meso detail should fade into roughness.

- **Tangent-space normal maps** (RTR3 §6.7.2)
  - Encoded [−1,1] → [0,255]; flat = (128,128,255). Tangent space allows deformation, reuse,
    and 2-channel compression (z = √(1 − x² − y²)).
  - Mirrored UVs flip tangent handedness → store a ±1 sign; otherwise mirrored halves light
    inverted. Green-channel convention mismatch is the related symptom (P-11.3b).
  - Normal maps are **data**: never sRGB-tagged (P-11.1b).

- **Filtering normal maps is nonlinear** (RTR3 §6.7.2, §7.8.1; PBRT3 §9.3 Further reading)
  - Lambert ≈ linear in n (averaged, unnormalized normal almost correct). Specular is not:
    averaged-renormalized normals keep a narrow lobe → **highlight sparkle / flicker** and
    gloss that changes with distance.
  - **Toksvig**: average normals without renormalizing; shorter length |na| ⇒ wider NDF.
    Blinn-Phong power `m' = |na|·m / (|na| + m(1 − |na|))`. Equivalent roughness approach:
    widen roughness where normal variance is high. Caveat: 2-channel normal compression
    can't store short normals → keep uncompressed or bake variance into roughness map.
  - Ideal: filter the whole appearance (normal + roughness + BRDF) together (SpecVar,
    multi-lobe fits) — expensive, offline.

- **Bump from displacement** (PBRT3 §9.3)
  - Shading normal from displaced-surface partial derivatives; the small-d term is usually
    dropped. Limits: no silhouettes, **no self-shadowing** (horizon mapping addresses that);
    shading normals can break energy conservation. Displacement mapping fixes silhouettes at
    geometry cost.

- **Fixed-rate compression** (RTR3 §6.2.6)
  - Block (4×4) interpolation formats: BC1 4 bpp RGB, BC3 8 bpp RGBA, BC4 1 channel, BC5
    2 channels (normals). Lossy; colors in a block lie on a line. ETC for mobile. Normals:
    BC5/2-channel, not RGB formats. HDR: separate luminance/chroma.
  - *three.js mapping*: KTX2 + Basis (ETC1S for color, UASTC for normals) via `KTX2Loader` —
    the P-11.7b fix.

## Key Concepts
- **Minification / magnification** — texels per pixel > 1 / < 1.
- **Mip level d (λ)** — log2 of footprint size in texels.
- **Trilinear** — bilinear in 2 mip levels + lerp.
- **Anisotropic / EWA** — non-square footprint filtering.
- **Detail texture** — high-frequency overlay for magnification.
- **Distance-field alpha** — crisp, scalable cutout edges from a low-res map.
- **Tangent frame (TBN) + handedness** — basis for tangent-space normals.
- **Toksvig factor** — gloss reduction from averaged normal length.

## Reference Tables

| Filter need | Symptom if missing | Fix |
|---|---|---|
| Minification | shimmering/moiré toward horizon | mipmaps (`generateMipmaps`, linear-mipmap-linear) |
| Edge-on minification | ground/beam texture overblurred to mush | anisotropy 4–16 |
| Magnification | blurry close-ups, pixelation | detail texture, higher res, bicubic |
| sRGB mip generation | distant surfaces darker | decode→filter→encode (GPU sRGB format) |
| Normal/gloss mip | sparkle, far surfaces too shiny | Toksvig / roughness-from-variance |
| Cutout edges | jaggy grating/foliage edges | alpha to coverage; distance-field alpha |

| Format (RTR3) | bpp | Use |
|---|---|---|
| BC1/DXT1 | 4 | opaque color |
| BC3/DXT5 | 8 | color + smooth alpha |
| BC4 | 4 | roughness/AO/height single channel |
| BC5/3Dc | 8 | tangent-space normals (x,y) |
| ETC | 4 | mobile color |

## Worked Example — the steel-frame GLB's texture set at a far iso shot
Current branch: 20 textures, 7 shared `MeshStandardMaterial`s with full map sets.
1. **Color maps** (concrete, paint): sRGB-tagged? mips on? Far camera → footprint ≫ 1 texel
   → must be mipmapped or the concrete crawls when orbiting.
2. **Ground-facing / long-beam maps**: edge-on view → trilinear overblurs. Check
   `anisotropy`; raise to max on those materials only.
3. **Normal maps** on bolts/welds (tiny on screen): at far LOD the averaged normals keep
   sharp highlights → metallic glints flicker frame-to-frame while orbiting. RTR3 says fix
   by widening roughness in lower mips (Toksvig). *three.js mapping*: the built-in
   geometry-roughness term only handles *geometric* normal variation, not normal-map
   variance — verify in the installed shader chunk before claiming coverage.
4. **Normal-map convention**: GLB (glTF) normal maps are OpenGL (+Y up); a DirectX-authored
   map inverts bolt relief → check P-11.3b with a raking light.
5. **Compression**: 20 textures uncompressed at 2K = large VRAM; KTX2 (UASTC normals,
   ETC1S color).

## Anti-patterns
- **Mipmap/filter in gamma space** — distance darkening.
- **Box-filter mip generation** for high-frequency patterns (grating, checker, text).
- **Alpha test on MSAA-reliant edges** — jaggies that MSAA can't touch.
- **Color-optimized compression on normal maps** — blocky, banded shading.
- **Renormalizing mipped normals for glossy materials** — sparkle; loses the roughness signal.
- **Assuming normal maps self-shadow** — they don't; crevices stay lit (pair with AO map).

## Key Takeaways
1. Every texture: mipmaps on; sRGB only for color; anisotropy on edge-on surfaces.
2. Normal and roughness maps must be filtered *together* — distance sparkle is a roughness bug.
3. Alpha to coverage for cutouts when MSAA is on.
4. Compress with format-per-data-type (BC5/UASTC normals, BC4 single channels).
5. Bump/normal maps never add silhouettes or self-shadowing.

## Connects To
- **ref-06**: shading vs. edge aliasing.
- **ref-02**: roughness = NDF width; Toksvig modifies it.
- **ref-05**: normal maps lack occlusion → AO maps / SSAO.
- Research doc **§10, §11.3b/c, §11.7b**.
