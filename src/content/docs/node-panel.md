The Node panel puts the things you normally do in a terminal for a Node.js project one click away: which Node version you are on, running a script, installing packages, seeing what is out of date, and stopping a process that got stuck. This tutorial walks through each, in the order you would use them on a new project.

It takes about eight minutes. You need a folder with a `package.json` in it, open in Forge Super.

## 1. Open the panel

Press `Ctrl+K` then `O`, or click the **Node** icon in the status bar.

The panel is a stack of sections that you can collapse and expand. At the top it says which Node.js and npm you are using, for example `Node.js v22.22.1 (IDE default)`. The sections are **Node Versions**, **Projects**, **Quick Actions**, **Packages**, **Outdated**, **Vulnerabilities**, **Scripts** and **Processes**. A project made with the SharePoint Framework also gets an **SPFx** section.

You should see your project's name under **Projects** and its scripts under **Scripts**.

[//]: # (TODO screenshot node-panel-1-overview.png: The Node panel with its sections, the header showing the Node version.)

## 2. Choose a Node version

Nothing has to be installed first. Forge Super manages Node.js versions itself, the same way on Windows, macOS and Linux, so you do not need nvm or fnm.

Open **Node Versions**:

- Click **Install Version…** to see every Node.js release. The long-term-support ones are marked. If you have nothing installed yet, **Install latest LTS** is a single click.
- The choice is **per workspace**: what you pick here applies to this window's project only.
  - **Auto** is the default. Forge Super uses the version your project asks for, in a `.nvmrc` or `.node-version` file or in the `engines.node` field of `package.json`, when that version is installed. Otherwise it uses the first version you installed.
  - **System** hands the choice back to whatever Node.js is already on your machine. Nothing is removed.
  - Click **a version** to pin it for this workspace, whatever the project asks for.

The line at the top of the panel says what is in use and why: `pinned`, `project file`, `IDE default` or `system`. If the project asks for a version that is not the one in use, you get **Use** (when it is installed) or **Install** (when it is not).

If the project asks for no version at all, click **Create .nvmrc**. It writes the version in use into the project's `.nvmrc`, so your team and your build server use the same one. An existing `.nvmrc` is never overwritten.

The version you choose is the one used by the editor's terminals, the Script Runner, workflows, and this panel's own commands. A server that is already running keeps the version it started with, and nothing outside Forge Super is changed.

[//]: # (TODO screenshot node-panel-2-versions.png: The Node Versions section with a pinned version and Install Version.)

## 3. Pick the project

**Projects** lists every folder under your workspace that has a `package.json`. Click one to make it the active project. The sections below, from **Packages** to **Scripts**, always show the active project.

If the workspace holds a frontend and a backend, switch between them here.

## 4. Install the packages

Under **Quick Actions**, click **Install**.

The button names the package manager the project uses, such as **Install (npm)** or **Install (pnpm)**. It is chosen from the `packageManager` field in `package.json`, or else the project's lock file, and it is npm when there is neither. If the project has lock files of more than one kind, you are asked which to use, for that install only.

The output opens in the **Script Runner** panel, which shows the install as it runs. If the Node version in use does not fit what the project asks for, you are asked first: **Run anyway** or **Cancel**.

If the button shows a warning, the package manager is not on your path. For Yarn and pnpm, run `corepack enable`. Nothing is installed for you.

## 5. Run a script

**Scripts** lists the scripts from the project's `package.json`, for example `dev`, `build`, `lint` and `preview`. Each row has:

- **▶** runs the script in the Script Runner, with the Node version you chose.
- **✎** edits the script's name and command.
- **✕** deletes the script.

Click **Add script**, fill in a name and a command, and it is saved. Editing, adding and deleting write straight back to `package.json`.

You should see the Script Runner open and show the script's output as it runs.

[//]: # (TODO screenshot node-panel-3-scripts.png: The Scripts section with the run, edit and delete buttons and Add script.)

## 6. Keep your packages healthy

Three sections show the state of the active project's packages:

- **Packages** lists what is installed.
- **Outdated** lists packages that have a newer version. **Update all (patch)** applies only the safe bug-fix updates, and **Update all (minor)** also takes the new features. Neither one touches a major version.
- **Vulnerabilities** shows what `npm audit` found. It is empty for a project with no known advisories.

For anything more, such as searching the registry or installing a single package, click **Package Manager** under **Quick Actions**. It opens the Node Package Manager in its own tab. See [Manage npm packages](/docs/npm-manager).

[//]: # (TODO screenshot node-panel-4-outdated.png: The Outdated section with Update all (patch) and Update all (minor).)

## 7. Stop a process that got stuck

**Processes** lists the Node processes that are running. Each row names the process from its command line, such as `npm run dev`, `next dev` or `tsserver`. Hover it to see the full command. Anything that looks like a secret, such as a `--token=` value, is hidden as `***`.

Processes started from this workspace come first, heaviest first. The rest of the machine's are folded under **Other**, including the editor's own, marked **IDE**. The editor's own processes have no Stop button.

To stop one, click **Stop** and confirm in the row. It stops the process and everything it started, so stopping `npm run dev` also stops the server npm ran. If something would not stop, the panel says what is still running, or that the process may belong to an administrator or another user.

On Windows a process is ended at once. On Linux and macOS it is asked to finish first and is given two seconds.

The list refreshes every few seconds, and only while you can see it.

## 8. Hand the project to a workflow

Under **Quick Actions**, click **Task Chain**. It opens the task-chain wizard with this project already filled in, so you can build a flow that starts it, together with the rest of your servers, in one click. That is the next tutorial: [Add a task chain](/docs/task-chain).

## If something goes wrong

**The wrong Node version is used.** Look at the line at the top of the panel. If it says `pinned`, you pinned a version for this workspace; click **Auto** to follow the project again. A server you started earlier keeps its old version until you restart it.

**Install says the package manager is missing.** Run `corepack enable` for Yarn or pnpm, or install the tool, and try again.

**A script does nothing.** Check the Script Runner panel, which shows the output and any error the script printed.

**Stop says the process may belong to an administrator.** It was started by another account, or by a program running with more rights than Forge Super. Close it from the program that started it, or run Forge Super with the same rights.
