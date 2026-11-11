This page lists the keyboard shortcuts that Forge Super adds to Zed's own: the keys that open each panel, and the keys that work inside the panels' lists, tables and the Designer canvas. For Zed's own shortcuts, such as editing, search and the command palette, see [Zed's key bindings documentation](https://zed.dev/docs/key-bindings).

The shortcuts are the same on every system, except that `Cmd` takes the place of `Ctrl` on macOS.

## Opening a panel

Each of these is a chord: press `Ctrl+K`, let go, then press the letter.

| Press | Opens |
| --- | --- |
| `Ctrl+K` then `O` | [Node panel](/docs/node-panel) |
| `Ctrl+K` then `I` | [Python panel](/docs/python-panel) |
| `Ctrl+K` then `C` | [Rust panel](/docs/rust-panel) |
| `Ctrl+K` then `F` | [Flows panel](/docs/flows-panel) |
| `Ctrl+K` then `K` | [Script Runner](/docs/script-runner) |
| `Ctrl+K` then `X` | [Processes panel](/docs/processes-panel) |
| `Ctrl+K` then `D` | [Database panel](/docs/database-panel) |
| `Ctrl+K` then `H` | [Helm](/docs/helm-panel) |
| `Ctrl+K` then `J` | [npm Package Manager](/docs/npm-manager) |
| `Ctrl+K` then `Y` | [Python Package Manager](/docs/python-manager) |
| `Ctrl+K` then `G` | [NuGet Manager](/docs/nuget-manager) |

On macOS, use `Cmd+K` in place of `Ctrl+K`.

A chord opens the panel and focuses it. Pressing it again while the panel is focused hides it. The three package managers open as tabs in the editor area, and the others open as panels.

### Panels with no key

These have no default key. Open them from the status bar, or run the command from the command palette (`Ctrl+Shift+P`):

| Panel | Command |
| --- | --- |
| Cockpit | `cockpit panel: toggle focus` |
| Dashboard | `cockpit panel: open dashboard`, or the **Dashboard** button in the Cockpit panel |
| .NET | `dotnet panel: toggle focus` |
| Cargo Manager | The **Package Manager** button in the Rust panel |

Every dock panel can also be opened from the command palette with its own `… panel: toggle focus` command.

## Inside the package managers

The npm, Python, NuGet and Cargo managers share the same keys when a package list is focused. Click the list to focus it.

| Key | Does |
| --- | --- |
| `Up` and `Down` | Move the selection |
| `Enter` | Open the selected package's details. On the Cargo Manager's Vulnerabilities page, open the advisory in your browser |
| `Space` | Do the page's main action: Install, Remove, Update or Fix |

In a search box, `Enter` runs the search. The Cargo Manager's search results cannot be moved through with the keys yet.

## Inside the Processes panel

Click the table to focus it, then:

| Key | Does |
| --- | --- |
| `A` | Mark the selected process as managed, or release it |
| `Delete` or `Backspace` | Kill the selected process, after asking |

## Inside Helm

Click a list to focus it, then:

| Key | Does |
| --- | --- |
| `Up` and `Down` | Move the selection |
| `Enter` | Open the selected row, where rows open something |

A click on a row does the same as `Enter`. Lists such as branches, commits and tags only show information, so nothing happens. Invitations are accepted and declined only with their own buttons, never with a key or a click on the row, so one cannot be accepted by accident.

## In the Designer

| Key | Does |
| --- | --- |
| `Enter` on an action in the list | Adds it as the next step after the selected node, or near the middle of the canvas |
| `Delete` or `Backspace` | Deletes the selected nodes and connections. The canvas must be focused, so that typing in a node's field does not delete the node |
| `Tab` and `Shift+Tab` | Move the selection to the next or previous node |
| `Ctrl+Z` and `Ctrl+Shift+Z` | Undo and redo a change on the canvas (`Cmd` on macOS). From release `dev-v54`; before it, these keys did nothing on Windows and Linux |
| `Ctrl+A` | Selects every node, when the canvas is focused (`Cmd` on macOS) |
| `Ctrl`+click | Adds a node to the selection, or takes it out (`Cmd` on macOS) |
| `Shift`+drag | Draws a box and selects what is inside it |
| `Ctrl+S` | Saves the flow, like any other file |
| Scroll | Pans the canvas |
| `Ctrl`+scroll (`Cmd`+scroll on macOS) | Zooms towards the pointer |

In the Add Task Chain window, `Escape` closes it without making anything.

## Changing a shortcut

To use a different key for a panel, open your keymap from the command palette (search for "keymap") and add an entry. The keymap is a list, and each entry maps keys to an action:

```json
[
  {
    "bindings": {
      "ctrl-alt-n": "node_panel::ToggleFocus",
      "ctrl-alt-p": "python_panel::ToggleFocus"
    }
  }
]
```

The action names are the ones in the first column of this table:

| Panel | Action |
| --- | --- |
| Node | `node_panel::ToggleFocus` |
| Python | `python_panel::ToggleFocus` |
| Rust | `rust_panel::ToggleFocus` |
| Flows | `flows_panel::ToggleFocus` |
| Script Runner | `script_runner_panel::ToggleFocus` |
| Processes | `processes_panel::ToggleFocus` |
| Database | `database_panel::ToggleFocus` |
| Helm | `helm_panel::ToggleFocus` |
| Cockpit | `cockpit_panel::ToggleFocus` |
| .NET | `dotnet_panel::ToggleFocus` |
| npm Package Manager | `npm_manager::OpenNpmManager` |
| Python Package Manager | `python_manager::OpenPythonManager` |
| NuGet Manager | `nuget_manager::OpenNuGetManager` |
| Cargo Manager | `cargo_manager::OpenCargoManager` |

A key you add this way works on top of the defaults. To stop a default chord from doing anything, bind it to `null`. Your keymap is a Zed keymap, so [Zed's key bindings documentation](https://zed.dev/docs/key-bindings) explains the format, contexts and precedence in full.

You can also move or hide a panel with its settings, for example `"node_panel": { "dock": "right", "button": false }`. See [What's different from Zed](/docs/different-from-zed).
