'use strict';
// PostToolUse (Edit|Write). Three.js geometries/materials/textures are GPU resources —
// not garbage-collected by the JS GC. Missing .dispose() is the #1 memory-leak pattern.
const path = require('path');
const { readInput, readPkg, hasDep, readFileSafe, allowSilent, postToolContext } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const filePath = input.tool_input && input.tool_input.file_path;
if (!filePath || !/\.(tsx?|jsx?)$/.test(filePath)) allowSilent();

const pkg = readPkg(cwd);
if (!hasDep(pkg, 'three') && !hasDep(pkg, '@react-three/fiber')) allowSilent();

const content = readFileSafe(filePath);
if (!content) allowSilent();

const allocPattern = /new\s+(THREE\.)?\w*(Geometry|Material|Texture|BufferGeometry)\s*\(/;
if (allocPattern.test(content) && !/\.dispose\s*\(/.test(content)) {
  postToolContext(
    `check-three-dispose: ${path.basename(filePath)} allocates a Three.js Geometry/` +
    `Material/Texture but the file has no .dispose() call anywhere. These are GPU ` +
    `resources, not JS-GC'd — if this component unmounts/remounts (route change, ` +
    `conditional render) repeatedly, this leaks GPU memory. If disposal happens in a ` +
    `parent/hook elsewhere this may be a false positive — otherwise add cleanup in a ` +
    `useEffect return or on unmount.`
  );
}
allowSilent();
