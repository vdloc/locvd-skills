'use strict';
// PostToolUse (Edit|Write). Runs the project's own eslint on the just-touched file only.
// Skips silently if no eslint config or eslint isn't resolvable — never installs anything.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { readInput, allowSilent, postToolContext } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const filePath = input.tool_input && input.tool_input.file_path;
if (!filePath || !/\.(tsx?|jsx?)$/.test(filePath)) allowSilent();
if (!fs.existsSync(filePath)) allowSilent();

const configCandidates = [
  '.eslintrc', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json', '.eslintrc.yml',
  'eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts',
];
const hasConfig = configCandidates.some((f) => fs.existsSync(path.join(cwd, f)));
if (!hasConfig) allowSilent();

let result;
try {
  result = spawnSync('npx', ['--no-install', 'eslint', '--no-color', filePath], {
    cwd, encoding: 'utf8', timeout: 20000,
  });
} catch {
  allowSilent();
}
if (!result || result.error || result.status === null) allowSilent(); // eslint not resolvable / timed out

if (result.status !== 0) {
  const out = (result.stdout || result.stderr || '').trim().slice(0, 1500);
  if (out) {
    postToolContext(`lint-changed-file: eslint found issues in ${path.basename(filePath)}:\n${out}`);
  }
}
allowSilent();
