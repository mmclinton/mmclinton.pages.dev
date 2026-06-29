+++
title = "spectral"
date = 2026-02-18
description = "A real-time audio noise suppression application"
[extra]
tags = ["rust", "nix"]
repo = "https://codeberg.org/mmc/spectral"
lang = "Rust"
+++

Spectral cleans background noise out of your microphone in real time, powered by [RNNoise](https://arxiv.org/pdf/1709.08243) — a hybrid DSP and neural-network-based suppression model originally developed by Xiph.org. On Linux it runs through PipeWire as a GUI (`spectral`) paired with a background daemon (`spectral-daemon`) that does the audio processing.

## Features

- Real-time noise suppression using the RNNoise neural network
- Native PipeWire audio-pipeline integration
- A virtual microphone usable from any application
- Adjustable suppression threshold
- State that persists across sessions

## Usage

Try it straight from the repo:

```sh
nix run git+https://codeberg.org/mmc/spectral
```

Then:

1. Start the daemon: `spectral-daemon`
2. Launch the GUI: `spectral`
3. Select your input device from the dropdown
4. Adjust the noise suppression threshold as needed
5. Click **Enable** to create the virtual microphone
6. Select **Spectral-Mic** (or your custom name) as the input in other applications

Nix is the officially supported install method — it pulls in the PipeWire, libpulse, and WirePlumber configuration Spectral depends on.
