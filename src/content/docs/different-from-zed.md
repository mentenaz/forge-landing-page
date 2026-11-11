Forge Super is a fork of the Zed editor. Most of what you see is Zed's, and works as Zed's documentation describes. This page lists what is different: what was removed or switched off, which defaults changed, what was added, and what is named differently. Read it before you follow an upstream Zed page, so you know whether that page applies.

Forge Super is an independent project. It is not made, endorsed or supported by Zed Industries. It is built on Zed 1.29 and is distributed under the GPL, like Zed.

## In short

- **The editor is Zed's.** Editing, languages, themes, the terminal, the project and outline panels, the Git panel, search, tasks, the debugger and key bindings are Zed's, and we have not changed them on purpose.
- **Nothing needs an account.** There is no sign-in, no collaboration service and no Zed-hosted AI. Forge Super does not contact Zed's servers for those.
- **No usage data is ever sent.** See [Privacy](/docs/privacy).
- **It does not update itself.** Updates come from the installer on GitHub or the apt repository. See [Updating](/docs/updating).
- **It adds panels,** such as Node, Python, .NET, Rust, Database, Flows and Helm, each with a key to open it. See the [tutorials](/docs/tutorials).
- **It has its own names,** folders and link scheme, so it can be installed beside Zed without touching it.

## Using Zed's own documentation

Zed's documentation is at [zed.dev/docs](https://zed.dev/docs). Many of the links inside Forge Super still open it, because the features behind them are Zed's. It is the right place to learn the editor. Use this table to know when to be careful.

| Topic in Zed's docs | In Forge Super |
| --- | --- |
| The editor, multi-cursors, search, snippets, vim mode | The same |
| Languages, language servers, tree-sitter, formatting | The same |
| Themes, icon themes, fonts | The same |
| The terminal, tasks, the debugger | The same |
| The project panel, outline panel, Git panel | The same. In the Git panel, push, pull and fetch can also use your Helm account (see below) |
| Key bindings and the keymap file | The same, with extra bindings for the new panels |
| Settings | The same file format and keys, with different defaults (below) and extra panel settings |
| Extensions | The same system. The catalogue comes from our own registry (below) |
| AI: the agent panel and edit predictions | The same panels, but Zed's hosted models are not available. You connect a provider yourself. See [AI setup](/docs/ai-setup) |
| Sign in, accounts, Zed Pro and billing | Not available |
| Collaboration | Not available. It needs Zed's servers, so the panel is not loaded |
| Updates, release channels and installing | Different. See [Install](/docs/install) and [Updating](/docs/updating) |
| Telemetry and crash reports | Different. See [Privacy](/docs/privacy) |

## Removed or switched off

| What | Why |
| --- | --- |
| The sign-in button in the title bar | It signs in to Zed's account service, which Forge Super does not use. It is hidden by default (`"show_sign_in": false`) |
| The collaboration panel | It connects to Zed's collaboration servers. Its status bar button is off and it is not loaded at startup |
| Zed's hosted AI models, and the default model | There is no hosted provider. The agent asks you to set one up, and no default model is chosen |
| Zed's edit prediction provider | It needs a Zed account. The provider is `none` until you choose one |
| Usage data upload | Switched off in the code. The `telemetry.metrics` setting still exists but has no effect |
| The built-in updater | It would fetch upstream Zed. It is off in every build |
| Crash report upload | Release builds have no destination for it, so nothing is uploaded. Crashes are written to your local log |

You can also remove the AI interface entirely with `"disable_ai": true`.

## Defaults that changed

If you copy a setting from a Zed guide, check it against this table first.

| Setting | Zed's default | Forge Super's default |
| --- | --- | --- |
| `show_sign_in` | `true` | `false` |
| `collaboration_panel.button` | Shown | `false` |
| `agent.default_model` | A Zed-hosted model | Not set. Choose a provider yourself |
| `edit_predictions.provider` | `zed` | `none` |
| `telemetry.metrics` | `true` | `false`, and it has no effect |
| `resize_all_panels_in_dock` | `["left"]` | `["left", "bottom"]` |
| `auto_update` | Updates the app | Never updates the app. It controls the daily check that tells you a release exists |

## What was added

### Panels, and the keys that open them

Each panel opens from the status bar and from the command palette. Most have a key too:

