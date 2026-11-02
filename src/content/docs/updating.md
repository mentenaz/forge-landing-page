Forge Super does not update itself. The built-in updater is switched off in every build, so updates come from the same place you installed from.

## Knowing when there is an update

The first time you start a release build, Forge Super asks whether it may check for updates automatically. If you agree, it asks GitHub once a day whether a newer release exists, and shows a notice when there is one. Nothing is downloaded or installed, and the only request made is to `api.github.com`.

- **Skip This Version** hides the notice for that release. The next release is announced again.
- **Help > Check for Updates** checks right away, and always tells you the result.
- To turn the automatic check off, set `"auto_update": false` in your settings.
- After you update, the first start shows "Updated to Forge Super dev-vN" with a link to what changed.

Builds that did not come from a numbered release (for example one you compiled yourself) have no version to compare, so they never check.

## Windows

Download the installer from the [latest release](https://github.com/mentenaz/mentenaz.Forge.Super/releases/latest) and run it over your existing install. Your settings and data are kept.

## Linux

```sh
sudo apt-get update && sudo apt-get upgrade
```

Every release has a higher package version than the one before it, so apt offers it as a normal upgrade.

## What changed

Every release is listed with its changes on the [Releases](/docs/releases) page.
