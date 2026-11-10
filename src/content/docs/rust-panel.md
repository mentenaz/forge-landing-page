The Rust panel gives a Cargo project an overview: which toolchain you have, which crates are in the workspace, what each crate depends on, what is out of date, and which security advisories apply. A second tab, the Cargo Manager, is where you add, remove and update dependencies. This tutorial goes through both on a small practice project.

It takes about ten minutes. You need Rust installed (`rustc` and `cargo` on your path).

## 1. Make a practice project

Use a scratch project for this, not a project you care about. In a terminal:

```sh
cargo new practice
cd practice
cargo add rand@0.8
```

`rand@0.8` is an older release line of the `rand` crate, which gives the panel something to report later. Open the `practice` folder in Forge Super.

The panel needs the project's `Cargo.toml` at the top of the folder you have open. If your Rust project is in a subfolder, open that subfolder.

## 2. Open the panel

Press `Ctrl+K` then `C`, or click the **Rust** icon in the status bar.

The first line shows the installed `rustc` and `cargo` versions. Under it are the sections **Crates**, **Quick Actions**, **Dependencies**, **Outdated** and **Advisories**.

If it says **Cargo.toml not found in this folder**, the folder you opened is not the one that holds `Cargo.toml`.

[//]: # (TODO screenshot rust-panel-1-overview.png: The Rust panel with the toolchain line and its sections.)

## 3. Pick the crate

**Crates** lists every crate in the workspace. A practice project has one, `practice`. Click a crate to select it, and the sections below show that crate. In a workspace with more than eight crates, a **Filter crates…** box appears.

## 4. Check, build, run and test

Under **Quick Actions**, four buttons run Cargo for the selected crate:

| Button | Runs |
| --- | --- |
| **check** | `cargo check -p <crate>` |
| **build** | `cargo build -p <crate>` |
| **run** | `cargo run -p <crate>` |
| **test** | `cargo test -p <crate>` |

Hover a button to see the exact command. The output appears in the **Script Runner** panel as it prints. One action runs at a time, and the buttons are greyed out while one is running or when no crate is selected.

The panel never runs a build or a check by itself. It only reads your manifest and lock file, so opening it costs next to nothing.

[//]: # (TODO screenshot rust-panel-2-quick-actions.png: The four quick action buttons and the Script Runner showing a cargo check.)

## 5. See the dependencies

**Dependencies** lists the crate's dependencies from crates.io, each with the exact version it is locked to in `Cargo.lock`. For the practice project that is `rand`.

Dependencies that are on your disk or in git are not listed. A line under the list says how many were left out. In a workspace where crates depend on their siblings, that is often most of them.

## 6. Read what is out of date

**Outdated** lists dependencies with a newer version on crates.io. A row can show two different kinds of move:

- **up to 0.8.9 … cargo update** is a newer version that the crate's requirement already allows. It says "up to" because other crates in the workspace can hold Cargo at a lower one.
- **newer 0.9.0 … needs the requirement changed** is a newer version that the requirement rules out, usually a major release. For the practice project you should see this for `rand`.

Tags next to a version tell you how big the move is, **patch**, **minor** or **major**, and a red **needs Rust 1.xx** means that version needs a newer Rust than you have installed. **Rust version not declared** is only information. A row also appears when the version you are locked to has been **yanked** (withdrawn by its author), even if nothing newer exists.

## 7. Check for security advisories

**Advisories** does not scan by itself. It says **Not scanned yet** until you click **Scan**.

The scan asks OSV.dev about every crates.io package the crate pulls in, including dependencies of dependencies, and takes a few seconds. Findings are grouped:

- **Vulnerabilities** come first, most severe first. One with an unknown severity shows **unknown** in the warning colour, and is never shown as fine.
- **Unsound**, **Unmaintained** and **Notices** come next. They are notices from the RustSec database, not security holes, and they are not counted in the number at the top.

Click an advisory's id to open its page. "Fixed in" lists only versions newer than the one you have.

The scan reads `Cargo.lock`, which covers every platform, so it can mention a package that is never built on your machine. Selecting another crate, or any change to `Cargo.toml` or `Cargo.lock`, puts the section back to "Not scanned yet".

[//]: # (TODO screenshot rust-panel-3-advisories.png: The Advisories section after a scan, with a findings group.)

## 8. Change dependencies in the Cargo Manager

Click **Package Manager** under **Quick Actions**. The Cargo Manager opens in its own tab, on the crate you selected. To work on another crate, select it in the panel and click **Package Manager** again.

It has five pages on the left:

| Page | What you do there |
| --- | --- |
| **General** | See the crate, its workspace, the toolchain and the status of the last action |
| **Search** | Search crates.io, **Add** a result, **Load more** for further results |
| **Installed** | See direct dependencies with their locked versions, and **Remove** one |
| **Updates** | **Update** one, **Update all**, or **Change to** a different version |
| **Vulnerabilities** | The same advisories as the panel, scanned on demand |

Select a dependency or a search result to open its details on the right: links to crates.io and docs.rs, its README, and the versions available, each marked with the Rust version it needs. **Compatible only** hides versions that need a newer Rust than you have.

Every change shows you what will happen and asks first:

- **Update** first asks Cargo what it would change (`cargo update --dry-run`) and shows you the answer. Updating one package often moves others. If nothing would change, the tab says so and runs nothing.
- **Remove** says so when the workspace's root manifest will change too.
- **Add** says what Cargo will write. To add as a development dependency, switch on **Add as a dev-dependency** first.
- **Update all** updates every dependency that has a newer version inside its declared range. It never runs a bare `cargo update`.

Commands run in the Script Runner, and when one finishes, the tab reads `Cargo.toml` and `Cargo.lock` again.

Try it: on the **Updates** page, find `rand` and click its **Change to** button, which names the newer version. Confirm, and when the command has finished, check **Dependencies** in the panel. It now shows the new version.

[//]: # (TODO screenshot rust-panel-4-cargo-manager.png: The Cargo Manager Updates page with a confirmation.)

## 9. Things the manager will not do

In a workspace where several crates share a version (a `[workspace.dependencies]` table in the root `Cargo.toml`), the version lives in the root file and no Cargo command edits it. For those dependencies, **Updates** shows the newer version with "set in the root Cargo.toml" instead of a button. A dependency under a `cfg(...)` target, such as `[target.'cfg(windows)'.dependencies]`, cannot be removed from here either, and the tab tells you to edit `Cargo.toml` by hand.

## If something goes wrong

**"Cargo.toml not found in this folder".** Open the folder that holds `Cargo.toml`. The panel reads only the top of the opened folder, and only the first folder if you have several open.

**The quick action buttons are greyed out.** No crate is selected, or an action is still running.

**A version is tagged "needs Rust 1.xx".** It needs a newer Rust than the one installed. Update your toolchain, or pick a version marked as compatible.

**The advisory scan reports "unknown" severity.** The advisory does not state one. Treat it as serious until you have read it.

**"Details could not be fetched".** Crates.io or OSV.dev could not be reached. Check your connection and try again.
