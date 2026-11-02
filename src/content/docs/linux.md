Linux works on a large variety of systems. Forge Super is tested mostly on Ubuntu and Kali, and is expected to work on other Debian-based distributions.

## Forge Super fails to start

If you see an error like `/lib64/libc.so.6: version 'GLIBC_2.29' not found`, your distribution's glibc is too old. Upgrade your system.

## Graphics

Forge Super needs a GPU. It talks to it through [Vulkan](https://www.vulkan.org/), so if windows fail to open or performance is poor, Vulkan is the first thing to check.

### "Software emulated GPU" warning

If the only graphics device is a software renderer such as `llvmpipe`, Forge Super refuses to start, because rendering will be very slow. This is common in virtual machines and containers without GPU passthrough. To run anyway, set this variable before starting it:

```sh
export ZED_ALLOW_EMULATED_GPU=1
forge-super
```

Put the line in your shell profile to make it permanent. Expect poor performance; installing Vulkan drivers for your GPU (below) is the real fix.

### `NoSupportedDeviceFound`

Vulkan cannot find a compatible GPU. Run `vkcube` (from the `vulkan-tools` package) to see where it fails:

```sh
vkcube
```

Try both display servers, with `vkcube -m x11` and `vkcube -m wayland`. If it shows a rotating cube, Vulkan works. If not, install Vulkan-capable drivers for your GPU. On a minimal system the Mesa drivers are enough for most Intel and AMD cards:

```sh
sudo apt-get install mesa-vulkan-drivers vulkan-tools
```

To see which GPU Forge Super picked, look for `Using GPU: ...` in the log (see [Logs](#logs)).

### Crashes or `ERROR_SURFACE_LOST_KHR`

Errors like `ERROR_INITIALIZATION_FAILED`, `GPU Crashed` or `ERROR_SURFACE_LOST_KHR` can often be avoided by installing different drivers for your GPU, or by selecting another GPU (below).

On AMD, if you get a `Broken Pipe` error or it never launches while using `amdvlk`, switch to the RADV driver (the `mesa-vulkan-drivers` package) and remove `amdvlk`.

### Choosing a GPU

**By device ID.** Find the ID of the GPU you want:

```sh
lspci -nn | grep VGA
```

In `[10de:2484]` the device ID is `2484`, a hexadecimal number:

```sh
ZED_DEVICE_ID=0x2484 forge-super
```

**With Mesa.** List the available devices, then pick one:

```sh
MESA_VK_DEVICE_SELECT=list forge-super --foreground
export MESA_VK_DEVICE_SELECT=xxxx:yyyy
```

Setting `WAYLAND_DISPLAY=""` as well falls back to XWayland.

**Discrete GPU on laptops.** Try `DRI_PRIME=1 forge-super` to use the discrete GPU.

## I can't open any files, or links don't work

Opening files with the file picker and opening links both go through XDG desktop portals, specifically `org.freedesktop.portal.FileChooser` and `org.freedesktop.portal.OpenURI`. Some window managers, such as Hyprland, don't provide a file picker by default. See [this list of portal backends](https://wiki.archlinux.org/title/XDG_Desktop_Portal#List_of_backends_and_interfaces) for alternatives.

## Forge Super isn't remembering my API keys or login

Secrets are kept in your system keychain, which needs `org.freedesktop.portal.Secret` or `org.freedesktop.Secrets`. Packages that provide this include `gnome-keyring`, `KWallet` and `keepassxc`.

## Could not start inotify

Forge Super uses inotify to watch your folders for changes, and is not reliable without it. If you see "too many open files", check the limits first:

```sh
sysctl fs.inotify
```

- `max_user_instances` should be 128 or higher. Raise it with `sudo sysctl fs.inotify.max_user_instances=1024`. Forge Super needs one instance.
- `max_user_watches` should be 8000 or higher. Raise it with `sudo sysctl fs.inotify.max_user_watches=64000`. It needs one watch per folder in your open projects, one per git repository, and a few more for settings, themes, keymaps and extensions.

You may also be running out of file descriptors. Check with `ulimit` and raise the limit in `/etc/security/limits.conf`.

## Logs

The log is at `~/.local/share/forgesuper/logs/ForgeSuper.log`. For a useful graphics log, clear it, run with more detail, and read it back:

```sh
truncate -s 0 ~/.local/share/forgesuper/logs/ForgeSuper.log
ZED_LOG=wgpu=info forge-super .
cat ~/.local/share/forgesuper/logs/ForgeSuper.log
```

## Reporting a problem

Open an issue at [mentenaz/mentenaz.Forge.Super](https://github.com/mentenaz/mentenaz.Forge.Super/issues) and include your distribution and version, your GPU and driver, and the log from above.
