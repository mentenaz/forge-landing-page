A template is a folder: a `manifest.json` that says what questions to ask and which files to copy, and the files themselves. Drop one into the right place and the Scaffold panel lists it next to the ones that come with Forge Super, marked **Custom**.

It takes about ten minutes for a small one. You need a text editor.

## 1. Find the templates folder

Forge Super keeps its templates in its data folder, in a folder called `scaffold_templates`. On Windows that is:

```text
%LOCALAPPDATA%\ForgeSuper\scaffold_templates\
```

Downloaded templates are in there already, each in its own folder. Yours go beside them. Anything in that folder that Forge Super did not download itself is yours, and an update never changes or removes it.

If you run the isolated test build, it has its own folder with `ForgeSuperBuild` in place of `ForgeSuper`.

## 2. Make the folder

A small template looks like this:

```text
my-template.1.0.0\
  manifest.json
  base\
    package.json
    src\{__projectNamePascal__}.ts
    _gitignore
```

- The folder's own name does not matter. The engine reads the `id` and the `version` from the manifest. Naming it `<id>.<version>` keeps it easy to read.
- `manifest.json` must be directly inside it, not one folder deeper.
- The files you want copied go in a folder the manifest names (`base` here).

## 3. Use tokens for the parts that change

In the files, and in file and folder names, write a **token** where something should be filled in: `{__name__}`. A text question called `projectName`, answered `my-app`, gives:

| Token | Becomes |
|---|---|
| `{__projectName__}` | `my-app` |
| `{__projectNamePascal__}` | `MyApp` |
| `{__projectNameCamel__}` | `myApp` |
| `{__projectNameKebab__}` | `my-app` |
| `{__projectNameAllCaps__}` | `MY_APP` |

A token that nothing defines is an error, and the answer is put in exactly as typed, so an answer can never pull in another value. A file that has to be called `.gitignore` is stored as `_gitignore` and renamed on the way out (see `rename` below).

## 4. Write the manifest

This is a complete, working manifest for the folder above:

```json
{
  "$schema": "https://schemas.mentenaz-server.com/forge-scaffold/manifest.v1.json",
  "id": "my-template",
  "version": "1.0.0",
  "title": "My template",
  "description": "A small starter.",
  "tags": ["starter"],
  "prompts": [
    { "key": "projectName", "type": "text", "label": "Project name", "rule": "solution-name" }
  ],
  "folderFrom": "projectName",
  "include": [
    { "folder": "base", "rename": { "_gitignore": ".gitignore" } }
  ]
}
```

What each part does:

- **`id`** is the template's name for the engine: lowercase letters, digits and `-`. **`version`** is three numbers.
- **`title`**, **`description`** and **`tags`** are what the panel's list shows. Without a title, the id is shown. The title may be up to 80 characters, the description up to 300, and there can be up to 8 tags of lowercase letters, digits and `-`.
- **`prompts`** are the questions the form asks. A question can be `text`, `bool` (a switch), `list` (rows, such as web part names) or `choice` (one of several options). A `rule` checks the answer, for example `solution-name` accepts lowercase letters, digits and `-`.
- **`folderFrom`** names the question whose answer is the new project's folder.
- **`include`** copies a folder of your template into the new project. `rename` changes a file's own name on the way.
- The first line, **`$schema`**, is optional. It lets an editor such as VS Code check the manifest as you type and flag a misspelt field.

The manifest is plain data, never code. A field the engine does not know is an error, and the only things a template can ask for after creating a project are `install` and `composeUp`.

## 5. Check it

The engine has a checker: `forge-scaffold check ./my-template.1.0.0`. It loads the manifest, builds the template with sample answers, and lists every problem with the file it is in. It writes nothing. You build the program from the [Forge.Scaffold.SDK](https://github.com/mentenaz/Forge.Scaffold.SDK) repository, which also has the full guide to writing templates.

Run it before you rely on a template. **The panel does not show a manifest's problems yet**, so a template with an error is simply missing from the list.

## 6. See it in the panel

1. Put the folder in the templates folder.
2. In the Scaffold panel, click **Check for updates**. That makes the panel read its folder again.
3. Open the **Local templates** tab. Your template is there, marked **Custom**.
4. Click it to use it, exactly as in [Create a project from a template](/docs/scaffold-panel).

## 7. Add a version

Make another folder with the same `id` and a higher `version`, for example `my-template.1.1.0`. The panel then shows one entry for the template, takes its name and description from the **newest** version, and lets you pick the version in the form.

## 8. Lists and repeated folders

A template can ask for a **list** (for example, the names of several pages) and copy a folder once for each item:

```json
"repeat": [
  { "over": "pages", "as": "page", "folder": "page", "guids": ["pageId"] }
]
```

Inside `page`, `{__pagePascal__}` and the other forms stand for the current item, and `{__pageId__}` is a fresh GUID for it. A `merge` can add an entry to a JSON file once for each item, such as one line in a configuration file per page. The [engine's guide](https://github.com/mentenaz/Forge.Scaffold.SDK/blob/main/docs/authoring-templates.md) has the details and a worked example.

## Good to know

- **Yours wins.** If one of your templates has the same id and version as one Forge Super downloaded, yours is used, and no update changes it.
- **Limits.** A template can hold up to 20,000 files, a file up to 64 MiB, and 512 MiB in all. Names Windows keeps for devices, a `.git` folder and links are refused.
- **No making a template from a project yet.** The engine can do it (`forge-scaffold create`, which also checks its own work by rebuilding your project from the template), but the panel does not have a screen for it yet.
- **A package is not a template.** A folder with an `import` section in its manifest is a package for the [Packages page](/docs/edit-spfx-solution), and it appears in this list without being usable as a new project.

## If something goes wrong

**It does not show in the list.** The manifest is probably invalid, and the panel does not say so. Run `forge-scaffold check` on the folder. Also check that `manifest.json` is directly inside the folder you dropped in, and click **Check for updates**.

**"Unknown token".** A `{__name__}` that no question, GUID or list defines. Spelling and capitals matter: `{__projectName__}`, not `{__projectname__}`.

**An unknown field.** The engine refuses fields it does not know. Compare with the example above, or use the `$schema` line so your editor points at it.

**A literal `{__x__}` in a file.** The engine has no way to write one. Change the text.
