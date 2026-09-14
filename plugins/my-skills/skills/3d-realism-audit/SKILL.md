---
name: 3d-realism-audit
description: Use when asked to audit, improve, or increase the photorealism of the three.js / react-three-fiber scene in a web project — review lighting, materials, color management, shadows, AO, reflections, post-processing, anti-aliasing, or geometry detail and produce a prioritized punch list of concrete code changes. Grounded in the repo research doc plus Real-Time Rendering 3e and Physically Based Rendering 3e reference notes.
---

# 3D realism audit — three.js / R3F project

Audit real three.js / `@react-three/fiber` scene in repo against current (2024–2025) real-time-rendering best practice. Output: prioritized, file:line-grounded punch list of concrete code changes.

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
- After any change to `src/diagram/DiagramScene.tsx`, `src/app/Viewport.tsx`, `src/diagram/palette.ts`, or `src/store/viewSlice.ts` (files defining materials, lighting, camera, and `mode`/`quality` state gating rendering fidelity).
- Before treating `ViewControls.tsx` "Realistic" display mode as finished — `docs/FEATURES.md` BUG-4 documents "Realistic" today only hides dimension annotations; applies none of techniques below.
- Whenever `docs/RESEARCH-3D-REALISM.md` gains new section (technique or pitfall) — past "clean" result goes stale purely because research grew, not code.

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

# Post-processing — does the package even exist?
grep -n "postprocessing" package.json
grep -rn "EffectComposer\|<Bloom\|<SSAO\|<Vignette" src/

# Instancing / draw-call shape
grep -rn "InstancedMesh\|<Instances\|<Detailed" src/
```

Read full current contents of:
- the scene root, e.g. `src/diagram/DiagramScene.tsx` (materials, camera, canvas config — nearly every finding below grounded here)
- the color source, e.g. `src/diagram/palette.ts` (color source — CSS custom properties, not hardcoded hex; matters for §2 below)
- the canvas host, e.g. `src/app/Viewport.tsx` (overlay/stats — confirms nothing else touches renderer)
- the view state, e.g. `src/store/viewSlice.ts` and `src/store/types.ts` (`mode`/`quality`/`Quality` state — a `quality` value that is written but never read is a natural hook for device-tier fidelity gate, §9 below)

**Two baselines exist — check which branch first**
(`ls src/diagram/realistic/`):

- **Without `src/diagram/realistic/`** (main, pre-realistic-mode): one `<meshBasicMaterial>` per part, zero lights, zero `<Environment>`, zero post-processing package, `dpr={[1,2]}` clamped, `antialias: true`. Step 2 before/after snippets written against this state.
- **With `src/diagram/realistic/`** (branch `worktree-3d-realism`, commit 98bf09a, audited 2026-09-13): flat modes unchanged; realistic mode mounts `RealisticScene.tsx` → Draco GLB (`StructureGlb.tsx`, 3362 meshes, 7 shared `MeshStandardMaterial`s with full map sets, metalness factors 0.45/0.60 on bolt/weld), local HDRI `<Environment files background>`, one `directionalLight castShadow` with tight frustum + texel-scaled normalBias, `ambientLight` fill, FogExp2, `ContactShadows` gated on `quality === 'high'`. Renderer: `outputColorSpace = SRGBColorSpace` explicit, AgX + exposure 0.8 set by `ToneMappingSwitch` in `DiagramScene.tsx`, `PCFSoftShadowMap`, DEV `window.__gl = { gl, scene, camera }` (object, not renderer — read `__gl.gl.info`). No postprocessing package. No ground slab. Nothing in UI calls `setQuality`, so `quality` stuck at `'balanced'`. Measured (Intel RPL-S iGPU, 820×774 canvas, DPR 1, iso shot): ~6725 calls/frame (main + shadow pass), ~423k tris, 20 textures, frame median 28.6 ms. On this branch Step 2 snippets for 2.1/2.2/2.4 are history — audit `src/diagram/realistic/` directly instead of pattern-matching them.

Anything above contradicts what you just read → **trust what you read, not this file** — update findings, then **edit this SKILL.md's Step 1 baseline and any stale Step 2 snippet in same session**, before writing punch list. Don't merely note drift in report: uncorrected baseline silently mis-grounds every future run, and snippet quoting nonexistent code worse than no snippet.

## Step 2 — audit each dimension

Each dimension: how to detect current state → what "good" looks like (cites research §) → concrete before/after snippet using repo's actual files/patterns. No generic snippet when repo code available to before/after against — always quote real surrounding code (imports, component names) so diff is drop-in patch, not sketch.

### 2.1 Color management

- **Detect**: `grep -rn "outputColorSpace\|colorSpace" src/`. As of writing: no hits. `palette.ts` reads hex strings from CSS custom properties (`getComputedStyle(...).getPropertyValue(...)`) and passes straight to `meshBasicMaterial color={colour}` — three.js `Color` constructor auto-converts hex/string input from `SRGBColorSpace` to linear working space by default, so *accidentally* correct today, but nothing in `DiagramScene.tsx`'s `<Canvas>` sets `renderer.outputColorSpace` explicitly.
- **Good**: research §1, §11.1. Explicit `outputColorSpace`; if any texture ever added (not true today — no `TextureLoader` calls in `src/diagram/`), tag color maps `SRGBColorSpace` and data maps (normal/roughness/AO) `NoColorSpace` per §11.1b.
- **Book**: ref-01 (RTR3 §5.8) — decode every nonlinear input, encode exactly once *after* tone mapping and all post; symptom test = two overlapping lights overbrightening at overlap, or roped AA edges. P-B.6, P-B.7.
- **Before/after** (`src/diagram/DiagramScene.tsx`, inside existing `onCreated` callback of `<Canvas>` in `DiagramScene()`):
```tsx
// BEFORE — DiagramScene.tsx:314, DiagramScene()
onCreated={({ gl }) => {
  gl.localClippingEnabled = true;
}}

