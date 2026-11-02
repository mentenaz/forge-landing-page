Mentenaz Forge Super runs on Windows and on Debian-based Linux (Debian, Ubuntu, Kali) on 64-bit x86.

## Windows

Download `Mentenaz-Forge-Super-x86_64.exe` from the [latest release](https://github.com/mentenaz/mentenaz.Forge.Super/releases/latest) and run it. The installer puts Forge Super in your user profile, so it does not need administrator rights.

## Linux

Run the installer script as root:

```sh
curl -fsSL https://downloads.mentenaz-server.com/install.sh | sudo sh
```

It checks the signing key of the Mentenaz package repository against a fingerprint built into the script, registers the repository with apt, and installs the `forge-super` package. To register the repository without installing anything yet:

```sh
curl -fsSL https://downloads.mentenaz-server.com/install.sh | sudo sh -s -- --repository-only
```

Then start it with:

```sh
forge-super
```

Because Forge Super comes from an apt repository, it is updated with the rest of your system. See [Updating](/docs/updating).

## If it does not start

On Linux, the most common cause is graphics. See [Linux and graphics troubleshooting](/docs/linux).
