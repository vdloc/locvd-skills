#!/usr/bin/env bash
# Usage: speak.sh "<english text>" [voice]
# Plays English text with edge-tts (default voice: General American, matches the skill's IPA).
# Silent no-op (exit 0) if edge-tts or a player is missing, so the skill never fails on audio.
set -u
text="${1:-}"; voice="${2:-en-US-AndrewNeural}"
[ -n "$text" ] || { echo "usage: speak.sh \"text\" [voice]" >&2; exit 2; }
edge="$(command -v edge-tts || echo "$HOME/.local/bin/edge-tts")"
[ -x "$edge" ] || { echo "edge-tts not installed (uv tool install edge-tts)" >&2; exit 0; }
tmp="$(mktemp --suffix=.mp3)"; trap 'rm -f "$tmp"' EXIT
"$edge" --voice "$voice" --text "$text" --write-media "$tmp" >/dev/null 2>&1 || { echo "edge-tts failed (offline?)" >&2; exit 0; }
for p in "mpv --no-video --really-quiet" "ffplay -nodisp -autoexit -loglevel quiet" "paplay"; do
  command -v "${p%% *}" >/dev/null && { $p "$tmp"; exit 0; }
done
echo "no audio player found" >&2
