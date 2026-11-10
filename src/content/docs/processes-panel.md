The Processes panel is a live table of every process running on your machine. It is how you find the dev server, watcher or stray interpreter that is still running somewhere, see what it is costing you, and stop it, without opening the Task Manager. This tutorial finds a process, marks it, and ends it.

It takes about five minutes. Open any folder in Forge Super.

## 1. Open the panel

Press `Ctrl+K` then `X`, or click the **Processes** icon in the status bar. It opens along the bottom of the window.

From top to bottom it has a filter box and a **Refresh** button, the table, and a footer that counts the processes. The table refreshes by itself every two seconds.

[//]: # (TODO screenshot processes-panel-1-overview.png: The Processes panel with the filter box, the table and the footer.)

## 2. Start something to look at

You need a process that runs for a while. Open the **Script Runner** panel (`Ctrl+K` then `K`) and run a command that keeps going. On Windows:

```sh
ping -n 300 127.0.0.1
```

On Linux and macOS:

```sh
ping -c 300 127.0.0.1
```

Leave it running and go back to the Processes panel. If you prefer, start a dev server from the Node panel instead.

## 3. Read the table

Every row is one process, with these columns:

| Column | What it shows |
| --- | --- |
| **PID** | The number the operating system gave the process |
| **Name** | The program's name |
| **CPU %** | How much of the machine's processing it is using right now |
| **Memory** | How much memory it holds |
| **Source** | **Managed** for processes you have marked (step 5), **External** for all the rest |
| **Status** | **Running** or **Sleeping** |

Click a column heading to sort by it, and click again to reverse the order. The list starts sorted by name. You can drag the edge of a column heading to resize it, and drag a heading to move the column.

Click **Refresh** to read the machine again right now, instead of waiting for the next two-second tick. While the first reading is loading, the table says **Loading processes…**.

## 4. Find your process

Type `ping` in the box that says **Filter by name or PID…**. The table narrows to the matching rows, and you can also type a PID. The footer says how many of the processes are shown, for example `412 processes · 2 shown`.

You should see the `ping` you started, with **Running** or **Sleeping** beside it. Click its row to select it.

## 5. Mark it as managed

**Adopt** marks a process you care about, so it stands out from the hundreds of others. It does not change the process in any way.

Right-click the row and choose **Adopt (Manage)**, or press `A` with the table focused. The **Source** changes to a blue **Managed** tag, and the footer counts it: `1 managed`. To undo it, right-click and choose **Release (Stop Managing)**, or press `A` again.

The managed marks are kept while Forge Super is open and are not saved. They are gone the next time you start it.

[//]: # (TODO screenshot processes-panel-2-managed.png: The filtered table with the ping row marked Managed and the footer showing 1 managed.)

## 6. End it

There are three ways to end the selected process:

- click the red **✕** at the end of its row;
- right-click the row and choose **Kill Process**;
- press `Delete` or `Backspace` with the table focused.

A banner appears at the top of the panel: **Kill "ping" (PID 1234)? This cannot be undone.** Click **Kill** to go ahead, or **Cancel**. The list refreshes straight away, and the `ping` is gone. In the Script Runner, the command has ended.

Kill ends that one process. A program it started can keep running on its own. For a dev server you started from Forge Super, it is usually better to use **Stop** in the place that started it, since that ends the server and everything it launched:

| You started it from | End it with |
| --- | --- |
| The Script Runner | **Stop** in the Script Runner |
| The Node or Python panel | **Stop** on its row in that panel's **Processes** section |
| A flow | **Stop** in the Designer or on the flow's row in the Flows panel |
| Somewhere else, or you are not sure | **Kill** here |

If something stops the kill, the panel says so under the header. If the process is no longer there, it says `Failed to kill process 1234: Process 1234 not found`. If the system refuses, it says so and why. See below.

## If something goes wrong

**The table says "No processes found" or is empty.** If the filter box has text in it, clear it. A filter that matches nothing leaves the table empty.

**"Failed to kill process … the system refused".** The process belongs to another user or to the system, or it was started with administrator rights. Only Forge Super running with the same rights can end it. Before release `dev-v53` the panel showed no message for this, and the process just stayed in the list.

**"Process … not found".** It had already ended by the time you clicked Kill.

**The process comes back after you kill it.** Something is starting it again, such as a file watcher, a service, or a script in a loop. Stop that, not the process it keeps starting.

**Your Managed marks disappeared.** They are not saved between sessions. Mark the processes again.
