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
          # pyftsubset for scripts/subset-font.sh (brotli enables woff2 output)
          (pkgs.python3.withPackages (ps: [ps.fonttools ps.brotli]))
        ];
      };

      # `nix flake check` runs the full site build in the sandbox, so the
      # documented pre-commit gate actually gates the build.
      checks.build = pkgs.stdenvNoCC.mkDerivation {
        name = "site-build";
        src = self;
        nativeBuildInputs = [pkgs.zola pkgs.nodejs_22 pkgs.esbuild];
        KATEX_DIST = "${katexDist}/dist";
        buildPhase = "bash scripts/build.sh";
        installPhase = "mv public $out";
        dontFixup = true;
      };

      formatter = pkgs.alejandra;
    });
}
