+++
title = "gnome-center-window"
date = 2000-01-03
description = "Center the active GNOME window with one shortcut"
include_in_feeds = false
[extra]
tags = ["javascript", "gnome"]
repo = "https://github.com/mmclinton/gnome-center-window"
screenshot = { src = "img/projects/gnome-center-window.png", alt = "The extension's preferences: a keyboard shortcut set to Shift+Alt+C, and switches for centering horizontally and vertically", width = 639 }

[[extra.links]]
name = "extensions.gnome.org"
url = "https://extensions.gnome.org/extension/10355/center-window-shortcut/"
+++

A GNOME Shell extension that centers the focused window on its current monitor with one shortcut, `Alt+Shift+C` by default. It moves the window horizontally, vertically, or both, and never resizes it.

## Why

GNOME can maximize, tile, and snap a window, but it has no way to simply put one in the middle of the screen. I wanted that as a single keystroke, without a tiling extension that rearranges everything else.

## Design

JavaScript, because GNOME Shell extensions run in GJS and there is no other choice of language. The whole extension is a few dozen lines: the shortcut is registered through the window manager, and on each press it takes the work area of the window's own monitor, which leaves out the top bar and any docks, and moves the window's frame to the middle of it without touching its size. Holding the keys doesn't repeat the move. Which axes it centers on, and the shortcut itself, are GSettings keys, set from a small libadwaita preferences page.

## Try it

Install it from [extensions.gnome.org](https://extensions.gnome.org/extension/10355/center-window-shortcut/) with the toggle on that page; it's enabled right away, with no restart. It supports GNOME Shell 48, 49, and 50. Change the shortcut, or turn either axis off, from the extension's preferences.