// AFTER — decide the color pipeline explicitly instead of relying on the default
onCreated={({ gl }) => {
  gl.localClippingEnabled = true;
  gl.outputColorSpace = THREE.SRGBColorSpace; // explicit, not "whatever r169 defaults to"
}}
```
Callback destructures `{ gl }` — does **not** receive or stash full r3f `state`, and no `window.__r3f` handle in repo. Step 4 programmatic verification needs one; see Step 4 for dev-only line adding it. Don't write snippet here assuming it exists.
- **Impact**: low today (unlit hex colors, little visible difference) but prerequisite for every material/lighting change below — set now so not silent variable when `MeshStandardMaterial`/textures/lights introduced. Research §11.1a warns against leaving implicit and later mixing older-API snippets.

### 2.2 Lighting model & IBL

- **Detect**: `grep -rn "Light\b" src/diagram/ src/app/` — zero results today. `Model()`/`Member()` in `DiagramScene.tsx` render every part with `meshBasicMaterial`, which **ignores lights entirely** — adding lights before changing material = zero visible effect.
- **Good**: research §2 (`MeshStandardMaterial`), §4 (`<Environment>`), §11.2 (light-count and IBL-intensity pitfalls).
- **Book**: ref-04 (RTR3 §8.2–8.6) — split direct (one shadowed key) from indirect (env/irradiance); constant ambient without occlusion reads flat; never double-count sun present in HDRI; env reflections assume distant surroundings (flat smooth surfaces need planar reflection). P-B.12–P-B.15.
- **Before/after** — two-part change (material first, then light/environment), shown together since one inert without other:
```tsx
// BEFORE — Member(), DiagramScene.tsx
<meshBasicMaterial
  color={colour}
  transparent={transparent}
  opacity={transparent ? 0.3 : 1}
  depthWrite={!transparent}
  side={DoubleSide}
  clippingPlanes={planes}
/>

// AFTER — swap to a lit PBR material; requires a light/environment source to be visible at all
<meshStandardMaterial
  color={colour}
  roughness={0.6}
  metalness={role === 'service' ? 1 : 0} // pipes (service role) read as bare steel; everything else is dielectric — endpoints only, see research §11.3a
  transparent={transparent}
  opacity={transparent ? 0.3 : 1}
  depthWrite={!transparent}
  side={DoubleSide}
  clippingPlanes={planes}
