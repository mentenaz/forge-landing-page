Troubleshooting for Mentenaz Forge Super on Windows. To install it, see [Install](/docs/install).

## Forge Super fails to start or shows a blank window

- Update your GPU drivers from your GPU vendor (Intel, AMD, NVIDIA or Qualcomm).
- Make sure hardware acceleration is enabled in Windows and is not blocked by third-party software.
- Try starting it with no extensions and default settings to rule out a conflict.

## Graphics

Forge Super needs a DirectX 11 compatible GPU. To check yours, run:

```
dxdiag
```

The DirectX Diagnostic Tool shows the supported version under **System** > **System Information** > **DirectX Version**.

### "Software emulated GPU" warning

In a virtual machine, Forge Super uses the emulated adapter the VM provides. It works, but it is slow, and it shows a warning on start. To stop the warning, set the environment variable `ZED_ALLOW_EMULATED_GPU` to `1` in your Windows environment variables and restart Forge Super.

## ReadDirectoryChangesW initialization failed

Forge Super watches your folders for changes through Windows. This can fail on network filesystems and on WSL paths (`\\wsl$\...`). Open the project from a local drive, or work inside WSL with the remote development features instead.

## Logs

The log is at `%LOCALAPPDATA%\ForgeSuper\logs\ForgeSuper.log`.

## Reporting a problem

Open an issue at [mentenaz/mentenaz.Forge.Super](https://github.com/mentenaz/mentenaz.Forge.Super/issues) and include your Windows version, your GPU and driver, and the log from above.
