When you already have a SharePoint Framework solution, you do not have to start again to change it. The Edit solution tab lets you change its name, description and version, add web parts to it, and import a package of shared services into it. Every change is shown before it is written, and the last one can be undone.

It takes about ten minutes. You need an SPFx solution open in Forge Super, one that is safe to change while you learn.

## 1. Open the editor

Open the solution's folder. In the **Node** panel, the **SPFx** row shows the SharePoint icon and the solution's SPFx version. At the end of that row is a **gear**. Click it, and the **Edit solution** tab opens with three pages: **Details**, **Components** and **Packages**.

[//]: # (TODO screenshot edit-solution-1-tabs.png: The Edit solution tab with the Details, Components and Packages tabs.)

## 2. Change the name, description and version

The **Details** page shows the solution's name, description and version, read from `config/package-solution.json`. Change one and the panel checks it as you type, by the rules the scaffolding engine uses: the name cannot be empty, and the version must be four numbers such as `1.0.0.1`. A problem is shown under the box it belongs to.

Under **Changes** you see the old and new line, and **Apply changes** turns on only when something has really changed. Nothing else in the file is touched, and its comments and line endings stay as they were. The solution id and the SPFx version cannot be changed here.

After an edit, **Undo: Edited solution …** appears. It puts the file back.

## 3. Add a web part

Open the **Components** page. **In this solution** lists what is already there. Under **Add**:

1. Choose the template. Only the templates that match the solution's SPFx version are offered (1.20 or newer). If none fits, the page says why.
2. Type a name for the web part. Use **+** for more and **-** to remove one. The panel tidies what you type: `test` becomes `Test`, so the web part is `TestWebPart`, and `Request Form` becomes `RequestForm`. The line under the box shows what each name becomes. A name that is already in the solution is refused, ignoring capital letters.
3. Under **Changes**, read which files would be created and which edited, with the web part's main file. Then click **Add web part**.

Each web part gets its own id automatically, and the web part's entries are added to `config/config.json` for you. **Open web part** opens its main file.

If the template's framework differs from the solution's, a note says so. The template's packages are added to `package.json`, and the ones already there are not changed.

If the add changed `package.json`, a **Run npm install** button appears next to **Undo**. It runs the install in the Script Runner, after the folder is trusted. A plain web part add does not touch `package.json`, so you will not always see it.

[//]: # (TODO screenshot edit-solution-2-components.png: The Components page with a name typed and the Changes preview.)

## 4. Import a package of services

A **package** is a folder of shared code, such as a layer of service functions, that you want in more than one solution. It has:

```text
my-services\
  manifest.json    what the package is, and which files to copy (an "import" section)
  package.json     the packages it needs
  src\             the source
```

Open the **Packages** page and click **Choose package folder…**. The panel reads the folder and shows, without writing anything:

- **Modules.** A package can have a shared core (always copied) and optional modules. Each module is a switch. One that is not in the solution yet is off. One already imported is on and locked, with **imported** beside it, or **changed** if you have edited it since, or **N files missing** if only part of it is there. **Select all** and **Clear** switch many at once. The core comes with the first module you choose.
- **What it needs.** One line per package the code needs, coloured by what would happen: green `+` will be added to `package.json`, grey nothing to do (the solution already has a version that fits, or supplies it itself), amber it differs from your version (your version is kept, the files are still imported) or an upgrade is available (reported, never applied), red it stops the import.
- **Changes.** Once you choose a module: the folder the files land in (`src/services/<name>/` by default), the files in groups, the lines `package.json` gains, and any files left as they are. **Show all files** lists every one.

Click **Import package**. Afterwards, a note from the package may appear, and if `package.json` changed, **Run npm install** appears. **Undo** takes the import back, as long as you have not changed those files.

### When the import is blocked

An SPFx package or a peer the package needs may be missing from the solution, for example `@microsoft/sp-http` in a solution that has not had `npm install` yet. A red banner names what is missing, and **Import package** stays off. Click **Install the missing packages**. It installs the SPFx packages at the solution's own SPFx version, and a missing peer at the version range the package asks for, in the Script Runner. Then click **Check again**. Anything that cannot be installed from here is listed for you to add yourself.

### Making a package

The **Forge Super repository** has a script, [`script/make-package-draft.ps1`](https://github.com/mentenaz/mentenaz.Forge.Super/blob/main/script/make-package-draft.ps1), that drafts a package from a TypeScript library: it writes a new folder with a `manifest.json`, a `package.json` of the needs, and only the source the manifest names. It never changes your original. Check the draft before you use it: the module titles, and which files are the core.

[//]: # (TODO screenshot edit-solution-3-packages.png: The Packages page with the module switches and the needs list.)

## Good to know

- **One undo.** Only the last change is kept, whether it was an edit, a web part or an import.
- **Nothing is deleted.** Adding and importing never remove or overwrite a file the solution has. An existing file that differs is kept, and listed.
- **Removing a web part is not part of this.** Undo takes back the last add, nothing more.
- **Packages are new.** Importing works for SharePoint Framework solutions, and it is still an early feature.
- **Nothing runs without trust.** The install buttons run in the Script Runner, which asks you to trust the folder first.

## If something goes wrong

**The gear is not there.** The Node panel shows it only when the folder is detected as an SPFx solution. Check that `package.json` and `config/package-solution.json` are in the folder you opened.

**No template is offered on Components.** The solution's SPFx version has no matching template. Templates exist for 1.20 and newer. Click **Check for updates** in the Scaffold panel.

**Undo says it cannot.** A file the change wrote was edited since, so undoing would overwrite your work. The message names the file.

**The Packages page says the folder is not a package.** Its `manifest.json` is missing, or has no `import` section.

**An import is refused as blocked.** Read the red banner, then use **Install the missing packages** or add the packages yourself, and click **Check again**.
