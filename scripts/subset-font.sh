#!/usr/bin/env bash
# Subset the site's Inter variable font to the ranges the site actually uses.
#
# The committed static/fonts/Inter.var.woff2 is the OUTPUT of this script — a
# subset of Inter v3.19 ("Inter var", wght 100-900 + slnt, Version 3.019;
# git-0a5106e0b). To regenerate (e.g. to widen coverage), download the full
# variable font from https://github.com/rsms/inter/releases/tag/v3.19 and run:
#
#   nix develop -c ./scripts/subset-font.sh <path-to-full-Inter.var.woff2>
#
# Ranges: Basic Latin + Latin-1 (accented names), Latin Extended-A, General
# Punctuation (smart_punctuation output), superscripts (footnotes), arrows
# (→ ↗), math operators (∏ etc.), and the reading-list stars (★☆). Box-drawing
# characters in code samples are intentionally absent — Inter has no glyphs for
# them, so they render through the monospace fallback either way. Codepoints a
# range names but the font lacks are silently skipped. Variable axes and the
# default layout features (kern, liga, calt, ...) are preserved.
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ $# -ne 1 ]]; then
  echo "usage: $0 <path-to-full-Inter-variable-font>" >&2
  exit 1
fi

out="static/fonts/Inter.var.woff2"

pyftsubset "$1" \
  --output-file="$out.tmp" \
  --flavor=woff2 \
  --unicodes="U+0000-00FF,U+0100-017F,U+2000-206F,U+2070-209F,U+2190-21FF,U+2200-22FF,U+2605-2606"

mv "$out.tmp" "$out"
ls -l "$out"
