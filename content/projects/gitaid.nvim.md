+++
title = "gitaid.nvim"
date = 2026-03-10
description = "A small, idiomatic Neovim plugin"
[extra]
tags = ["lua", "neovim", "nix"]
repo = "https://codeberg.org/mmc/gitaid.nvim"
lang = "Lua"
+++

`gitaid` displays the output of `git status --short` in a floating popup. Files are selectable — pressing `<CR>` jumps to the file in the previously focused window.

## Why

The porcelain is powerful but the muscle memory is brutal. `gitaid` trades a few flags for verbs.

## Install

With [lazy.nvim](https://github.com/folke/lazy.nvim):

```lua
{
  url = "https://codeberg.org/mmc/gitaid.nvim",
  cmd = "GitAid",
  keys = { { "<leader>gs", desc = "gitaid: toggle git status popup" } },
  opts = {},
}
```

Nix flake users get an overlay and a Home Manager module from the repo.

## Usage

`<leader>gs` toggles the popup. Inside it, `<CR>` opens the file under the cursor, `r` refreshes, and `q` or `<Esc>` closes. Border, dimensions, mappings, and highlight colors are all configurable through the `setup` table:

```lua
require("gitaid").setup({
  border = "rounded",
  show_ignored = false,
  mappings = { toggle = "<leader>gs" },
  keymaps = { open = "<CR>", close = { "q", "<Esc>" }, refresh = "r" },
})
```
