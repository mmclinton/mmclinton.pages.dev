+++
title = "mmclinton.pages.dev"
date = 2026-06-10
description = "What you're looking at — Zola, Nix, zero trackers"
[extra]
tags = ["zola", "nix"]
repo = "https://codeberg.org/mmc/mmclinton.pages.dev"
lang = "Web"
+++

This website. A Zola static site, reproducible through a Nix flake, deployed to Cloudflare Pages from Codeberg. Math is prerendered with KaTeX, code highlighting follows the theme toggle, and the only client JavaScript is a theme switch and a small constellation canvas.

See the [colophon](/colophon/) for the full rundown.

## Develop

From the Nix dev shell (`nix develop`, or `direnv allow` if you use direnv):

```sh
zola serve           # fast loop for layout and prose (math shows unrendered)
./scripts/build.sh   # canonical build: zola + the KaTeX/highlight post-build pass
```

`zola serve` is the quick feedback loop; the canonical build runs the post-build pass that prerenders math and injects the KaTeX stylesheet, so reach for it when you need a full-fidelity preview.
