---
name: translate-en-vi
description: Use when the user asks to translate English text into Vietnamese, or pastes English prose and asks what it means in Vietnamese — general text such as chat messages, emails, articles, and casual writing. Not for engineering or product documentation (commit messages, RFCs, runbooks, UI strings, i18n resource files) — use vietnamese-tech-writing for those.
---

# Translate English to Vietnamese

## Overview

General-purpose English→Vietnamese translation for everyday prose, doubling as an English
lesson: every translation comes with a vocabulary/grammar breakdown of the source text, so
translating also teaches the English in it. Machine-translation output is recognizable by a
handful of specific tells — this skill exists to avoid them, on both the translation and the
teaching. Not for engineering/product documentation; that's **vietnamese-tech-writing**'s job
(different register rules, different loanword list, no teaching layer).

## When to Use

- Translating chat messages, emails, articles, casual text, or any pasted English prose
- The user asks "what does this mean in Vietnamese" or "translate this to Vietnamese"

**Not for:** commit messages, PR descriptions, RFCs, runbooks, UI strings, i18n files —
those go through `vietnamese-tech-writing` instead (different register/loanword rules).
This skill is EN→VI only; a VI→EN request is out of scope for this skill's rules, just
translate it directly.

## Core Rules

1. **Keep common English/everyday loanwords untranslated.** `email`, `OK`, `wifi`,
   `internet`, `app`, `link`, brand/product names. Forcing a Vietnamese equivalent
   (`thư điện tử` for `email`) is the loudest machine-translation tell.
2. **Infer register from the source text's own tone** — see Register & Address below.
3. **Tone-mark style: kiểu cũ by default** (`hòa`, `thủy`, `khỏe`) — unless the surrounding
   context/document already uses kiểu mới (`hoà`, `thuỷ`, `khoẻ`), in which case match it.
   Never mix both styles in one output.
4. **Emit NFC Unicode** — precomposed diacritics (`ế` = U+1EBF), not decomposed.
5. **No calques.** Translate idioms to their natural Vietnamese equivalent, not word-for-word.
6. **Preserve non-text elements exactly as-is**: code spans, URLs, placeholders (`{{var}}`,
   `%s`), markdown/HTML tags, emoji/emoticons. Mirror the source's line breaks, paragraph,
   and list structure. Translate only the surrounding prose.
7. **In a sentence, pick one reading and translate it.** When a full sentence or piece of
   prose is genuinely ambiguous (an English "you" that could be singular/plural/formal, a
   word with two unrelated senses used in context), choose the single most natural
   interpretation and translate that — don't hedge with multiple options or footnote every
   judgment call. Note a choice only when it's a real coin-flip that materially changes
   meaning.
   **Exception — a bare word or short fragment with no sentence around it:** list its 2-3
   common senses with their distinct Vietnamese translations instead, dictionary-style (e.g.
   "cadence" → nhịp điệu / tiết tấu / nhịp độ, one per sense). There's no surrounding context
   to disambiguate with, so collapsing to one answer silently discards a distinction the
   input itself can't rule out.

## Register & Address

Vietnamese has no neutral "you"/"I" — pronouns encode the relationship between speaker and
listener. Resolve from context, in this order:

