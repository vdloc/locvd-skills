# Example: courtier-console-v2

This is a **worked example**, not a default configuration. It documents
the brief and config that describe the real
[courtier-console-v2](https://github.com/vdloc/courtier-console-v2)
project, whose realistic-mode pipeline (Blender-authored steel structure,
Poly Haven-sourced concrete, procedural per-part texture variation, an
HDRI-lit three.js/R3F viewer) is what this plugin's design generalizes
from. See that project's `docs/RESEARCH-REALISTIC-PIPELINE.md` and
`docs/GLB-BOTH-MODES.md` for the reasoning behind specific choices like
`interaction.parts_individually_animatable: true` (a construction-sequence
timeline needs every part animatable on its own) and the raised
`max_draw_calls` (3,362 individually-selectable parts, deliberately not
merged).

Copy the **shape** of `brief.yaml`/`config.yaml` for a new project, never
these exact values — every value here is specific to this one structure.
