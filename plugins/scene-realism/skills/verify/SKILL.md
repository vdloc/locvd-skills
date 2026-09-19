---
name: verify
description: Runs the glTF Validator plus budget and physical-plausibility gates (draw calls, GPU texture memory, metalness clustering) against a built GLB, using scene/config.yaml's budgets (falling back to this plugin's shared defaults), and writes a pass/warn/fail report. Use after a target skill (e.g. target-web) has produced a GLB, or any time to re-check one.
---

# Verify

The pipeline's honesty check: measures the actual deliverable, rather than
trusting that earlier stages did what they intended.

## Gates

Each gate reads its threshold from `scene/config.yaml`'s `budgets` block if
present, else `${CLAUDE_PLUGIN_ROOT}/shared/budgets.yaml`'s defaults (see
that file's own sourcing notes — some numbers are standards-adjacent,
others are this plugin's own starting point, never presented as more
authoritative than they are).

```python
import sys
sys.path.insert(0, "${CLAUDE_PLUGIN_ROOT}/shared")
from verify_budgets import parse_glb, count_draw_calls, metalness_report, estimate_gpu_texture_bytes

with open(glb_path, "rb") as handle:
    gltf, bin_chunk = parse_glb(handle.read())

draw_calls = count_draw_calls(gltf)
metalness = metalness_report(gltf)
texture_memory = estimate_gpu_texture_bytes(gltf, bin_chunk)
```

1. **glTF Validator.** Run the official Khronos glTF Validator against the
   GLB (install/invoke per its own docs — this plugin doesn't vendor it).
   Any error is a `fail`; warnings are reported but don't block.
2. **Draw calls.** `count_draw_calls(gltf)` against `budgets.draw_calls`:
   `warn` at the configured threshold, `fail` only if the project set a
   hard `max`.
3. **GPU texture memory.** `estimate_gpu_texture_bytes(gltf,
   bin_chunk).estimated_bytes` against `budgets.gpu_texture_mb`. If
   `report.unsupported_images > 0` (e.g. the GLB uses WebP), say so
   explicitly in the output: the number is a documented lower bound, not a
   silently-incomplete total — see `shared/lessons.md`.
4. **Metalness clustering.** Every `False` entry in `metalness_report(...)`
   is a `warn` naming the material — cross-reference against
   `scene/materials.lock.json` to say *why* it's expected to be metal or
   not.
5. **Re-run stability** (optional, only if `scene/verify-report.json`
   already exists from a prior run and `scene/config.yaml` sets
   `verify.check_stability: true`): diff node names and material names
   between the two GLBs; report any name that disappeared or appeared
   unexpectedly.

## Output

Write `scene/verify-report.json`:

```json
{
  "gltf_validator": {"status": "pass", "errors": [], "warnings": []},
  "draw_calls": {"status": "warn", "value": 3362, "threshold": 1000},
  "gpu_texture_mb": {"status": "pass", "value": 118, "threshold": 256, "unsupported_images": 0},
  "metalness": {"status": "warn", "flagged": ["VF_Steel_Bolt"]},
  "overall": "warn"
}
```

`overall` is `fail` if any gate is `fail`, else `warn` if any gate is
`warn`, else `pass`. If `scene/brief.yaml`'s `delivery.strict_verify` is
`true`, treat `overall: warn` as blocking too; otherwise `warn` only
informs.

## Handoff

Report `overall` status and every non-`pass` gate with its numbers to the
user in plain language, not just the JSON.
