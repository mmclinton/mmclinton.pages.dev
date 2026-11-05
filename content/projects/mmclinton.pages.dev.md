+++
title = "mmclinton.pages.dev"
date = 2000-01-04
description = "What you're looking at: Zola, Nix, zero trackers"
[extra]
tags = ["zola", "nix"]
repo = "https://github.com/mmclinton/mmclinton.pages.dev"
+++

This website. A Zola static site, reproducible through a Nix flake, deployed to Cloudflare Pages from my own Forgejo. Math is prerendered with KaTeX, code highlighting follows the theme toggle, and the only client JavaScript is a theme switch, a small constellation canvas, and sorting and search on the reading page.

See the [colophon](/colophon/) for the full rundown.

## Develop

From the Nix dev shell (`nix develop`, or `direnv allow` if you use direnv):

```sh
zola serve           # fast loop for layout and prose (math shows unrendered)
./scripts/build.sh   # canonical build: zola + the KaTeX/highlight post-build pass
```

`zola serve` is the quick feedback loop; the canonical build runs the post-build pass that prerenders math and injects the KaTeX stylesheet, so reach for it when you need a full-fidelity preview.
