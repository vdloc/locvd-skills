# Lessons already paid for

Concrete pitfalls hit while building the reference pipeline this plugin
generalizes. Read before reinventing any of these.

## Per-object texture variation must live in the mesh, not the material

glTF's `KHR_texture_transform` extension sets a texture's offset/rotation/
scale **per material**, not per node. If many parts share one material (the
common case — you do not want 900 near-duplicate materials), the only way to
give each part its own patch of a tiling texture is to bake a per-object UV
offset into that part's own UV coordinates at export time. This is a
workaround for a real glTF limitation, not an optional nicety — see
`docs/RESEARCH-REALISTIC-PIPELINE.md` §D.2.

## Mesh deduplication must key on that per-object stamp

A build pipeline that deduplicates identical meshes to save space (same
vertex/index data → one shared mesh, many nodes) will silently collapse
meshes that differ ONLY in their baked-in UV offset, because the geometry
signature it hashes usually doesn't include UVs. Include a per-object phase
stamp in whatever signature drives deduplication, or hours of "randomize the
UVs" work vanishes without an error.

## Box/cube UV projection needs a sign and offset per axis-plane

A naive cube projection (`u, v = component-of-position-on-the-dominant-
axis-plane`) mirrors the texture across every corner, because the two faces
meeting at an edge read the same coordinate in opposite directions. Give
each of the three axis-planes its own sign and offset so corners read as a
seam, not a mirror.

## A metadata-writing step has an order dependency on posing/animation

If a pipeline stage measures geometry to write metadata (bounding boxes,
inferred connections, "what touches what"), it must run either strictly
before or strictly after any step that poses the scene for an animation
default (e.g., "seek the clip to its end so the export shows the built
state"). Running it at the wrong point silently produces plausible-looking
but wrong metadata — nothing raises an error, so this needs to be an
explicit, documented step order, not something inferred from a script's
docstring alone.

## Tone mapping lives in exactly one place

When a renderer's output feeds a post-processing composer, tone mapping
must happen inside that composer's chain, not at the renderer level — a
renderer-level tone-mapping curve gets compiled out of the shaders once a
composer takes over the render target. Applying it in both places, or in
neither, both fail silently (double-mapped or flat output) rather than
erroring.

## Report unsupported input, never silently under-count it

Any budget or plausibility check that can't parse a given input (an
unfamiliar image codec, a malformed chunk) must say so in its report as
"unsupported / not counted", not omit it from a total as if it didn't
exist. A texture-memory estimate that silently skips every WebP image looks
like a passing budget and is actually a lower bound.
