Most of Forge Super is Zed, and Zed's documentation at [zed.dev/docs](https://zed.dev/docs) is the best place to learn it. But some of Zed's pages describe things that Forge Super removed or changed. This page goes through Zed's documentation section by section and says, for each, whether it applies, so you do not follow a page for a feature that is not here.

The labels mean:

| Label | Meaning |
| --- | --- |
| **Same** | We have not changed it on purpose, and it should work as Zed's page says |
| **Different** | It exists, but something differs. The note says what, and usually points to a Forge Super page |
| **Not available** | The feature is removed or switched off |
| **Not tested** | It may work, but we have not checked it, so verify before you rely on it |

"Same" means we do not know of a difference. We have not tested every page. For the overall picture, see [What's different from Zed](/docs/different-from-zed).

Two things to keep in mind:

- Zed's website documents the newest Zed. Forge Super is built on Zed 1.29, so a very recent Zed feature may not be here yet. The documentation for exactly the version you run is in the `docs/src` folder of the [Forge Super repository](https://github.com/mentenaz/mentenaz.Forge.Super/tree/main/docs/src).
- Where a Zed page says `zed`, read `forge-super` for the command line, and where it shows a folder named `Zed`, Forge Super uses `ForgeSuper`. Zed's commands appear in the command palette with `forge:` in front of their names.

## Getting started

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Getting Started](https://zed.dev/docs/getting-started) | **Different** | There is no account or sign-in. See [Getting Started on our home page](/#get-started) |
| [Installation](https://zed.dev/docs/installation), [Update](https://zed.dev/docs/update), [Uninstall](https://zed.dev/docs/uninstall) | **Different** | Forge Super has its own installer and apt repository, and does not update itself. See [Install](/docs/install) and [Updating](/docs/updating) |
| [Troubleshooting](https://zed.dev/docs/troubleshooting) | **Same** | For graphics and file-watching problems, see [Windows troubleshooting](/docs/windows) and [Linux troubleshooting](/docs/linux). Logs are in the `ForgeSuper` folder |

## Working with code

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Windows & Projects](https://zed.dev/docs/windows-and-projects), [Editing Code](https://zed.dev/docs/editing-code), [Code Completions](https://zed.dev/docs/completions), [Snippets](https://zed.dev/docs/snippets), [Diagnostics & Quick Fixes](https://zed.dev/docs/diagnostics), [Multibuffers](https://zed.dev/docs/multibuffers) | **Same** | |
| [Finding & Navigating](https://zed.dev/docs/finding-navigating), [Tab Switcher](https://zed.dev/docs/tab-switcher) | **Same** | |
| [Command Palette](https://zed.dev/docs/command-palette) | **Same** | Commands that begin with `zed:` are shown as `forge:`. The commands for the Forge Super panels are listed in [Keyboard shortcuts](/docs/shortcuts) |
| [Project Panel](https://zed.dev/docs/project-panel), [Outline Panel](https://zed.dev/docs/outline-panel) | **Same** | |
| [Running & Testing](https://zed.dev/docs/running-testing), [Tasks](https://zed.dev/docs/tasks), [Debugger](https://zed.dev/docs/debugger), [REPL](https://zed.dev/docs/repl) | **Same** | The [Script Runner](/docs/script-runner) and [Flows](/docs/flows-panel) are Forge Super's own ways to run commands |
| [Terminal](https://zed.dev/docs/terminal) | **Same** | For GitHub repositories you have opened in Helm, Git in the terminal can use your Helm account. See [Helm for administrators](/docs/helm-admin) |
| [Git](https://zed.dev/docs/git) | **Same** | Push, pull and fetch from the Git panel can use your Helm account. Everything else is Zed's |
| [Modelines](https://zed.dev/docs/modelines) | **Same** | |

## Collaboration

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Overview](https://zed.dev/docs/collaboration/overview), [Channels](https://zed.dev/docs/collaboration/channels), [Contacts and Private Calls](https://zed.dev/docs/collaboration/contacts-and-private-calls) | **Not available** | Collaboration needs Zed's servers. The panel is not loaded |

## Remote development

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Remote Development](https://zed.dev/docs/remote-development), [Dev Containers](https://zed.dev/docs/dev-containers) | **Not tested** | A remote server for Linux is built with each release, but we have not checked connecting to it. Verify before you rely on it |
| [Environment Variables](https://zed.dev/docs/environment) | **Same** | |

## AI

Forge Super has Zed's agent panel, inline assistant and edit predictions, with nothing switched on until you set it up. There is no Zed-hosted model, so every provider is one you connect yourself. Start with [AI setup](/docs/ai-setup).

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Overview](https://zed.dev/docs/ai/overview), [Agents](https://zed.dev/docs/ai/agents), [Zed Agent](https://zed.dev/docs/ai/zed-agent), [External Agents](https://zed.dev/docs/ai/external-agents), [Terminal Threads](https://zed.dev/docs/ai/terminal-threads), [Parallel Agents](https://zed.dev/docs/ai/parallel-agents) | **Different** | The features work as described, but only with a provider you configure. Anything that says it uses Zed's hosted models does not apply |
| [AI Quick Start](https://zed.dev/docs/ai/quick-start) | **Different** | It tells you to sign in to Zed. Use [AI setup](/docs/ai-setup) instead |
| [Agent Panel](https://zed.dev/docs/ai/agent-panel), [Agent Settings](https://zed.dev/docs/ai/agent-settings), [Agent Profiles](https://zed.dev/docs/ai/agent-profiles), [Tools](https://zed.dev/docs/ai/tools), [Tool Permissions](https://zed.dev/docs/ai/tool-permissions), [Agent Sandboxing](https://zed.dev/docs/ai/sandboxing), [Model Context Protocol](https://zed.dev/docs/ai/mcp), [Skills](https://zed.dev/docs/ai/skills), [Instructions](https://zed.dev/docs/ai/instructions), [Inline Assistant](https://zed.dev/docs/ai/inline-assistant) | **Same** | No default model is chosen, so choose one first |
| [AI by Company](https://zed.dev/docs/ai/by-company), [LLM Providers](https://zed.dev/docs/ai/llm-providers), [Use API Access](https://zed.dev/docs/ai/use-api-access), [Use an Existing Subscription](https://zed.dev/docs/ai/use-an-existing-subscription), [Use a Gateway](https://zed.dev/docs/ai/use-a-gateway), [Use a Local Model](https://zed.dev/docs/ai/use-a-local-model) | **Same** | These are the ways to connect a provider. Skip any option that depends on a Zed account |
| [Edit Prediction](https://zed.dev/docs/ai/edit-prediction) | **Different** | The provider is `none` until you choose one, and Zed's own provider is not available |
| [AI Privacy](https://zed.dev/docs/ai/privacy-and-security), [Feedback and Training Data](https://zed.dev/docs/ai/ai-improvement) | **Different** | What leaves your machine is described in [Privacy](/docs/privacy). To remove AI from the interface, set `"disable_ai": true` |

## Account, billing and business

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Authenticate](https://zed.dev/docs/authentication), [Plans & Pricing](https://zed.dev/docs/account/plans-and-pricing), [Zed-Hosted Models](https://zed.dev/docs/account/zed-hosted-models), [Billing](https://zed.dev/docs/account/billing) | **Not available** | Forge Super has no account, plans or billing |
| [Zed Business](https://zed.dev/docs/business/overview), [Organizations](https://zed.dev/docs/business/organizations), [Roles & Permissions](https://zed.dev/docs/roles), [Admin Controls](https://zed.dev/docs/business/admin-controls), [Business Support](https://zed.dev/docs/business/business-support) | **Not available** | They describe Zed's paid service |

## Privacy and security

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Worktree Trust](https://zed.dev/docs/worktree-trust) | **Same** | |
| [Telemetry](https://zed.dev/docs/telemetry) | **Different** | Forge Super never sends usage data. See [Privacy](/docs/privacy) |
| [Privacy for Business](https://zed.dev/docs/business/privacy), [SOC2](https://zed.dev/docs/soc2) | **Not available** | They are about Zed's service. For a security review of Forge Super's GitHub client, see [Helm for administrators](/docs/helm-admin) |

## Platforms

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Windows](https://zed.dev/docs/windows), [Linux](https://zed.dev/docs/linux) | **Same** | The requirements and graphics advice apply. See also [Windows troubleshooting](/docs/windows) and [Linux troubleshooting](/docs/linux) |
| [macOS](https://zed.dev/docs/macos) | **Not available** | There is no macOS build at the moment |

## Customization

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Appearance](https://zed.dev/docs/appearance), [Themes](https://zed.dev/docs/themes), [Icon Themes](https://zed.dev/docs/icon-themes), [Fonts & Visual Tweaks](https://zed.dev/docs/visual-customization) | **Same** | |
| [Keybindings](https://zed.dev/docs/key-bindings) | **Same** | Forge Super adds bindings for its panels. See [Keyboard shortcuts](/docs/shortcuts) |
| [Vim Mode](https://zed.dev/docs/vim), [Helix Mode](https://zed.dev/docs/helix) | **Same** | |

## Language support

| Zed's page | Label | Notes |
| --- | --- | --- |
| [All Languages](https://zed.dev/docs/languages), [Configuring Languages](https://zed.dev/docs/configuring-languages), [Toolchains](https://zed.dev/docs/toolchains), [Semantic Tokens](https://zed.dev/docs/semantic-tokens) and each language's page | **Same** | Language servers are downloaded from their own sources when a project needs one |

One name to watch: Zed's [Helm](https://zed.dev/docs/languages/helm) language page is about Kubernetes Helm charts. It has nothing to do with Forge Super's Helm panel, which is a GitHub client. See [Helm](/docs/helm-panel).

## Extensions

| Zed's page | Label | Notes |
| --- | --- | --- |
| [Extensions](https://zed.dev/docs/extensions), [Installing Extensions](https://zed.dev/docs/extensions/installing-extensions) | **Same** | The list comes from Forge Super's own registry |
| [Developing Extensions](https://zed.dev/docs/extensions/developing-extensions), [Extension Capabilities](https://zed.dev/docs/extensions/capabilities), and the pages for language, debugger, theme, icon theme, snippet, MCP server and agent server extensions | **Same** | Extensions are written the same way |
| [Publishing Your Extension](https://zed.dev/docs/extensions/publishing/overview) and the pages under it | **Different** | Publish to Zed's catalogue as the pages describe. Forge Super's registry follows that catalogue, so the extension appears here too once it is built. To add one only Forge Super carries, see [Add an extension](/docs/add-an-extension) |

## Coming from another editor

| Zed's page | Label | Notes |
| --- | --- | --- |
| [VS Code](https://zed.dev/docs/migrate/vs-code), [IntelliJ IDEA](https://zed.dev/docs/migrate/intellij), [PyCharm](https://zed.dev/docs/migrate/pycharm), [WebStorm](https://zed.dev/docs/migrate/webstorm), [RustRover](https://zed.dev/docs/migrate/rustrover) | **Same** | Skip any step that signs in to Zed |

## Reference

| Zed's page | Label | Notes |
| --- | --- | --- |
| [All Settings](https://zed.dev/docs/reference/all-settings) | **Different** | The same keys, but some defaults differ and Forge Super adds settings for its panels. See [What's different from Zed](/docs/different-from-zed) |
| [All Actions](https://zed.dev/docs/all-actions) | **Same** | Forge Super adds actions for its panels, such as `node_panel::ToggleFocus`. They are listed in [Keyboard shortcuts](/docs/shortcuts) |
| [CLI Reference](https://zed.dev/docs/reference/cli) | **Different** | The command is `forge-super`, not `zed` |

## Developing Zed

[Developing Zed](https://zed.dev/docs/development) and its pages are about building and contributing to upstream Zed. They are not about using it. To build Forge Super itself, start from the [repository](https://github.com/mentenaz/mentenaz.Forge.Super). The notes for each release are on the [Releases](/docs/releases) page.