/>
```
```tsx
// AFTER — DiagramScene(), add once, sibling of <Model />, not nested inside a
// mode-conditional block (research §11.8d: conditional mounting reloads the HDRI)
<Environment preset="city" />
```
- **Impact**: high — single highest-leverage change in codebase; nothing else in list matters visually until material responds to light. Gate behind `mode === 'realistic'` (see 2.9) rather than replacing `meshBasicMaterial` unconditionally, since `engineering`/`analysis`/`construction` modes deliberately flat per `docs/FEATURES.md`.

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
// BEFORE — DiagramScene(), <Canvas> props
<Canvas
  dpr={[1, 2]}
  gl={{ antialias: true, preserveDrawingBuffer: true }}
  ...
>

// AFTER
<Canvas
  dpr={[1, 2]}
  gl={{ antialias: true, preserveDrawingBuffer: true }}
  shadows="soft" // PCFSoftShadowMap; see research §11.4e re: mobile cost before shipping unconditionally
  ...
>
```
```tsx
// Member(), each mesh — only meaningful once a shadow-casting light exists
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
- **Impact**: medium — most valuable once model has real geometry contact (bolts/plates), which current generated box-per-part model (`src/diagram/model.ts`) has plenty of at connection points.

### 2.6 Reflections

- **Detect**: no `<Environment>`, no SSR — N/A today.
- **Good**: research §4 (IBL as default), §11.5d (SSR experimental/thin-geometry-unsafe — don't default). For steel-frame model with pipes (`kind: 'pipe'`, rendered as `service` role, opaque per `palette.ts`'s `ROLE_BY_KIND`), IBL-only reflection via `<Environment>` is correct default; SSR breaks on thin pipe geometry per §11.5d.
- **Book**: ref-04 (RTR3 §8.4–8.5) and ref-05 (RTR3 §9.3) — prefiltered env mips per roughness; radially symmetric prefiltering wrong on flat floors at grazing views; planar reflections need clip plane + stencil. P-B.14.
- **Impact**: low priority vs 2.2/2.4 — reflections read correctly for free once `<Environment>` + `MeshStandardMaterial` land.

### 2.7 Post-processing / bloom / exposure

- **Detect**: `grep -n "postprocessing" package.json` — absent.
- **Good**: research §7, §11.5a-b, §11.5e.
- **Book**: ref-07 (RTR3 §10.11–10.15) — order: blend → bloom (HDR) → tone map ×1 → grade → encode; set exposure against key ≈ 0.18 from log-average luminance; fixed exposure correct for predictable lighting; bloom = bright-pass + low-res separable blur, additive; physical fog exponential (Beer–Lambert) in radial distance — `FogExp2` is squared-exponential. P-B.6, P-B.21–P-B.24.
- **Before/after**: if adding bloom, set `renderer.toneMapping` and composer tone-mapping ownership consistently (research §11.5b — one place for tone mapping):
```tsx
// AFTER — DiagramScene(), onCreated
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

- **Detect**: `dpr={[1, 2]}` and `gl={{ antialias: true }}` already in `DiagramScene.tsx` — dimension **already correctly handled** per research §11.6b. Re-check only that future `EffectComposer` addition (2.7) doesn't silently defeat context-level MSAA per research §11.6a — needs multisampled render target or `SMAAEffect` once composer introduced.
- **Book**: ref-06 (RTR3 §5.6–5.7) — pick AA per aliasing *type*: MSAA fixes geometry edges only, not specular/normal-map shimmer (ref-03) or alpha-test edges (alpha to coverage); transparents: depth test on / write off, back-to-front, α = 0.5 pairs order-free. P-B.8, P-B.9.
- **Impact**: none needed now; becomes checklist item moment 2.5/2.7 land.

### 2.9 Geometry / normal detail, and the `mode`/`quality` gate

