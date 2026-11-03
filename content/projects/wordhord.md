+++
title = "wordhord"
date = 2000-01-02
description = "A private, offline-first dictionary application"
[extra]
tags = ["rust", "nix"]
+++

`wordhord` is a native, offline-first dictionary — private and fast, with no accounts, no tracking, and no network at all once a dictionary is downloaded. The name is Old English for "word-hoard," a treasury of words.

## Why

Looking up a word shouldn't phone home. wordhord keeps the whole dictionary on your machine and answers instantly — headword and lemma lookup, prefix, fuzzy, and wildcard search, even reverse lookup by definition text — all local, all yours.

## Design

Rust, so a single fast core can back every platform. The engine is pure and synchronous — no UI, no I/O policy, no async — and it's exposed over a [UniFFI](https://mozilla.github.io/uniffi-rs/) boundary to thin, native shells: GTK4/libadwaita on Linux first, then SwiftUI and Jetpack Compose. One engine, native UIs. A separate build-time pipeline compiles the kaikki.org Wiktionary extract into a self-contained, documented format (SQLite with FTS5, plus a finite-state-transducer headword index). Code and data are kept strictly apart — the code is MIT/Apache-2.0, the compiled dictionary is CC BY-SA 4.0 and released separately — and CI holds every search mode to a strict latency budget.

## Try it

Pre-release — nothing is packaged yet. The engine, data model, and compiler pipeline all work today; the GTK shell is still an early spike, so there's nothing to install just yet. The repo link above is the place to follow along.
