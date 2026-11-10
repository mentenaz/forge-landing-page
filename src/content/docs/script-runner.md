The Script Runner is a panel that runs one command and shows what it prints as it prints it. You can type a command into it yourself, and it is also where the other panels send theirs: running a script in the Node panel, building in the .NET panel, or installing a package all show their output here. This tutorial covers using it directly and reading what it shows.

It takes about five minutes. Open any folder in Forge Super.

## 1. Open the panel

Press `Ctrl+K` then `K`, or click the **Script Runner** icon in the status bar. It opens along the bottom of the window.

From top to bottom the panel has:

- a header with its name, **Idle** or **Running…**, and a count of the lines of output;
- a row to type a command, with a **Run** button;
- a **cwd** line that shows the folder commands run in;
- the output.

The **cwd** is the folder you have open. When you run something from another panel, such as a script from the Node panel, it changes to that project's folder, and it stays there for the next command you type.

[//]: # (TODO screenshot script-runner-1-overview.png: The Script Runner with the header, command row and cwd line.)

## 2. Run a command

Click the command box, which says **Enter a command…**, and type:

```sh
git --version
```

Click **Run**.

The header changes to **Running…** with a spinner, the output appears under it, and when the command ends it goes back to **Idle**. You should see your Git version printed.

The **Run** button is only active when there is something typed and nothing else is running.

On Windows, commands run through PowerShell 7 (`pwsh`), or the older `cmd` when PowerShell 7 is not installed. On Linux and macOS they run through `sh`. Normal output and error output arrive together, in the order they were printed.

## 3. Watch a long command, then stop it

A command that does not finish by itself, such as a dev server, is a normal case. Try one that takes a while. On Windows:

```sh
ping -n 30 127.0.0.1
```

On Linux and macOS:

```sh
ping -c 30 127.0.0.1
```

Click **Run**. A line arrives about every second. While it runs, a red **Stop** button appears beside **Run**. Click it.

The command ends and the header goes back to **Idle**. **Stop** ends the command and everything it started, so a dev server's helper processes do not keep running behind it.

[//]: # (TODO screenshot script-runner-2-running.png: A running command with the Running badge, the Stop button and lines of output.)

## 4. Open the links it finds

When a command prints a web address, the panel picks it up and lists it in a **Links** bar under the cwd line. Try:

```sh
echo "Open http://localhost:3000 to see the app"
```

The address appears in the bar. Click it to open it in your browser, or click the copy icon beside it to copy it. This is how you get the link to a dev server without selecting it in the output.

For SharePoint Framework projects, the panel also notices the workbench debug address that `gulp serve` or `heft start` print, and shows it in a **Debug script** bar with a **Copy** button.

## 5. See what other panels run here

Run a script from the Node panel, or click **build** in the .NET panel, and look at the Script Runner. It opens by itself and shows that command's output, with the folder it ran in on the **cwd** line.

This is the shared place where the language panels and the package managers run their commands. It runs one command at a time. If you start something from another panel while a command is running, that panel tells you the Script Runner is busy. Wait for it to finish, or click **Stop**.

## 6. Good to know

- **Only the newest 500 lines are kept.** A command that prints a lot loses its oldest lines. The count in the header is the number shown now.
- **Colour codes are removed** from the output, so you read plain text.
- **The built-in tools come first.** The runner puts Forge Super's own runtimes first on the path, such as the Node.js and Python versions you chose in their panels. A command finds them without you installing anything.
- **A project's Python environment is not switched on.** If a Python command fails with `No module named …`, its packages are in the project's virtual environment. See [Get around the Python panel](/docs/python-panel).
- **Python prints as it goes.** The runner asks Python not to hold its output back, so lines appear when they are printed and not all at the end.

## If something goes wrong

**Run is greyed out.** The box is empty, or a command is still running. Wait for it, or click **Stop**.

**"command not found" or "is not recognized".** The program is not installed, or it is not on your path. Check it in a terminal. A tool that Forge Super provides, such as Node, is found without any setup.

**A command seems stuck.** Some commands ask a question and wait for an answer, and the panel has nowhere to type one. Click **Stop**, and run the command again with the option that skips the question, often `--yes`.

**The output is cut off.** Only the newest 500 lines are kept. Send the output to a file, or run the command in a terminal if you need all of it.
