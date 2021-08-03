{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/2a6732c38dfa8c1a3c8288f2b47a28cbea57a304.tar.gz") { system = "x86_64-linux"; } }:

let
    pythonPackages = pkgs.python2.withPackages (ps: [
        ps.flask
        ps.requests
    ]);
in pkgs.dockerTools.buildImage {
    name = "docker-devenv";

    # nix run nixpkgs.nix-prefetch-docker -c nix-prefetch-docker --image-name "ubuntu" --image-tag "16.04"
    fromImage = pkgs.dockerTools.pullImage {
        imageName = "ubuntu";
        imageDigest = "sha256:6a3ac136b6ca623d6a6fa20a7622f098b2fae1ac05f0114386ef439d8ca89a4a";
        sha256 = "1lf6wqvybm9icwdc2rpy47ddixhlpa0qnw9441mmi6jwmgclxvr6";
        finalImageTag = "16.04";
    };
    contents = [ 
        pythonPackages
        pkgs.git
        pkgs.vim
        ./test-app/AddSEC-demo
    ];
#     runAsRoot = ''
#         sudo apt-get update
#     '';
    config = {
        #Cmd = [ "${pkgs.python39}/bin/python" "/test-app/app.py" ];
        #Cmd = [ "${pkgs.bash}/bin/bash" ];
        Cmd = [ "/run.sh" "-h" "0.0.0.0" ];
        ExposedPorts = {
            "5000/tcp" = { };
        };
    };

}

# This encapsulates dependencies
# Look to use for compiled languages or run python app
# Get docker to build rather than run bash
# Integrate into CI
# Auto-populate from requirements.txt? - Generate this nix file and store in s3?
# Hermetic, portable venv w/ dependencies
