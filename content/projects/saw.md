+++
title = "saw"
date = 2026-01-12
description = "A terminal workbench for running static analysis"
[extra]
tags = ["rust", "nix"]
repo = "https://codeberg.org/mmc/saw"
lang = "Rust"
+++

Discover the available analyzers for your language, run them, and review normalized findings in one place — `saw` is a terminal-first static-analysis workbench, built in Rust, language by language, and in early development.

Findings are normalized across tools — clippy → Correctness, rustfmt → Formatting, cargo-audit → Security — and every run is stored under `.saw/` in the project root.

## Usage

Run `saw` from inside a Rust project (it walks up to the nearest `Cargo.toml`):

```sh
saw run     # run the enabled analyzers in parallel, render findings, persist the run
saw list    # show each analyzer and whether its underlying tool is installed
saw show    # re-render the latest stored run (or: saw show <run-id>)
```

Run `saw` with no subcommand (or `saw tui`) to open the interactive TUI — a three-tab workbench (home, analysis, tools) that triggers analyzer runs without leaving the terminal.
