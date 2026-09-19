# PBR physical-plausibility reference

Numeric ranges `materials` and `verify` check against, with sources. Full
citations are in `docs/RESEARCH-REALISTIC-PIPELINE.md` §B.2 in the project
that commissioned this research; this file is the portable summary shipped
with the plugin.

## Metalness

A physically-based metallic-roughness material's `metallicFactor` (or an
ARM/ORM map's blue channel) should be near **0.0** (dielectric: paint,
plastic, concrete, wood) or near **1.0** (raw/bare metal, galvanized
steel). A value in between describes no single real material — it is
either a blend that should instead be two materials, or a mistake reading
the wrong channel.

| Material | Typical metalness |
|---|---|
| Painted steel, concrete, plastic, wood, fabric | 0.0 |
| Bare/raw steel, galvanized coating, weld bead | 0.8–1.0 |

## Roughness and albedo

No standards body publishes per-substance roughness numbers; the Filament
PBR guide's dielectric F0 (~0.04 reflectance) and the general albedo range
below are the widely-cited reference:

- Linear-light diffuse albedo for any real-world dielectric surface: roughly
  **0.03–0.90** per channel. A value near 0 with `metallicFactor: 0` is
  implausible (near-black paint still reflects a few percent); a value
  above ~0.9 is implausible even for a bright surface under linear light.
- These limits are **linear** values. A Diffuse/base-color image is
  sRGB-encoded, so decode each sampled pixel to linear light before
  averaging (`check_maps.linear_albedo_means`); comparing raw sampled
  values against the range accepts textures that are too dark and rejects
  valid bright ones. ARM/ORM and normal maps are linear data — do not
  decode them.
- Bare-metal reflectance (F0, not albedo — read as the base color channel
  when `metallicFactor` is 1) is typically **≥ 0.5**, and colored (unlike a
  dielectric's near-neutral F0).

## Normal maps

glTF's `normalTexture` uses the OpenGL/+Y (green-up) convention. A map
authored for DirectX (`-Y`/green-down, often named `*_nor_dx` on texture
sites) must have its green channel inverted before use, or lit geometry
reads as if lit from the wrong side.