| Signal in the source | 2nd person | 1st person |
|---|---|---|
| Peers, casual, no age/status cue | bạn (or name) | mình |
| Speaker clearly older / familiar tone | em | anh (male) / chị (female) |
| Speaker clearly younger | anh / chị (match addressee's gender if known, else anh) | em |
| Addressing one's own parent/grandparent/sibling by relationship ("Mom", "Dad", "sis") | the specific family term named — mẹ, ba/bố, ông, bà, anh, chị, em | con (to a parent/grandparent) or the matching sibling term |
| Elder, formal respect (not family) | chú (male) / cô (female) / bác | cháu |
| Customer-facing / service tone | quý khách | (brand name, no self-reference) |
| Stranger, unclear relationship, formal writing | no direct address — impersonal phrasing | no direct address |

**Default when nothing signals the relationship: impersonal, no direct address.** Guessing an
age/gender-coded pronoun (anh/chị/em) from nothing risks misgendering or miscalling the
reader's status — the one wrong call this table can make. Impersonal phrasing never misfires.

**A named family relationship always wins over the generic age-based rows above.** "Mom" is
never chú/cô/bác just because a parent counts as an elder — it's mẹ. Match the specific term
the source names, not the closest age bracket.

**Regional vocabulary:** default to standard written Vietnamese (`bố/mẹ`, `cây bút`) rather
than Southern-leaning forms (`ba/má`, `cây viết`) unless the source itself signals a specific
region or the target audience is known to use it — then match consistently.

## Tone Particles

Sentence-final particles carry tone English conveys through word choice or punctuation.
Reach for them in casual text instead of translating the English cue literally:

| Particle | Effect | Replaces |
|---|---|---|
| `nhé` | friendly suggestion/reminder | "okay?", a soft trailing "please" |
| `nha` | same as nhé, more casual/texting register | same, informal |
| `ạ` | polite/respectful marker | addressing someone older or a customer |
| `đấy` | mild emphasis, matter-of-fact | "you know", "actually" |
| `thôi` | downplays, reassures | "just/only", "no big deal" |
| `mà` | mild insistence or contradiction | "though", "but really" |

## Numbers, Dates, Currency

Only reformat numbers/dates that are part of natural prose — never inside code spans, URLs,
or data placeholders (rule 6 already protects those).

| Convention | English | Vietnamese |
|---|---|---|
| Decimal separator | `1,234.56` | `1.234,56` |
| Date order | MM/DD/YYYY | DD/MM/YYYY |
| Currency | `$100` | `100 USD` (keep foreign currency as-is) or `100.000 đ` / `100.000 VNĐ` if the source is already in VND |

Don't invent precision the source doesn't have — a casual "the 5th" stays casual, not `05/XX`.

## Proper Nouns

Keep brand names, personal names, and product names in their original spelling —
**"Sydney"**, not a phonetic respelling. Use an established Vietnamese exonym only for the
small closed set that already has one: countries and major cities (`Mỹ`, `Anh`, `Nhật`,
`Pháp`, `Luân Đôn`). When in doubt, keep the original spelling.

## Idioms & Culture

Translate idioms, jokes, and cultural references for their **meaning**, not their words — a
literal rendering is the second-loudest machine-translation tell after mistranslated
loanwords. If something is genuinely untranslatable (wordplay that depends on English
phonetics or spelling), say so in a short bracketed note rather than forcing a translation
that loses the point: `[wordplay lost in translation: explanation]`.

## Common Everyday Phrases

| English | Vietnamese |
|---|---|
| Hi / Hello | Chào |
| Thanks / Thank you | Cảm ơn |
| Please | Làm ơn / Vui lòng |
| Sorry | Xin lỗi |
| No problem | Không sao / Không có gì |
| No rush | Không gấp / Từ từ cũng được |
| Let me know | Cho mình biết / Báo mình biết nha |
| See you | Hẹn gặp lại |
| Take care | Giữ gìn sức khỏe / Bảo trọng |
| Good luck | Chúc may mắn |
| Congratulations | Chúc mừng |

## English-Learning Notes (always included)

Every response teaches the English in the source, comprehensively — not just the 2-3 hardest
words. This is the whole point of the skill; treat it as required output, not a bonus.

**Vocabulary & phrases** — a row for every word/phrase in the source above elementary level
(skip `a`, `the`, `is`, basic pronouns; include phrasal verbs, idioms, collocations,
less-common single words):

| English | IPA | Loại từ | Nghĩa | Ghi chú |
|---|---|---|---|---|
| e.g. `heads up` | /hɛdz ʌp/ | cụm động từ (phrasal) | báo trước, thông báo sớm | thân mật, dùng khi báo tin ngắn gọn |

- IPA for anything whose pronunciation isn't obvious from spelling; skip it for trivial words.
- `Ghi chú` carries what a dictionary entry alone doesn't: register, when it's used, a
  near-synonym contrast if one is easy to confuse with it.

**Grammar & structure** — bullet list naming each notable construction in the source
(tense, conditional, passive voice, phrasal verb pattern, idiom syntax) and explaining briefly,
in plain terms, how/why it's built that way. Skip this list only if the source has no
structure above elementary level (e.g. a single word — see the bare-word format below).

**Ví dụ áp dụng** — 1-2 new example sentences reusing the source's harder vocabulary or
structures, each with its own Vietnamese translation, so the learner sees the word or pattern
in a second context.

**Bare word/short fragment (rule 7's exception):** skip the three-part structure above.
Instead, for each sense: the word, IPA, part of speech, the Vietnamese translation, and one
example sentence. This already covers meaning + pronunciation + usage for a single-word
lookup — a separate breakdown table would just repeat it.

## Vocabulary Memory (spaced repetition)

This skill remembers what it has already taught, across sessions, so review shrinks over
time instead of repeating forever. State lives in `vocab-log.md` in this skill's base
directory (the "Base directory for this skill" path shown when this skill loads) — create it
with this header if it doesn't exist yet:

```
# Vocabulary Log

| Word/Phrase | Times Seen | First Seen | Last Seen |
|---|---|---|---|
```

**Before building the vocabulary table**, read this file and look up each candidate word:

| Times seen so far | Treatment this time |
|---|---|
| 0 (new) | Full row, as normal |
| 1-4 | Full row + a short note: `(đã gặp lần N, lần đầu: DATE)` |
| 5+ | **Mastered** — collapse to a one-line reminder instead of a full row: `word — nghĩa (đã thuộc, gặp Nx)` |

**Spaced recall check:** a logged word is "due" once this much time has passed since its
`Last Seen`: 2 times seen → 3 days, 3 times → 7 days, 4+ times → 14 days. If the current
source text contains a due word, open the response with a short **Ôn lại** section naming
the word and asking the learner to recall its meaning, before the vocabulary table reveals it:

> **Ôn lại:** Thử nhớ lại trước khi xem: "beforehand" nghĩa là gì? (học lần đầu 20/08, đã 14
> ngày chưa gặp lại)

**After responding, update the log** for every word covered this turn — increment Times Seen
(mastered words too — don't freeze the count once it crosses 5), set Last Seen to today, add
any new word at Times Seen = 1. This step isn't optional: a log that never gets written to
never learns anything about the user, and every later table above depends on it being current.

## Before Returning: Quick Self-Check

- Meaning, names, numbers, and placeholders unchanged from the source?
- Register consistent throughout (no accidental switch between bạn/mình/impersonal)?
- One tone-mark style used, no mixing?
- One reading chosen for any ambiguity — no hedged multi-option output?
- Vocabulary table covers every above-elementary word/phrase in the source, not just the
  obviously hard ones?
- Grammar/structure notes present if the source has any construction above elementary level?
- `vocab-log.md` checked before building the table, and updated for every word after
  responding?

## Output

Full sentence/prose input, in this order:

0. **Ôn lại** — only if a due word from the log appears in this source (see Vocabulary
   Memory above); omit entirely otherwise
1. **Bản dịch** — the Vietnamese translation, per Core Rules above
2. **Từ vựng & cụm từ** — the vocabulary table, mastered words collapsed per the log
3. **Ngữ pháp & cấu trúc** — the grammar/structure notes (omit only if genuinely nothing
   above elementary level)
4. **Ví dụ áp dụng** — the 1-2 reinforcement examples

Bare word/short fragment input (rule 7's exception): the dictionary-style per-sense format
from English-Learning Notes above — no four-part structure, no separate vocabulary table.
Still check and update `vocab-log.md` for the word looked up.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Translating `email`, `OK`, `deploy` literally | Keep the English loanword |
| Guessing anh/chị/em from no cue in the source | Default to impersonal, no direct address |
| Using `bạn`/`quý khách` regardless of source tone | Read the source's register first |
| Mixing `hòa` and `hoà` in the same translation | Pick kiểu cũ (default) and hold it |
| Translating a `{{placeholder}}` or code span | Leave it untouched, translate around it |
| Word-for-word idiom translation | Use the natural Vietnamese equivalent |
| Keeping English number/date format (`1,234.56`, `MM/DD`) in prose | Convert to `1.234,56`, `DD/MM` |
| Hedging with two translations for an ambiguous line | Pick the single most natural reading |
| Collapsing a bare ambiguous word (no sentence) to one translation | List its 2-3 common senses, dictionary-style |
| Returning only the translation, no learning notes | Always include vocab table + grammar notes + examples for sentence input |
| Vocabulary table with only 2-3 "hardest" words | Cover every above-elementary word/phrase, comprehensively |
| Explaining a mastered word (5+ times seen) in full again | Collapse to a one-line reminder instead |
| Skipping the `vocab-log.md` update after responding | Update it every turn — the memory only works if it's current |
