Helm is the GitHub client built into Forge Super. It lets you find a repository, read its code and history, check an Actions run, clone it, work on its pull requests, and handle everyday chores such as accepting an invitation, without opening a browser. This tutorial signs you in, finds a repository, works on a pull request, reads the code without cloning, and then clones it.

It takes about fifteen minutes. You need a GitHub account, and `git` installed if you want to clone.

## 1. Open the panel

Press `Ctrl+K` then `H`, or click the **Helm** icon in the status bar. It opens on the left.

The first time, it shows a sign-in screen.

[//]: # (TODO screenshot helm-panel-1-signin.png: The Helm panel's sign-in screen with Login with GitHub and Use a token instead.)

## 2. Sign in

Click **Login with GitHub**. Helm shows a **one-time code** and a link:

1. Click **Open** to open the link in your browser. You can copy the code from the panel with the copy icon.
2. Enter the code on GitHub and approve the sign-in.
3. Come back to Forge Super. Helm signs in by itself.

You do not need the GitHub command line. Helm signs in through its own GitHub app, and keeps your token in your system's credential store (Windows Credential Manager on Windows), never in a settings file.

Two other ways in are on the same screen:

- **Use a token instead** takes a personal access token. A classic one needs the `repo`, `read:org` and `user` permissions. A fine-grained one limits Helm to the repositories you choose.
- **Use GitHub CLI** appears only if `gh` is installed. It copies one of its accounts' tokens once. Helm keeps its own copy and does not run `gh` again for it.

If you belong to an organisation that restricts third-party apps, its repositories do not show up until an owner approves Helm. The sign-in screen links to the page in your GitHub settings where you can request that.

## 3. Find your way around

After signing in you see your name and a menu:

| Menu item | What it does |
| --- | --- |
| **View Profile** | Opens your profile, with the items below |
| **Organizations** | The organisations you belong to. It is shown only if you belong to any |
| **Repositories** | Your repositories |
| **Search GitHub** | Search every public repository on GitHub |
| **Create Repository** | Make a new repository |
| **Logout** | Sign out |

**View Profile** shows your details and a short list of its own:

| Item | What it does |
| --- | --- |
| **Edit Profile** | Change your GitHub profile |
| **Repositories** | Your repositories, with how many there are |
| **Organizations** | Your organisations. Shown only if you belong to any |
| **Invitations** | Invitations to repositories and organisations. Shown only while you have some waiting |
| **Account Security** | Opens GitHub's own security settings page in your browser. Helm does not show your security details itself |

A back arrow at the top takes you to the screen you were on before.

## 4. Find a repository

Click **Repositories**. Type in the box that says **Search repositories…** to filter your list. Lists show ten rows at a time, with **Back** and **Next** and a "Page 2 of 7" line when there is more than one page.

To look beyond your own repositories, use **Search GitHub** and type in **Search GitHub repositories…**. Click a result to open it.

You can move through a list with `Up` and `Down`, and open the selected row with `Enter`.

## 5. Look around a repository

Click a repository to open it. Its page lists what it holds:

| Section | What it shows |
| --- | --- |
| **Branches** | The branches |
| **Collaborators** | Who has access, and you can add or remove people |
| **Issues** | Issues and their comments, and a box to post a comment |
| **Pull requests** | Pull requests: read, create, edit, close, reopen, merge and comment on them |
| **Releases** | Releases, and a way to create one |
| **Packages** | Published packages and their versions |
| **Commits** | Recent commits |
| **Actions** | Workflow runs |
| **Deployments** | Deployments |
| **Tags** | Tags |
| **Traffic** | Views, clones, referrers and popular paths |
| **Security** | Dependabot and secret-scanning alerts |

Click a run under **Actions** and it opens as its own tab, with the run's jobs drawn as a graph, so you can see which step failed without leaving the editor. Lists such as branches, commits and tags are read-only: they show information and do nothing when you click a row.

[//]: # (TODO screenshot helm-panel-2-repository.png: A repository page with its sections.)

## 6. Work on a pull request

Click **Pull requests** on a repository's page. The list has an **Open**, **Closed** and **All** switch, and **New pull request** creates one. Click a pull request to open it. You see:

- a badge (Open, Closed or Merged, and Draft if it is one), its number, who opened it, and `branch → base`;
- under the buttons, a line that says whether it can be merged;
- the checks that ran on its latest commit;
- the description and the comments, with a box to write a comment.

[//]: # (TODO screenshot helm-panel-4-pull-request.png: A pull request open in Helm with the merge line, the checks and the comment box.)

**The merge line.** GitHub decides whether a pull request can be merged, and Helm shows its answer: **Ready to merge**, **Can be merged** with a caution (some checks that are not required are failing), or the reason it cannot be: it has merge conflicts, its branch is behind the base, a required review or check is missing, or it is a draft. While GitHub is still working it out the line says so, and Helm asks again a few times by itself.

**Checks.** Each check is listed with its result: Passed, Failed, Running, Queued, Skipped, Cancelled or Neutral. Click one to open its page in your browser. Older-style commit statuses are not shown.

**Comment.** Type in the box under the thread and click **Comment**. The box empties once GitHub has accepted the comment, so one that failed to send is still there to try again. Issues have the same box.

**Edit, Close and Reopen.** **Edit** changes the title and the description. **Close** closes the pull request, and a closed one offers **Reopen**. A merged pull request has none of these, because GitHub does not let it be reopened.

**Merge.** **Merge…** is greyed out unless GitHub says the pull request can be merged. Click it and a dialog names the pull request and the branch it goes into, and asks for:

- the method: a merge commit, a squash or a rebase. If the repository says which it allows, only those are offered;
- the commit title, which a rebase does not have;
- whether to delete the branch afterwards. This is offered only for a branch in the repository itself, never for the default branch or a fork's. If the branch cannot be deleted, the merge still stands.

A merge cannot be undone from here. Helm sends the commit you were looking at, so if someone pushes to the branch in the meantime GitHub refuses the merge and you can look again.

[//]: # (TODO screenshot helm-panel-5-merge.png: The merge dialog with the method, the commit title and the delete-branch switch.)

**Staying current.** While a pull request or an issue is open, Helm checks it for news every 30 seconds, or every 15 while its checks are still running, so a reply or a finished check appears by itself. If that check fails it says nothing and keeps what is on screen. **Refresh** does the same at once. Neither touches what you are typing.

**What is not here.** Marking a draft ready for review, reviews and approvals, and the changed files and diff are not in Helm yet. The **Open in Browser** button takes you to GitHub for those.

These actions need the `repo` permission. If GitHub refuses one because the sign-in lacks it, the authorize prompt described under "If something goes wrong" appears.

## 7. Read the code without cloning

Click **Open Workspace** on the repository's page. A tab opens that shows the whole repository, read-only:

| Page | What it shows |
| --- | --- |
| **Overview** | The description, default branch, visibility, language, stars, forks, open issue and pull request counts, and the last commit |
| **Code** | A file tree, a filter for file names, the README, and the selected file with syntax colours. Images are shown too |
| **Commits** | The history of the branch, or of a single file or folder, and each commit's changed files and patch |
| **Compare** | The commits and changed files between two branches or tags |
| **Search** | Code search inside this repository |
| **Pull requests** and **Issues** | The open ones, with their comment threads |
| **Actions** | The latest workflow run for the branch you are on |

The branch and tag dropdown at the top changes what you are looking at. The tab is pinned to a commit: when the branch moves on GitHub, the tab offers **Update** and never changes under you. Nothing in this tab changes anything on GitHub.

The header also shows whether you have a local copy of the repository open and how it compares to the commit in view.

[//]: # (TODO screenshot helm-panel-3-workspace.png: The workspace tab on the Code page with a file open.)

## 8. Clone it

Click **Clone repository** on the repository's page. A dialog opens that says where the clone will go: **Clones into** followed by a folder named after the repository. By default that is inside the folder you have open. To put it somewhere else, click **Choose folder…** and pick a different parent folder. Then click **Clone repository** in the dialog.

Helm runs `git clone` as the account you are signed in with, and shows **Cloning…** with the output as it arrives. **Cancel** stops it and removes the half-cloned folder. The token is used for that one command and is not stored in the clone.

When it finishes, the dialog says you have successfully cloned the repository and asks **Would you like to open that workspace?** Click **Yes** to open the clone as a new workspace. If the clone fails, the reason is shown with a **Retry** button.

If the project has a `package.json` and no `node_modules`, Helm offers to run `npm install`.

## 9. Use more than one account

You can be signed in to several GitHub accounts. The account button next to **Helm** in the panel header (its tooltip is **Switch GitHub account**) lets you:

- switch accounts without signing out;
- add another account, and choose which one is the default;
- sign out of one, which deletes its token from this machine, or remove it from the list.

Each workspace remembers which account it uses. A workspace that has never chosen uses the default.

Commits made from the Git panel are written with a name and email you choose for each account, from the account menu's **Commit email…**. Helm sets them in that repository only, and asks first if the repository already names someone else. Your global Git settings are never changed.

Push, pull and fetch from the Git panel log in as the workspace's account, so two windows can push as two different accounts. If the workspace's account cannot push to the repository but another signed-in account can, a notification offers **Switch to …**.

## 10. Create a repository

Click **Create Repository** in the menu and fill in the form:

- **Name** and **Description**;
- **Owner**, which is you or one of your organisations;
- **Private**, to keep it from the public;
- **Add .gitignore**, **Add README.md** and an **Initial commit message**.

To change an existing repository, click the settings icon (**Edit repository**) on its page. You can change its name, description, homepage, topics, and the **Issues**, **Projects**, **Wiki** and **Discussions** switches. The **Private** switch changes who can see the code. A warning appears under it as soon as you flip it, saying what saving will do, and visibility is only sent to GitHub when you actually changed it. Making a repository public exposes its code and history to everyone, and GitHub may refuse depending on your plan or organisation.

## If something goes wrong

**An organisation's repositories are missing.** The organisation restricts third-party apps. An owner has to approve Helm. The sign-in screen links to where you can request it. Owners can read what to approve in [Helm for administrators](/docs/helm-admin).

**An "Authorize … scope" prompt appears.** GitHub refused a change because the sign-in lacks a permission, such as `repo` or `user`. Click the button, sign in again, and Helm returns you to where you were and tries the change once more.

**Merge… is greyed out.** Read the line under the buttons: it says why GitHub will not merge the pull request yet. Fix that on the branch or on GitHub, then click **Refresh**.

**Your comment did not send.** The text stays in the box. Fix the cause, such as a lost connection, and click **Comment** again.

**You get "Failed to …".** Your account has no rights on that resource, or the organisation blocks the change. Signing in again cannot fix that.

**You are asked to sign in again.** The sign-in was removed or has ended. Sign in, and the change you were making is sent again.

**It cannot connect from behind a company proxy.** Helm uses Forge Super's `proxy` setting, or the `HTTPS_PROXY` and `HTTP_PROXY` variables. The Windows system proxy is not read. Set `"proxy"` in your settings, and for Git itself run `git config --global http.proxy` with your proxy address.

**You want to remove Helm's access completely.** **Sign out** deletes Helm's copy of the token on this machine, but the token stays valid on GitHub. The account menu's **Sign out … and revoke…** also opens the GitHub page where you can revoke it everywhere.
