The Flows panel is the index of your workflows. It lists every flow in the project, shows how each one last ended, runs them and stops them without opening them, and shows the links of any servers a running flow has started. This tutorial uses the panel to create, run, open and organise flows. To build what goes inside a flow, see [Your first flow](/docs/first-flow).

It takes about six minutes. You need a folder open in Forge Super, because flows belong to a project.

## 1. Open the panel

Press `Ctrl+K` then `F`, or click the **Flows** icon in the status bar. You can also run `flows panel: toggle focus` from the command palette. It opens on the left.

At the top is the title **Flows** with a **Refresh** button, and under it the buttons **New Workflow** and **Add Task Chain**. Below those is the list.

With no folder open, the two buttons are greyed out and the list says **Open a folder to see its flows**. In a new project it says **No flows yet — click "New Workflow" to create one**.

[//]: # (TODO screenshot flows-panel-1-empty.png: The Flows panel in a new project with the empty message.)

## 2. Create a flow

There are two ways to make one:

- **New Workflow** makes an empty flow and opens it in the Designer. It is not given a name you choose: it is named after the time, for example `flow-20261110-091500`.
- **Add Task Chain** looks through your project for servers, such as a frontend and a backend, and builds a flow that starts them together. See [Add a task chain](/docs/task-chain).

Click **New Workflow** now. The new flow opens as a tab, and appears in the list.

## 3. Where flows live

A flow is a file ending in `.flow.json`, kept in `.zed/workflows` in your project folder. The folder is created the first time you need it. Because they are ordinary files, you can commit them to git and share them with your team.

The list shows one row for each file, sorted by name. To give a flow a better name, rename its file. If you add, remove or rename flow files outside Forge Super, for example with a `git pull`, click **Refresh** to read the folder again.

To keep your flows somewhere else, set a folder relative to the project in your settings:

```json
{
  "flows": {
    "workflows_dir": "automation/flows"
  }
}
```

## 4. Run a flow from the list

Each row has a **Run** button, which runs the flow without opening it.

While it runs, the button changes to a red **Stop** with a spinner, and **Open** and **Graph** are greyed out until it ends. When it ends, the row shows a tag saying how the latest run went:

| Tag | Meaning |
| --- | --- |
| **last run ok** | It finished without an error |
| **last run failed** | It ended with an error. The reason appears in red under the buttons at the top of the panel, starting with **Run failed:** |
| **last run stopped** | You stopped it. This is not counted as a failure |

The panel keeps the last 50 runs of each flow. The row shows how the most recent one ended.

For a step-by-step view of a run, with each node coloured and a log of what it printed, run the flow from the Designer instead. The panel shows only the outcome.

[//]: # (TODO screenshot flows-panel-2-rows.png: The list with a flow running, a flow marked last run ok, and a flow marked last run failed.)

## 5. Servers and their links

A flow that starts servers keeps running for as long as they do, so its row keeps showing **Stop** until you press it. While it runs, a line appears under the row for each server that is up and has an address:

```
● Start backend:   http://localhost:8000    [open] [copy]
● Start frontend:  http://127.0.0.1:5173/   [open] [copy]
```

Click the open icon to open the address in your browser, or the copy icon to put it on the clipboard. A server with no address is not listed, and the lines go away when the run ends.

Press **Stop** and every server the run started is stopped. Closing the panel stops the runs it started too, and so does closing the flow's tab in the Designer. Running the same flow again first stops the servers its earlier run left, so you never have two servers on one port.

## 6. Open a flow

There are two ways to open a flow from its row:

- **Open** opens the flow the normal way. Forge Super always opens `.flow.json` files in the Designer, so this ends up on the canvas.
- **Graph** opens the flow on the Designer canvas directly.

To read the flow's JSON, click **Raw** in the Designer's toolbar.

## 7. Settings

Two settings change how the panel itself looks. Put them in your settings file:

```json
{
  "flows_panel": {
    "dock": "right",
    "button": false
  }
}
```

`dock` is `left` or `right`, and `button` shows or hides the Flows icon in the status bar. You can still open the panel with `Ctrl+K` then `F` when the button is hidden.

## If something goes wrong

**The New Workflow and Add Task Chain buttons are greyed out.** No folder is open. Open your project's folder.

**A flow you added by hand is not in the list.** Click **Refresh**, and check that the file is in the flows folder and ends in `.flow.json`.

**The row stays on Stop after the last step finished.** The flow started a server, and a run lasts as long as its servers. This is intended. Click **Stop** when you are done. If a step of the flow never turns Ready, see [Designer reference](/docs/designer-reference) for the ready settings.

**"Run failed: …" appears.** The message is the first error the run met. Open the flow in the Designer and run it there to see which node failed and why.

**Open and Graph are greyed out.** The flow is running. Stop it, or wait for it to finish.
