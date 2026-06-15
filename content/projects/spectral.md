+++
title = "spectral"
date = 2026-02-18
description = "A real-time audio noise suppression application"
[extra]
tags = ["audio", "rust", "nix"]
repo = "https://codeberg.org/mmc/spectral"
lang = "Rust"
+++

## About

 A real-time audio noise suppression application powered by [RNNoise](https://arxiv.org/pdf/1709.08243), a hybid DSP and neural-network-based noise suppression system originally developed by Xiph.org.
 
## Status

Functional on Linux via PipeWire. The application consists of a GUI (`spectral`) and a background daemon (`spectral-daemon`) that handles audio processing.
