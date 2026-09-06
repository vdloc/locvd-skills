'use strict';
const fs = require('fs');

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Exit 0, no JSON: silent no-op.
function allowSilent() {
  process.exit(0);
}

// UserPromptSubmit: add context alongside the prompt the model sees. The original prompt is
// still delivered verbatim — a hook cannot replace it, only annotate it.
function promptContext(message) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: message },
  }));
  process.exit(0);
}

module.exports = { readInput, allowSilent, promptContext };
