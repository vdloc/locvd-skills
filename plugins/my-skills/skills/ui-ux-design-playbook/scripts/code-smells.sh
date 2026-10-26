#!/usr/bin/env bash
# Static source scan for grep-able UI/UX smells. Run: bash scripts/code-smells.sh <dir> [max-hits-per-smell]
# Every hit is a LEAD, not a finding: read the line in context and confirm it against the
# chapter check named in brackets (code-smells.md lists the false positives per smell).
# Only confirmed hits become Measured findings. Requires ripgrep (rg) with PCRE2.
set -u
DIR="${1:-.}"
MAX="${2:-5}"
command -v rg >/dev/null || { echo "ripgrep (rg) is required" >&2; exit 2; }

EXCL=(-g '!**/node_modules/**' -g '!**/dist/**' -g '!**/build/**' -g '!**/.next/**' -g '!**/out/**'
      -g '!**/coverage/**' -g '!**/storybook-static/**' -g '!**/vendor/**' -g '!*.min.*' -g '!*.map'
      -g '!**/__snapshots__/**' -g '!*.snap' -g '!*.lock' -g '!package-lock.json' -g '!pnpm-lock.yaml'
      -g '!*.d.ts' -g '!**/*.gen.*' -g '!**/*.generated.*')
UI=(-g '*.{html,htm,css,scss,sass,less,js,jsx,ts,tsx,vue,svelte,astro,erb,hbs,njk,liquid,php,twig}')
CSS=(-g '*.{css,scss,sass,less,vue,svelte,astro,tsx,jsx}')
MARKUP=(-g '*.{html,htm,jsx,tsx,vue,svelte,astro,erb,hbs,njk,liquid,php,twig}')
COMP=(-g '*.{jsx,tsx,vue,svelte,astro}')

# id | chapter check | label | file set | PCRE2 pattern
SMELLS=(
"S01|ch15 A2|focus outline removed (confirm a :focus-visible replacement)|CSS|outline\s*:\s*(none|0)\b|\boutline-none\b"
"S02|ch15 A3|click handler on div/span|MARKUP|<(div|span|li|td|img)\b[^>]*\bon[Cc]lick\s*="
"S03|ch15 A16|ARIA widget role (confirm key handling, prefer native)|MARKUP|role=[\"'{]+(button|tab|menuitem|option|checkbox|switch|link)\b"
"S04|ch15 A1|positive tabindex|MARKUP|tab[Ii]ndex\s*=\s*[\"'{]*\s*[1-9]"
"S05|ch08, ch15 A13|submit disabled until valid|MARKUP|disabled\s*=\s*\{\s*!\s*\w*([Vv]alid|canSubmit|isDirty)"
"S06|ch15 A9|img without alt|MARKUP|<img\b(?![^>]*\balt\s*=)[^>]*>"
"S07|ch14 M1|zoom blocked in viewport meta|UI|user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b"
"S08|ch16, ch15 A23|assertive live region (only urgent errors)|MARKUP|aria-live\s*=\s*[\"']assertive"
"S09|ch15 A23|live region mounted together with its text|MARKUP|&&\s*\(?\s*<\w+[^>]*role=[\"'](status|alert)"
"S10|ch15 A26|fake link|MARKUP|href\s*=\s*[\"'](#|javascript:)[\"']"
"S11|ch09, ch15 A20|paste blocked|UI|onPaste\s*=\s*\{[^}]*preventDefault|onpaste\s*=\s*[\"']\s*return\s+false"
"S12|ch18 AN11|transition all / will-change all|UI|transition\s*:\s*all\b|\btransition-all\b|will-change\s*:\s*all\b"
"S13|ch04 T15|line-height with a unit|CSS|line-height\s*:\s*[0-9.]+(px|rem|em)\b"
"S14|ch04 T21|letter-spacing in px|CSS|letter-spacing\s*:\s*-?[0-9.]+px\b"
"S15|ch04 T20|raw font tags where a property exists|CSS|font-variation-settings\s*:\s*[\"']wght|font-feature-settings\s*:\s*[\"'](tnum|zero|lnum)"
"S16|ch04 T4|light weight (confirm size >= ~28px)|UI|font-weight\s*:\s*[123]00\b|\bfont-(thin|extralight|light)\b"
"S17|ch04 T8|justified text|UI|text-align\s*:\s*justify|\btext-justify\b"
"S18|ch04 T21|user-select none (only on drag/gesture surfaces)|UI|user-select\s*:\s*none|\bselect-none\b"
"S19|ch04 T21|underline skip-ink disabled|CSS|text-decoration-skip-ink\s*:\s*none"
"S20|ch03 L17|100vw width / 100vh pane|UI|width\s*:\s*100vw|(?<![\w-])height\s*:\s*100vh|(?<![\w-])w-screen\b|(?<![\w-])h-screen\b"
"S21|ch07 I13|hard-coded icon colour|MARKUP|<(path|svg|circle|rect|g)\b[^>]*\b(fill|stroke)\s*=\s*[\"']#[0-9a-fA-F]{3,8}"
"S22|ch05 C13|colour literal in a component (confirm a token exists)|COMP|(?<!href=[\"'])(?<!to=[\"'])(#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F-]))|\brgba?\(\s*\d"
"S23|ch13 W15|plural by ternary / sentence from fragments|UI|===?\s*1\s*\?\s*[\"'\`]{2}\s*:\s*[\"'\`]s[\"'\`]|[\"'\`][A-Za-z][^\"'\`]*\s[\"'\`]\s*\+\s*\w+\s*\+\s*[\"'\`]\s[a-z]"
"S24|ch13 W6|non-descriptive link text|MARKUP|>\s*(Click here|click here|here|Learn more|Read more|More)\s*</(a|Link|button)"
"S25|ch13 W10, W17|blamey or vague error copy|UI|\bOops\b|Something went wrong|Whoops"
"S26|ch13, ch08|vague confirmation copy|UI|Are you sure|>\s*(OK|Yes|No)\s*<"
"S27|ch13 W1|filler words in UI strings|UI|[\"'>][^\"'<]*\b(successfully|Please)\b[^\"'<]*[\"'<]"
"S28|ch15 A4, ch13|accessible name names the glyph|MARKUP|aria-label\s*=\s*[\"'][^\"']*\b(icon|Icon|glyph)[\"']|aria-label\s*=\s*[\"'](X|x)[\"']"
"S29|ch04 T21|three dots instead of an ellipsis in rendered text|MARKUP|>[^<{}]*\w\.\.\.[^<{}]*<"
"S30|ch05 C14|text over alpha colour (measure the rendered pair)|UI|\btext-\w+-\d{2,3}/\d{1,2}\b|(?<![\w-])color\s*:\s*rgba\("
"S31|ch18 AN10|entrance from scale(0)|UI|scale\(\s*0\s*\)|\bscale\s*:\s*0\s*[,;}]|\bscale-0\b"
"S32|ch18 AN10|press scale below 0.95|UI|whileTap\s*=\s*\{\{[^}]*scale\s*:\s*0?\.(?:[0-8]\d*|9(?:[0-4]\d*)?)(?!\d)|active:scale-(?:[0-8]\d|90)\b"
"S33|ch18 AN7|animation driven from scroll events|UI|addEventListener\(\s*[\"']scroll[\"']|\bonScroll\s*=\s*\{"
"S34|ch14 M17|autoFocus (desktop-only, one primary input)|MARKUP|\bauto[Ff]ocus\b"
"S35|ch15 A26|navigation in a click handler instead of a link|UI|onClick\s*=\s*\{[^}]*(router\.push|navigate\(|location\.href\s*=|window\.location)"
)

