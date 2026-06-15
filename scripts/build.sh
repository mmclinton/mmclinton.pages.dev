#!/usr/bin/env bash
# Canonical build: Zola, then the KaTeX/highlight post-build pass.
# Run inside `nix develop` (needs zola, node, and $KATEX_DIST).
set -euo pipefail
cd "$(dirname "$0")/.."

zola build
esbuild public/js/constellation.js --minify --allow-overwrite --outfile=public/js/constellation.js
node scripts/postbuild.mjs
