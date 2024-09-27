{pkgs}: {
  deps = [
    pkgs.netcat-openbsd
    pkgs.iproute
    pkgs.unixtools.netstat
    pkgs.lsof
  ];
}
