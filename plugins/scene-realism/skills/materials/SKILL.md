---
name: materials
description: Finds, ranks, and downloads CC0 PBR textures (Poly Haven first, ambientCG fallback) for each substance in scene/classification.json, checks them for physical plausibility, and records provenance and license in scene/materials.lock.json. Use after classify, or to re-source materials for specific substances.
---

# Materials

Turns a list of real-world substances into a checked, licensed,
locally-cached set of PBR maps.

## Source priority

1. **Poly Haven** (`${CLAUDE_PLUGIN_ROOT}/shared/polyhaven_client.py`) —
   CC0, per-map downloads, an `arm` map already in glTF's occlusion/
   roughness/metalness channel order, and physical `dimensions`. Use this
   first for every substance.
2. **ambientCG** — CC0, zip-only (no per-map download), used only when
   Poly Haven has no matching asset for a substance.
3. **User-supplied.** If `scene/brief.yaml`'s `delivery.license_policy` is
   `allow-attribution`, the user may point at a specific asset (any
   source); record its license terms verbatim in the lock file — do not
   summarize or assume CC0 for it.

If none of the above yields a plausible match and the policy is
`cc0-only`, stop and ask, rather than picking the closest available
texture silently.

## Selection modes

`scene/brief.yaml` may set `materials.mode` (default `guided`):

- **`guided`** (default): for each substance, search Poly Haven
  (`search_textures(category)` with a category/tag guess from the
  substance name — e.g. `cast-concrete` → category `concrete`), rank the
  top candidates locally by tag overlap with the substance name, present
  the top 3 with a one-line reason each, and let the user pick.
- **`auto`**: pick the top-ranked candidate without asking. Only use this
  when the user has explicitly requested it for this run.
- **`manual`**: the user names a Poly Haven asset id (or supplies their own
  files) directly.

## Downloading

Once an asset is chosen, call `asset_files(asset_id)` once, then
`download_map(asset_id, map_name, resolution, dest_dir, files=...)` for
exactly three maps: `Diffuse`, `arm`, `nor_gl` (never `nor_dx` — glTF is
GL-convention; see `shared/pbr-physics.md`). Never download `Displacement`
or `.blend`/`.gltf` bundles — they aren't needed by this pipeline's
material path.

Pick `resolution` from `scene/brief.yaml`'s `budgets.max_gpu_texture_mb`:
start at `2k`, drop to `1k` if the running total (see `verify`'s texture-
memory estimate) would exceed the budget once all substances are counted.

`dest_dir` is `${CLAUDE_PLUGIN_DATA}/polyhaven-cache/<asset_id>/` — shared
across projects, so a second project reusing the same asset doesn't
re-download it.

## Checking what was downloaded

For each downloaded set, use `${CLAUDE_PLUGIN_ROOT}/shared/check_maps.py`:

```python
import sys
sys.path.insert(0, "${CLAUDE_PLUGIN_ROOT}/shared")
from check_maps import load_rgb_pixels, metalness_is_plausible, albedo_is_plausible, normal_map_is_gl_convention

albedo_pixels = load_rgb_pixels(diffuse_path)
arm_pixels = load_rgb_pixels(arm_path)
normal_pixels = load_rgb_pixels(normal_path)

albedo_means = tuple(sum(c[i] for c in albedo_pixels) / len(albedo_pixels) for i in range(3))
blue_channel = [c[2] for c in arm_pixels]

assert albedo_is_plausible(albedo_means), "albedo outside plausible range — see pbr-physics.md"
assert metalness_is_plausible(blue_channel), "metalness doesn't cluster near 0 or 1"
```

If a check fails, don't silently accept the asset — tell the user what
looked wrong (with the numbers) and offer to try the next-ranked candidate.

## Writing the lock file

```json
{
  "painted-steel": {
    "source": "polyhaven",
    "asset_id": "rusty_metal_04",
    "resolution": "2k",
    "maps": {
      "Diffuse": {"url": "...", "md5": "...", "local_path": "..."},
      "arm": {"url": "...", "md5": "...", "local_path": "..."},
      "nor_gl": {"url": "...", "md5": "...", "local_path": "..."}
    },
    "license": "CC0 — https://polyhaven.com/license",
    "retrieved": "2026-09-19",
    "physical_values": {"metallic_factor": 0.0, "tile_size_m": 1.25}
  }
}
```

## Handoff

Tell the user which substances got which assets, any check failures and
how they were resolved, and that `/scene-realism:lighting-rig` is next.
