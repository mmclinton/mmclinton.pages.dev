+++
title = "saw"
date = 2000-01-04
description = "A terminal workbench for running static analysis"
[extra]
tags = ["rust", "nix"]
+++

`saw` is a terminal-first static-analysis workbench — it discovers the analyzers for your project, runs them, and reports one normalized set of findings, as human-readable text or machine-readable JSON.

## Why

Every analyzer speaks its own dialect: different commands, different flags, different output schemas. `saw` runs them all and normalizes what comes back — clippy lints and cargo-audit advisories arrive in the same shape, so you (or an agent) read one report instead of juggling several.

## Design

Rust, for a single fast binary whose output is a stable contract: the exit codes and JSON schema are fixed — `0` clean, `1` findings, `2` incomplete — so scripts and agents can depend on them. A two-crate workspace splits the engine (`saw-core`) from the CLI (`saw`), and each analyzer is a plugin behind one interface. saw resolves analyzers from its own pinned, checksum-verified store rather than your `PATH`, so runs are reproducible — never "whatever is on the machine."

## Usage

The core commands:

```sh
saw analyze [PATH] [--format text|json]   # run the enabled analyzers, normalize, report
saw tool list                             # show analyzers and whether each is installed
saw tool install <ID>                     # fetch a pinned analyzer into saw's store
```

Status: early — Rust (clippy, cargo-audit) on Linux today, with more languages and an interactive TUI on the roadmap.
