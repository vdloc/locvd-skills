'use strict';
const fs = require('fs');
const path = require('path');

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function readPkg(cwd) {
  try {
    return JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  } catch {
    return null;
  }
}

function depVersion(pkg, name) {
  if (!pkg) return null;
  return (pkg.dependencies && pkg.dependencies[name]) ||
         (pkg.devDependencies && pkg.devDependencies[name]) || null;
}

function hasDep(pkg, name) {
  return depVersion(pkg, name) !== null;
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

// Exit 0, no JSON: silent allow / no-op.
function allowSilent() {
  process.exit(0);
}

// PostToolUse: surface a message to Claude without undoing the already-run action.
function postToolContext(message) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: message },
    systemMessage: message,
  }));
  process.exit(0);
}

// PreToolUse: escalate to the user instead of silently allowing or hard-blocking.
function preToolPrompt(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'prompt',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

// SessionStart does NOT reliably honor the documented hookSpecificOutput.systemMessage
// JSON schema in this build (verified empirically — see plugin README). Plain stdout text
// is what actually surfaces here, same mechanism the caveman plugin's SessionStart hook uses.
function sessionStartMessage(message) {
  process.stdout.write(message);
  process.exit(0);
}

module.exports = {
  readInput, readPkg, depVersion, hasDep, readFileSafe,
  allowSilent, postToolContext, preToolPrompt, sessionStartMessage,
};
