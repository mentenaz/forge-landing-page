Forge Super has no account and no sign-in, and it does not send usage data or crash reports anywhere by default. This page lists what the app does contact, and when, so you can check it yourself.

It describes the app as of release `dev-v47` (2 November 2026). If you ever see it connect somewhere that is not listed here, please [report it](https://github.com/mentenaz/mentenaz.Forge.Super/issues).

## What stays on your computer

Your code, projects, settings and history stay on your machine. Forge Super does not upload them. API keys you enter for AI providers are stored in your system keychain, not in `settings.json`.

## What the app contacts

| What | Where | When |
| --- | --- | --- |
| Extension list, search and details | `forge.mentenaz-server.com` | When you use the Extensions panel |
| Extension downloads | `github.com` (releases of `mentenaz/extensions`) | When you install or update an extension |
| Update check | `api.github.com` | Only if you agreed to it, at most once a day, or when you choose **Check for Updates** |
| Language servers, runtimes and packages | Their own sources, such as GitHub releases, the npm registry and nodejs.org | When a project needs one and you let it install |
| List of external agents | `cdn.agentclientprotocol.com` | When you use external agents |
| GitHub features (Helm) | `api.github.com` | Only after you sign in to GitHub, and only when you use them |
| AI models and edit predictions | The provider you set up yourself | Only when you use an AI feature |

In each case the server can see your IP address and the request itself, as with any web request. We run only the first row (the extension registry), along with the website and the package repository at `downloads.mentenaz-server.com`. The others are run by GitHub, the package registries, the Agent Client Protocol project and the AI provider you chose, and their own policies apply to what they receive.

The extension request tells the registry which extension API versions your build supports, plus any search words or filters you typed.

Forge Super does not contact Zed's servers for sign-in, collaboration or AI, because those features are removed or switched off.

## Telemetry and crash reports

- **Usage data** (`telemetry.metrics`) is **off**. While it is off, usage events are discarded inside the app and never sent. If you turn it on, the app would send them to Zed's telemetry endpoint, because that is where the editor's code sends them and we do not run a collector. We recommend leaving it off.
- **Crash reports** (`telemetry.diagnostics`) show as on in the settings, but release builds of Forge Super have no crash-report destination configured, so nothing is uploaded. Crashes and errors are written to your local log file only.

Your log files are here, and you can read or delete them at any time:

- Windows: `%LOCALAPPDATA%\ForgeSuper\logs\ForgeSuper.log`
- Linux: `~/.local/share/forgesuper/logs/ForgeSuper.log`

## Turning things off

- To remove AI from the interface completely, set `"disable_ai": true`.
- To stop the daily update check, set `"auto_update": false`.
- To stop an AI provider receiving anything, remove its key in **Settings** > **AI** > **LLM Providers**.

## The website

This page covers the app. The website at `forge.mentenaz-server.com` has its own sign-in and a newsletter, for the previous version of Forge and for mailing list subscribers. They hold the email address you give them for that purpose.

## Questions

Open an issue at [mentenaz/mentenaz.Forge.Super](https://github.com/mentenaz/mentenaz.Forge.Super/issues).
