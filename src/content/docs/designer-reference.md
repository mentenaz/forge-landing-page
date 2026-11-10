This is the reference for the Designer: the window, every action you can add, how steps connect, how a flow runs, and how to refer to one step's result in another. If you are new to flows, start with [Your first flow](/docs/first-flow) and come back here for the details.

## The Designer window

Any `.flow.json` file opens in the Designer, in its own tab. It has three panes:

| Pane | Purpose |
| --- | --- |
| **Actions** (left) | A searchable list of every action, grouped by what it does |
| **Canvas** (middle) | The flow drawn as boxes (nodes) and lines (connections). You can pan, zoom and drag nodes |
| **Inspector** (right) | The settings of the selected node or connection |

The toolbar has these buttons:

| Button | Does |
| --- | --- |
| **Run** | Runs the flow. It is disabled while problems that block a run remain |
| **Stop** | Takes Run's place while a run is live: stops the run and the servers it started |
| **Save** | Writes the flow and its layout |
| **Fit View** | Zooms to show the whole graph |
| **Raw** | Opens the flow's JSON as text |
| **Run log** | Shows or hides the run log under the canvas (it appears once a run has produced something) |
| **Results** | Opens the run results in a tab of their own |
| **Clear results** | Clears the run's colours and log from the canvas |
| **Issues badge** | Appears beside Run when there are problems. Click it to see the list |

A flow with unsaved changes shows the usual marker on its tab, and you are asked before closing it. If the file changes on disk while you have unsaved changes, a banner offers **Reload from disk**, and saving keeps your own changes. An unfinished flow can be saved as a draft: problems are shown on the nodes and in the inspector, and only Run is blocked. A file that cannot be read still opens a tab, with the error in a banner.

## Building a flow

### Adding actions

Three ways, all using the same list:

- **Click** an action in the list (or press `Enter` on it). It is added as the next step after the selected node, or near the middle of the canvas when nothing is selected. With a loop, a branch, or an If or Try selected, it goes inside it.
- **Drag** an action onto the canvas to place it exactly. Dropping it onto a loop or a branch puts it inside.
- **Right-click** the canvas and choose **Add Action**.

To put an action between two that are already connected, hover over the connection until a **+** appears in the middle, and click it.

### Connecting actions

A connection means "run this after that one". Each connection has an outcome that decides when the later step may run. Click a connection to change it in the inspector:

| Outcome | The later step runs when the earlier step |
| --- | --- |
| **Succeeded** | succeeded (the default) |
| **Failed** | failed, which is how you build an error path |
| **Either** | succeeded or failed |

A step that does not run because its condition was not met is **Skipped**. A step with no incoming connection starts immediately, and steps whose conditions are met at the same moment run together, in parallel.

### Editing and removing

Select a node to edit it in the inspector. **Delete Node** removes it. Deleting a loop or a branch also deletes what is inside it, and undo brings it all back.

Required settings always have a row. Optional ones are listed under **Add an optional input** until you add them. An optional setting left blank is not written to the file.

## How a flow runs

When you click **Run**, the engine works out which steps can start, runs them, and moves on as each one finishes. Each node shows its state by colour and in the log:

| State | Meaning |
| --- | --- |
| **Running** | It has started and has not finished |
| **Ready** | A server it started is up and still running. The steps after it can start |
| **Succeeded** | It finished without an error |
| **Failed** | It finished with an error, which is shown in the inspector and the log |
| **Skipped** | Its condition was not met, so it never started |

A **Start Process** node follows the life of its command. A command that ends, such as a build, finishes when it exits. A server that never ends is **Ready** as soon as its ready settings pass, and then keeps running. A run lasts as long as the servers it started. **Stop** ends the run and every server in it, and a stopped run is not counted as a failure. Closing the Designer tab stops the run too. See [Add a task chain](/docs/task-chain) for servers in practice.

Running a flow again first stops the servers that an earlier run of the same flow left on the same node.

## Expressions and references

Most settings take plain text or a number. Some take an **expression**, and others accept either. An expression is written in JSONLogic, a small language for calculating a value from the data of the run, as a JSON object.

The data of a run is reached with `var`:

| To read | Write |
| --- | --- |
| An output of an earlier step | `{"var": "fetchOrder.outputs.total"}` (the step's id, `outputs`, then the output's name) |
| A flow variable | `{"var": "variables.count"}` |
| The current item of a loop | `{"var": "$item"}`, or a field such as `{"var": "$item.sku"}` |

Under an expression field, **Insert a reference** lists the outputs of the steps that run before the selected one, and inserts the right `var` for you. After a run, **From the last run** adds what those steps actually returned, however deeply nested: the fields inside an HTTP response, the keys a script printed, and the fields of one `$item` in a loop. These are observations of one run, so a different response may be shaped differently. Editing a step drops the samples for it and for everything after it until the next run.

