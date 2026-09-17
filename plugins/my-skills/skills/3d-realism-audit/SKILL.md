---
name: 3d-realism-audit
description: Use when asked to audit, improve, or increase the photorealism of the three.js / react-three-fiber scene in a web project — review lighting, materials, color management, shadows, AO, reflections, post-processing, anti-aliasing, or geometry detail and produce a prioritized punch list of concrete code changes. Grounded in the repo research doc plus Real-Time Rendering 3e and Physically Based Rendering 3e reference notes.
---

# 3D realism audit — three.js / R3F project

Audit real three.js / `@react-three/fiber` scene in repo against current (2024–2026) real-time-rendering best practice — including the r3f v9 color-management/async-renderer changes, post-r155 lighting defaults, and the emerging WebGPU/TSL path (see P-11.9d). Output: prioritized, file:line-grounded punch list of concrete code changes, each with a falsifiable acceptance rule (see Step 3).

**Every "why" behind recommendation lives in the project's own 3D research doc**
(`docs/RESEARCH-3D-REALISM.md` in repos that have one; no such doc → cite the reference notes below instead).
Skill cites file by section number (`§4`, `§11.2b`, etc.), no re-arguing rendering theory — but pitfall catalog not citation-only: Step 2.5 duplicates wrong/fixed code pattern for every pitfall inline, so audit pattern-matches `src/` without second file open. Research file missing something you find → add it there first (with primary-source citation), then reference here. No unsourced advice in audit output.

**Second source layer — textbook references** in this skill's `references/` directory, distilled from *Real-Time Rendering* 3rd ed. (Akenine-Möller, Haines, Hoffman — "RTR3") and *Physically Based Rendering* 3rd ed. (Pharr, Jakob, Humphreys — "PBRT3"). Supply theory, numeric ranges (F0/albedo tables, tone-mapping key, bias/cascade rules, batch budgets) and extra pitfalls **P-B.\*** in Step 2.5. Cite as `ref-0N (RTR3 §x.y)`. Count as primary sources for "no unsourced advice" rule, two limits: lines marked *three.js mapping* not from books — verify against installed three.js before quoting; both books predate AgX/ACES, WebGPU/TSL, modern WebGL batching numbers — use for principles and ranges, research doc for current three.js APIs.

| Ref | Covers | Serves |
|---|---|---|
| [ref-01](references/ref-01-radiometry-color-gamma.md) | radiometry, luminance, linear pipeline, gamma | 2.1, 2.7 |
| [ref-02](references/ref-02-brdf-materials.md) | BRDF, Fresnel/F0 tables, microfacet GGX/Smith, albedo ranges | 2.2, 2.3 |
| [ref-03](references/ref-03-textures-filtering-normalmaps.md) | mipmaps, anisotropy, compression, alpha maps, normal-map filtering (Toksvig) | 2.3, 2.9 |
| [ref-04](references/ref-04-lights-ibl-ambient.md) | area vs point lights, env/prefiltered/irradiance maps, SH, ambient, color temperature | 2.2, 2.6 |
| [ref-05](references/ref-05-shadows-ao-reflections.md) | shadow-map bias/resolution/CSM/PCF/PCSS/VSM, AO theory & SSAO, planar reflections | 2.4, 2.5, 2.6 |
| [ref-06](references/ref-06-antialiasing-transparency.md) | sampling theory, MSAA/SSAA, transparency sorting, premultiplied alpha | 2.8, P-11.3e |
| [ref-07](references/ref-07-tonemap-bloom-grading-fog.md) | tone mapping/key/exposure, HDR, bloom, LUT grading, fog & aerial perspective | 2.7 |
| [ref-08](references/ref-08-lod-batching-performance.md) | bottleneck tests, small-batch problem, LOD selection/switching, overdraw | 2.9, 2.10 |
| [cheatsheet](references/cheatsheet.md) · [glossary](references/glossary.md) | decision rules, thresholds, tells · terms → ref | all |

Load ref file only when auditing its dimension; cheatsheet = one-page summary, open first.

Read research doc §12 ("This repo's current state, for reference") before anything below — last-known-good snapshot of what's implemented, but repo moves, so verify still accurate before relying (see Step 1).

## When this runs

**Repeatable, continuous-improvement audit**, not one-shot report. Re-run:
- After any change to the files that define materials, lighting, camera, or the mode/quality state gating rendering fidelity — the `<Canvas>` root component, its material/color source, the canvas-hosting page, and any view/quality store.
- Before treating a "realistic"/"photoreal" display mode as finished — check the project's own issue tracker or feature doc first; a toggle that only changes annotations/overlays without touching materials/lighting/post-processing is common and easy to miss.
- Whenever the project's research doc (if one exists) gains a new section (technique or pitfall) — past "clean" result goes stale purely because research grew, not code.

Each run: fresh punch list, not diff against last — state ordering/priority explicitly each time, since highest-impact shifts as earlier items get fixed.

Full cycle = **Step 1 → 2 → 2.5 → 4a/4b (baseline) → 3 (punch list) → implement → 4a/4b/4c again (verify)**. Step 4 not optional polish: punch list without before/after capture has no evidence change helped, and Step 4d tells you loop finished rather than merely quiet.

## Step 1 — re-verify current state (don't trust the cached snapshot)

Grep/read these targets before auditing anything else. Research §12 accurate as of its write time; confirm still is:

```bash
# Materials — is anything still unlit?
grep -rn "meshBasicMaterial\|meshStandardMaterial\|meshPhysicalMaterial\|meshLambertMaterial\|meshPhongMaterial" src/

# Lights — does any exist yet?
grep -rn "directionalLight\|pointLight\|spotLight\|ambientLight\|hemisphereLight\|<Environment" src/

# Renderer config — color management, tone mapping, shadows
grep -rn "outputColorSpace\|toneMapping\|shadowMap\|antialias\|dpr=" src/

# Legacy-lighting guard — must NOT reappear on three>=0.155 (r155 flipped useLegacyLights default to false)
grep -rn "useLegacyLights\|physicallyCorrectLights" src/

# Custom shaders/materials — r3f v9 removed automatic texture sRGB conversion for these;
# built-in materials (meshStandardMaterial etc.) still auto-handle it, custom ones don't
grep -rn "ShaderMaterial\|onBeforeCompile\|RawShaderMaterial" src/

# Stack versions — pin and check compatibility, don't assume
grep -n '"three"\|"@react-three/fiber"\|"react"\|"@react-three/postprocessing"' package.json

# Post-processing — does the package even exist?
grep -n "postprocessing" package.json
grep -rn "EffectComposer\|<Bloom\|<SSAO\|<Vignette" src/

# Instancing / draw-call shape
grep -rn "InstancedMesh\|<Instances\|<Detailed" src/
```

Read full current contents of:
- **the scene root** — the component that mounts `<Canvas>` and renders the model (materials, camera, canvas config — nearly every finding below grounded here).
- **the color/material source** — wherever mesh `color`/material props are computed (hardcoded hex? CSS custom properties? a palette module? a material library?) — matters for §2.1 below.
- **the canvas host** — the page/component wrapping `<Canvas>` (confirms nothing else touches the renderer — overlays, stats, a second canvas).
- **the view/quality state**, if the project has one — a `mode`/`quality`-style store or prop is a natural hook for a device-tier fidelity gate (§2.9 below); note whether such a value exists, and whether anything actually reads it (a write-only quality flag is a common, easy-to-miss gap).

If the project has **more than one rendering path** (e.g. a flat/schematic mode alongside a "realistic" mode, or a feature branch adding one), identify which path is in scope for this audit before writing any Step 2 before/after snippet — snippets below use illustrative names (`SceneRoot`, `Mesh`, a generic material/color source); replace them with this repo's actual file and component names as you write the punch list, don't leave the illustrative names in the output.

Anything you read contradicts an assumption baked into this skill's snippets → **trust what you just read, not this file's examples** — the snippets are patterns to adapt, not literal code that must exist. Note the mismatch in the audit output and move on; there is nothing to "correct" in this file itself unless you are extending the skill.

## Step 2 — audit each dimension

Each dimension: how to detect current state → what "good" looks like (cites research §, if a project research doc exists) → concrete before/after snippet. Snippets below use illustrative component/file names (`SceneRoot`, `Mesh`, a generic color source) — before writing the punch list, re-point every snippet at this repo's actual files, imports, and component names, quoting real surrounding code so the diff is a drop-in patch, not a sketch.

