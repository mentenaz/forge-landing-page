The Dashboard answers one question: what is the state of this whole project? On one tab it shows which runtimes you have (Node, Python, .NET and Rust), how many packages are out of date or have known vulnerabilities, where your git repository stands, and how busy your machine is. The runtime panels each show only their own language; the Dashboard puts them together.

It takes about five minutes. Open a project that uses at least one of those languages.

## 1. Open the Cockpit panel

The Dashboard is opened from the **Cockpit** panel, which shows live readings of the machine you are working on.

Click the **Cockpit** icon in the status bar, or run `cockpit panel: toggle focus` from the command palette. The panel has no default key binding.

The header shows how many logical cores the machine has, how long it has been up, and a **Dashboard** button. Below it are sections you can collapse:

| Section | Shows |
| --- | --- |
| **Metrics** | Circular gauges for CPU and memory |
| **Cores** | A usage bar for each logical core |
| **Disks** | How full each disk is |
| **History** | A chart of recent CPU and memory use |
| **Network** | A chart of recent network traffic |

The readings refresh every two seconds. The two charts keep the last 30 readings, about a minute.

[//]: # (TODO screenshot dashboard-panel-1-cockpit.png: The Cockpit panel with its header, the Dashboard button, and the gauges.)

## 2. Open the Dashboard

Click **Dashboard** in the Cockpit header, or run `cockpit panel: open dashboard` from the command palette.

The Dashboard opens as a tab in the main editor area. If one is already open, it is brought to the front, not opened a second time. It comes back with your workspace the next time you start Forge Super.

It reads the information the other panels have already collected, so it opens at once and updates when they do. It has four parts: **Runtimes**, **Security**, **Git** and **System**.

## 3. Read the runtimes

**Runtimes** has a row for each language. With made-up numbers, they look like this:

```
Node     v22.22.1       3 projects   2 outdated
Python   3.12.4         1 project    1 vulnerable
.NET     9.0.100        1 project
Rust     1.88.0         12 crates    4 outdated   not scanned
```

Each row shows the version found, how many projects (or crates, for Rust) were detected, and two coloured tags: an amber **outdated** count and a red **vulnerable** count. A tag only appears when its count is more than zero. A language that was not found says **not detected**.

The grey **not scanned** tag means nothing has been checked yet, so the absence of a red tag is not good news. Rust is scanned only when you ask, and an unscanned crate must not look clean.

[//]: # (TODO screenshot dashboard-panel-2-runtimes.png: The Runtimes section with all four rows and their tags.)

## 4. Check security

**Security** has one card for each language. A card lists each finding with its severity, the package, the version it is fixed in, and a link to the advisory. Python's advisories expand in place so you can read more without leaving the tab.

Click **Scan all** at the top to run every language's vulnerability scan again. While a card is scanning it says **Scanning the active project…**, and afterwards either lists the findings or says **No known vulnerabilities**. A card that has nothing to look at says **Nothing to scan yet**.

Two things about the Rust card:

- It covers the crate selected in the Rust panel, not the whole workspace, and it names that crate. To look at another one, select it in the Rust panel.
- Findings that are not vulnerabilities (unsound or unmaintained packages) are listed after the vulnerabilities, tagged with their kind and not a severity.

## 5. Look at git

**Git** summarises the active project's repository: its name, the branch you are on, how many commits you are **ahead** or **behind** the remote, and how many files have changed. If the folder is not a git repository, it says **No git repository detected**.

## 6. Watch the machine

**System** is the Cockpit's gauges and charts again, on the same tab, so you can see whether a build or a scan is what is making the machine slow. It is the same data as the Cockpit panel, not a second set of readings.

## 7. Act on what you see

The Dashboard is a summary. To change anything, go to the panel for that language:

- Outdated Node packages: the **Outdated** section of the Node panel, with its update buttons. See [Get around the Node panel](/docs/node-panel).
- Outdated or vulnerable Python packages: the Python panel and its Package Manager. See [Get around the Python panel](/docs/python-panel).
- NuGet packages: the .NET panel and the NuGet Manager. See [Get around the .NET panel](/docs/dotnet-panel).
- Rust dependencies: the Rust panel and the Cargo Manager. See [Get around the Rust panel](/docs/rust-panel).

After you update something, click **Scan all** to see the new numbers.

## If something goes wrong

**A language says "not detected".** Forge Super did not find that tool or a project that uses it. Open the folder that holds the project, and check that the tool is on your path.

**"Cockpit panel not loaded" in System.** The Cockpit panel did not start. The rest of the Dashboard still works.

**The numbers look out of date.** Click **Scan all**. The counts come from each language panel's own scan, and this runs all of them again.

**The Rust card does not match the crate you expect.** It follows the crate selected in the Rust panel. Select the crate you want there.
