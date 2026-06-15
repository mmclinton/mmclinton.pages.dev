#!/usr/bin/env bash
# Build and publish to Cloudflare Pages (Direct Upload).
# Run inside `nix develop` (uses the devshell's node via npx for wrangler).
# Authenticate with `npx -y wrangler login`, or set CLOUDFLARE_API_TOKEN +
# CLOUDFLARE_ACCOUNT_ID in the env.
set -euo pipefail
cd "$(dirname "$0")/.."

./scripts/build.sh
npx -y wrangler pages deploy public --project-name mmc --branch=main
