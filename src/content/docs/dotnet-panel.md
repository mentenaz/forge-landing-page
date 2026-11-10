The .NET panel gives a .NET solution a quick overview and one-click commands: which SDK you have, which projects are in the workspace, build, run and test buttons, and the state of your NuGet packages. A second tab, the NuGet Manager, handles searching and installing packages. This tutorial goes through both.

It takes about eight minutes. You need a folder with a `.csproj` or `.sln` file in it, open in Forge Super, and the .NET SDK installed.

## 1. Open the panel

Click the **Dotnet** icon in the status bar, or open the command palette and run `dotnet panel: toggle focus`. The panel has no default key binding.

The first thing in the panel is the SDK it found, for example `dotnet 9.0.100`. Under that are the sections **Projects**, **Quick Actions**, **Packages**, **Outdated**, **Vulnerabilities** and **Processes**.

If the panel says **dotnet not found in PATH**, the SDK is not installed or Forge Super cannot see it. Install the .NET SDK, then reopen Forge Super.

[//]: # (TODO screenshot dotnet-panel-1-overview.png: The .NET panel with the SDK version at the top and its sections.)

## 2. Pick the project

**Projects** lists every `.csproj` and every solution (`.sln`, marked with a small **sln** tag) under your workspace. Click one to make it the active project. Everything below, from **Quick Actions** to **Vulnerabilities**, is about the active project.

If it says **No .NET projects found**, open the folder that holds the project or solution file.

## 3. Build, run and test

Under **Quick Actions**, four buttons run the usual commands in the project's folder:

| Button | Runs |
| --- | --- |
| **build** | `dotnet build` |
| **run** | `dotnet run` |
| **test** | `dotnet test` |
| **restore** | `dotnet restore` |

Hover a button to see the command. The output opens in the **Script Runner** panel and appears line by line as it prints.

The buttons are greyed out until a project is found, and while one command is running, because the Script Runner shows one command at a time. If you click while it is busy, you see "Script Runner is busy — wait for it to finish first."

A web app started with **run** keeps running. Click **Stop** in the Script Runner when you want to end it.

You should see the Script Runner open and show the build output, ending with a line such as `Build succeeded`.

[//]: # (TODO screenshot dotnet-panel-2-quick-actions.png: The Quick Actions buttons and the Script Runner showing a build.)

## 4. See what the project uses

**Packages** lists the NuGet packages the active project references, each with its version. If the list is empty, it says **No installed NuGet packages**.

## 5. Update what is out of date

**Outdated** lists the packages that have a newer version. While it checks, it says **Checking for updates…**, and if the check fails, **Retry** tries again. When nothing is old it says **All packages up to date**.

- **Update all (patch)** applies only bug-fix updates.
- **Update all (minor)** also applies new-feature updates.

Neither touches a major version. Each update runs `dotnet add package` for the package at its newer version, all in one Script Runner run, so you can watch it.

[//]: # (TODO screenshot dotnet-panel-3-outdated.png: The Outdated section with Update all (patch) and Update all (minor).)

## 6. Check for known vulnerabilities

**Vulnerabilities** shows what `dotnet list package --vulnerable` found. Each finding names the package and shows the address of its advisory. When there are none, it says **No known vulnerabilities**. Use **Retry** if the check fails.

## 7. Use the NuGet Manager

There is a tutorial for this tab on its own: [Manage NuGet packages](/docs/nuget-manager). For anything beyond updating, click **NuGet Manager** under **Quick Actions**, or press `Ctrl+K` then `G`. It opens in its own tab, with five pages on the left:

| Page | What you do there |
| --- | --- |
| **General** | See which project the tab is working on |
| **Search** | Search nuget.org, click **Install** on a result, and **Load more** for further results |
| **Installed** | See the referenced packages and **Remove** one |
| **Updates** | **Update** an outdated package |
| **Vulnerabilities** | See the known vulnerabilities (there is no fix button here) |

Select a package to open its details on the right: its versions, its dependencies, and its README. In a package list you can use the up and down keys to move, `Enter` to open details, and `Space` to run the page's main action (Install, Remove or Update).

Every change runs in the Script Runner, so you see the `dotnet add package` or `dotnet remove package` output as it happens.

The NuGet Manager works on **one project** at a time, because `dotnet list package` does not accept a folder with more than one project file. If the workspace has no `.csproj`, the tab says so and offers **Rescan**.

[//]: # (TODO screenshot dotnet-panel-4-nuget-manager.png: The NuGet Manager Search page with a package selected and its README.)

## 8. See what is running

**Processes** lists the `dotnet` processes that are running, with their process number, name, CPU use and memory. It is a read-only list: there is no Stop button here. To end a server you started with **run**, use **Stop** in the Script Runner.

## If something goes wrong

**The panel says "dotnet not found in PATH".** Install the .NET SDK, then reopen Forge Super so it picks up the new path.

**The quick action buttons are greyed out.** No project has been found, or a command is still running. Check **Projects**, and look at the Script Runner.

**"Script Runner is busy".** Another command is still running. Wait for it, or click **Stop** in the Script Runner.

**The NuGet Manager says there is no project.** There is no `.csproj` under the workspace. Open the right folder, then click **Rescan**.

**`dotnet run` never finishes.** A web app or a service keeps running on purpose. Click **Stop** in the Script Runner when you are done.
