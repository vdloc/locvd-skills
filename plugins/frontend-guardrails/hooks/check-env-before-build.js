'use strict';
// PreToolUse (Bash). Before a `next build`, check declared env vars (from .env.example /
// .env.local.example) are actually set somewhere. Uses "prompt" — asks the user to confirm
// rather than silently blocking, since CI/hosting may supply these outside the local shell.
const fs = require('fs');
const path = require('path');
const { readInput, allowSilent, preToolPrompt } = require('./_util');

const input = readInput();
const cwd = input.cwd || process.cwd();
const command = (input.tool_input && input.tool_input.command) || '';
if (!/\bnext\s+build\b/.test(command)) allowSilent();

const exampleFile = ['.env.example', '.env.local.example']
  .map((f) => path.join(cwd, f))
  .find((p) => fs.existsSync(p));
if (!exampleFile) allowSilent();

const declaredKeys = fs.readFileSync(exampleFile, 'utf8')
  .split('\n')
  .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=/))
  .filter(Boolean)
  .map((m) => m[1]);
if (declaredKeys.length === 0) allowSilent();

const localEnvPath = path.join(cwd, '.env.local');
const localEnvContent = fs.existsSync(localEnvPath) ? fs.readFileSync(localEnvPath, 'utf8') : '';
const setLocally = new Set(
  localEnvContent.split('\n').map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=/)).filter(Boolean).map((m) => m[1])
);

const missing = declaredKeys.filter((k) => !setLocally.has(k) && !process.env[k]);
if (missing.length > 0) {
  preToolPrompt(
    `check-env-before-build: ${exampleFile.split(/[\\/]/).pop()} declares ${missing.length} ` +
    `env var(s) not found in .env.local or the shell environment: ${missing.join(', ')}. ` +
    `If these are supplied by CI/hosting rather than locally, proceed; otherwise the build ` +
    `may fail or silently ship with unset values.`
  );
}
allowSilent();
