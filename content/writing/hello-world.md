+++
title = "Hello, world"
date = 2026-06-01
description = "A first placeholder post to prove the pipeline end to end."
+++

This is a placeholder post — proof that markdown, templates, and the feed all
work end to end.

## A heading

Some prose with a [link](https://www.getzola.org/) and a little `inline code`.

```rust
fn main() {
    println!("hello, world");
}
```

```nix
{
  description = "Personal website — Zola static site, deployed to Cloudflare Pages";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      # KaTeX, vendored declaratively (build-time only) for server-side math
      # rendering. fetchzip strips the npm tarball's top-level `package/`, so the
      # distributables live at "${katexDist}/dist".
      katexDist = pkgs.fetchzip {
        url = "https://registry.npmjs.org/katex/-/katex-0.17.0.tgz";
        hash = "sha256-PH5c4Ut57zenUaY0YL4/mDiM18w4Hs0qbgFg6L0yoTo=";
      };
    in {
      devShells.default = pkgs.mkShell {
        KATEX_DIST = "${katexDist}/dist";
        packages = [
          pkgs.zola
          pkgs.nodejs_22
          pkgs.lychee
          pkgs.esbuild
          pkgs.prettier
          pkgs.alejandra
          pkgs.miniserve
        ];
      };

      formatter = pkgs.alejandra;
    });
}
```

## Mermaid 
graph TD
    A[Start] --> B[Process]
    B --> C[End]   

## Mermaid again
```
graph TD
    A[Start] --> B[Process]
    B --> C[End]   
```

A second paragraph so there's something for the table of contents to chew on
once that lands in the next milestone.