- **Detect**: `src/diagram/model.ts` generates every part as plain box (`boxGeometry args={part.size}`, no normal maps, no sub-part detail). `viewSlice.ts`'s `quality: Quality` field exists but nothing reads it (`docs/CHECKLIST.md` §2.4 flags as dead control).
- **Good**: research §9 (instancing/LOD budget), §11.7c (device-tier gating). Also natural implementation point for `ViewControls.tsx`'s inert "Realistic" mode (`docs/FEATURES.md` BUG-4) and dead `quality` control together: `mode === 'realistic'` switches material/lighting/post-processing on; `quality` scales shadow resolution / SSAO resolution / DPR ceiling.
- **Book**: ref-08 (RTR3 §14.7) — LOD geometry *and* textures *and* shaders by projected size (box area for long thin members), with hysteresis; ref-03 for detail textures (magnification) and bump/normal limits (no silhouettes, no self-shadowing). P-B.27.
- **Before/after**:
```tsx
// AFTER — DiagramScene(), gate the realism stack behind existing store state
const mode = useAppStore((s) => s.mode);
const quality = useAppStore((s) => s.quality);
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
- **Impact**: wiring that makes every other item ship as actual feature (fixing BUG-4 and CHECKLIST §2.4 together) rather than always-on cost — treat as **required**, not optional, alongside whichever of 2.2–2.7 implemented first.

### 2.10 Performance-vs-fidelity tradeoffs (draw calls, instancing)

- **Detect**: `Model()` in `DiagramScene.tsx` maps `visible.map((p) =>
  <Member key={p.id} part={p} .../>)` — one `<mesh>` per part, confirmed against `docs/CHECKLIST.md` §5's open question ("Scene 175 part vẽ một `<mesh>` mỗi part. Đo chi phí frame trước khi cho là cần instancing").
- **Good**: research §9, §11.7a. Measure frame cost *before* instancing (checklist's own instruction) — with `meshBasicMaterial` and no shadows/post-processing, 175 draw calls likely fine; re-measure after 2.2–2.7 land, since every added feature (shadows, SSAO, bloom) multiplies marginal cost per draw call.
- **Book**: ref-08 (RTR3 §15.2, §15.4.2) — locate bottleneck first (frame time at DPR 1 vs 0.5; `castShadow` off); small-batch problem ("a few large meshes are much more efficient than many small ones") — meshes averaging < ~200 tris sharing materials = merge/instance candidate; shadow casters can be merged low-detail proxies. P-B.25, P-B.26, P-B.28.
- **Impact**: currently unmeasured — flag as measurement task, not assumed fix, per checklist's explicit instruction not to instance speculatively.

## Step 2.5 — pitfall scan (mandatory, run every time)

Step 2 checks "is feature present." This step checks "is feature — present or future — implemented in way that will go wrong," per `docs/RESEARCH-3D-REALISM.md` §11 pitfall catalog. Run every entry, every audit. Each entry: grep/read to run, `Applies` verdict (`now` / `once <feature>` / `n/a — feature absent`), and wrong/fixed pair to pattern-match — copied from research §11 so scan never needs research file open.

**Report every entry**, even `n/a` — `n/a` today flipping to `now` after future change is how this becomes continuous-improvement loop instead of one-shot report (see "When this runs").

### Color management (research §11.1)

- **P-11.1a** double gamma correction. Grep: `grep -rn "outputEncoding\|sRGBEncoding\|\.encoding = " src/`. Applies: n/a today (no such calls; `outputColorSpace` not set yet — see 2.1). WRONG: `texture.encoding = THREE.sRGBEncoding; renderer.outputEncoding = THREE.sRGBEncoding;` FIXED: `texture.colorSpace = THREE.SRGBColorSpace; renderer.outputColorSpace = THREE.SRGBColorSpace;` (set once, one place).
- **P-11.1b** data map tagged sRGB. Grep: `grep -rn "\.colorSpace" src/` (currently zero — no textures loaded in `src/diagram/`). Applies: n/a until any `normalMap`/`roughnessMap`/`aoMap` introduced. WRONG: `normalMap.colorSpace = THREE.SRGBColorSpace;` FIXED: `normalMap.colorSpace = THREE.NoColorSpace;` (only color map gets `SRGBColorSpace`).
- **P-11.1c** inconsistent per-material tone-mapping opt-out. Grep: `grep -rn "toneMapped" src/`. Applies: n/a today (no HUD material inside `<Canvas>` — `Viewport.tsx`'s `Chip` overlay is DOM sibling, not Three.js material, sidestepping this). WRONG: future in-canvas HUD mesh's `toneMapped` unset while scene has tone mapping. FIXED: `hudMaterial.toneMapped = false;` on any such mesh.

### Lighting / IBL (research §11.2)

- **P-11.2a** too many shadow-casting lights. Grep: `grep -rn "castShadow" src/`. Applies: n/a — zero lights (see 2.2). Once added: WRONG: `{lights.map((l) => <pointLight key={l.id} castShadow position={l.pos} />)}` (many casters). FIXED: one `<directionalLight castShadow>` key light + `<Environment>` for ambient fill.
- **P-11.2b** missing environment map. Grep: `grep -rn "<Environment" src/` (currently zero). Applies: now — live gap, not future risk; see 2.2/2.6. WRONG: `<meshStandardMaterial metalness={1} />` with no `scene.environment`. FIXED: add `<Environment preset="city" />` as sibling of `<Model />`.
- **P-11.2c** environment intensity vs. exposure mismatch. Grep: `grep -rn "environmentIntensity\|toneMappingExposure" src/`. Applies: n/a until both exist. WRONG: tuning `environmentIntensity` alone after `toneMappingExposure` change. FIXED: re-check both together against known-material reference whenever either changes.
- **P-11.2d** stale physically-correct light-unit assumptions. Grep: `grep -rn "useLegacyLights\|physicallyCorrectLights" src/` (should stay zero — repo's `three@^0.169.0` predates property's removal window; must not be reintroduced). Applies: now, as guard — confirm no future PR reintroduces it, and any new light's `intensity`/`decay` tuned empirically, not copied from pre-r155 tutorial. WRONG: `new THREE.PointLight(0xffffff, 1, 100, 1)` copied from old example with `decay: 1`. FIXED: `new THREE.PointLight(0xffffff, intensity, 100, 2)` — `decay: 2`, intensity re-tuned against current renderer, not ported.
- **P-11.2e** baked vs. real-time shadow conflict. Grep: `grep -rn "AccumulativeShadows\|RandomizedLight" src/` (currently zero). Applies: n/a until adopted. WRONG: baking `AccumulativeShadows` under moving/`exploded` part. FIXED: baked shadow-catchers for static scenery only; timeline/explode-animated parts (repo has both, via `progress` and `exploded` in `viewSlice.ts`) get real-time shadow.
- **P-11.2f** light leaking through thin/open geometry. Grep: `grep -n "size:" src/diagram/model.ts | head` — check near-zero dimension in `Part.size`. Applies: n/a until shadows exist; re-check once 2.4 lands, since `model.ts` generated boxes could include thin plate. WRONG: `shadow.camera.near = 5` when occluder sits closer than 5 units to light. FIXED: `shadow.camera.near` small enough to include closest occluder, tightened with `far` (see P-11.4b).

### Material / PBR correctness (research §11.3)

- **P-11.3a** non-binary metalness on ordinary materials. Grep: `grep -rn "metalness={0\.[1-9]" src/` (n/a today — no `metalness` prop anywhere; `meshBasicMaterial` has none). Applies: once 2.2/2.3 introduce `meshStandardMaterial`. WRONG: `<meshStandardMaterial metalness={0.5} roughness={0.5} />`. FIXED: `<meshStandardMaterial metalness={1.0} roughness={0.6} />` (or `metalness={0}` for non-metals — vary `roughness`, not `metalness`, for "worn" vs "clean").
- **P-11.3b** normal-map Y-channel handedness. Grep: `grep -rn "normalMap\|normalScale" src/` (zero today). Applies: n/a — no normal maps in generated-box model. WRONG: importing OpenGL-convention normal map unflipped. FIXED: `material.normalScale.set(1, -1);` if source map uses other convention.
- **P-11.3c** missing mipmaps/anisotropy. Grep: `grep -rn "TextureLoader\|generateMipmaps\|anisotropy" src/` (zero — no textures; every surface flat `color`). Applies: n/a today; live moment any texture loaded (e.g. ground/gravel plane). WRONG: `textureLoader.load('gravel.jpg')` with defaults on ground plane. FIXED: `tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();`.
- **P-11.3d** overusing `MeshPhysicalMaterial` extensions. Grep: `grep -rn "clearcoat\|transmission\|iridescence\|sheen" src/` (zero today). Applies: n/a; flag first time any prop added to more than couple "hero" materials (e.g. no `transmission` on all 175 generated parts). WRONG: `transmission` on every part in `model.ts`. FIXED: reserve for specific glazing/glass part kind, if ever added.
- **P-11.3e** transparent sort-order artifacts. Grep: `grep -n "transparent" src/diagram/DiagramScene.tsx` — **live today**: `Member()` sets `transparent={role === 'translucent' && !isSelected}` with no `renderOrder`, and `ROLE_BY_KIND` marks `foundation`, `column`, `beam_x`, `beam_y` all `'translucent'` — most overlapping geometry transparent with no explicit sort control. Applies: now. WRONG (current `DiagramScene.tsx`): `<mesh position={position} ...><meshBasicMaterial transparent={transparent} .../></mesh>` with no `renderOrder`. FIXED: `<mesh position={position} renderOrder={role === 'translucent' ? 1 : 0} ...>` on known-overlapping pairs once visual sorting artifact actually observed (don't preemptively renderOrder everything — confirm artifact first).

### Shadows (research §11.4)

- **P-11.4a** shadow acne / peter-panning. Grep: `grep -rn "shadow-bias\|shadow\.bias\|shadow-normalBias" src/` (n/a — zero shadow-casting lights). Applies: once 2.4 lands. WRONG: `<directionalLight castShadow />` (bias defaults, `bias≈-0.0001`, `normalBias: 0`). FIXED: `<directionalLight castShadow shadow-bias={-0.005} shadow-normalBias={0.02} />`.
- **P-11.4b** shadow-map resolution/frustum mismatch. Grep: `grep -rn "shadow-mapSize\|shadow\.camera" src/` (n/a today). Applies: once 2.4 lands. WRONG: `shadow.camera.left/right/top/bottom` at three.js defaults (±5) against model's actual bounds (`BOUNDS` in `model.ts`, spanning multiple bays). FIXED: frustum to model's real `BOUNDS`, then raise `mapSize` — tighten before upsize.
- **P-11.4c** no cascaded shadow maps. Applies: n/a at this scale (single model within `BOUNDS`); revisit only at site-wide/multi-building scale.
- **P-11.4d** `ContactShadows` direction mismatch with real key light. Grep: `grep -rn "ContactShadows" src/` (zero today). Applies: n/a until adopted; if adopted, verify implied top-down direction against chosen `directionalLight` position in 2.4 — don't add both with mismatched directions.
- **P-11.4e** soft shadow cost on mobile. Grep: `grep -rn "shadows=\"soft\"\|PCFSoftShadowMap" src/` (n/a today). Applies: once 2.4/2.9 land — gate by `quality` from `viewSlice.ts` (see 2.9), not hardcoded `shadows="soft"`.
- **P-11.4f** light leaking at thin dividers — see P-11.2f (same root cause, shadow angle: check `shadow.camera.near` once any light exists).

### Post-processing (research §11.5)

- **P-11.5a** bloom on everything. Grep: `grep -rn "<Bloom\|BloomEffect" src/` (zero — no `postprocessing` dependency in `package.json`). Applies: n/a until package installed and `<Bloom>` added. WRONG: `<Bloom luminanceThreshold={0} />`. FIXED: `<Bloom luminanceThreshold={1.0} luminanceSmoothing={0.3} intensity={0.6} />`.
- **P-11.5b** double tone mapping. Grep: `grep -rn "toneMapping\|ToneMappingEffect" src/` (n/a — `toneMapping` not set anywhere yet). Applies: moment BOTH `renderer.toneMapping` (2.7) AND composer `<ToneMapping>` effect added — check combination, not each alone. WRONG: renderer `toneMapping = ACESFilmicToneMapping` **and** `ToneMappingEffect` in composer. FIXED: exactly one — renderer-level simplest here; skip composer tone-mapping effect.
- **P-11.5c** SSAO halos. Grep: `grep -rn "<SSAO\|SSAOEffect" src/` (n/a today). Applies: once 2.5 lands. WRONG: `<SSAO radius={2} depthAwareUpsampling={false} />` (wide radius, no depth-aware upsampling — halos at part silhouettes, of which box model has many). FIXED: `<SSAO radius={0.4} depthAwareUpsampling intensity={20} />`.
- **P-11.5d** SSR on thin geometry. Grep: `grep -rn "<SSR\|SSREffect" src/` (n/a). Applies: n/a — model includes `kind: 'pipe'` parts (thin cylinders/boxes), exactly geometry class SSR breaks on per research §11.5d; if SSR proposed, flag pipes as risk case, recommend `<Environment>`-only reflections.
- **P-11.5e** over-stacked grading effects. Grep: `grep -rn "<Vignette\|<ChromaticAberration\|<HueSaturation" src/` (n/a). Applies: once two+ grading effects stacked — review composite against no-post render before shipping.

### Anti-aliasing (research §11.6)

- **P-11.6a** MSAA defeated by render-target composer. Grep: `grep -n "antialias" src/diagram/DiagramScene.tsx` (currently `true`, no composer — MSAA live and working). Applies: **will apply moment `EffectComposer` introduced** (2.5/2.7) — re-check then, since today's "pass" flips to "fail" instantly if composer added without `SMAAEffect` or multisampled render target. WRONG: `<EffectComposer>` with no AA effect and no multisampled target. FIXED: `new THREE.WebGLRenderTarget(w, h, { samples: 4 })` passed to composer, or `SMAAEffect` in pass.
- **P-11.6b** unclamped DPR. Grep: `grep -n "dpr=" src/diagram/DiagramScene.tsx`. Applies: **already fixed** — `dpr={[1, 2]}` present. No action; confirm no regression to `dpr={window.devicePixelRatio}`.
- **P-11.6c** TAA ghosting. Grep: `grep -rn "TAA\|TemporalAA" src/` (n/a — no TAA). Applies: n/a; flag only if TAA proposed — cross-check against `explodedPosition()`'s per-frame position jumps and timeline's `progress`-driven visibility toggling in `DiagramScene.tsx`, both discontinuous-motion cases likely to ghost.

### Performance-vs-realism tradeoffs (research §11.7)

- **P-11.7a** draw-call explosion. Grep: `grep -n "visible.map\|<Member" src/diagram/DiagramScene.tsx` — `Model()` maps one `<Member>` per visible part (175 total per `docs/CHECKLIST.md`). Applies: now, as open measurement task (matches `docs/CHECKLIST.md` §5 instruction to measure before instancing). WRONG: assuming instancing needed without measuring. FIXED: profile frame time first; only then consider `<Instances>`/merged geometry for repeated part kinds (e.g. all `beam_x` sharing one geometry).
- **P-11.7b** uncompressed HDRI/texture memory. Grep: `grep -rn "RGBELoader\|\.hdr\|KTX2Loader" src/` (n/a — no textures/HDRIs loaded yet). Applies: moment 2.2 adds `<Environment>` — check whether `preset` (CDN-hosted, uncompressed) or local compressed `.ktx2`/small `.hdr` used. WRONG: `<Environment files="studio_4k.hdr" />` shipped uncompressed. FIXED: KTX2/Basis-compressed environment or modest `.hdr`, transcoded via `KTX2Loader`.
- **P-11.7c** expensive effects running unconditionally. Grep: `grep -n "quality" src/store/viewSlice.ts src/app/ViewControls.tsx` — `quality: Quality` in state and `setQuality` exists, but (per `docs/CHECKLIST.md` §2.4) nothing reads it. Applies: now — live, named gap. FIXED: see 2.9 — gate `shadow-mapSize`, SSAO resolution, and shadow-casting behind `quality`.
- **P-11.7d** over-tessellated geometry. Grep: `grep -n "boxGeometry\|CylinderGeometry\|SphereGeometry" src/diagram/DiagramScene.tsx` — only `boxGeometry` (6 faces, can't over-tessellate). Applies: n/a today; re-check moment curved primitive (bolt heads, pipe fittings) added to `model.ts` parts — match segment count to on-screen size, not copy-pasted default.

### React / r3f-specific pitfalls (research §11.8)

- **P-11.8a** geometry/material recreated every render. Grep: `grep -rn "new THREE\." src/diagram/ src/app/` — currently zero (all geometry/material in `DiagramScene.tsx` declarative JSX: `<boxGeometry args={part.size} />`, `<meshBasicMaterial .../>`, correctly reconciled by r3f). Applies: **already correct** — keep true; risk = future perf refactor introducing imperative `new THREE.BoxGeometry(...)` in `Member()` without memoizing.
- **P-11.8b** `dispose={null}` needed for shared resources. Grep: `grep -rn "dispose=" src/` (n/a — no shared geometry/material instances passed as props; each `<Member>` builds own JSX-owned geometry). Applies: n/a until geometry sharing (P-11.7a fix) introduced — once parts share one `BoxGeometry` across `<Instances>`, check whether any consumer needs `dispose={null}`.
- **P-11.8c** asset loading outside Suspense/`useLoader`. Grep: `grep -rn "TextureLoader\|useLoader\|Suspense" src/` (n/a — no assets loaded; model procedurally generated in `model.ts`). Applies: n/a until texture/GLB load introduced.
- **P-11.8d** `<Environment>` reloading on remount. Grep: `grep -n "mode ===" src/diagram/DiagramScene.tsx` — confirm `<Environment>` (once added, P-11.2b) is sibling of, not nested inside, any `{mode === 'realistic' && ...}` block, since remount on every mode switch re-triggers HDRI load. Applies: check when 2.2/2.9 implemented, not before. WRONG: `{realistic && <><Environment preset="city" /><Model /></>}`. FIXED: `<Environment preset="city" />` always mounted; `Model`'s *material choice* (not environment's mount state) branches on `realistic`.
- **P-11.8e** `setState`/store-`set()` inside `useFrame`. Grep: `grep -n "useFrame" src/diagram/DiagramScene.tsx` — `CameraRig`'s `useFrame` (~line 149) mutates `camera.position`/`controls.target` directly, calls no store setter in loop. Applies: **already correct — protect pattern**, don't regress. WRONG (hypothetical future): `useFrame(() => { setCameraPosition(camera.position); })`. FIXED (existing pattern to keep): `useFrame(() => { camera.position.copy(computed); controls.update(); })`.

### Rare/subtle (research §11.9)

- **P-11.9a** glTF Y-up/unit mismatch. Grep: `grep -rn "GLTFLoader\|\.gltf\|\.glb" src/` (n/a — `docs/CHECKLIST.md` §3 notes model still procedurally generated, not GLB-loaded). Applies: n/a today; re-run if/when CHECKLIST's open "generated vs. GLB" decision (§3) resolved toward GLB.
- **P-11.9b** `KHR_materials_emissive_strength` / clamped emissive. Grep: `grep -rn "emissive" src/` (n/a — no emissive materials). Applies: n/a until emissive part (e.g. lit fixture) added; if bloom (2.7) also added, plain `emissiveIntensity` must exceed `1.0` to register against `luminanceThreshold` of `1.0`.
- **P-11.9c** z-fighting at large world coordinates. Applies: n/a — model spans tens of metres (`BAY_X = 7.2`, 4×3 bays); revisit only at geo-referenced coordinate scale.
- **P-11.9d** WebGPU/TSL parity gaps. Applies: n/a — plain `WebGLRenderer` path. TSL/WebGPU migration (research §10) **out of scope for this audit**; if proposed, hand off as own initiative, not punch-list item.
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
- **P-B.23** LDR environment. Read: resolved env path — `grep -rn "HDRI_URL\|<Environment" src/` (currently constant in `src/diagram/realistic/rig.ts`), then `ls -la public/<that path>` and check extension/format. Applies: now if IBL loads 8-bit image. FIXED: `.hdr`/`.exr`/KTX2 HDR (RTR3 §10.11.1).
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
  Change: <concrete diff-shaped snippet, using this repo's actual imports/names>
  Why: docs/RESEARCH-3D-REALISM.md §<n> and/or ref-0N (RTR3|PBRT3 §x.y) — <one-clause reason>
  Depends on: <other punch-list item, if sequencing matters — e.g. "2.4 shadows depends on 2.2 lighting">
```

