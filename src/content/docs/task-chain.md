A task chain is a flow that starts all of your project's servers together: your backend, your frontend, and anything else it needs. Forge Super looks through your project, proposes the servers it finds, lets you correct them, and builds the flow for you. Then one click starts everything and gives you the links, and one click stops it all.

It takes about eight minutes. It assumes you have made a flow before; if not, do [Your first flow](/docs/first-flow) first.

The example is a project laid out like this, which is the layout Forge Super finds most easily:

```
my-project/
  backend/     a Django project (it has manage.py)
  frontend/    a Vite + React app (it has package.json)
  .venv/       the Python environment, with Django installed
```

**Before you start**

- Open the project's top folder in Forge Super.
- Install what each server needs: `npm install` in the frontend, and for Python, create the environment and install the requirements. If there is a `.venv` (or `venv`) folder in the project, or beside the backend folder, Forge Super uses it automatically. Without one, the server is started with the system Python, which usually does not have your packages.

## 1. Open the wizard

There are two ways in, and both open the same wizard:

- In the **Flows** panel, click **Add Task Chain**.
- In the **Node** panel, click **Task Chain** under **Quick Actions**. The project selected in the Node panel is included in the wizard even if it was not detected.

The wizard is called **Add Task Chain**. If nothing is open yet it says so, because it scans the folder you have open.

[//]: # (TODO screenshot task-chain-1-entry-points.png: The Flows panel toolbar with Add Task Chain, and the Node panel Quick Actions row with Task Chain.)

## 2. Review what it found

The wizard lists one card for each server it detected. Each card shows what kind of project it is (for example **Django** or **React Frontend**) and these settings:

| Setting | What it is |
| --- | --- |
| Name | What the server is called in the flow |
| Command | The program to run |
| Args | Its arguments, separated by spaces |
| Working Dir | Where to run it, relative to the folder you have open |
| Port | The port the server listens on |

Forge Super looks in the folder you have open and in the folders directly inside it. It recognises:

- **Node:** React, Vite and Next.js frontends, Express, Fastify, Koa and Nest backends, and any other app with a `package.json`.
- **Python:** Django (a `manage.py`), FastAPI, Flask, and a plain app with a `main.py`, `app.py` or `server.py`.

The ports are the usual ones for each kind (5173 for a frontend, 8000 for Django and FastAPI, 5000 for Flask). They are guesses. Forge Super does not read your project's own settings, so check them.

If a Python project has a `.venv` or `venv` folder, **Command** shows the full path to that environment's Python, and a FastAPI or Flask project is started through it (`-m uvicorn`, `-m flask`).

[//]: # (TODO screenshot task-chain-2-wizard.png: The wizard with a Django card and a React Frontend card.)

## 3. Correct it

Change anything that is wrong:

- **Edit a field.** The port must be the one your server really uses. Args are split at spaces, so one argument cannot contain a space.
- **Leave one out.** Switch a card off to keep it in the list but out of the flow, or click the bin to remove it.
- **Add a server it missed.** Click **Add Custom Service** and fill in a card by hand, for example `dotnet` with `run` for a .NET project, or the command for a database. Anything it did not detect works the same way.

For a Vite frontend, set Args to `run dev -- --port 5173 --strictPort`. Without `--strictPort`, Vite quietly moves to another port when 5173 is busy, and the flow keeps waiting for a port that nothing is on.

[//]: # (TODO screenshot task-chain-3-edit-row.png: One card with the fields edited and a second card switched off.)

## 4. Create the flow

Click **Create**. A new flow named after the time, such as `flow-20261110-091500`, is saved in `.zed/workflows` and opens in the Designer.

If something is missing, the wizard says what: every included server needs a name and a command, every port must be a number, and at least one server must be switched on. **Cancel** closes the wizard without making anything.

## 5. See what it built

For each server, the flow has two nodes, side by side with the other servers:

- **Start _name_** runs the command. Select it to see the command, args and working folder you chose, the address it shows (`http://localhost:` and the port), and **ready_port**, set to the port.
- **Wait For _name_** runs after it and checks that the port really answers.

The servers start at the same time, because nothing connects one server to another. **ready_port** is what makes the chain work: a server never finishes by itself, so the node is **Ready** as soon as its port answers, and the nodes after it can start.

[//]: # (TODO screenshot task-chain-4-flow.png: The generated flow in the Designer with two servers and their Wait For nodes.)

## 6. Run it

Click **Run**.

Each **Start** node goes from Running to **Ready** when its server is up. A bar under the toolbar then lists each server with its link:

```
● Start backend:    http://localhost:8000     [open] [copy]
● Start frontend:   http://localhost:5173     [open] [copy]
```

**Open** launches the address in your browser and **Copy** puts it on the clipboard. The run log shows what each server prints. The run does not end when the last node does, because the servers are still running. Click **Stop** and every server is stopped. Closing the flow's tab stops them too, and so does quitting Forge Super.

Running the flow again first stops the servers from the last run, so you never end up with two servers on the same port.

[//]: # (TODO screenshot task-chain-5-running.png: The flow running with both nodes Ready and the servers bar showing two links.)

## 7. Make it yours

A task chain is an ordinary flow. Add a node after a server to do something once it is up, such as loading test data after the backend is Ready. Change a command, or delete a node, just as you did in your first flow. Running **Add Task Chain** again makes a new flow and does not change the old one.

## If something goes wrong

**A Start node stays on "Running…".** The node has no `ready_port`, so it is waiting for the server to exit. Flows made by an older version of Forge Super do not have it. Select the node, click **Add an optional input**, add `ready_port` and enter the port.

**"No module named django" (or another Python package).** The server was started with the system Python. Create a `.venv` in the project, install the requirements, and make the flow again, or edit **Command** to the full path of the environment's `python.exe`.

**It stops waiting after a minute with "not ready".** The server is running on a different port from the one in the flow. Look at the run log for the port it printed, fix **ready_port** and the Wait For node's port, or set the port in the server's own command. See the Vite note in step 3.

**Nothing was detected.** Detection only looks in the folder you have open and the folders directly inside it. Open the project's top folder, or use **Add Custom Service**.
