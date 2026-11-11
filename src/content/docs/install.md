Mentenaz Forge Super runs on Windows and on Debian-based Linux (Debian, Ubuntu, Kali) on 64-bit x86.

## Windows

Download `Mentenaz-Forge-Super-x86_64.exe` from the [latest release](https://github.com/mentenaz/mentenaz.Forge.Super/releases/latest) and run it. The installer puts Forge Super in your user profile, so it does not need administrator rights.

### winget (pending)

A winget package, `Mentenaz.Forge.Super`, has been submitted to the Windows Package Manager community repository, and is waiting to be accepted ([see its status on GitHub](https://github.com/microsoft/winget-pkgs/pull/468737), pull request 468737). Until it is, `winget install Mentenaz.Forge.Super` will not find it, so use the installer above.

Once it is accepted, this will work:

```powershell
winget install Mentenaz.Forge.Super
```

The submission is for release `dev-v47`, so the first version winget offers will be that one, and newer releases reach winget in later submissions. The installer from the [latest release](https://github.com/mentenaz/mentenaz.Forge.Super/releases/latest) is always the newest.

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

### Stable and edge

The repository has two channels. The installer sets you up on **stable**, which only receives a build after it has been tried and approved. If you would like every build as soon as it is made, and do not mind the occasional rough one, register **edge** instead:

```sh
curl -fsSL https://downloads.mentenaz-server.com/install.sh | sudo sh -s -- --edge
```

To go back, run the installer again without `--edge`.

## If it does not start

On Linux, the most common cause is graphics. See [Linux and graphics troubleshooting](/docs/linux).
