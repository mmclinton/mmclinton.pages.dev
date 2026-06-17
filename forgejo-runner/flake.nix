{
  description = "Forgejo Actions runner (host mode) — `nix run` starts the daemon";

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

      daemon = pkgs.writeShellApplication {
        name = "forgejo-runner-daemon";
        runtimeInputs = [pkgs.forgejo-runner pkgs.nodejs pkgs.git];
        text = ''
          exec forgejo-runner daemon "$@"
        '';
      };
    in {
      packages.default = daemon;

      apps.default = {
        type = "app";
        program = "${daemon}/bin/forgejo-runner-daemon";
      };

      devShells.default = pkgs.mkShell {
        packages = [pkgs.forgejo-runner pkgs.nodejs pkgs.git];
      };
    });
}
