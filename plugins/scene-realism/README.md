# scene-realism

Converts a plain-geometry 3D scene into a realistic one — CC0-sourced PBR
materials, a physically-based lighting rig, and automated verification
gates — without assuming anything about your project's naming, scale, or
conventions. Every project-specific choice lives in *your* project's own
`scene/config.yaml`, written on first run.

## Pipeline

```
/scene-realism:start
  -> intake        detect your project, ask what can't be inferred
  -> classify       parts -> real-world substances
  -> materials      find + download CC0 PBR textures (Poly Haven)
  -> lighting-rig   HDRI + sun + shadows + post, generated for your target
  -> verify         glTF Validator + budgets + physical-plausibility gates
  -> target-web     package for three.js / react-three-fiber
```

Each stage is also invocable on its own once `scene/brief.yaml` exists, e.g.
`/scene-realism:materials` to re-run just the material search.

## Design

See `docs/ARCHITECTURE.md` in this plugin, and the worked example under
`examples/courtier-console-v2/`.

## Status

v0.1: web/glTF delivery only. Offline-render and AR targets are staged for
later versions — see `CHANGELOG.md`.