Order by dependency chain, not just impact — 2.2 (lighting + material swap) blocks nearly everything, so almost always `[HIGH]` #1 regardless, with 2.9 (mode/quality gating) right alongside so change ships as togglable feature, not silent behavior change to `engineering`/`analysis`/`construction` modes.

Close report naming which `docs/RESEARCH-3D-REALISM.md` sections and which `references/ref-0N` files relied on, and explicitly note any place Step 1 live grep/read contradicted this SKILL.md's assumed baseline — plus confirmation you corrected baseline in this file (per Step 1), not just noticed.

## Step 4 — verify empirically (method, not theory)

Steps 2 and 2.5 audit *code*. This step audits *output*. Nothing below makes rendering claim — measurement procedure, so no research `§` citation. (Rendering claims still need one; see top of file.)

Run **before** implementing punch list, for baseline, and **again after**, so each cycle yields comparable pair.

### 4a — capture

Use highest rung available; fall through if tool missing.

1. **Browser MCP** (chrome-devtools or playwright, if connected): `npm run dev`, navigate to dev server, screenshot canvas.
2. **Manual**: `npm run dev`, ask user for screenshot of each mode.
3. **Programmatic** (no MCP needed): `preserveDrawingBuffer: true` already set in `<Canvas>` `gl` props (`DiagramScene.tsx`:313), so drawing buffer survives frame and `document.querySelector('canvas').toDataURL()` returns current frame from devtools console without re-rendering.

