#!/usr/bin/env bash
# Canonical build: Zola, then the KaTeX/highlight post-build pass.
# Run inside `nix develop` (needs zola, node, and $KATEX_DIST).
set -euo pipefail
cd "$(dirname "$0")/.."

zola build
for f in public/js/*.js; do
  esbuild "$f" --minify --allow-overwrite --outfile="$f"
done
node scripts/postbuild.mjs