| Panel | Windows and Linux | macOS |
| --- | --- | --- |
| Node | `Ctrl+K` then `O` | `Cmd+K` then `O` |
| Python | `Ctrl+K` then `I` | `Cmd+K` then `I` |
| Rust | `Ctrl+K` then `C` | `Cmd+K` then `C` |
| npm Package Manager | `Ctrl+K` then `J` | `Cmd+K` then `J` |
| Python Package Manager | `Ctrl+K` then `Y` | `Cmd+K` then `Y` |
| NuGet Manager | `Ctrl+K` then `G` | `Cmd+K` then `G` |
| Script Runner | `Ctrl+K` then `K` | `Cmd+K` then `K` |
| Processes | `Ctrl+K` then `X` | `Cmd+K` then `X` |
| Database | `Ctrl+K` then `D` | `Cmd+K` then `D` |
| Helm | `Ctrl+K` then `H` | `Cmd+K` then `H` |
| Flows | `Ctrl+K` then `F` | `Cmd+K` then `F` |

The Cockpit and .NET panels have no default key. Open them from the status bar. The Dashboard opens from the Cockpit panel. Each panel can be moved or hidden with its own settings, for example `"node_panel": { "dock": "right", "button": false }`, and the `panel_order` setting sets the order of the panel buttons in the status bar.

There is a tutorial for each: [Node](/docs/node-panel), [Python](/docs/python-panel), [.NET](/docs/dotnet-panel), [Rust](/docs/rust-panel), [Database](/docs/database-panel), [Dashboard and Cockpit](/docs/dashboard-panel), [Script Runner](/docs/script-runner), [Processes](/docs/processes-panel), [Flows](/docs/flows-panel), [Helm](/docs/helm-panel), and the package managers for [npm](/docs/npm-manager), [Python](/docs/python-manager), [NuGet](/docs/nuget-manager) and [Cargo](/docs/cargo-manager).

### Workflows

The Flows panel and the Designer, which are not in Zed, let you describe multi-step automation as a file you can commit. See [Your first flow](/docs/first-flow) and the [Designer reference](/docs/designer-reference).

### Small additions to Zed's own features

- **The editor's right-click menu.** In a JavaScript or TypeScript file it can offer **Open in Package Manager** and **Search npm for "package"**, for the package named in an import.
- **The Extensions view.** An extension's README can be read in a tab before you install it.
- **Git and GitHub accounts.** When you are signed in to GitHub in Helm, the Git panel's push, pull and fetch, and Git in the terminal for GitHub repositories, use the workspace's Helm account. Outside a repository Helm knows, Git behaves as before. See [Helm for administrators](/docs/helm-admin) for exactly how.
- **Built-in runtimes.** Node.js and Python versions can be installed and chosen from their panels, and the terminal, the Script Runner and workflows find the chosen one first on the path.
- **Importing from earlier builds.** On first launch, Forge Super copies settings and data from this fork's earlier builds. **Import Data From Previous Version** in the command palette does it again.

## Extensions

Extensions work as in Zed. The list, search and details come from Forge Super's own registry, `forge.mentenaz-server.com`, which follows the public Zed extension catalogue and also carries a few extensions of its own. Downloads come from GitHub. See [Add an extension](/docs/add-an-extension).

## Names, folders and links

Forge Super uses its own names so it can sit beside Zed.

| What | Zed | Forge Super |
| --- | --- | --- |
| Product name | Zed | Mentenaz Forge Super |
| Command line | `zed` | `forge-super` |
| Data and logs folder, Windows | `%LOCALAPPDATA%\Zed` | `%LOCALAPPDATA%\ForgeSuper` |
| Logs, Linux | `~/.local/share/zed` | `~/.local/share/forgesuper` |
| Link scheme | `zed://` | `forgesuper://`. `zed://` links still open here |
| Stored credentials | Under the bare address | Under `forgesuper:<address>`. Earlier entries are copied across when first read |
| winget package | `ZedIndustries.Zed` | `Mentenaz.Forge.Super`, once its submission is accepted. See [Install](/docs/install) |

In the command palette, the names of commands that begin with `zed:` are shown as `forge:`. Only the label changes, and the command does the same thing.

Forge Super does not read Zed's own settings or data folders, and never changes them. To bring your settings across, open your settings and your keymap in Forge Super and paste in what you want to keep.

## Releases and platforms

Releases are numbered `dev-vN` and published on GitHub. Windows has an installer, and Debian-based Linux has an apt repository with a stable and an edge channel. There is no macOS build at the moment. See [Install](/docs/install).

Forge Super follows Zed's releases: upstream changes are merged in from time to time, and the release notes say when that happened. Fixes to Zed itself, such as editor bugs, normally come through those merges.

## Where to look next

- New to Forge Super: [Install](/docs/install), then [Your first flow](/docs/first-flow).
- Setting up AI: [AI setup](/docs/ai-setup).
- Worried about what it contacts: [Privacy](/docs/privacy).
- Learning the editor: [Zed's documentation](https://zed.dev/docs).
