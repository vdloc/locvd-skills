'use strict';
// TEMP debug: dump the real SessionStart hook invocation (cwd, argv, raw stdin) to a log
// file so we can see the actual contract instead of guessing. Not wired into plugin.json
// permanently — remove before final ship.
const fs = require('fs');
const os = require('os');
let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch {}
const line = JSON.stringify({
  at: new Date().toISOString(),
  processCwd: process.cwd(),
  argv: process.argv,
  env_PWD: process.env.PWD || null,
  env_INIT_CWD: process.env.INIT_CWD || null,
  stdin: raw,
}) + '\n';
try {
  fs.appendFileSync('C:/Users/locvd/AppData/Local/Temp/claude/C--Users-locvd/ee3b34b0-71d0-4083-9ec5-e7b474c4ffd8/scratchpad/fg-hook-debug.log', line);
} catch {}
process.exit(0);
