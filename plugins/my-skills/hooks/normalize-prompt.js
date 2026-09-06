'use strict';
// UserPromptSubmit. Detects the language of the prompt's prose locally (no network, no LLM
// call, so it adds no latency) and injects a short reading directive.
//
// A UserPromptSubmit hook CANNOT rewrite the prompt — the original always reaches the model
// verbatim. So this annotates rather than replaces: for a non-English prompt it tells the
// model to restate the message in English before acting; for English it asks for a charitable
// read through typos. Because nothing is substituted, code and paths are never at risk.
const { readInput, allowSilent, promptContext } = require('./_util');

// Vietnamese-only letters: ăâđêôơư plus the tone-marked block U+1EA0–U+1EF9 (ạ ế ộ ữ …).
// Deliberately excludes á à ả ã, which Spanish/French/Portuguese also use.
const VI_DIACRITIC = /[ăâđêôơưĂÂĐÊÔƠƯẠ-ỹ]/;

// Telex / no-diacritic Vietnamese, for prompts typed without tone marks ("sua cai bug nay
// giup toi"). Every entry is checked against English: words that are also English (them, ban,
// hay, the, la, co, van, ham, bat, tra) are omitted, and 2 hits are required, so an English
// sentence cannot trip this.
const VI_TELEX = new Set([
  'khong', 'duoc', 'minh', 'giup', 'gium', 'nay', 'lam', 'sua', 'toi', 'nhung',
  'voi', 'tren', 'trong', 'roi', 'nua', 'xoa', 'kiem', 'viet', 'chay', 'loi',
  'dung', 'cai', 'hoac', 'neu', 'thi', 'xong', 'giao', 'dien', 'cua', 'chua',
  'phai', 'chinh', 'dang', 'bien', 'lenh', 'hinh', 'muc', 'tep', 'cau', 'nhat',
  'thay', 'tinh', 'nang', 'chuc', 'truoc', 'moi', 'tao', 'buoc', 'duong', 'dan',
  'giai', 'quyet', 'thu', 'sau', 'giong', 'nguoi', 'thong', 'diem',
]);
const VI_TELEX_MIN_HITS = 2;

const SCRIPTS = [
  ['CJK', /[぀-ヿ㐀-䶿一-鿿]/],
  ['Hangul', /[가-힯ᄀ-ᇿ]/],
  ['Cyrillic', /[Ѐ-ӿ]/],
  ['Thai', /[฀-๿]/],
  ['Arabic', /[؀-ۿݐ-ݿ]/],
  ['Devanagari', /[ऀ-ॿ]/],
  ['Hebrew', /[֐-׿]/],
  ['Greek', /[Ͱ-Ͽ]/],
];

// Everything the language check must not look at: code, paths, URLs, mentions, flags. These
// are also exactly the spans the model must keep verbatim.
function meaningfulText(prompt) {
  return String(prompt)
    .replace(/```[\s\S]*?```/g, ' ')          // fenced code
    .replace(/`[^`\n]*`/g, ' ')               // inline code
    .replace(/<[^>\s]+>/g, ' ')               // tags / placeholders
    .replace(/https?:\/\/\S+/gi, ' ')         // urls
    .replace(/[~.]{0,2}\/\S+/g, ' ')          // paths: /a/b, ./a, ~/a
    .replace(/\S+\.[A-Za-z0-9]{1,6}\b/g, ' ') // bare filenames: app.js, README.md
    .replace(/[@#]\S+/g, ' ')                 // mentions
    .replace(/(^|\s)--?[A-Za-z][\w-]*/g, ' ') // cli flags
    .replace(/\s+/g, ' ')
    .trim();
}

function words(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

// -> null (no annotation) | { lang, kind: 'vietnamese' | 'script' | 'english' }
function detect(prompt) {
  const raw = String(prompt || '').trim();
  if (!raw) return null;
  if (raw.startsWith('/') || raw.startsWith('!')) return null; // slash command / bash passthrough

  const text = meaningfulText(raw);
  const tokens = words(text);
  if (tokens.length < 3) return null; // "yes", "continue", a bare path — nothing to read

  if (VI_DIACRITIC.test(text)) return { lang: 'Vietnamese', kind: 'vietnamese' };

  let hits = 0;
  for (const token of tokens) {
    if (VI_TELEX.has(token) && ++hits >= VI_TELEX_MIN_HITS) {
      return { lang: 'Vietnamese', kind: 'vietnamese' };
    }
  }

  for (const [name, re] of SCRIPTS) {
    if (re.test(text)) return { lang: `non-English (${name} script)`, kind: 'script' };
  }

  return { lang: 'English', kind: 'english' };
}

function message(result) {
  if (result.kind === 'english') {
    return 'Read the user\'s message charitably: interpret the intended meaning through any '
      + 'typos or loose grammar rather than asking about them. Do not "correct" code, paths, '
      + 'identifiers, or command syntax — those are literal.';
  }
  return `The user's message is in ${result.lang}. Restate it in English for yourself before `
    + 'acting, then work and reply in English. Translate the prose only — keep code, file '
    + 'paths, identifiers, commands, and quoted output exactly as written.';
}

function main() {
  const input = readInput();
  const result = detect(input.prompt);
  if (!result) allowSilent();
  promptContext(message(result));
}

if (require.main === module) main();

module.exports = { detect, message, meaningfulText, words };