A text setting can be a plain string, or an expression whose result is used as the text. A step that has not run yet reads as empty, not as an error.

## The actions

### Flow control

These hold other steps. Select one and add steps to put them inside.

**Foreach** runs its steps once for each item of a list.

| Setting | Meaning |
| --- | --- |
| `foreach` | An expression that gives the list, for example `{"var": "variables.ids"}` |

Inside, `$item` is the current item. The iterations run at the same time, with no limit, and they all run to the end even if one fails. The Foreach as a whole fails if any iteration did. The inspector shows a pager, `For each · <loop> ‹ 2 / 12 ›`, to look at each iteration's result. Because iterations run together, several that set the same variable race, and the last one to write wins.

**Until** repeats its steps until a condition is true.

| Setting | Meaning |
| --- | --- |
| `until` | An expression. The steps repeat until it is true |
| `limit` | A guard against looping forever, for example `{"count": 10}` or `{"count": 5, "timeout": "PT30S"}` |

The steps run first and the condition is checked after, like a retry. The loop also ends when the count is reached or the timeout passes. The timeout is a duration such as `PT30S` (30 seconds) or `PT5M` (5 minutes).

**If** runs one of two groups of steps.

| Setting | Meaning |
| --- | --- |
| `expression` | A condition. When it is true the **True** branch runs, otherwise the **Else** branch does, if it has one |

**Try/Catch** runs its **Try** steps. If they all succeed, it succeeds and the **Catch** steps do not run. If one fails, the **Catch** steps run, and inside them the error is available as `{"var": "<tryId>.outputs.error"}`, with the failed step's id and message. If the Catch steps succeed, the Try/Catch counts as succeeded, because the error was handled.

### Data

**Transform** calculates a value.

| Setting | Meaning |
| --- | --- |
| `expression` | An expression. Its result is the output `result` |

**Initialize Variable** creates a variable that lasts for the whole run.

| Setting | Meaning |
| --- | --- |
| `name` | The variable's name. It cannot contain a `.` |
| `type` | `object`, `string`, `integer` or `array`. It is fixed from then on |
| `value` | Optional starting value. Without one it starts empty: `{}`, `""`, `0` or `[]` |

**Set Variable** changes a variable that already exists.

| Setting | Meaning |
| --- | --- |
| `name` | The variable to change |
| `value` | The new value, as written |
| `valueExpression` | Or an expression for the new value. Use one of the two, not both |

A value has to fit the variable's type. A number given to a string variable becomes text, and text given to an integer variable becomes a number when it can. Anything else fails the step. Both actions output `name` and `value`. A variable set inside a loop is still set after it, which an ordinary step's outputs are not. `variables` cannot be used as a step's id.

### Integrations

**HTTP Request** calls a web address.

| Setting | Meaning |
| --- | --- |
| `method` | `GET`, `POST`, `PUT`, `PATCH`, `MERGE` or `DELETE` |
| `url` | The address, as text or an expression |
| `headers` | Optional. An object of headers. A text value is sent as written, and an object value is worked out as an expression |
| `body` | Optional. Sent exactly as written: text as text, anything else as JSON. Use **Edit Body** to edit it as a JSON file |
| `bodyExpression` | Optional. An expression whose result is the body. Use it instead of `body` |

Outputs: `body` (the response) and `status` (the status code). A response outside 200 to 299 fails the step. To carry on after one, connect the next step with the **Failed** outcome, or wrap the request in a Try/Catch. `Content-Type` is `application/json` (or `text/plain` for a text body) unless you set it in `headers`.

**Notify** sends a message to a webhook, such as Slack or Mattermost.

| Setting | Meaning |
| --- | --- |
| `url` | The webhook address |
| `message` | The text to send |
| `channel` | Optional. A channel to use instead of the webhook's own, such as `#alerts` |

It posts `{"channel": …, "text": …}`. The step fails if the webhook does not answer with a success status. Output: `status`.

### Processes

**Script** runs a script file.

| Setting | Meaning |
| --- | --- |
| `source` | The script file, and its language |
| `args` | Optional. A JSON value given to the script |
| `argsExpression` | Optional. An expression whose result is given to the script. Use it to pass a variable, the loop item, or an earlier step's result |

Adding a Script creates a file for it at `<flow>.flow-scripts/<action-id>.py`, from a template that reads its input and prints a result. **Create a script file** does the same for Python, Node (`.mjs`), PowerShell or Bash. **File Path** can point at any other file, and the language comes from its extension or from the **Runtime** setting. **Open Script** opens the file in an editor tab. The script returns its result by printing a JSON object as its last line, and that becomes the step's output `stdout_json`.

