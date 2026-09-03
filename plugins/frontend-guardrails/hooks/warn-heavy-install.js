'use strict';
// PreToolUse (Bash). Flags installs of known-heavy 3D/animation/data-viz packages so bundle
// impact gets considered before it's in the tree. Uses "prompt", never blocks outright.
const { readInput, allowSilent, preToolPrompt } = require('./_util');

const HEAVY_PACKAGES = [
  'three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing',
  'gsap', 'framer-motion', 'motion', 'lottie-web', 'matter-js', 'cannon-es',
  'd3', 'chart.js', 'recharts', 'moment',
];

const input = readInput();
const command = (input.tool_input && input.tool_input.command) || '';
const isInstall = /\b(npm\s+(i|install)|pnpm\s+add|yarn\s+add|bun\s+add)\b/.test(command);
if (!isInstall) allowSilent();

const hit = HEAVY_PACKAGES.find((pkg) => {
  const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[\\s@])${escaped}(@|\\s|$)`).test(command);
});

if (hit) {
  preToolPrompt(
    `warn-heavy-install: installing "${hit}" — this is a known bundle-size-heavy package. ` +
    `Consider dynamic import()/next/dynamic for it if it's not needed on first paint, and ` +
    `check for a lighter alternative (e.g. "date-fns" over "moment") if one fits.`
  );
}
allowSilent();
