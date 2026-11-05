+++
title = "smv"
date = 2000-01-02
description = "A markdown viewer for Linux"
[extra]
tags = ["rust", "nix"]
repo = "https://github.com/mmclinton/smv"
screenshot = { src = "img/projects/smv.png", alt = "smv showing a markdown document with headings, a table, a highlighted Rust code block, a task list, and a quote" }
+++

smv is a markdown viewer for Linux: a window and the document in it, rendered the way GitHub renders it. It opens a file, or reads standard input when given `-`.

## Why

I wanted a viewer that stays a viewer. Most markdown tools grow into editors, file browsers, or note apps; I wanted one that spawns quickly, paints its first frame quickly, scrolls as smoothly as the monitor allows, and renders everything GitHub would. So smv has no editing, no file browser, and no tabs, and none of those are planned.

## Design

Rust, because the frame budget is tight: smv measures scrolling against 4.17 ms, one refresh at 240 Hz, and a garbage-collector pause would blow through that. Each part of the stack was picked by measurement. [comrak](https://github.com/kivikakk/comrak) parses the markdown because it passes 98.7% of the GFM spec suite to pulldown-cmark's 96.6%, and handles bare-URL autolinks. [cosmic-text](https://github.com/pop-os/cosmic-text) shapes and lays out text, with a first screenful ready in 9.8 ms where parley took 115.7 ms. Drawing goes through winit and wgpu on the GL backend, which reaches a first frame in 47 ms to Vulkan's 62 ms. Syntax highlighting runs on a thread of its own with a per-block time budget, so a pathological code block can never stall a frame.

## Try it

```sh
nix run github:mmclinton/smv -- README.md
pandoc -t gfm notes.docx | nix run github:mmclinton/smv -- -
```

Keys are vim-flavored: `j` and `k` scroll, `/` finds, `n` and `N` step through matches, `Ctrl-c` copies the selection as markdown, and `q` quits. The Nix package brings a desktop entry, so smv can be set as the default handler for `text/markdown`.

smv is at 0.1.0 and pre-release. It runs on Wayland or X11.
