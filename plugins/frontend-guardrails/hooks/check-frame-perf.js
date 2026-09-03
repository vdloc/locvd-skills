'use strict';
// PostToolUse (Edit|Write). Per-frame callbacks (useFrame, gsap.ticker) run 60x/sec —
// allocations or heavy array ops inside them are a classic, hard-to-spot perf killer.
// Heuristic only: whole-file scan, not scoped to the callback body. Says so in the message.
const path = require('path');
const { readInput, readPkg, hasDep, readFileSafe, allowSilent, postToolContext } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const filePath = input.tool_input && input.tool_input.file_path;
if (!filePath || !/\.(tsx?|jsx?)$/.test(filePath)) allowSilent();

const pkg = readPkg(cwd);
if (!hasDep(pkg, 'three') && !hasDep(pkg, '@react-three/fiber') && !hasDep(pkg, 'gsap')) allowSilent();

const content = readFileSafe(filePath);
if (!content) allowSilent();

const perFrameCallback = /useFrame\s*\(|gsap\.ticker\.add\s*\(/;
if (!perFrameCallback.test(content)) allowSilent();

const allocPattern = /new\s+THREE\.Vector3\s*\(|\.map\s*\(|\.filter\s*\(|new\s+Array\s*\(/;
if (allocPattern.test(content)) {
  postToolContext(
    `check-frame-perf: ${path.basename(filePath)} has a per-frame callback ` +
    `(useFrame/gsap.ticker) and also contains allocation-heavy patterns (new ` +
    `THREE.Vector3, .map/.filter, new Array) somewhere in the file. Whole-file heuristic, ` +
    `not scoped to the callback body — worth checking whether any of that runs inside the ` +
    `60fps loop. If so, hoist allocations outside the callback and reuse objects.`
  );
}
allowSilent();
