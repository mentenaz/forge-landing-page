The Cargo Manager is a tab for one Rust crate's dependencies. It shows what is installed, what is behind crates.io and which security advisories apply, and it lets you add, remove and update dependencies through Cargo, instead of editing `Cargo.toml` by hand. It asks you to confirm every change first, and shows you what the change will do. This tutorial uses a practice project.

It takes about eight minutes. You need Rust installed.

## 1. Make a practice project

Use a scratch project, not one you care about. In a terminal:

```sh
cargo new practice
cd practice
```

Open the `practice` folder in Forge Super.

## 2. Open the manager

Click **Package Manager** under **Quick Actions** in the [Rust panel](/docs/rust-panel). It opens on the crate you selected there. To work on a different crate, select it in the Rust panel and click **Package Manager** again.

You can also run `cargo manager: open cargo manager` from the command palette. That opens it on the workspace's default crate.

The manager has five pages in the sidebar: **General**, **Search**, **Installed**, **Updates** and **Vulnerabilities**. **General** shows the crate, its workspace, the toolchain and the result of the last action.

[//]: # (TODO screenshot cargo-manager-1-overview.png: The Cargo Manager tab with the five pages in the sidebar.)

## 3. Add a dependency

Open **Search**, type `rand` in the box that says **Search crates.io for a crate…**, and click **Search**. Click **Add** on the result, or open **Details** first to pick a specific version, each of which has its own **Add**.

Before anything runs, you are shown what Cargo will write. In a workspace that declares its shared versions in the root `Cargo.toml`, it adds a line that refers to that shared version. If it would instead write a version into the crate where the workspace does not do that, you get a warning, and **Add anyway** if you are sure.

To add a development dependency instead, switch on **Add as a dev-dependency** above the results, before you click **Add**.

Searches are at least a second apart, which is what crates.io asks of programs that use it. A second search inside that second waits and is not lost.

Confirm. The **Script Runner** panel opens and shows `cargo add` as it runs. When it ends, the tab reads `Cargo.toml` and `Cargo.lock` again.

You should see `rand` on the **Installed** page.

[//]: # (TODO screenshot cargo-manager-2-add.png: The Search page with rand and the confirmation showing what Cargo will write.)

## 4. Read about a crate

Select a dependency or a search result to open its details on the right: how your crate declares it, links to crates.io and docs.rs, its **README**, and the versions that exist, each marked with the Rust version it needs. **Compatible only** hides versions that need a newer Rust than you have.

A version you already have is marked **locked**, and any other version has a **Use** button, so you can pick one on purpose.

With a list selected, the keyboard works too:

| Key | Does |
| --- | --- |
| `Up` and `Down` | Move the selection |
| `Enter` | Open the details, or an advisory's page in your browser |
| `Space` | Do the page's main action: Remove or Update |

The results on the Search page cannot be moved through with the keys yet. Press `Enter` in the search box to run a search.

## 5. Update a dependency

**Updates** lists the dependencies that have a newer version. There are two kinds of row:

- A newer version your crate's requirement already allows. **Update** asks Cargo first what it would change (`cargo update --dry-run`) and shows you the answer as the confirmation. Updating one package often moves others, and the version Cargo settles on can be lower than the one shown if another crate holds it down. If Cargo would change nothing, the tab says so and runs nothing.
- A newer version your requirement rules out, usually a major release. The button says **Change to** and the version.

**Update all** updates every dependency that has a newer version inside its declared range, in one `cargo update` that names them all. It never runs a bare `cargo update`, which can change far more than you expect.

Try it: add an older release of a crate (`cargo add rand@0.8` in a terminal), then open **Updates** and click **Change to** on `rand`.

## 6. Remove a dependency

On **Installed**, which lists your direct dependencies with their locked versions, click **Remove**. The confirmation says so if the workspace's root `Cargo.toml` will change as well. That happens when you remove the last crate that uses a shared entry, and Cargo deletes that entry.

## 7. Check for vulnerabilities

**Vulnerabilities** starts at **Not scanned yet**. Click **Scan**. The scan asks OSV.dev about every package your crate pulls in, including dependencies of dependencies. The result is shared with the Rust panel, so scanning in one shows the findings in both.

An advisory with no stated severity shows **unknown** in the warning colour, and is never shown as fine. Notices such as unmaintained or unsound packages are listed separately, and are not counted as vulnerabilities. Press `Enter` on a finding to open its page.

[//]: # (TODO screenshot cargo-manager-3-updates.png: The Updates page with an Update button, a Change to button, and Update all.)

## 8. What the manager will not do

- **Change a version that the workspace shares.** When a dependency is written as `name.workspace = true`, its version is in the root `Cargo.toml`, which no Cargo command edits. The Updates page shows the newer version with "set in the root Cargo.toml" and no button.
- **Remove or re-version a dependency under a `cfg(...)` target**, such as `[target.'cfg(windows)'.dependencies]`. The tab tells you to edit `Cargo.toml` by hand.
- **Add a dependency the crate already has.** Changing a version is the Updates page's job.
- **List local or git dependencies.** A line under the Installed list says how many were left out, and they are not checked for advisories.

## If something goes wrong

**A command is not run and a reason is shown on the General page.** A crate name or version contained something other than the characters real ones use. The check stops a harmful value from being run as part of a command.

**There is no button where you expect one.** The reason is usually in step 8: the version is shared by the workspace, or it sits under a `cfg(...)` target.

**The README does not show images.** It is shown as crates.io serves it, and pictures such as badges may not appear.

**A version you want is missing.** Yanked versions are never offered. If the version you have locked has been yanked, its row says so.
