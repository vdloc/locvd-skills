'use strict';
// SessionStart. Echoes pinned versions of the frontend stack so advice doesn't drift to
// APIs from a different major version (React 18 vs 19 hook rules, R3F v8 vs v9, etc).
const { readInput, readPkg, depVersion, allowSilent, sessionStartMessage } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const pkg = readPkg(cwd);
if (!pkg) allowSilent();

const TRACKED = ['next', 'react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', 'gsap'];
const found = TRACKED
  .map((name) => [name, depVersion(pkg, name)])
  .filter(([, v]) => v);

if (found.length === 0) allowSilent();

const summary = found.map(([name, v]) => `${name}@${v}`).join(', ');
sessionStartMessage(`frontend-guardrails: detected stack versions — ${summary}`);
