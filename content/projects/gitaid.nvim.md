+++
title = "gitaid.nvim"
date = 2000-01-06
description = "A small, idiomatic Neovim plugin"
[extra]
tags = ["lua", "neovim", "nix"]
+++

`gitaid` displays the output of `git status --short` in a floating popup. Rows are selectable — pressing `<CR>` jumps to the file in the previously focused window.

## Why

The porcelain is powerful but the muscle memory is brutal. `gitaid` trades a few flags for verbs.

## Design

Lua — it's Neovim's native plugin language, so there are no runtime dependencies. Under the hood `gitaid` shells out with `vim.system` to `git status --porcelain=v1 -z`; the NUL-terminated output means paths are never quoted or escaped, so renames and awkward filenames parse cleanly. The code follows the standard `lua/gitaid/` layout — one config module as the single source of truth, plus git, ui, and highlights — and every highlight is registered with `default = true`, so your colorscheme wins unless you override it. Nix users get a Home-Manager/NixOS module that mirrors the Lua options one-to-one.

## Usage

`<leader>gs` toggles the popup — inside it, `<CR>` opens the file under the cursor, `r` refreshes, and `q` or `<Esc>` closes. Border, dimensions, mappings, and highlight colors all go through the `setup` table:

```lua
require("gitaid").setup({
  border = "rounded",
  show_ignored = false,
  mappings = { toggle = "<leader>gs" },
  keymaps = { open = "<CR>", close = { "q", "<Esc>" }, refresh = "r" },
})
```