For `renderer.info` counters in 4b, need renderer handle. Branch `worktree-3d-realism` already exposes one in `DiagramScene.tsx`'s `onCreated`; on branch without it, add same dev-gated line:

```tsx
// DiagramScene.tsx, inside the existing onCreated
onCreated={({ gl, scene, camera }) => {
  gl.localClippingEnabled = true;
  if (import.meta.env.DEV) {
    (window as unknown as { __gl?: unknown }).__gl = { gl, scene, camera }; // audit handle; DEV only
  }
}}
```

`info.render.calls` resets per `render()` and counts shadow pass too, so with `shadowMap.autoUpdate` on reads roughly double visible mesh count. Store reachable from console for scripted mode/shot switches: `(await import('/src/store/useAppStore.ts')).useAppStore.getState().setMode('realistic')`.

Line is audit instrumentation, not punch-list item — ships behind `import.meta.env.DEV`, Vite strips from production builds.

### 4b — record these numbers, every cycle

Same camera position and same `mode` across before/after, else comparison meaningless. From devtools console:

```js
__gl.gl.info.render.calls      // draw calls — the P-11.7a measurement the CHECKLIST asks for
__gl.gl.info.render.triangles  // geometry budget
__gl.gl.info.memory.textures   // texture count — catches P-11.7b HDRI bloat
__gl.gl.info.memory.geometries // catches P-11.8a/b leaks: should be stable across mode switches,
                            // not climbing every toggle
```

