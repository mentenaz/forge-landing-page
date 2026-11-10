The Node Package Manager is a tab for finding, installing, updating and removing npm packages, with the registry, each package's README and the audit results all in one wide view. It works on every Node project in your workspace. This tutorial uses a practice project, then shows how to reach the manager straight from your code.

It takes about six minutes. You need Node.js and npm, which you can get from Forge Super's [Node panel](/docs/node-panel).

## 1. Make a practice project

Use a scratch folder, not a project you care about. In a terminal:

```sh
mkdir practice
cd practice
npm init -y
```

Open the `practice` folder in Forge Super.

## 2. Open the manager

Any of these opens it:

- Press `Ctrl+K` then `J`.
- Click **Package Manager** under **Quick Actions** in the Node panel.
- Run `npm manager: open npm manager` from the command palette.
- Right-click in a JavaScript or TypeScript file (see step 8).

The manager opens as a tab. It looks through the workspace for folders that have a `package.json` and shows a tab for each project. If it finds none, it says **No Node projects found in this project** and offers **Rescan**. A workspace with a frontend and a backend gets two tabs.

Each project has five pages in the sidebar: **General**, **Search**, **Installed**, **Updates** and **Vulnerabilities**.

[//]: # (TODO screenshot npm-manager-1-overview.png: The npm manager tab with the project tab and the five pages in the sidebar.)

## 3. Check the General page

**General** shows which package manager the project uses (npm, yarn, pnpm or bun) and whether the Node and npm you are running fit what the project asks for in `.nvmrc`, `.node-version` or `engines`. A mismatch is shown as a warning, and installs ask before they run. Click **Refresh** to read the project again.

## 4. Search for a package and install it

Open **Search**, type `lodash` in the box that says **Search npmjs.com for a package…**, and click **Search**.

Each result shows the package and a button for what you can do with it: **Install**, or **Update** or **Uninstall** if you already have it. **More info** opens its details, and **Load more** brings further results.

Click **Install** on `lodash`.

The **Script Runner** panel opens and shows the `npm install` as it runs. When it ends, the lists reload by themselves.

You should see `lodash` in the **Installed** page, and in your `package.json`.

[//]: # (TODO screenshot npm-manager-2-search.png: The Search page with lodash results and the Install button.)

## 5. Read about a package

Click a package, or **More info**, to open its details in a pane on the right. It shows the versions, the dependencies and the **README**, so you can decide before you install. Use **← Details** to go back from the README. You can drag the divider to give the pane more room.

With a package list selected, the keyboard works too:

| Key | Does |
| --- | --- |
| `Up` and `Down` | Move the selection |
| `Enter` | Open the package's details |
| `Space` | Do the page's main action: Install, Remove, Update or Fix |

## 6. Remove and update

**Installed** lists what the project has. Click **Remove** to take a package out.

**Updates** lists the packages that have a newer version, each marked **patch**, **minor** or **major**:

- **Update** updates one package to its latest version.
- **Update All Safe** updates every package whose update is a patch or a minor one.
- **Update All Patch** updates only the bug-fix ones.

Neither of the two bulk buttons touches a major version, since those can break your code. Update those one at a time, and read the README first. To see it work, install an old version in your terminal with `npm install lodash@4.17.20`, then open **Updates**.

When the list is empty it says **All packages are up to date**.

## 7. Check for vulnerabilities

**Vulnerabilities** shows what `npm audit` found for this project. When a fix is available, a **Fix → version** button runs it. With nothing to report, it says **No known vulnerabilities for this package set**.

[//]: # (TODO screenshot npm-manager-3-updates.png: The Updates page with Update All Safe, Update All Patch and a package marked minor.)

## 8. Reach the manager from your code

In a JavaScript, TypeScript or TSX file, right-click anywhere in the editor. Two entries can appear in the menu:

- **Open in Package Manager** opens the manager on the project that file belongs to. In a workspace with several projects, you land on the right one.
- **Search npm for "package"** appears when the cursor is inside an import's quoted name, or when you have selected one. It opens the manager on the **Search** page with that package already searched for.

For `import debounce from 'lodash/debounce'`, right-click inside the quotes and you get **Search npm for "lodash"**: the package is the part before the first slash, and for a scoped package such as `@mui/material/Button` it is `@mui/material`. Nothing is offered for relative paths such as `./utils`, or for Node's own modules such as `fs` and `node:path`, because those are not on npm.

## If something goes wrong

**"No Node projects found in this project".** There is no `package.json` in the workspace. Open the right folder, or click **Rescan** after you add one.

**"Failed to reload the package lists".** The lists could not be read. Click **Retry**.

**You are asked whether to "Run anyway".** The Node version in use does not fit what the project asks for. Choose a different one in the Node panel, or run it anyway.

**A command is not run and a reason is shown.** A package name or version contained something other than letters, digits and a few punctuation marks. Real npm names never do. The check stops a harmful value from being run as part of a command.

**Install says the package manager is missing.** For Yarn or pnpm, run `corepack enable`, then try again.
