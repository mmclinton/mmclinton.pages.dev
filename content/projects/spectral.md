+++
title = "spectral"
date = 2000-01-01
description = "Real-time microphone noise suppression for Linux"
[extra]
tags = ["rust", "nix"]
repo = "https://github.com/mmclinton/spectral"
screenshot = { src = "img/projects/spectral.png", alt = "Spectral's control panel: an active status badge, the input threshold slider, the list of input devices, the virtual mic name, the rumble filter and auto level switches, and the voice test" }

[[extra.links]]
name = "nixpkgs"
url = "https://search.nixos.org/packages?channel=unstable&query=spectral-mic"
+++

Spectral strips background noise out of your microphone in real time, powered by [RNNoise](https://arxiv.org/pdf/1709.08243), a hybrid DSP and neural-network suppressor published through Xiph.Org. On Linux it registers a native PipeWire virtual microphone, so any application can pick the cleaned signal as its input.

## Why

Fans, keyboards, and street noise leak into every call and recording, and the suppressors that handle them well tend to be proprietary and cloud-bound. Spectral does it locally: one virtual mic any app can select, with the denoising, a voice-activity gate, and optional rumble and leveling all under your control.

## Design

Rust, because real-time audio can't tolerate a garbage-collector pause on the hot path, and memory safety matters across the PipeWire FFI boundary, where `panic = "unwind"` is kept deliberately so a failed C call or a poisoned lock unwinds instead of aborting. Denoising is a pure-Rust RNNoise port. The app splits in two: a thin [Slint](https://slint.dev) GUI that doubles as a headless CLI, and a background `spectral-daemon` that owns all audio processing; they talk over a Unix-domain socket. A `platform/linux/` seam leaves room for other backends later.

## Try it

Spectral is in nixpkgs as `spectral-mic`, and the binary it installs is `spectral`:

```sh
nix run nixpkgs#spectral-mic
```

The flake in the repository tracks the latest commit instead of the last release, and carries a NixOS module that nixpkgs does not ship:

```sh
nix run github:mmclinton/spectral
```

A Flatpak manifest is included too. Spectral isn't on Flathub yet, so for now that route means building it yourself; the [installation guide](https://github.com/mmclinton/spectral/blob/main/docs/INSTALLATION.md) has the steps.

Launch `spectral`, pick your input device, and click **Enable**. The daemon starts on its own, and a virtual mic named **Spectral-Mic** appears and becomes the default input. Everything except the voice test also works headless: `spectral devices`, `spectral enable --device <id>`, `spectral status`, `spectral disable`.

Spectral needs Linux with PipeWire and WirePlumber, on Wayland or X11.
