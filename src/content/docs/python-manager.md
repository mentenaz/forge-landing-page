The Python Package Manager is a tab for looking up, installing, updating and uninstalling Python packages, with details and READMEs from PyPI and a vulnerability check. It works on the project's own environment. This tutorial uses a practice project.

It takes about six minutes. You need Python, which you can get from Forge Super's [Python panel](/docs/python-panel).

## 1. Make a practice project

Use a scratch folder, not a project you care about. In a terminal:

```sh
mkdir practice
cd practice
python -m venv .venv
```

Open the `practice` folder in Forge Super. The `.venv` folder is the project's own environment, so what you install in this tutorial stays inside it.

## 2. Open the manager

Any of these opens it:

- Press `Ctrl+K` then `Y`.
- Click **Package Manager** under **Quick Actions** in the Python panel.
- Run `python manager: open python manager` from the command palette.

It opens as a tab with five pages in the sidebar: **General**, **Search**, **Installed**, **Updates** and **Vulnerabilities**.

[//]: # (TODO screenshot python-manager-1-overview.png: The Python Package Manager tab with the five pages in the sidebar.)

## 3. Check the General page

**General** shows the **Interpreter** and the **Environment** the manager is working on. Look here first: it tells you which Python every install and update will use. For the practice project it should show the `.venv` you made. Click **Refresh** to read it again.

## 4. Look a package up and install it

Open **Search**. This page looks a package up by its **exact name**. Type `requests` in the box that says **Look up a package on PyPI (exact name)…** and click **Look up**.

PyPI no longer has a search service, so there is no fuzzy search: `requests` finds `requests`, and a half-remembered name finds nothing. If you are unsure of a name, look it up on pypi.org first.

The result shows the package, with **Install**, or **Installed** if you already have it. Click **Install**.

The **Script Runner** panel opens and shows the `pip install` as it runs. When it ends, the lists reload.

You should see `requests` under **Installed**.

[//]: # (TODO screenshot python-manager-2-lookup.png: The Search page with requests found and the Install button.)

## 5. Read about a package

Click a package to open its details on the right: its summary, version, author, licence, the Python versions it supports, its dependencies and links, and its **README**. Use **← Details** to go back from the README.

With a package list selected, the keyboard works too:

| Key | Does |
| --- | --- |
| `Up` and `Down` | Move the selection |
| `Enter` | Open the package's details |
| `Space` | Do the page's main action: Uninstall, Update or Fix |

## 6. Uninstall and update

**Installed** lists the installed packages. Click **Uninstall** to remove one.

**Updates** lists the packages that have a newer version. **Update** updates one, and **Update All** updates all of them. When the list is empty it says **All packages are up to date**. To see it work, install an old version in a terminal with the environment active, for example `pip install requests==2.25.0`, then open **Updates**.

## 7. Check for vulnerabilities

Open **Vulnerabilities**. It starts at **Not scanned yet**, with a button, **Scan Installed Packages**.

The scan does not run by itself. PyPI has no single audit service, so the scan asks about one package at a time, and it takes longer the more packages you have. The results come from PyPI and OSV.dev. When a finding offers a fix, a **Fix** button applies it. With nothing found, the page says **No known vulnerabilities found in installed packages**.
[//]: # (TODO screenshot python-manager-3-vulnerabilities.png: The Vulnerabilities page after a scan, with a finding and its Fix button.)

## If something goes wrong

**Look up finds nothing.** The name must be exact. Check the spelling on pypi.org.

**A package installs into the wrong Python.** Look at the **Interpreter** on the **General** page. If it is not your project's environment, create a `.venv` in the project, as in step 1, then click **Refresh**.

**A command is not run and a reason is shown.** A package name or version contained something other than letters, digits and a few punctuation marks. Real PyPI names never do. The check stops a harmful value from being run as part of a command.

**The scan is slow.** It checks one package at a time. It only runs when you click the button.
