+++
title = "spectral"
date = 2000-01-01
description = "A real-time audio noise suppression application"
[extra]
tags = ["rust", "nix"]
repo = "https://github.com/mmclinton/spectral"
+++

Spectral strips background noise out of your microphone in real time, powered by [RNNoise](https://arxiv.org/pdf/1709.08243) — a hybrid DSP and neural-network suppression model from Xiph.org. On Linux it registers a native PipeWire virtual microphone, so any application can pick the cleaned signal as its input.

## Why

Fans, keyboards, and street noise leak into every call and recording, and the suppressors that handle them well tend to be proprietary and cloud-bound. Spectral does it locally: one virtual mic any app can select, with the denoising, a voice-activity gate, and optional rumble and leveling all under your control.

## Design

Rust — real-time audio can't tolerate a garbage-collector pause on the hot path, and memory safety matters across the PipeWire FFI boundary, where `panic = "unwind"` is kept deliberately so a failed C call or a poisoned lock unwinds instead of aborting. Denoising is a pure-Rust RNNoise port. The app splits in two: a thin [Slint](https://slint.dev) GUI that doubles as a headless CLI, and a background `spectral-daemon` that owns all audio processing — they talk over a Unix-domain socket. A `platform/linux/` seam leaves room for other backends later.

## Try it

```sh
nix run github:mmclinton/spectral
```

Launch `spectral`, pick your input device, and click **Enable** — the daemon starts on its own and a virtual mic named **Spectral-Mic** appears for any app to select. The same binary works headless (`spectral enable --device <id>`, `spectral status`, `spectral disable`).

Nix is the supported install path — it brings the PipeWire and WirePlumber configuration Spectral depends on; an AUR package (`spectral-mic`) is pending. Spectral needs a running PipeWire session.
