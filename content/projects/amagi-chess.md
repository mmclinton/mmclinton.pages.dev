+++
title = "amagi-chess"
date = 2000-01-05
description = "A UCI chess engine that plays on Lichess"
[extra]
tags = ["rust", "nix"]
repo = "https://codeberg.org/mmc/amagi-chess"
demo = "https://lichess.org/@/amagi-chess"
+++

`amagi-chess` is a UCI chess engine in the alpha-beta + NNUE tradition — a Stockfish-style search paired with a neural-network evaluation — written in Rust and running as a bot on Lichess. The name comes from Sumerian _ama-gi_, "liberty."

## Why

A chess engine is the perfect excuse to go deep on the things that are genuinely hard to do well: search, evaluation, SIMD, and wringing every last bit of speed out of the machine. amagi-chess is that engine — built from first principles and put online to play rated games.

## Design

Rust, for the raw search speed of C++ without surrendering memory safety — the NNUE forward pass is hand-vectorized with AVX2 and stays bit-identical to a scalar reference. The engine is five crates: `amagi-core` (board and move generation), `amagi-eval` (NNUE inference), `amagi-search` (alpha-beta, transposition table, Lazy SMP, Syzygy probing), `amagi-uci` (the protocol loop), and `amagi-datagen` (self-play). Move generation and tablebase probing lean on pure-Rust crates (`cozy-chess`, `shakmaty`), so the Nix build needs no C dependencies; the net is embedded at build time while the GPU trainer lives outside the workspace, so the engine itself never links ROCm. Every change that can affect playing strength is gated behind offline SPRT before it lands.

## Try it

The easiest way is to play it: challenge the bot [`amagi-chess`](https://lichess.org/@/amagi-chess) on Lichess, which seeks rated 5+0 blitz when idle and takes challenges. To run the engine yourself, build it from the repo — the net is stored in git-lfs, so it needs a `git lfs pull` — and load the `amagi-uci` binary into a UCI GUI like Cute Chess or En Croissant. Status: milestone-driven and actively developed; it currently ships the `amagi-v4` net.
