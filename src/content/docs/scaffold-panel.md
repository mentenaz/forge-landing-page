The Scaffold panel creates a new project from a template, and shows you exactly what it will write before it writes anything. It is how you start a SharePoint Framework solution, a Vite front end, a Node API or a full-stack project without setting anything up by hand. It also keeps the templates up to date, and it is where your own templates appear.

It takes about ten minutes. You need an internet connection the first time, to download a template.

## 1. Open the panel

Open the **Scaffold** panel from the left dock. It lists the templates it knows about, and says **Loading templates…** for a moment the first time.

Under the panel's name there is a **Check for updates** button. It asks the templates server what is new, and tells you in words how many templates can be downloaded and how many of yours can be updated.

[//]: # (TODO screenshot scaffold-panel-1-list.png: The Scaffold panel with the three tabs, the search box and a few templates.)

## 2. Find a template

Above the search box are three tabs:

- **All templates** lists everything.
- **Installed** lists the ones already on this machine.
- **Local templates** lists the ones you made or added yourself. It is empty until you have some, and says so. See [Add your own template](/docs/own-templates).

Type in the search box to look through names, descriptions and tags. Click a tag to show only that kind of template. Forge Super remembers the tag and the tab you chose for next time. Under the box, **Showing 6 of 41** tells you how many fit.

Each row shows the template's name, a line about it, its latest version, and where it comes from: **Microsoft SPFx** for Microsoft's own SharePoint templates, **create-vite** for the Vite ones, and **Forge** for the templates made for Forge Super. A tag on the right says **Available** (not downloaded yet), **Installed**, or **Custom** (one of your own). **Update available** appears when a newer revision of one you have is on the server.

A **Legacy** tag marks the older SharePoint templates, which were built from the output of Microsoft's own generator and then edited. Open one and the form starts with a notice about that, and a link to read it.

## 3. Fill in the form

Click a template. A tab opens with a form built from that template's questions.

- Choose the **version**. A template can have several versions. One that is only on the server is downloaded first, with **Download this version**.
- If a template needs a certain Node.js version, the form tells you whether the one you have fits.
- Fill in the fields. A field that takes a list, such as web part names, is a row for each name. **+** adds an empty row under it, **-** takes one away, and **+** is off while a row is empty.
- The panel checks what you type as you type, by the template's own rules: a name that is not allowed, or one that appears twice, is shown under its row. **Next: review** waits until everything is right.
- **Run install afterwards** decides whether the packages are installed for you once the project exists.

If you already have the template but a newer revision is available, the form offers **Update this template** before you start. If a template needs a newer Forge Super than you have, the form says so, and says you can check for updates, instead of showing an error.

[//]: # (TODO screenshot scaffold-panel-2-form.png: The form for an SPFx template with the list rows and the live checks.)

## 4. Review what will be written

Click **Next: review**. You see a tree of every file the project will contain, and any warnings. Nothing has been written yet. Click **Back** if something is wrong.

## 5. Choose where it goes and create it

Click **Next: choose location**, then choose the folder the project goes in with **Choose folder…**. The panel remembers the last one you used. It checks the real location before it writes, and tells you if the folder already exists.

Click **Create project**. A progress bar shows the files being written. If something fails halfway, the half-written folder is removed.

When it finishes, **Open project** opens the new folder in a new window, **Show in file explorer** reveals it, and **Create another** starts again.

## 6. Install the packages

If the template needs `npm install`, Forge Super offers it once the project is trusted: a toast appears with a spinner while it runs ("Installing dependencies…"), and **Show output** opens it in the Script Runner. If you turned on **Run install afterwards**, it starts by itself. Nothing runs in a folder you have not trusted.

## 7. Change a solution you already have

For an existing SharePoint solution, the Node panel has a gear that opens an editor. You can change its name, description and version, add web parts, and import a package of services. See [Edit an SPFx solution](/docs/edit-spfx-solution).

## Good to know

- **Templates are kept on this machine.** Each is downloaded once, into Forge Super's data folder, in a folder called `scaffold_templates`. **Check for updates** only asks the server what has changed.
- **Your own templates are never replaced.** An update only changes templates the panel downloaded itself. If you have one of your own with the same id and version as a downloaded one, yours is the one used.
- **One entry, several versions.** Versions of a template share one entry. The newest version's name and description are shown, and the form lets you pick the version.
- **The panel does not make templates from a project yet.** You can add one by hand: see [Add your own template](/docs/own-templates).
- **Nothing runs without trust.** Creating a project only writes files. The install runs in the Script Runner, which asks you to trust the folder first.

## If something goes wrong

**The list says it could not load.** The templates folder could not be read. Click **Check for updates** to download the list again.

**A template will not download.** Check your connection, and your `proxy` setting if you are behind one. The download is checked against a fingerprint, so a damaged file is refused, not used.

**A template says it needs a newer Forge Super.** It was made for a newer version of the engine than this build has. Update Forge Super, then check for template updates.

**Local templates is empty.** That is expected until you add a template of your own.

**Create says the folder already exists.** The panel never writes into a folder that is there. Choose another folder, or another name.

**A name is refused.** The message under the row says why. Each template has its own rules, for example web part names may only hold letters and digits.
