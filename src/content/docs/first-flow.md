A flow is a set of steps that Forge Super runs for you, in order, and shows you as it goes. In this tutorial you build a small one from scratch: it logs a message, waits a second, and logs another. Nothing to install and nothing outside the app, so you can see how the Designer works before you use it for real jobs.

It takes about five minutes.

**Before you start**

- Forge Super is open on a folder (any folder). Flows are stored in the folder you have open.
- The Flows panel is on the left. If you cannot see it, press `Ctrl+K` then `F`, or click the Flows icon in the status bar.

## 1. Create the flow

In the Flows panel, click **New Workflow**.

A new flow is created and opens in its own tab. It is named after the time you made it, for example `flow-20261110-091500`, and saved in `.zed/workflows` in your folder. You are not asked for a name, and you can leave it as it is.

[//]: # (TODO screenshot first-flow-1-new-workflow.png: The Flows panel with the New Workflow button, and the empty flow open beside it.)

The Designer has three parts:

| Part | Where | What it is for |
| --- | --- | --- |
| Actions | Left | Every kind of step you can add, in groups |
| Canvas | Middle | Your flow, drawn as boxes (nodes) and lines |
| Inspector | Right | The settings of the node you have selected |

## 2. Add a Log step

In the **Actions** list, find the **Utilities** group and click **Log**.

A node appears in the middle of the canvas, already selected, and the inspector shows its settings:

- **level**: type `info`.
- **message**: type `Hello from Forge`.

[//]: # (TODO screenshot first-flow-2-log-inspector.png: The Log node on the canvas, selected, with level and message filled in the inspector.)

## 3. Add a Delay step

With the Log node still selected, click **Delay** in the Actions list.

The new node is placed below the Log node and joined to it by a line. Set **ms** to `1000` (one second).

The line means "run this after that one finished successfully". Every step you add while another is selected is joined to it in this way.

[//]: # (TODO screenshot first-flow-3-connected.png: Log and Delay on the canvas with the line between them.)

## 4. Add a second Log step

With Delay selected, click **Log** again. Set **level** to `info` and **message** to `Done`.

You now have three nodes in a row: Log, Delay, Log.

## 5. Run it

Click **Run** at the top right.

Each node changes colour as it runs: it is **Running** while it works and **Succeeded** when it is done. The Delay node stays in the running colour for about a second, which is the pause you asked for. A line at the top names the node that is working.

[//]: # (TODO screenshot first-flow-4-running.png: The flow mid-run, with the Delay node running and the Run button showing as Stop.)

While a flow runs, **Run** turns into **Stop**. For this flow it finishes by itself in a second or two.

## 6. See what happened

When the run has started, a terminal icon appears in the toolbar. Click it to open the **run log** under the canvas. It lists each node as it started and finished, with how long it took.

Click a node on the canvas, or a row in the log, and the inspector shows that node's result. The chart icon next to it opens the full run results in a tab of their own.

[//]: # (TODO screenshot first-flow-5-run-log.png: The run log open under the canvas with the three rows, and a node selected.)

To clear the colours and the log, use the **x** icon in the toolbar.

## 7. Save it

Click **Save**, or use your usual save shortcut. A flow with changes that are not saved shows the usual marker on its tab, and Forge Super asks before you close it.

Saving writes two files next to each other in `.zed/workflows`:

| File | What is in it |
| --- | --- |
| `<name>.flow.json` | The flow itself: its steps and how they connect |
| `<name>.flow.layout.json` | Where each node sits on the canvas |

Click **Raw** to see the flow file as text. It is ordinary JSON, so you can keep it in git with the rest of your project. Moving a node only changes the layout file, never the flow.

[//]: # (TODO screenshot first-flow-6-raw.png: The Raw view of the finished flow.)

## If Run is greyed out

Run is disabled while something is missing, for example a required setting left empty. A red badge next to it says how many problems there are. Click the badge to see the list; clicking a problem takes you to the node it belongs to. Fix it and Run comes back. You can still save a flow that is not finished.

## Where next

You have built, run and saved a flow. Next, [manage and run your flows](/docs/flows-panel), or [add a task chain](/docs/task-chain) to start all of your project's servers from one flow. For every action and setting in the Designer, see the [Designer reference](/docs/designer-reference). More tutorials will be added under [Workflows](/docs/tutorials/workflows).
