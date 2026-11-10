The NuGet Manager is a tab for searching nuget.org and installing, updating and removing the NuGet packages of a .NET project, so you do not have to edit a `.csproj` by hand or remember `dotnet add package`. This tutorial uses a practice project.

It takes about six minutes. You need the .NET SDK. If the [.NET panel](/docs/dotnet-panel) shows a version at the top, you have it.

## 1. Make a practice project

Use a scratch folder, not a project you care about. In a terminal:

```sh
dotnet new console -o practice
```

Open the `practice` folder in Forge Super.

## 2. Open the manager

Any of these opens it:

- Press `Ctrl+K` then `G`.
- Click **NuGet Manager** under **Quick Actions** in the .NET panel.

It opens as a tab with five pages in the sidebar: **General**, **Search**, **Installed**, **Updates** and **Vulnerabilities**.

If it says **No .NET project found in this workspace**, there is no `.csproj` under the folder you have open. Open the right folder and click **Rescan**.

[//]: # (TODO screenshot nuget-manager-1-overview.png: The NuGet Manager tab with the five pages in the sidebar.)

## 3. One project at a time

The NuGet Manager works on **one project**, and the **General** page names it. `dotnet list package`, which it uses, refuses a folder with more than one project file, so there is no view across several projects. Commands run in that project's folder, which is how `dotnet add package` knows which project to change.

If your solution has several projects, check on the General page that you are looking at the one you mean. Click **Refresh** there to read the project again.

## 4. Search for a package and install it

Open **Search**, type `Newtonsoft.Json` in the box that says **Search nuget.org for a package…**, and click **Search**.

Each result has an **Install** button, and **More info** opens its details. **Load more** brings further results. Click **Install** on `Newtonsoft.Json`.

The **Script Runner** panel opens and shows the `dotnet add package` as it runs. When it ends, the lists reload by themselves.

You should see `Newtonsoft.Json` on the **Installed** page, and a `PackageReference` for it in your `.csproj`.

[//]: # (TODO screenshot nuget-manager-2-search.png: The Search page with Newtonsoft.Json results and the Install button.)

## 5. Read about a package

Click a package, or **More info**, to open its details in a pane on the right. It shows the versions, the dependency groups and the **README**, so you can decide before you install. Use **← Details** to go back from the README. You can drag the divider to give the pane more room.

With a package list selected, the keyboard works too:

| Key | Does |
| --- | --- |
| `Up` and `Down` | Move the selection |
| `Enter` | Open the package's details |
| `Space` | Do the page's main action: Install, Remove or Update |

## 6. Remove and update

**Installed** lists the packages the project references. Click **Remove** to take one out.

**Updates** lists the packages that have a newer version, each marked **patch**, **minor** or **major**:

- **Update** updates one package to its latest version.
- **Update All Safe** updates every package whose update is a patch or a minor one.
- **Update All Patch** updates only the bug-fix ones.

Neither bulk button touches a major version. To see it work, install an old version with `dotnet add package Newtonsoft.Json --version 12.0.1` in a terminal, then open **Updates**. If the check fails, click **Retry**. When the list is empty it says **All packages are up to date**.

## 7. Check for vulnerabilities

**Vulnerabilities** shows what `dotnet list package --vulnerable` found, with the advisory for each. With nothing to report, it says **No known vulnerabilities for this package set**. This page lists findings but has no fix button: update or replace the package on the other pages. **Retry** runs the check again if it failed.

[//]: # (TODO screenshot nuget-manager-3-updates.png: The Updates page with Update All Safe, Update All Patch and a package marked minor.)

## If something goes wrong

**"No .NET project found in this workspace".** There is no `.csproj` under the open folder. Open the right one, then click **Rescan**.

**It is working on the wrong project.** It uses a single project. Check the project named on **General**, and open the folder that holds the one you want.

**A command is not run and a reason is shown.** A package id or version contained something other than letters, digits and a few punctuation marks. Real NuGet ids never do. The check stops a harmful value from being run as part of a command.

**The vulnerability or update check fails.** Click **Retry**. Both checks need to reach nuget.org.
