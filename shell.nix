{ pkgs ? (import <nixpkgs> {}) }:

with pkgs;

pkgs.stdenv.mkDerivation {
  name = "env";

  buildInputs = with pkgs; [
    nodejs-11_x
    nodePackages.node-pre-gyp
    nodePackages.node-gyp

    sqlite
  ];
}
