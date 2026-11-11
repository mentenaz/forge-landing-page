The Python panel gives a Python project the same at-a-glance view the Node panel gives a Node one: which Python you are using, what is installed and what is out of date, and one-click commands to run the project. This tutorial goes through it in the order you would use it on a new project.

It takes about eight minutes. You need a folder with a Python project in it (a `requirements.txt`, a `pyproject.toml`, or a file such as `main.py`), open in Forge Super.

## 1. Open the panel

Press `Ctrl+K` then `I`, or click the **Python** icon in the status bar.

The panel is a stack of sections that you can collapse and expand: **Python Versions**, **Projects**, **Environment**, **Framework**, **Quick Actions**, **Packages**, **Outdated**, **Vulnerabilities** and **Processes**.

A line at the top says where the Python in use comes from: `(venv)` for the project's own virtual environment, `(built-in)` for a Python that Forge Super downloaded, or `(system)` for the one already on your machine.

You should see your project under **Projects**, with a small tag for the file that identified it.

[//]: # (TODO screenshot python-panel-1-overview.png: The Python panel with its sections and the line showing where the Python comes from.)

## 2. Get a Python (if you need one)

If the machine has no Python, Forge Super can download one. Nothing is installed on the machine: the builds are self-contained and are kept in Forge Super's own data folder.

Open **Python Versions**:

- Click **Install Version…** to see what is available.
- Pick a version. Nothing downloads yet: a question appears that names the version, its download size and where it comes from. Click **Download** to go ahead. The download is checked against its published checksum.
- The first version you install becomes the active one. To switch later, click another version. Click **System** to hand the choice back to the machine's own Python.
- Removing a version breaks any virtual environment that was created from it, and the panel tells you so before it removes anything.

Terminals, the Script Runner and workflows all find the active version first, and a terminal that is already open follows a switch.

## 3. Create a virtual environment

A virtual environment keeps one project's packages apart from every other project's. The panel does not create one for you, but the active Python can. Open a terminal in the editor, go to the project folder and run:

```sh
python -m venv .venv
```

Then install what the project needs, with the environment's own Python. On Windows:

```sh
.venv\Scripts\python.exe -m pip install -r requirements.txt
```

On Linux and macOS, the same with `.venv/bin/python`.

Switch back to the panel. The line at the top now says `(venv)`.

## 4. Pick the project and check the environment

**Projects** lists the Python projects found under your workspace. Click one to make it the active project. If you only have one, it is already selected.

Open **Environment**. It shows:

- where the project's virtual environment is, or "Using the built-in Python (no project venv found)", or "Using the global interpreter (no project venv found)";
- how many packages are in `requirements.txt`;
- a red count of **missing from requirements.txt**, if packages listed there are not installed yet.

If the missing count is not zero, install the requirements as in step 3.

## 5. See what the project is

**Framework** names the web framework Forge Super recognised, with a tag such as **Django detected**. It looks at your requirements and your entry files. It recognises Flask, FastAPI, Django, Streamlit, Gradio and pytest.

[//]: # (TODO screenshot python-panel-2-framework.png: The Framework and Quick Actions sections for a Django project.)

## 6. Run the project

**Quick Actions** has one button for the framework and one for each entry file it found, such as `manage.py` or `main.py`:

- The **framework button** (named after the framework, for example `django`) runs its usual command, for example `python manage.py runserver 0.0.0.0:8000` for Django, `flask run --debug` for Flask, or `uvicorn main:app --reload` for FastAPI. Hover it to see the exact command.
- An **entry file button** runs `python <file>` from that file's own folder.

Both run in the **Script Runner** panel, which opens and shows the output as it runs.

If the panel is using your project's virtual environment (the line at the top says `(venv)`), the command runs as if that environment were switched on: its `Scripts` folder (`bin` on Linux) comes first on the path, so `python`, `flask` and `uvicorn` are the project's. If there is no virtual environment, the command uses the Python that Forge Super finds first, the built-in version you chose or the system one. This applies from release `dev-v54`. In earlier releases the buttons did not switch to the virtual environment, and a project that kept its packages there failed with an error such as `No module named django`.

## 7. Keep your packages healthy

Three sections show the state of the active project's packages:

- **Packages** lists what is installed.
- **Outdated** lists packages with a newer version. **Update all (patch)** applies only bug-fix updates, and **Update all (minor)** also applies new-feature updates. Neither touches a major version. The updates use the Python shown at the top of the panel.
- **Vulnerabilities** shows known advisories for the installed packages. It does not scan by itself: click **Scan for vulnerabilities**. PyPI has no single audit service, so the scan checks one package at a time and takes longer for a large project.

For anything more, such as looking up a package or installing one, click **Package Manager** under **Quick Actions**. It opens the Python Package Manager in its own tab. It looks a package up on PyPI by its exact name, and installs, updates or uninstalls it, with the output in the Script Runner. See [Manage Python packages](/docs/python-manager).

[//]: # (TODO screenshot python-panel-3-outdated.png: The Outdated section with Update all (patch) and Update all (minor), and the Scan for vulnerabilities button.)

## 8. Stop a process that got stuck

**Processes** lists the Python processes that are running. Each row names the process from its command line, such as `uvicorn main:app`, `flask run` or `manage.py runserver`. Hover it to see the full command. Anything that looks like a secret is hidden as `***`.

Processes started from this workspace come first. The rest of the machine's are folded under **Other**.

To stop one, click **Stop** and confirm in the row. It stops the process and everything it started. If something would not stop, the panel says what is still running, or that the process may belong to an administrator or another user.

## If something goes wrong

**`No module named …` when you run the project.** The command ran with a Python that does not have your packages. Check that the line at the top of the panel says `(venv)`. If it says `(built-in)` or `(system)`, there is no virtual environment for the project, so create one as in step 3 and click **Refresh**. If you are on a release before `dev-v54`, run the project from a task chain or from a terminal with the environment active.

**The panel says "Using the global interpreter (no project venv found)".** There is no `.venv` or `venv` folder in the project. Create one as in step 3.

**Nothing is listed under Projects.** A project is recognised by a `requirements.txt`, a `pyproject.toml` or a file such as `main.py`. Open the folder that holds them.

**The vulnerability scan is slow.** It checks one package at a time, so it takes longer the more packages you have. It only runs when you ask for it.