Frame time: devtools Performance panel, or drei's `<Stats />` added temporarily. One screenshot per `mode` (`engineering`, `analysis`, `construction`, `realistic`) — realism change silently altering three flat modes = regression, not improvement.

Report before/after delta in punch list closing section. Change improving appearance while doubling draw calls = tradeoff to state out loud, not silent win.

### 4c — perceptual check (the squint test)

Feature-presence audits pass while render still looks wrong. Look at `realistic`-mode screenshot, answer each yes/no:

- **Grounded?** Every part sits on/attaches to something, or parts float? (Missing contact shadows usual cause.)
- **Clipped?** Pure-black regions with no detail, or blown-out pure-white areas? Both mean exposure/tone mapping needs attention, not more lights.
- **Energy-conserving highlights?** Bright speculars fall off gradually, or read as flat painted-on patches?
- **Legible at squint?** Blur eyes (or downscale to ~200px): structure silhouette still readable, or post-processing washed out?
- **Varied?** Surfaces sharing one material still differ by orientation to light, or uniformly flat-shaded?
- **Still correct?** Compare against `engineering` mode screenshot — geometry, selection highlight, clipping planes unchanged.
- **Plausible values?** Metals read as F0 color, concrete/soil mid-dark (albedo 0.15–0.4), nothing non-emissive glows (ref-02).
- **Contact hardening?** Shadows sharpen where members meet ground, soften with distance (ref-05, RTR3 §9.1.4).
- **Grazing views honest?** Low camera: flat surfaces brighten toward horizon (Fresnel), highlights stretch rather than stay round (ref-02).
- **Atmosphere consistent?** Rotate in place: fog on fixed distant member doesn't change, fog color matches horizon behind it (ref-07).
- **Stable in motion?** Orbit slowly: no shimmering glints, crawling textures, or swimming shadow edges (ref-03, ref-05, ref-06).

Any "no" → punch-list item with failing question quoted as `Now:` line.

### 4d — when to stop

Loop has exit. Stop auditing, declare scene good enough when all hold:

- Every Step 2.5 entry reads `Applies: n/a` or `already correct`.
- Every 4c question answers "yes".
- Last two cycles produced only `[LOW]` items.
- Frame time inside budget at target `quality` tier on weakest supported device.

Last two cycles only `[LOW]` but 4c still has "no" → bottleneck not code, it's reference. Get target image (photo or render of real structure) and audit against it instead of another feature sweep.