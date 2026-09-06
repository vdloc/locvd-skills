'use strict';
// Fixture table for normalize-prompt detection. No test framework in this repo — run with:
//   node plugins/my-skills/hooks/__test__.js
const { detect } = require('./normalize-prompt');

const CASES = [
  ['sửa cái bug ở file này giúp tôi', 'vietnamese', 'diacritics'],
  ['toi muon them mot nut dark mode vao trang cai dat', 'vietnamese', 'telex, no tone marks'],
  ['sua cai loi nay trong app roi chay lai test', 'vietnamese', 'telex, dev vocabulary'],
  ['add a dark mode toggle to the settings page', 'english', 'plain English'],
  ['please do not remove the main function or the ban on writes', 'english', 'English words that look telex'],
  ['can you check `sua.js` and /home/x/nay/toi.txt for me', 'english', 'VI-looking tokens live in code/paths'],
  ['```\nkhong duoc chay\n```\nreview this snippet please', 'english', 'VI inside a fenced block is stripped'],
  ['给我修复这个 bug 好吗', 'script', 'CJK'],
  ['исправь эту ошибку в файле', 'script', 'Cyrillic'],
  ['/plugin update my-skills', null, 'slash command'],
  ['!ls -la /tmp', null, 'bash passthrough'],
  ['yes', null, 'too short'],
  ['/home/vdloc/Projects/app.js', null, 'bare path, nothing left after stripping'],
  ['', null, 'empty'],
];

let failed = 0;
for (const [prompt, expected, note] of CASES) {
  const got = detect(prompt);
  const kind = got ? got.kind : null;
  const ok = kind === expected;
  if (!ok) failed++;
  const label = JSON.stringify(prompt).slice(0, 52);
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${String(kind)}\t${label}\t(${note})`);
}

console.log(`\n${CASES.length - failed}/${CASES.length} passed`);
process.exit(failed ? 1 : 0);
