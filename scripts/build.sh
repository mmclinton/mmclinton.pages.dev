#!/usr/bin/env bash
# Canonical build: Zola, then the KaTeX/highlight post-build pass.
# Run inside `nix develop` (needs zola, node, and $KATEX_DIST).
set -euo pipefail
cd "$(dirname "$0")/.."

zola_log=$(zola build 2>&1) || { printf '%s\n' "$zola_log" >&2; exit 1; }
printf '%s\n' "$zola_log"
if [[ $zola_log == *"in a sorted section"* ]]; then
  echo "build.sh: Zola left pages out of a sorted section; give each a date or weight." >&2
  exit 1
fi
for f in public/js/*.js; do
  esbuild "$f" --minify --allow-overwrite --outfile="$f"
done
node scripts/postbuild.mjs