pick() { case "$1" in UI) echo UI;; CSS) echo CSS;; MARKUP) echo MARKUP;; COMP) echo COMP;; esac; }

total=0
printf 'Code-smell scan of %s (leads only; confirm each in context)\n\n' "$DIR"
for row in "${SMELLS[@]}"; do
  IFS='|' read -r id chk label set pat <<<"$row"
  pat="${row#*|*|*|*|}"   # keep any '|' inside the pattern
  declare -n G="$(pick "$set")"
  hits="$(rg -n --no-heading -P --max-columns 200 --max-columns-preview "${EXCL[@]}" "${G[@]}" -e "$pat" "$DIR" 2>/dev/null)"
  unset -n G
  # S01: a same-line focus-visible/focus ring replacement clears the lead
  [ "$id" = S01 ] && hits="$(printf '%s\n' "$hits" | rg -v -P -e 'focus(-visible|-within)?:(ring|shadow|border|outline-(?!none\b))' || true)"
  [ -z "$hits" ] && continue
  n=$(printf '%s\n' "$hits" | wc -l)
  total=$((total + n))
  printf '%s [%s] %s: %d\n' "$id" "$chk" "$label" "$n"
  printf '%s\n' "$hits" | head -n "$MAX" | sed 's/^/    /'
  [ "$n" -gt "$MAX" ] && printf '    … %d more\n' $((n - MAX))
done

# Repository-level checks
anim=$(rg -l -P "${EXCL[@]}" "${UI[@]}" -e '@keyframes|\banimation\s*:|\banimate-\w|from ["'"'"'](framer-motion|motion/react)' "$DIR" 2>/dev/null | wc -l)
rmo=$(rg -l -P "${EXCL[@]}" "${UI[@]}" -e 'prefers-reduced-motion|\bmotion-(safe|reduce):|MotionConfig|useReducedMotion' "$DIR" 2>/dev/null | wc -l)
printf '\nR1 [ch18 AN4] files with animation: %d · files honouring reduced motion: %d%s\n' "$anim" "$rmo" \
  "$([ "$anim" -gt 0 ] && [ "$rmo" -eq 0 ] && echo '  ← no reduced-motion handling found')"
pcs=$(rg -l -P "${EXCL[@]}" "${UI[@]}" -e 'prefers-color-scheme\s*:\s*dark' "$DIR" 2>/dev/null | wc -l)
cls=$(rg -l -P "${EXCL[@]}" "${UI[@]}" -e '\.dark\b|\[data-theme=|\bdark:' "$DIR" 2>/dev/null | wc -l)
printf 'R2 [ch05 C16] theme via prefers-color-scheme: %d files · via class/attribute: %d files%s\n' "$pcs" "$cls" \
  "$([ "$pcs" -gt 0 ] && [ "$cls" -gt 0 ] && echo '  ← two switching mechanisms? confirm')"
printf '\n%d leads in total.\n' "$total"