### 2.1 Color management

- **Detect**: `grep -rn "outputColorSpace\|colorSpace" src/`. If the color/material source (Step 1) reads plain hex strings or CSS custom properties straight into a material's `color` prop with no `TextureLoader` involved: three.js's `Color` constructor auto-converts hex/string input from `SRGBColorSpace` to linear working space by default, so this can be *accidentally* correct even with no `renderer.outputColorSpace` set explicitly anywhere — don't mistake "looks right" for "is configured."
- **Good**: research §1, §11.1 (if project research doc exists; else ref-01 below). Explicit `outputColorSpace` set once, in one place. If any texture is loaded, tag color maps `SRGBColorSpace` and data maps (normal/roughness/AO) `NoColorSpace` per §11.1b.
- **Book**: ref-01 (RTR3 §5.8) — decode every nonlinear input, encode exactly once *after* tone mapping and all post; symptom test = two overlapping lights overbrightening at overlap, or roped AA edges. P-B.6, P-B.7.
- **Before/after** (inside the `<Canvas>` root's `onCreated` callback — adapt file/component name to this repo):
```tsx
// BEFORE
onCreated={({ gl }) => {
  // whatever this repo's canvas setup already does
}}

// AFTER — decide the color pipeline explicitly instead of relying on the default
onCreated={({ gl }) => {
  // ...existing setup...
  gl.outputColorSpace = THREE.SRGBColorSpace; // explicit, not "whatever the installed version defaults to"
}}
```
If this callback destructures only `{ gl }` and doesn't stash a renderer handle anywhere reachable from outside React, Step 4's programmatic verification needs one added — see Step 4 for a dev-only line doing that. Don't write a Step 4 snippet assuming a handle exists without checking.
- **r3f v9 note**: built-in materials (`meshStandardMaterial`, `meshBasicMaterial`, etc.) auto-handle color-texture sRGB conversion same as vanilla three.js — no action needed there. But r3f v9 **removed** automatic conversion for custom materials/shaders: any `<shaderMaterial>`/`onBeforeCompile`/`RawShaderMaterial` consuming a color texture must set `texture.colorSpace = THREE.SRGBColorSpace` explicitly (or the JSX `texture-colorSpace` prop), or colors render too dark. Only relevant once a custom shader exists — n/a on stock materials.
- **Accept**: `renderer.outputColorSpace === THREE.SRGBColorSpace` read from live `__gl.gl` handle (Step 4a), AND every `ShaderMaterial`/`RawShaderMaterial` texture uniform has `.colorSpace` set (grep `ShaderMaterial` → for each hit, confirm paired `.colorSpace =` within same file). Fail = either check false.
- **Impact**: low today (unlit hex colors, little visible difference) but prerequisite for every material/lighting change below — set now so not silent variable when `MeshStandardMaterial`/textures/lights introduced. Research §11.1a warns against leaving implicit and later mixing older-API snippets.

### 2.2 Lighting model & IBL

- **Detect**: `grep -rn "Light\b\|<Environment" src/`. If the scene root renders every mesh with `meshBasicMaterial` (or another unlit material), lights and `<Environment>` have **zero visible effect** until material changes too — check material and light/IBL together, not separately, or an audit can wrongly report "lighting missing" when the real gap is the material.
- **Good**: research §2 (`MeshStandardMaterial`), §4 (`<Environment>`), §11.2 (light-count and IBL-intensity pitfalls) — or ref-04 below if no project research doc.
- **Book**: ref-04 (RTR3 §8.2–8.6) — split direct (one shadowed key) from indirect (env/irradiance); constant ambient without occlusion reads flat; never double-count sun present in HDRI; env reflections assume distant surroundings (flat smooth surfaces need planar reflection). P-B.12–P-B.15.
- **Before/after** — two-part change (material first, then light/environment), shown together since one inert without other:
```tsx
// BEFORE — unlit material, e.g. inside a per-part <Mesh> component
<meshBasicMaterial
  color={color}
  transparent={transparent}
  opacity={transparent ? 0.3 : 1}
  depthWrite={!transparent}
/>

// AFTER — swap to a lit PBR material; requires a light/environment source to be visible at all
<meshStandardMaterial
  color={color}
  roughness={0.6}
  metalness={isMetal ? 1 : 0} // binary by default — dielectrics get 0, bare-metal parts get 1; see research §11.3a for why 0.5 is almost always wrong
  transparent={transparent}
  opacity={transparent ? 0.3 : 1}
  depthWrite={!transparent}
/>
```
```tsx
// AFTER — scene root, add once, sibling of the model, not nested inside a
// mode-conditional block (research §11.8d: conditional mounting reloads the HDRI)
<Environment preset="city" />
```
- **Impact**: high — single highest-leverage change in most scenes; nothing else in this list matters visually until material responds to light. If the project has multiple display modes (schematic/engineering vs "realistic"), gate this behind the realistic-mode condition (see 2.9) rather than replacing the unlit material unconditionally — a diagrammatic mode is often deliberately flat by design, not an oversight.

### 2.3 Material PBR correctness

- **Detect**: once `meshStandardMaterial`/`meshPhysicalMaterial` exist, grep for `metalness={0.5}` or other non-0/1 values on structural parts (research §11.3a), and any texture load without paired `.colorSpace` assignment (§11.1b).
- **Good**: research §3, §11.3.
- **Book**: ref-02 (RTR3 §7.5–7.6, Tables 7.3/7.4; PBRT3 §8.2–8.4) — check values against physical ranges, not taste: metal `color` = F0 ≥ 0.5 linear (iron ≈ 0.56, aluminum ≈ 0.91); insulator F0 ≈ 0.04–0.05 and colorless; diffuse albedo for concrete/stone/soil 0.15–0.4 linear. Roughness (NDF) = dominant appearance control. ref-03 (RTR3 §7.8.1) for distance sparkle from normal/roughness mips. P-B.1–P-B.5, P-B.10, P-B.11.
- **Before/after**:
```tsx
// WRONG — mid metalness used as a "shininess" shortcut
<meshStandardMaterial metalness={0.5} roughness={0.5} />

// RIGHT — metalness at the physical extreme; roughness carries the finish
<meshStandardMaterial metalness={1.0} roughness={0.6} />
```
- **Impact**: medium, only relevant once 2.2 lands.

### 2.4 Shadows

- **Detect**: `grep -rn "castShadow\|receiveShadow\|shadowMap\|ContactShadows\|AccumulativeShadows" src/` — zero hits today; `<Canvas>` doesn't set `shadows`.
- **Good**: research §5, §11.4.
- **Book**: ref-05 (RTR3 §9.1.4) — fix order for blocky shadows: fit light frustum to visible receivers → restrict to casters → tighten near/far → raise mapSize → cascades (2–3× depth per split). Bias slope-dependent; real penumbrae harden at contact, so uniform PCF softness at bases reads "floating". P-B.16, P-B.19, P-B.20.
- **Before/after**:
```tsx
// BEFORE — <Canvas> props at the scene root
<Canvas
  dpr={[1, 2]}
  gl={{ antialias: true }}
  ...
>

// AFTER
<Canvas
  dpr={[1, 2]}
  gl={{ antialias: true }}
  shadows="soft" // PCFSoftShadowMap; see research §11.4e re: mobile cost before shipping unconditionally
  ...
>
```
```tsx
// each shadow-relevant mesh — only meaningful once a shadow-casting light exists
<mesh castShadow receiveShadow position={position} ...>
```
Add bias-tuned key light per research §11.4a-b, not three.js defaults:
```tsx
<directionalLight
  castShadow
  position={[40, 60, 30]}
  shadow-bias={-0.005}
  shadow-normalBias={0.02}
  shadow-mapSize={[2048, 2048]}
/>
```
- **Shadow softness tuning**: `shadow-radius` (e.g. `<directionalLight shadow-radius={10} ...>`) controls shadow-edge blur specifically under `VSMShadowMap` — has no effect under `PCFSoftShadowMap`/`PCFShadowMap`. If softness is the goal, pair `shadow-radius` with `shadows="variance"` (VSM), not `"soft"` (PCF) — the two are different shadow algorithms, not the same knob at different strengths.
- **Accept**: `castShadow`/`receiveShadow` present on ground + at least one structural mesh (grep, Step 1); `shadow-bias`/`shadow-normalBias` non-default (not `0`/three.js default `-0.0001`); `__gl.gl.info.render.calls` before vs after enabling shadows recorded in Step 4b (shadow pass roughly doubles calls — expected, not a bug, but must be stated). Fail = shadow prop present but frustum/bias still at three.js defaults (P-11.4a/b still `Applies: now`).
- **Impact**: medium-high once lighting (2.2) exists; zero before.

### 2.5 Ambient occlusion

- **Detect**: `grep -n "postprocessing\|SSAO" package.json src/` — package not installed, no AO of any kind (not even baked — `AccumulativeShadows` unused).
- **Good**: research §6, §11.5c.
- **Book**: ref-05 (RTR3 §9.2) — AO multiplies **indirect** term only; include ground in occlusion test so AO doubles as contact shadow; depth-only SSAO greys flat faces and halos edges (use normals + depth-aware blur); AO over-darkens bright albedo (Stewart–Langer correction). P-B.17, P-B.18.
- **Before/after**: requires installing `postprocessing`/`@react-three/postprocessing` first (not in `package.json` dependencies — confirm before assuming available):
```tsx
// AFTER — new: wrap <Model /> siblings in an EffectComposer
import { EffectComposer, SSAO } from '@react-three/postprocessing';

<EffectComposer>
  <SSAO radius={0.4} intensity={20} luminanceInfluence={0.6} depthAwareUpsampling />
</EffectComposer>
```
- **Impact**: medium — most valuable once the model has real geometry contact (joints, fasteners, overlapping parts) for AO to read.

### 2.6 Reflections

- **Detect**: no `<Environment>`, no SSR — N/A today.
- **Good**: research §4 (IBL as default), §11.5d (SSR experimental/thin-geometry-unsafe — don't default). For scenes with thin/open geometry (rails, pipes, mesh screens), IBL-only reflection via `<Environment>` is the correct default; SSR breaks on thin geometry per §11.5d — flag any such part kind as an SSR risk case if SSR is proposed.
- **Book**: ref-04 (RTR3 §8.4–8.5) and ref-05 (RTR3 §9.3) — prefiltered env mips per roughness; radially symmetric prefiltering wrong on flat floors at grazing views; planar reflections need clip plane + stencil. P-B.14.
- **Impact**: low priority vs 2.2/2.4 — reflections read correctly for free once `<Environment>` + `MeshStandardMaterial` land.

### 2.6b Volumetric lighting / god rays (optional, cost-gated)

- **Detect**: `grep -rn "Volumetric\|godrays\|GodRays\|raymarch" src/`. Applies only if scene has an occluder silhouette worth shafting light through (dense lattice/frame — this stack's typical subject) and a directional key light from 2.4.
- **Good**: implement as a **screen-space post-processing Effect** (extend `postprocessing`'s `Effect` class with `EffectAttribute.DEPTH`), raymarching against the reconstructed depth buffer — cost is then decoupled from scene geometric complexity (flat regardless of mesh count), unlike a geometry-based volume. For shadow-consistent shafts (light correctly occluded by structure, not just by depth), render a small dedicated shadow/depth texture (~256×256) from the light's view and sample it during the raymarch for occlusion, rather than trusting the main shadow map's resolution/frustum.
- **Accept**: effect's cost measured via 4b (`__gl.gl.info.render.calls`/frame time) does **not** scale with `triangles` count when toggled on/off at fixed geometry — if it does, it's not screen-space and the "Good" criterion above is violated. Shaft direction must visually match the 2.4 key light's `position` (side-by-side screenshot, not assumed).
- **Impact**: low — pure atmosphere polish, sequence last, after 2.2/2.4/2.7; skip entirely unless scene has a light-through-lattice moment worth the extra pass.

### 2.7 Post-processing / bloom / exposure

- **Detect**: `grep -n "postprocessing" package.json` — absent.
- **Good**: research §7, §11.5a-b, §11.5e.
- **Book**: ref-07 (RTR3 §10.11–10.15) — order: blend → bloom (HDR) → tone map ×1 → grade → encode; set exposure against key ≈ 0.18 from log-average luminance; fixed exposure correct for predictable lighting; bloom = bright-pass + low-res separable blur, additive; physical fog exponential (Beer–Lambert) in radial distance — `FogExp2` is squared-exponential. P-B.6, P-B.21–P-B.24.
- **Before/after**: if adding bloom, set `renderer.toneMapping` and composer tone-mapping ownership consistently (research §11.5b — one place for tone mapping):
```tsx
// AFTER — scene root's onCreated
state.gl.toneMapping = THREE.ACESFilmicToneMapping;
state.gl.toneMappingExposure = 1.0;
```
```tsx
import { Bloom } from '@react-three/postprocessing';
<EffectComposer>
  <Bloom luminanceThreshold={1.0} luminanceSmoothing={0.3} intensity={0.6} />
  {/* do NOT also add a ToneMappingEffect here if renderer.toneMapping is set — §11.5b */}
</EffectComposer>
```
- **Impact**: medium, cosmetic polish layer — sequence after 2.2/2.4, not before (bloom on unlit `meshBasicMaterial` output has nothing HDR to bloom).

### 2.8 Anti-aliasing

- **Detect**: `grep -n "dpr=\|antialias" src/` at the scene root — if `dpr={[1, 2]}` and `gl={{ antialias: true }}` are already both present, this dimension is **already correctly handled** per research §11.6b. Re-check only that a future `EffectComposer` addition (2.7) doesn't silently defeat context-level MSAA per research §11.6a — needs a multisampled render target or `SMAAEffect` once a composer is introduced.
- **Book**: ref-06 (RTR3 §5.6–5.7) — pick AA per aliasing *type*: MSAA fixes geometry edges only, not specular/normal-map shimmer (ref-03) or alpha-test edges (alpha to coverage); transparents: depth test on / write off, back-to-front, α = 0.5 pairs order-free. P-B.8, P-B.9.
- **Impact**: none needed now; becomes checklist item moment 2.5/2.7 land.

### 2.9 Geometry / normal detail, and the mode/quality gate

- **Detect**: check the geometry-generation code — plain primitives with no normal maps or sub-part detail is normal for a first pass, but note it. If the project has a `quality`-style field in its state store, grep for reads of it (`grep -rn "quality" src/`, then check whether anything besides the setter reads the value) — a write-only quality flag with no consumer is a common, easy-to-miss gap.
- **Good**: research §9 (instancing/LOD budget), §11.7c (device-tier gating). If the project has a "realistic" display mode and a `quality` tier control, this is the natural implementation point for wiring them together: the mode switches material/lighting/post-processing on; the quality tier scales shadow resolution / SSAO resolution / DPR ceiling.
- **Book**: ref-08 (RTR3 §14.7) — LOD geometry *and* textures *and* shaders by projected size (box area for long thin members), with hysteresis; ref-03 for detail textures (magnification) and bump/normal limits (no silhouettes, no self-shadowing). P-B.27.
- **Before/after** (adapt to this repo's actual state-management pattern — Zustand/Redux/context/props, whatever it uses):
```tsx
// AFTER — scene root, gate the realism stack behind existing state
const { mode, quality } = useSceneState(); // replace with this repo's actual store/hook
const realistic = mode === 'realistic';
// ...
{realistic && <Environment preset="city" />}
{realistic && (
  <directionalLight
    castShadow={quality !== 'performance'}
    shadow-mapSize={quality === 'high' ? [2048, 2048] : [1024, 1024]}
    position={[40, 60, 30]}
  />
)}
```
- **Impact**: wiring that makes every other item ship as an actual toggleable feature rather than an always-on cost — treat as **required**, not optional, alongside whichever of 2.2–2.7 is implemented first, if the project has more than one display mode.

### 2.10 Performance-vs-fidelity tradeoffs (draw calls, instancing)

- **Detect**: how does the scene root render its parts — one `<mesh>` per part (`items.map((p) => <Mesh key={p.id} part={p} />)`), or already instanced/merged? Check the project's own issue tracker or notes for any prior "should this be instanced?" question — don't re-litigate a decision that was already made and documented.
- **Good**: research §9, §11.7a. **Measure frame cost before instancing** — with an unlit material and no shadows/post-processing, a few hundred draw calls is often fine; re-measure after 2.2–2.7 land, since every added feature (shadows, SSAO, bloom) multiplies marginal cost per draw call.
- **Book**: ref-08 (RTR3 §15.2, §15.4.2) — locate bottleneck first (frame time at DPR 1 vs 0.5; `castShadow` off); small-batch problem ("a few large meshes are much more efficient than many small ones") — meshes averaging < ~200 tris sharing materials = merge/instance candidate; shadow casters can be merged low-detail proxies. P-B.25, P-B.26, P-B.28.
- **Impact**: don't instance speculatively — flag as a measurement task (4b) first, propose instancing only once a measured bottleneck points there.

## Step 2.5 — pitfall scan (mandatory, run every time)

Step 2 checks "is feature present." This step checks "is feature — present or future — implemented in a way that will go wrong," per the pitfall catalog below (mirrors a project research doc's §11, where one exists — keep them in sync if it does). Run every entry, every audit. Each entry: grep/read to run, `Applies` verdict (`now` / `once <feature>` / `n/a — feature absent`), and a wrong/fixed pair to pattern-match — self-contained here so the scan never needs a second file open.

**Report every entry**, even `n/a` — `n/a` today flipping to `now` after future change is how this becomes continuous-improvement loop instead of one-shot report (see "When this runs").

### Color management (research §11.1)

- **P-11.1a** double gamma correction. Grep: `grep -rn "outputEncoding\|sRGBEncoding\|\.encoding = " src/`. Applies: n/a today (no such calls; `outputColorSpace` not set yet — see 2.1). WRONG: `texture.encoding = THREE.sRGBEncoding; renderer.outputEncoding = THREE.sRGBEncoding;` FIXED: `texture.colorSpace = THREE.SRGBColorSpace; renderer.outputColorSpace = THREE.SRGBColorSpace;` (set once, one place).
- **P-11.1b** data map tagged sRGB. Grep: `grep -rn "\.colorSpace" src/`. Applies: n/a until any `normalMap`/`roughnessMap`/`aoMap` is introduced. WRONG: `normalMap.colorSpace = THREE.SRGBColorSpace;` FIXED: `normalMap.colorSpace = THREE.NoColorSpace;` (only color map gets `SRGBColorSpace`).
- **P-11.1c** inconsistent per-material tone-mapping opt-out. Grep: `grep -rn "toneMapped" src/`. Applies: n/a if HUD/overlay elements are DOM siblings of `<Canvas>` rather than in-canvas meshes (sidesteps this entirely); once in scope: WRONG: an in-canvas HUD mesh's `toneMapped` left unset while the scene has tone mapping. FIXED: `hudMaterial.toneMapped = false;` on any such mesh.
- **P-11.1d** custom shader missing texture colorSpace under r3f v9. Grep: `grep -rn "ShaderMaterial\|onBeforeCompile\|RawShaderMaterial" src/`. Applies: n/a on stock materials (`meshStandardMaterial` etc. still auto-convert); live once any custom shader consumes a color texture — r3f v9 dropped automatic sRGB conversion there. WRONG: `<shaderMaterial uniforms={{ map: { value: colorTex } }} />` with `colorTex.colorSpace` left at default (`NoColorSpace`). FIXED: `colorTex.colorSpace = THREE.SRGBColorSpace;` set once on load, before passing as uniform.

### Lighting / IBL (research §11.2)

- **P-11.2a** too many shadow-casting lights. Grep: `grep -rn "castShadow" src/`. Applies: n/a — zero lights (see 2.2). Once added: WRONG: `{lights.map((l) => <pointLight key={l.id} castShadow position={l.pos} />)}` (many casters). FIXED: one `<directionalLight castShadow>` key light + `<Environment>` for ambient fill.
- **P-11.2b** missing environment map. Grep: `grep -rn "<Environment" src/` (currently zero). Applies: now — live gap, not future risk; see 2.2/2.6. WRONG: `<meshStandardMaterial metalness={1} />` with no `scene.environment`. FIXED: add `<Environment preset="city" />` as sibling of `<Model />`.
- **P-11.2c** environment intensity vs. exposure mismatch. Grep: `grep -rn "environmentIntensity\|toneMappingExposure" src/`. Applies: n/a until both exist. WRONG: tuning `environmentIntensity` alone after `toneMappingExposure` change. FIXED: re-check both together against known-material reference whenever either changes.
- **P-11.2d** stale physically-correct light-unit assumptions. Grep: `grep -rn "useLegacyLights\|physicallyCorrectLights" src/` (should stay zero — three.js r155+ flipped `WebGLRenderer.useLegacyLights` default to `false` and removed the legacy path entirely in later releases; on any three.js at or past that line, reintroducing either flag is a regression, not a fix). Applies: now, as guard — confirm no future PR reintroduces it, and any new light's `intensity`/`decay` tuned empirically against the current (non-legacy) falloff, not copied from a pre-r155 tutorial or example. WRONG: `new THREE.PointLight(0xffffff, 1, 100, 1)` copied from old example with `decay: 1`. FIXED: `new THREE.PointLight(0xffffff, intensity, 100, 2)` — `decay: 2`, intensity re-tuned against current renderer, not ported. **Accept**: grep returns zero hits AND installed `three` version confirmed ≥0.155 (check `package.json`) — both conditions, not either alone.
- **P-11.2e** baked vs. real-time shadow conflict. Grep: `grep -rn "AccumulativeShadows\|RandomizedLight" src/`. Applies: n/a until adopted. WRONG: baking `AccumulativeShadows` under a moving/animated part. FIXED: baked shadow-catchers for static scenery only; anything animated (timeline scrubbing, exploded-view transitions, any per-frame position change) gets a real-time shadow.
- **P-11.2f** light leaking through thin/open geometry. Grep the geometry-generation code for near-zero-dimension parts (thin plates, panels). Applies: n/a until shadows exist; re-check once 2.4 lands. WRONG: `shadow.camera.near = 5` when an occluder sits closer than 5 units to the light. FIXED: `shadow.camera.near` small enough to include the closest occluder, tightened with `far` (see P-11.4b).

### Material / PBR correctness (research §11.3)

- **P-11.3a** non-binary metalness on ordinary materials. Grep: `grep -rn "metalness={0\.[1-9]" src/` (n/a today — no `metalness` prop anywhere; `meshBasicMaterial` has none). Applies: once 2.2/2.3 introduce `meshStandardMaterial`. WRONG: `<meshStandardMaterial metalness={0.5} roughness={0.5} />`. FIXED: `<meshStandardMaterial metalness={1.0} roughness={0.6} />` (or `metalness={0}` for non-metals — vary `roughness`, not `metalness`, for "worn" vs "clean").
- **P-11.3b** normal-map Y-channel handedness. Grep: `grep -rn "normalMap\|normalScale" src/` (zero today). Applies: n/a — no normal maps in generated-box model. WRONG: importing OpenGL-convention normal map unflipped. FIXED: `material.normalScale.set(1, -1);` if source map uses other convention.
- **P-11.3c** missing mipmaps/anisotropy. Grep: `grep -rn "TextureLoader\|generateMipmaps\|anisotropy" src/` (zero — no textures; every surface flat `color`). Applies: n/a today; live moment any texture loaded (e.g. ground/gravel plane). WRONG: `textureLoader.load('gravel.jpg')` with defaults on ground plane. FIXED: `tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();`.
- **P-11.3d** overusing `MeshPhysicalMaterial` extensions. Grep: `grep -rn "clearcoat\|transmission\|iridescence\|sheen" src/`. Applies: n/a; flag the first time any such prop is added to more than a couple of "hero" materials — these are expensive and easy to over-apply generically. WRONG: `transmission` applied across every generated part. FIXED: reserve for a specific glazing/glass/coated part kind, if one exists.
- **P-11.3e** transparent sort-order artifacts. Grep: `grep -rn "transparent" src/` and check for a paired `renderOrder`. Applies: now, wherever `transparent` is set on overlapping geometry with no explicit sort control — common in scenes where a "role"/"kind" field drives which parts render translucent (e.g. selection highlighting, ghosted/hidden states). WRONG: `<mesh ...><meshBasicMaterial transparent={transparent} .../></mesh>` with no `renderOrder` on known-overlapping parts. FIXED: `<mesh renderOrder={isTranslucent ? 1 : 0} ...>` on known-overlapping pairs, once a visual sorting artifact is actually observed (don't preemptively `renderOrder` everything — confirm the artifact first).

### Shadows (research §11.4)

- **P-11.4a** shadow acne / peter-panning. Grep: `grep -rn "shadow-bias\|shadow\.bias\|shadow-normalBias" src/` (n/a — zero shadow-casting lights). Applies: once 2.4 lands. WRONG: `<directionalLight castShadow />` (bias defaults, `bias≈-0.0001`, `normalBias: 0`). FIXED: `<directionalLight castShadow shadow-bias={-0.005} shadow-normalBias={0.02} />`.
- **P-11.4b** shadow-map resolution/frustum mismatch. Grep: `grep -rn "shadow-mapSize\|shadow\.camera" src/`. Applies: once 2.4 lands. WRONG: `shadow.camera.left/right/top/bottom` left at three.js defaults (±5) against the model's actual world-space bounds (which are almost always larger). FIXED: fit the frustum to the model's real bounds first, then raise `mapSize` — tighten before upsize.
- **P-11.4c** no cascaded shadow maps. Applies: n/a at this scale (single model within `BOUNDS`); revisit only at site-wide/multi-building scale.
- **P-11.4d** `ContactShadows` direction mismatch with real key light. Grep: `grep -rn "ContactShadows" src/` (zero today). Applies: n/a until adopted; if adopted, verify implied top-down direction against chosen `directionalLight` position in 2.4 — don't add both with mismatched directions.
- **P-11.4e** soft shadow cost on mobile. Grep: `grep -rn "shadows=\"soft\"\|PCFSoftShadowMap" src/`. Applies: once 2.4/2.9 land — gate by the project's quality tier (see 2.9), not a hardcoded `shadows="soft"`.
- **P-11.4f** light leaking at thin dividers — see P-11.2f (same root cause, shadow angle: check `shadow.camera.near` once any light exists).

### Post-processing (research §11.5)

- **P-11.5a** bloom on everything. Grep: `grep -rn "<Bloom\|BloomEffect" src/` (zero — no `postprocessing` dependency in `package.json`). Applies: n/a until package installed and `<Bloom>` added. WRONG: `<Bloom luminanceThreshold={0} />`. FIXED: `<Bloom luminanceThreshold={1.0} luminanceSmoothing={0.3} intensity={0.6} />`.
- **P-11.5b** double tone mapping. Grep: `grep -rn "toneMapping\|ToneMappingEffect" src/` (n/a — `toneMapping` not set anywhere yet). Applies: moment BOTH `renderer.toneMapping` (2.7) AND composer `<ToneMapping>` effect added — check combination, not each alone. WRONG: renderer `toneMapping = ACESFilmicToneMapping` **and** `ToneMappingEffect` in composer. FIXED: exactly one — renderer-level simplest here; skip composer tone-mapping effect.
- **P-11.5c** SSAO halos. Grep: `grep -rn "<SSAO\|SSAOEffect" src/` (n/a today). Applies: once 2.5 lands. WRONG: `<SSAO radius={2} depthAwareUpsampling={false} />` (wide radius, no depth-aware upsampling — halos at part silhouettes, of which box model has many). FIXED: `<SSAO radius={0.4} depthAwareUpsampling intensity={20} />`.
- **P-11.5d** SSR on thin geometry. Grep: `grep -rn "<SSR\|SSREffect" src/` (n/a). Applies: n/a — model includes `kind: 'pipe'` parts (thin cylinders/boxes), exactly geometry class SSR breaks on per research §11.5d; if SSR proposed, flag pipes as risk case, recommend `<Environment>`-only reflections.
- **P-11.5e** over-stacked grading effects. Grep: `grep -rn "<Vignette\|<ChromaticAberration\|<HueSaturation" src/` (n/a). Applies: once two+ grading effects stacked — review composite against no-post render before shipping.

### Anti-aliasing (research §11.6)

- **P-11.6a** MSAA defeated by render-target composer. Grep: `grep -rn "antialias" src/` at the scene root. Applies: **will apply the moment `EffectComposer` is introduced** (2.5/2.7) — re-check then, since a passing "context antialias: true, no composer" state flips to failing instantly if a composer is added without `SMAAEffect` or a multisampled render target. WRONG: `<EffectComposer>` with no AA effect and no multisampled target. FIXED: `new THREE.WebGLRenderTarget(w, h, { samples: 4 })` passed to composer, or `SMAAEffect` in the pass.
- **P-11.6b** unclamped DPR. Grep: `grep -n "dpr=" src/` at the scene root. Applies: check whether `dpr` is clamped (e.g. `dpr={[1, 2]}`) vs. unclamped (`dpr={window.devicePixelRatio}`, unsafe on high-DPI mobile). FIXED: clamp to a sane range, e.g. `[1, 2]`.
- **P-11.6c** TAA ghosting. Grep: `grep -rn "TAA\|TemporalAA" src/`. Applies: n/a unless TAA is proposed — flag then and cross-check against any per-frame position jumps (camera rigs, exploded-view transitions, timeline scrubbing) or discontinuous visibility toggling, both cases likely to ghost under TAA.

### Performance-vs-realism tradeoffs (research §11.7)

- **P-11.7a** draw-call explosion. Grep: how the scene root maps parts to meshes — one `<Mesh>` per part is the common starting point. Applies: now, as an open measurement task — don't assume instancing is needed without measuring first (4b). WRONG: assuming instancing is needed without measuring. FIXED: profile frame time first; only then consider `<Instances>`/merged geometry for repeated part kinds sharing one geometry.
- **P-11.7b** uncompressed HDRI/texture memory. Grep: `grep -rn "RGBELoader\|\.hdr\|KTX2Loader" src/`. Applies: the moment 2.2 adds `<Environment>` — check whether a `preset` (CDN-hosted, uncompressed) or a local compressed `.ktx2`/modest `.hdr` is used. WRONG: `<Environment files="studio_4k.hdr" />` shipped uncompressed. FIXED: KTX2/Basis-compressed environment or a modest `.hdr`, transcoded via `KTX2Loader`.
- **P-11.7c** expensive effects running unconditionally. Grep: `grep -rn "quality" src/` — if a `quality`-style field exists in state but nothing reads it (only written by a setter), that's a live, named gap. FIXED: see 2.9 — gate `shadow-mapSize`, SSAO resolution, and shadow-casting behind the quality tier.
- **P-11.7d** over-tessellated geometry. Grep: `grep -rn "boxGeometry\|CylinderGeometry\|SphereGeometry" src/` at the scene root — box-only geometry can't over-tessellate. Applies: n/a until a curved primitive (bolt heads, pipe fittings, fasteners) is added — match segment count to on-screen size then, not a copy-pasted default.

### React / r3f-specific pitfalls (research §11.8)

- **P-11.8a** geometry/material recreated every render. Grep: `grep -rn "new THREE\." src/` — geometry/material declared as JSX (`<boxGeometry args={...} />`, `<meshStandardMaterial .../>`) is correctly reconciled by r3f and costs nothing extra per render; imperative `new THREE.BoxGeometry(...)` inside a component body without memoizing recreates it every render. Applies: now — confirm which pattern this repo uses; if JSX-declarative, note as already correct and a pattern to protect against regression.
- **P-11.8b** `dispose={null}` needed for shared resources. Grep: `grep -rn "dispose=" src/`. Applies: once geometry/material sharing is introduced (P-11.7a fix, e.g. one `BoxGeometry` shared across `<Instances>`) — check whether any consumer needs `dispose={null}` to avoid an early dispose of a still-in-use shared resource.
- **P-11.8c** asset loading outside Suspense/`useLoader`. Grep: `grep -rn "TextureLoader\|useLoader\|Suspense" src/`. Applies: n/a if the model is procedurally generated with no texture/GLB load; once one is introduced, confirm it goes through `useLoader` wrapped in `Suspense`, not a raw `TextureLoader.load()` call outside React's lifecycle.
- **P-11.8d** `<Environment>` reloading on remount. Grep: `grep -rn "<Environment" src/` and check whether it's nested inside a mode-conditional block (e.g. `{mode === 'realistic' && <Environment ... />}`) — remount on every mode switch re-triggers the HDRI load. Applies: check once 2.2/2.9 are implemented. WRONG: `{realistic && <><Environment preset="city" /><Model /></>}`. FIXED: `<Environment preset="city" />` always mounted; the model's *material choice* (not the environment's mount state) branches on `realistic`.
- **P-11.8e** `setState`/store-`set()` inside `useFrame`. Grep: `grep -rn "useFrame" src/`. For each hit, confirm it mutates three.js objects directly (`camera.position.copy(...)`, `controls.update()`) rather than calling a React state setter or store `set()` every frame — the latter causes a re-render per frame, a common perf mistake in camera rigs and animation loops. WRONG: `useFrame(() => { setCameraPosition(camera.position); })`. FIXED: `useFrame(() => { camera.position.copy(computed); controls.update(); })`.
- **P-11.8f** `@react-three/fiber` version behind installed React. Grep: `grep -n '"react"\|"@react-three/fiber"' package.json`. Applies: now — check every audit, since a React major bump can silently outrun the pinned r3f version. WRONG: React `^19.2.0` with `@react-three/fiber` `<9.5.0` (v9.5.0 is the version that added its own reconciler for React 19.0–19.2, including the `Activity` feature — earlier v9.x targets narrower React ranges). FIXED: bump `@react-three/fiber` to ≥9.5.0 before or alongside any React 19.2 upgrade; re-run this whole audit after (a renderer major bump can shift default behaviors covered elsewhere in this file). **Accept**: `package.json` `@react-three/fiber` semver satisfies the installed `react` major/minor per the pmndrs release notes for that r3f version — don't assume compatibility, read the release notes for the exact pinned version.

### Rare/subtle (research §11.9)

- **P-11.9a** glTF Y-up/unit mismatch. Grep: `grep -rn "GLTFLoader\|\.gltf\|\.glb" src/`. Applies: n/a if the model is procedurally generated rather than GLB-loaded; re-check if/when the project moves toward loading real GLB/glTF assets — glTF is Y-up and meters by default, verify against this repo's world convention before trusting positions.
- **P-11.9b** `KHR_materials_emissive_strength` / clamped emissive. Grep: `grep -rn "emissive" src/`. Applies: n/a until an emissive part (e.g. a lit fixture) is added; if bloom (2.7) is also added, plain `emissiveIntensity` must exceed `1.0` to register against a `luminanceThreshold` of `1.0`.
- **P-11.9c** z-fighting at large world coordinates. Applies: n/a for scenes spanning tens of meters at the origin; revisit only if the scene moves to geo-referenced/large-offset world coordinates.
- **P-11.9d** WebGPU/TSL parity gaps. Grep: `grep -rn "WebGPURenderer\|WebGPU\|three/tsl\|from 'three/webgpu'" src/`. Applies: n/a while on plain `WebGLRenderer` path — stays out of scope for this audit *as a migration target*, hand off as own initiative if proposed. **Becomes in-scope the moment `grep` above returns a hit** (someone started the migration): confirm (1) `Canvas`'s `gl` prop is an async factory (`gl={async (props) => { const r = new THREE.WebGPURenderer(props); await r.init(); return r; }}` — this is the documented r3f v9 pattern, not a sync renderer instance) and (2) every Step 2/2.5 rule in this file still applies to the WebGPU path (most do — color management, shadow bias, AO cost — but re-verify each, don't assume WebGL findings port silently). As of this writing (Sep 2026) r3f's WebGPU/TSL support is a v10 **alpha** line (also adding multi-canvas GPU-context sharing and a standalone `useFrame` scheduler) — treat any WebGPU punch-list item as experimental-track, not main-track, until v10 stabilizes. No specific three.js version is a confirmed "WebGPU-ready" gate — don't cite one.
- **P-11.9e** 8-bit render-target banding. Grep: `grep -rn "HalfFloatType\|dithering" src/` (n/a — no render targets/composer yet). Applies: once 2.5/2.7 introduce `EffectComposer` — check composer render-target `type` then. WRONG: default `UnsignedByteType` composer target under bloom. FIXED: `new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType })`, or `material.dithering = true` as cheaper fallback.

### Book-derived pitfalls (P-B.*, from references/ — RTR3 / PBRT3)

Same rules: run every entry, report every verdict. No research-doc `§` yet — cite ref file; if one becomes punch-list item, also add to research §11 so catalogs don't drift. Run every grep from the repo root (or active worktree root); widen `src/` if realistic-mode code lives elsewhere. "Verify" entries need value read or screenshot, not just grep hit.

**Materials (ref-02, ref-03)**
- **P-B.1** metal F0 out of physical range. Read: every material with `metalness` ≥ 0.9 (GLB materials: `__gl.scene.traverse` in DEV). Applies: once any metal exists. WRONG: `metalness 1` with linear `color` < 0.5 or pure white. FIXED: color from RTR3 T7.4 (steel/iron ≈ 0.56 linear, aluminum ≈ 0.91).
- **P-B.2** diffuse albedo out of range. Verify: mean linear base color per non-metal material (texture average × `color`). Applies: once lit materials exist. WRONG: concrete/soil/stone > ~0.5 linear, or any albedo < 0.02 / > 0.9. FIXED: concrete/stone/soil 0.15–0.4, white paint ≈ 0.7 (RTR3 §7.5.4).
- **P-B.3** specular aliasing at distance. Verify: orbit far shot — glints on small normal-mapped/glossy parts flicker frame to frame. Applies: once normal maps + low roughness exist. WRONG: renormalized normal mips with fixed roughness. FIXED: raise roughness in far mips / bake normal variance into roughness (Toksvig, RTR3 §7.8.1), or shader-LOD normal map off.
- **P-B.4** custom BRDF without normalization/Fresnel. Grep: `grep -rn "onBeforeCompile\|ShaderMaterial\|RawShaderMaterial" src/`. Applies: n/a unless custom lit shader exists. WRONG: `pow(max(dot(R,V),0.), shininess)` Phong lobe, constant specular. FIXED: half-vector lobe with `(m+8)/(8π)` normalization × Schlick F, or stay on `MeshStandardMaterial`.
- **P-B.5** colored specular on insulator. Grep: `grep -rn "specularColor\|specularIntensity" src/`. Applies: n/a until `MeshPhysicalMaterial` specular props used. WRONG: tinted `specularColor` on plastic/paint/concrete. FIXED: leave white; color in albedo (RTR3 §7.5.2).
- **P-B.10** normal-map tangent handedness on mirrored UVs. Verify: raking light across mirrored part — relief inverts on one half. Applies: once normal maps on mirrored UVs exist. FIXED: export tangents with w sign (glTF `TANGENT` vec4) or recompute (RTR3 §6.7).
- **P-B.11** compression format vs data type. Grep: `grep -rn "KTX2Loader\|\.ktx2\|basis" src/ public/`. Applies: once KTX2 adopted. WRONG: normal maps in ETC1S/color formats. FIXED: UASTC (or BC5-style 2-channel) for normals, ETC1S for color (RTR3 §6.2.6).
- **P-B.29** stale three.js version misses recent PBR fixes. Grep: `grep -n '"three"' package.json`. Applies: now, every audit — three.js is actively revising physical accuracy (e.g. r186, Sep 2026, improved energy conservation in diffuse and sheen lighting calculations; a genuine physical-correctness delta, not cosmetic). WRONG: pinning `three` far below current and assuming material appearance is version-independent. FIXED: no forced upgrade mandated by this rule alone, but note installed version in the audit report and flag if >2 minor versions behind current three.js release — a stale pin silently ages every F0/albedo/roughness value checked elsewhere in this file. **Accept**: `package.json` three.js version recorded in audit output; if audit finds material-appearance discrepancy vs P-B.1–P-B.5 that isn't explained by scene code, check changelog for the installed version before concluding the scene code is wrong.

**Color pipeline (ref-01, ref-07)**
- **P-B.6** effect after output encode. Grep: `grep -rn "OutputPass\|EffectComposer\|<EffectComposer" src/`. Applies: once composer exists. WRONG: any pass after output/encode pass, or bloom on 8-bit sRGB target. FIXED: output pass last; effects on linear half-float targets (RTR3 §5.8).
- **P-B.7** legacy luma weights. Grep: `grep -rn "0\.299\|0\.587\|0\.30 *\* \|0\.59" src/`. Applies: n/a unless custom luminance code exists. FIXED: `0.2126, 0.7152, 0.0722` on linear RGB (RTR3 eq. 7.11).

**Transparency / AA (ref-06)**
- **P-B.8** alpha-test cutouts with MSAA. Grep: `grep -rn "alphaTest" src/`. Applies: n/a until cutout textures (grating, mesh, foliage) exist. WRONG: `alphaTest: 0.5` alone (MSAA can't smooth). FIXED: `alphaToCoverage: true` with context MSAA (RTR3 §6.6).
- **P-B.9** transparent writes depth. Grep: `grep -rn "transparent" src/` then read paired `depthWrite`. Applies: now wherever `transparent` set. WRONG: `transparent` with `depthWrite` true. FIXED: `depthWrite={false}` for blended parts (RTR3 §5.7).

**Lighting (ref-04)**
- **P-B.12** sun double-count. Verify: open HDRI — visible sun disc? and `grep -rn "directionalLight" src/`. Applies: now on any branch with HDRI + directional light. WRONG: sun-bearing HDRI at full intensity plus independent sun light. FIXED: sun-clipped HDRI with directional light as key, or align light to HDRI sun and lower `environmentIntensity`.
- **P-B.13** constant ambient on top of IBL. Grep: `grep -rn "ambientLight" src/`. Applies: now wherever both `ambientLight` and `<Environment>` exist. WRONG: `<ambientLight>` as fill with no AO. FIXED: remove, or `hemisphereLight` sky/ground, plus AO (RTR3 §8.3, §8.6.3).
- **P-B.14** env reflection on large flat smooth surfaces. Verify: any ground/slab/plate with roughness < ~0.3. Applies: once such surface exists. WRONG: relying on `scene.environment` for mirror-like floor. FIXED: planar reflector, or raise roughness (RTR3 §8.4, §9.3.1).
- **P-B.15** light color temperature vs environment. Verify: directional light `color` vs HDRI time of day. Applies: now with HDRI + colored lights. WRONG: warm ~3000 K key under noon-blue sky capture. FIXED: match (D65 ≈ neutral for noon; warm only with low-sun HDRI) (PBRT3 §12.1).

**Shadows / AO (ref-05)**
- **P-B.16** uniform soft shadows at contact. Verify: base-plate/column-to-ground screenshot at each `quality` tier. Applies: now wherever shadows exist without contact hardening on active tier. WRONG: `PCFSoftShadowMap`/`shadow.radius` only, contact cue gated to one tier. FIXED: PCSS or contact shadows/AO on every tier showing ground (RTR3 §9.1.4).
- **P-B.17** AO darkening direct light. Grep: `grep -rn "SSAO\|N8AO\|aoMap" src/`. Applies: once any AO exists. WRONG: SSAO multiplied over final lit image in bright sun. FIXED: AO on indirect/ambient only (three.js `aoMap` already does; post AO needs low sunlit intensity) (RTR3 eq. 9.16).
- **P-B.18** depth-only SSAO. Applies: once SSAO lands (with P-11.5c). WRONG: flat faces uniformly grey, bright rims at silhouettes. FIXED: normal-aware hemisphere sampling + depth-aware blur (RTR3 §9.2.5).
- **P-B.19** VSM bleeding on stacked members. Grep: `grep -rn "VSMShadowMap" src/`. Applies: n/a unless VSM chosen. WRONG: VSM on dense steel lattice. FIXED: PCF/PCSS (RTR3 §9.1.4).
- **P-B.20** shadow shimmer. Grep: `grep -rn "shadow-camera\|shadow\.camera" src/` and check whether frustum follows camera. Applies: only if light frustum moves with view. FIXED: snap frustum to world-space texel increments (RTR3 §9.1.4).

**Tone / fog (ref-07)**
- **P-B.21** fog model. Grep: `grep -rn "fogExp2\|FogExp2\|<fog" src/`. Applies: now wherever `FogExp2` used for realism. WRONG: squared-exponential, view-plane depth treated as physical. FIXED: exponential in radial distance (custom fog chunk), or accept FogExp2 as stylistic and say so (RTR3 §10.15).
- **P-B.22** fog color vs horizon. Verify: fog color vs HDRI horizon at 2+ headings. Applies: now with fog + HDRI background. WRONG: flat grey fog against blue horizon. FIXED: fog color sampled from horizon (aerial perspective, RTR3 §10.15).
- **P-B.23** LDR environment. Read: resolved env path — `grep -rn "HDRI_URL\|<Environment" src/`, then check the referenced file's extension/format. Applies: now if IBL loads an 8-bit image. FIXED: `.hdr`/`.exr`/KTX2 HDR (RTR3 §10.11.1).
- **P-B.24** exposure by eye. Grep: `grep -rn "toneMappingExposure" src/`. Applies: now wherever exposure is magic number. FIXED: record rationale — log-average luminance vs key 0.18 at audit shot (RTR3 eq. 10.8–10.10).

**Performance (ref-08)**
- **P-B.25** small-batch problem. Measure: `__gl.gl.info.render.calls` and `triangles`; compute tris ÷ meshes. Applies: now if meshes average < ~200 tris and share few materials. FIXED: merge by material / `BatchedMesh` / instancing, keep per-part IDs as attributes (RTR3 §15.4.2).
- **P-B.26** unlocated bottleneck. Measure: frame time at DPR 1 vs 0.5, and with `castShadow` off. Applies: now, every cycle, before any perf item. FIXED: name bound stage in punch list (RTR3 §15.2).
- **P-B.27** LOD without hysteresis / wrong metric. Grep: `grep -rn "<Detailed\|THREE.LOD\|addLevel" src/`. Applies: n/a until LOD exists. FIXED: hysteresis band; box projected area for thin members (RTR3 §14.7.2).
- **P-B.28** full-detail shadow casters. Measure: calls with `castShadow` on vs off. Applies: now if shadow pass ≈ main pass cost. FIXED: merged/low-detail proxy casters (RTR3 §9.1.5).

## Step 3 — output format

Merge Step 2 dimension findings and Step 2.5 pitfall results into one list — pitfall marked `Applies: now` (e.g. P-11.3e's live transparency sort-order gap, or P-11.7c's dead `quality` field) is first-class punch-list item, not footnote; `Applies: once <feature>` entry folds into that feature's item as "watch for" note, not listed separately. Produce **prioritized punch list**, high/medium/low impact, each item with:

Assign label by rubric, not feel:
- **HIGH** — visibly wrong or flat *today* at normal viewing distance, or hard blocker for other items (2.2's material swap blocks everything below). Anything non-expert would notice in side-by-side screenshot.
- **MEDIUM** — visible on inspection, or correct-but-unsafe (pitfall with `Applies` `now` and latent symptom, like P-11.3e's unsorted transparency).
- **LOW** — perceptible only against reference, or purely preventative (`Applies: once <feature>` guard costing nothing to apply early).

Pitfall `Applies: n/a` is **not** punch-list item at any priority — report in Step 2.5 scan table, leave there.

```
[HIGH] <one-line title>
  Where: <file>:<line> (exact, from what you just read in Step 1 — never guess a line number)
  Now:   <what's actually there today, quoted>
  Why: project research doc §<n> (if one exists) and/or ref-0N (RTR3|PBRT3 §x.y) — <one-clause reason>
  Implementation:
    <full step-by-step build guide — see required shape below, not a one-line diff>
  Parameters: <every numeric/enum knob touched, starting value, and why that value — table if 3+>
  Failure modes: <specific ways THIS change breaks, symptom → cause → fix, not generic advice>
  Accept: <falsifiable pass/fail rule that proves the change landed and works — see rule types below>
  Depends on: <other punch-list item, if sequencing matters — e.g. "2.4 shadows depends on 2.2 lighting">
```

**`Implementation:` must be buildable by someone who has not read this skill or the research doc.** A single diff fragment is not enough — write it as an ordered sequence someone can execute top to bottom:

1. **Full code, not a fragment.** Quote the complete before-state of the function/component/block being changed (from what Step 1 actually read), then the complete after-state — every import, every prop, every closing tag — not `...` elisions in the parts that changed. A fragment forces the implementer to guess how it merges with surrounding code; guessing is where "should work now" bugs come from.
2. **Order multi-part changes.** If the change touches more than one file or more than one spot in a file (e.g. 2.2's material swap + `<Environment>` addition), number the parts in the order they must land — state explicitly if order doesn't matter vs. must be sequential (e.g. "material change alone is invisible until the light/environment part also lands — implement both before testing either").
3. **Name every new dependency.** Package name, exact install command (`npm install @react-three/postprocessing`), and the minimum version this skill's research relies on (see P-11.8f-style version checks) — don't assume the reader will infer the package from an import line.
4. **State the manual verification action**, distinct from `Accept:` — `Accept:` is the automated/measurable pass criterion; this is "open the dev server, orbit to X angle, look for Y" — the concrete human action that produces the evidence `Accept:` checks.

**`Parameters:`** — every prop/uniform/config value touched gets its starting numeric value and the one-clause reason for that value (cite research § or ref-0N), not just the value alone. A value with no stated reason is indistinguishable from a guess to the next person tuning it. Use a table once 3 or more parameters are involved:

| Prop | Value | Why |
|---|---|---|
| `shadow-bias` | `-0.005` | starting point for shadow acne on this geometry scale, research §11.4a |
| `shadow-mapSize` | `[2048, 2048]` | balances resolution vs. mobile cost, tune down under `quality !== 'high'` |

**`Failure modes:`** — at minimum, cover: (a) the most likely way this specific change silently does nothing (e.g. material swapped but no light exists yet — zero visible effect, no error), (b) the most likely way it silently does the wrong thing (e.g. metalness at 0.5 instead of 0/1 — renders, looks plausible, is physically wrong), (c) any interaction with a pitfall from Step 2.5 that this change makes newly `Applies: now`.

**`Accept:` is mandatory, not optional narration.** It must be checkable by someone who didn't write the code, without re-reading this skill's reasoning. Every item's dimension in Step 2/2.5 above already models one; pick the matching rule type rather than inventing a new shape each time:

| Rule type | Form | Example |
|---|---|---|
| **Config/prop check** | `<expr> === <expected value>`, read from live renderer/material, not source guess | `renderer.outputColorSpace === THREE.SRGBColorSpace` (2.1) |
| **Grep-absence/presence** | pattern must (not) match, stated as the exact command | `grep -rn "useLegacyLights" src/` returns zero hits (P-11.2d) |
| **Measured threshold** | numeric value from Step 4b, with the pass boundary stated | effect cost flat vs `triangles` when toggled (2.6b) |
| **Version/compat check** | installed semver satisfies a stated minimum, cite the source of the minimum | `@react-three/fiber` ≥9.5.0 for React 19.2 (P-11.8f) |
| **Visual yes/no** | one specific 4c-style question, answerable from a screenshot, not "looks better" | shaft direction matches key light position (2.6b) |

A punch-list item whose `Accept:` line reduces to "looks good" or "should work now" is not done — go back and find the config value, grep pattern, measured number, or specific screenshot comparison that would prove it.

**Depth is not optional padding — apply the full `Implementation`/`Parameters`/`Failure modes` shape to every `[HIGH]` and `[MEDIUM]` item.** `[LOW]` items may compress `Implementation` to a single confirmed-correct snippet if the change is genuinely one line with no sequencing and no parameter to tune — state why it qualifies for the shorter form rather than defaulting to it.

Order by dependency chain, not just impact — 2.2 (lighting + material swap) blocks nearly everything, so almost always `[HIGH]` #1 regardless. If the project has other, deliberately non-realistic display modes, put 2.9 (mode/quality gating) alongside it so the change ships as a togglable feature, not a silent behavior change to those other modes.

Close the report naming which project research doc sections (if any) and which `references/ref-0N` files were relied on, and explicitly note any place Step 1's live grep/read contradicted an assumption in this skill's example snippets.

## Step 4 — verify empirically (method, not theory)

Steps 2 and 2.5 audit *code*. This step audits *output*. Nothing below makes rendering claim — measurement procedure, so no research `§` citation. (Rendering claims still need one; see top of file.)

Run **before** implementing punch list, for baseline, and **again after**, so each cycle yields comparable pair.

### 4a — capture

Use highest rung available; fall through if tool missing.

1. **Browser MCP** (chrome-devtools or playwright, if connected): `npm run dev`, navigate to dev server, screenshot canvas.
2. **Manual**: `npm run dev`, ask user for screenshot of each mode.
3. **Programmatic** (no MCP needed): if the `<Canvas>`'s `gl` props already set `preserveDrawingBuffer: true`, the drawing buffer survives the frame and `document.querySelector('canvas').toDataURL()` returns the current frame from devtools console without re-rendering. If not set, add it (dev-only is fine) before relying on this rung.

For the `renderer.info` counters in 4b, a renderer handle reachable from outside React is needed. If the scene root doesn't already expose one, add a dev-gated line:

```tsx
// inside the scene root's existing onCreated
onCreated={({ gl, scene, camera }) => {
  // ...existing setup...
  if (import.meta.env.DEV) {
    (window as unknown as { __gl?: unknown }).__gl = { gl, scene, camera }; // audit handle; DEV only
  }
}}
```

`info.render.calls` resets per `render()` and counts the shadow pass too, so with `shadowMap.autoUpdate` on it reads roughly double the visible mesh count. If the project's state store is reachable from a module path, scripted mode/shot switches from the console look like `(await import('/src/store/yourStore.ts')).useStore.getState().setMode('realistic')` — adapt the import path to this repo.

This instrumentation line is not a punch-list item — ship it behind `import.meta.env.DEV` (or equivalent), stripped from production builds by the bundler.

### 4b — record these numbers, every cycle

Same camera position and same `mode` across before/after, else comparison meaningless. From devtools console:

```js
__gl.gl.info.render.calls      // draw calls — the P-11.7a measurement
__gl.gl.info.render.triangles  // geometry budget
__gl.gl.info.memory.textures   // texture count — catches P-11.7b HDRI bloat
__gl.gl.info.memory.geometries // catches P-11.8a/b leaks: should be stable across mode switches,
                            // not climbing every toggle
```

Frame time: devtools Performance panel, or drei's `<Stats />` added temporarily. One screenshot per display mode the project has — a realism change silently altering other, deliberately non-realistic modes is a regression, not an improvement.

Report before/after delta in punch list closing section. Change improving appearance while doubling draw calls = tradeoff to state out loud, not silent win.

### 4c — perceptual check (the squint test)

Feature-presence audits pass while render still looks wrong. Look at `realistic`-mode screenshot, answer each yes/no:

- **Grounded?** Every part sits on/attaches to something, or parts float? (Missing contact shadows usual cause.)
- **Clipped?** Pure-black regions with no detail, or blown-out pure-white areas? Both mean exposure/tone mapping needs attention, not more lights.
- **Energy-conserving highlights?** Bright speculars fall off gradually, or read as flat painted-on patches?
- **Legible at squint?** Blur eyes (or downscale to ~200px): structure silhouette still readable, or post-processing washed out?
- **Varied?** Surfaces sharing one material still differ by orientation to light, or uniformly flat-shaded?
- **Still correct?** Compare against a non-realistic/schematic mode screenshot, if one exists — geometry, selection highlight, clipping planes unchanged.
- **Plausible values?** Metals read as F0 color, concrete/soil mid-dark (albedo 0.15–0.4), nothing non-emissive glows (ref-02).
- **Contact hardening?** Shadows sharpen where members meet ground, soften with distance (ref-05, RTR3 §9.1.4).
- **Grazing views honest?** Low camera: flat surfaces brighten toward horizon (Fresnel), highlights stretch rather than stay round (ref-02).
- **Atmosphere consistent?** Rotate in place: fog on fixed distant member doesn't change, fog color matches horizon behind it (ref-07).
- **Stable in motion?** Orbit slowly: no shimmering glints, crawling textures, or swimming shadow edges (ref-03, ref-05, ref-06).

Any "no" → punch-list item with failing question quoted as `Now:` line.

### 4d — when to stop

Loop has exit. Stop auditing, declare scene good enough when all hold:

- Every Step 2.5 entry reads `Applies: n/a` or `already correct`.
- Every open punch-list item's `Accept:` rule (Step 3) passes when re-checked, not just "implemented."
- Every 4c question answers "yes".
- Last two cycles produced only `[LOW]` items.
- Frame time inside budget at target `quality` tier on weakest supported device.

Last two cycles only `[LOW]` but 4c still has "no" → bottleneck not code, it's reference. Get target image (photo or render of real structure) and audit against it instead of another feature sweep.