A script can read the run through a small helper file in the same folder, and ends by handing back its result:

```js
import { variables, item, args, actions, output } from "./forge.mjs";
output({ count: variables.ids.length });
```

| Language | Helper | Use |
| --- | --- | --- |
| Node (modules) | `forge.mjs` | `import { variables } from "./forge.mjs"` |
| Node (`require`) | `forge.cjs` | `const { variables } = require("./forge.cjs")` |
| Python | `forge.py` | `from forge import variables` |
| PowerShell | `forge.ps1` | `. "$PSScriptRoot/forge.ps1"`, then `$Variables` |

`variables` is all of the flow's variables, `item` the current loop item, `args` the step's `args`, and `actions` the outputs of finished steps by id. The helpers are generated and refreshed on save and run. Do not edit them. Bash has no helper, but the `args` still arrive as JSON on standard input. A script cannot set a variable itself: follow it with a **Set Variable** that reads its output.

**Start Process** runs a command.

| Setting | Meaning |
| --- | --- |
| `command` | The program to run, or its full path |
| `args` | Optional. A JSON list of arguments, such as `["run", "dev"]` |
| `cwd` | Optional. The folder to run in, relative to the project. The default is the project folder |
| `url` | Optional. The address of a server it starts, shown in the servers bar |
| `ready_port` | Optional. Ready once this port answers on `127.0.0.1` or `[::1]` |
| `ready_url` | Optional. Ready once this web address answers with a success or redirect status |
| `ready_text` | Optional. Ready once the command's output contains this text |
| `ready_timeout_ms` | Optional. How long to wait for the ready settings. The default is 60,000 |

When more than one ready setting is given, all of them must pass. If the command exits first, the step fails with its exit code and its last output. If they do not pass in time, the server is stopped and the step fails. With none of them, the step finishes when the command exits, so a server with no ready setting holds back every step after it. Outputs: `pid`, `processId`, `ready`, `exit_code` and `address`.

The project's Python virtual environment is not switched on by this action, so use the full path to its `python.exe` as the `command` for a Python project.

**Wait For Port** waits until something answers on a port.

| Setting | Meaning |
| --- | --- |
| `port` | The port to check, on `127.0.0.1` and on `[::1]` |
| `timeout_ms` | Optional. How long to wait. The default is 30,000 |
| `url` | Optional. Also wait for this web address to answer with a success or redirect status |

It is for a server you did not start from the flow, or to wait for a health address. Outputs: `ready` and `address`, the loopback address that answered.

### Utilities

**Delay** waits.

| Setting | Meaning |
| --- | --- |
| `ms` | How long to wait, in milliseconds |

**Log** writes a line to the run log.

| Setting | Meaning |
| --- | --- |
| `level` | `info`, `warn` or `error` |
| `message` | The text, or an expression whose result is the text |

Outputs: `level` and `message`.

**Set Environment Variable** sets an environment variable.

| Setting | Meaning |
| --- | --- |
| `key` | The variable's name, such as `DATABASE_URL` |
| `value` | Its value |

It sets the variable for the whole of Forge Super, not just this run, so it also applies to other flows and to anything you start afterwards.

## What blocks Run

The Issues badge lists everything that stops a run. Each problem names the node it belongs to, and clicking one selects it. The common ones:

- a required setting that is missing, or is blank when it must not be;
- a setting that is not valid JSON where JSON is expected, or not a number where a number is expected;
- a value for **Set Variable** that does not fit its variable's type;
- a script whose file path is blank, whose language cannot be told from the file name, or whose inline body is empty;
- connections that form a loop, or that point at a step that does not exist;
- an action type that Forge Super does not know.

A **Start Process** with no ready setting and a command that looks like a server gets a warning that the steps after it would wait for it to exit. It does not block Run.

## Files the Designer writes

| Path | Contents |
| --- | --- |
| `<name>.flow.json` | The flow itself |
| `<name>.flow.layout.json` | Where each node sits on the canvas |
| `<name>.flow-scripts/` | Script files and their helpers |
| `<name>.flow-http/` | HTTP request bodies, as `<action-id>.body.json` |

Node positions never go into `.flow.json`, so moving a node does not change what the flow does in a git diff. A flow with no layout file is laid out automatically. Script files and body files are ordinary files you can commit, and a flow needs its `.flow-scripts` folder next to it to run. Flows are kept in `.zed/workflows` in your project by default, and the `flows.workflows_dir` setting changes that.

## Not available yet

Three actions are planned but not in the list: **Send Email**, **DB Migration** and **AI Check**. A flow file that uses one fails validation as an unknown action.
