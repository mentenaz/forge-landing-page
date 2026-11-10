This page is for the person who has to decide whether Helm, the GitHub client in Forge Super, may be used at a company: an IT administrator, a security reviewer, or a GitHub organisation owner. It says what Helm can reach, where it keeps credentials, what it sends where, and what an organisation owner controls. If you are a developer who just wants to use Helm, see [Sign in to GitHub and explore a repository](/docs/helm-panel).

## In short

- Helm signs in to GitHub with its own OAuth App, **Helm for Forge**, using GitHub's device flow. It does not need the GitHub command line.
- It asks for three permissions: `repo`, `read:org` and `user`. It asks for a fourth only when a specific action needs it.
- Tokens are kept in the operating system's credential store, never in a settings file or a log.
- A token goes only to GitHub: `api.github.com` for Helm's requests, and `github.com` for Git over HTTPS.
- Helm cannot do anything the signed-in account cannot. An organisation's OAuth App policy and single sign-on still apply.
- Signing out in Helm deletes Helm's copy of the token on that machine. It does not end the token on GitHub. Revoking is a separate step on GitHub.

## What Helm can access

Helm acts as the signed-in GitHub user, within the permissions (scopes) of the token:

| Scope | Why Helm asks for it |
| --- | --- |
| `repo` | Your repositories, public and private, and changing them: creating and editing repositories, pull requests, releases, collaborators, repository invitations, and the token Helm hands to Git for push, pull and fetch |
| `read:org` | The organisations you belong to, for the Organizations screen and the Owner list when creating a repository |
| `user` | Editing your GitHub profile, and reading your verified email addresses so commits can be written with one of them |

`user` is asked for up front, because asking only for the narrower `user:email` would make the first profile edit need a second sign-in.

When GitHub refuses a change because a scope is missing, Helm shows an **Authorize … scope** prompt. Signing in again adds that scope on top of the existing ones. The scope each action needs:

| Action | Scope |
| --- | --- |
| Repositories, pull requests, releases, collaborators, repository invitations | `repo` |
| Edit profile | `user` |
| Organisation invitations | `write:org` |

Helm does not go around any GitHub rule. If a refusal is not a missing scope, for example because the account has no rights on a repository or an organisation blocks the change, Helm says so and does not offer to re-authorize, because that would not help.

## For GitHub organisation owners

### Third-party application access

If your organisation restricts OAuth App access, members who sign in to Helm see their personal repositories, but not the organisation's. Its private repositories stay hidden until an owner approves **Helm for Forge**. The sign-in screen has a link to Helm's page in the member's GitHub settings, where they can request approval from the organisation.

To allow it, approve the request in the organisation's settings under third-party access. To keep Helm out, leave the request denied. Either way, Helm shows no error: the organisation simply does not appear.

### Single sign-on

If the organisation uses SAML single sign-on, a token has to be authorized for it before it can see the organisation's resources. A member does that on GitHub, as for any other token. Until then, requests for those resources are refused.

### Fine-grained tokens

A member can sign in with a fine-grained personal access token instead (**Use a token instead**). It limits Helm to the repositories the member picks, and your organisation's token policies apply to it. Fine-grained tokens do not report their scopes, so every refusal is shown as a plain "Failed to …" message and not as a re-authorize prompt.

## Where credentials are kept

- **Tokens** are in the operating system's credential store: Windows Credential Manager, the macOS Keychain, or the Secret Service on Linux. The entry is named `helm://github.com/<login>`.
- **Never in settings or logs.** `settings.json` lists only the account names and which one is the default. A token is never written to Forge Super's log.
- **A development build** keeps credentials in a plain file only when the environment variable `ZED_DEVELOPMENT_USE_FILE_CREDENTIALS` is set, for throwaway testing. A file of that kind left from before is moved into the credential store at startup.
- **An account listed on a machine that has no token for it** shows **Sign in as …**. The list of accounts is a setting, but a token is not.

## How long a token lasts, and how to end one

Tokens from Helm's OAuth App do not expire on their own.

| Action in Helm | What it does |
| --- | --- |
| **Sign out of** *name* | Deletes Helm's copy of the token on this machine. The token stays valid on GitHub |
| **Sign out of** *name* **and revoke…** | Does the same, and opens the GitHub page where you revoke the token, which ends it on every machine |

Helm cannot revoke a token by itself. GitHub only allows that with the OAuth App's client secret, and an application installed on users' machines cannot keep a secret, so Helm has none. The revoke page depends on how the account was signed in:

- **Helm's own sign-in:** Helm's entry under **Authorized OAuth Apps** in the user's GitHub settings.
- **A pasted token:** the token settings page, where it was created.
- **Imported from the GitHub CLI:** the GitHub CLI's entry. Revoking it signs `gh` out too.

To remove Helm's access to an organisation without involving each member, change the organisation's third-party application access so that Helm is not approved.

## Where a token goes

Only to GitHub.

- `api.github.com`, for Helm's requests.
- `github.com`, for Git over HTTPS.

Other hosts never receive it. Git over SSH, and other Git hosts, keep Git's own login and do not use Helm.

For push, pull and fetch from the Git panel, the token is given to that one `git` process as an `Authorization` header in `GIT_CONFIG_*` environment variables, and it is not written to any Git config file.

For Git in Forge Super's terminals, a credential helper answers when Git asks for `github.com`, with the token of the workspace's account. It listens on a socket in a folder named `zed-git-credential*` under your temporary folder, which only your own Windows account and administrators can open. It answers only for github.com over HTTPS, only for a repository Helm knows, and for anything else answers nothing, so your own helpers (`gh`, Git Credential Manager) answer as before. The token is never put in a terminal's environment. A program running as you could ask the helper for a token, but it could just as easily read the token from the credential store, so the helper exposes nothing new.

## Several accounts and several windows

A user can be signed in to several GitHub accounts. Each workspace remembers which account it uses, and a workspace that has not chosen uses the default. Two windows can therefore push as two different accounts.

If the same folder is open in two windows with different accounts, Git can only log in as one of them there. The window that set it up last wins, Helm says so in a notification, and closing that window hands the folder back to the other.

When the workspace's account cannot push to its repository but another signed-in account can, Helm offers to switch. It checks this in the background without switching anything, and offers it once per account and repository in a session.

## Commit identity

Commits are written with a name and email chosen for each account. Helm writes them into the repository's own Git configuration when a workspace uses that account, and asks first if the repository already names someone else. The global Git configuration is never changed. If the global email is already one of the account's verified addresses, it is used without asking.

## Network, proxies and certificates

- **Proxy.** Helm's requests use Forge Super's `proxy` setting, or the `HTTPS_PROXY` and `HTTP_PROXY` environment variables. On Windows, the system proxy (Internet Options or a PAC script) is not read. Behind a company proxy, set `"proxy"` in the settings, and for Git itself (clone, push, pull and fetch) run `git config --global http.proxy` with the proxy address, since Git does not read the system proxy either.
- **Certificates.** Requests are checked against the operating system's certificate store (on Windows, the one `certmgr` shows), so a company inspection certificate installed there is trusted. Only if that store cannot be loaded does Forge Super fall back to the root certificates it ships with.
- **Rate limits.** Answers to reads are remembered with their `ETag`, and asked for again with a conditional request. When nothing has changed GitHub answers without a body, and that does not count against the rate limit. A rate-limited request is reported as such, with when to try again, and not as a permission error.

## Cloning

**Clone** runs `git clone` as the account the window uses. The token is handed to Git for that one command and is not stored in the clone. Later pushes and pulls in the clone use Git's own credential helper (Git Credential Manager, or `gh`), unless they are made from the Git panel or a Forge Super terminal, as described above. Helm does not install a project's dependencies: it offers `npm install` when the clone has a `package.json` and no `node_modules`.

## A checklist for approval

| Question | Answer |
| --- | --- |
| Does it need the GitHub CLI? | No |
| Which permissions does it ask for? | `repo`, `read:org` and `user`, and `write:org` only for organisation invitations, only when needed |
| Where is the token stored? | The operating system's credential store, as `helm://github.com/<login>` |
| Is it in a settings file or a log? | No |
| Which servers receive it? | `api.github.com` and `github.com` (Git over HTTPS) |
| Can an organisation block it? | Yes, with its third-party application access policy and single sign-on |
| Does the token expire? | Not by itself. Sign out deletes the local copy, and revoking ends it everywhere |
| Can Helm revoke the token itself? | No. The user or an owner does it on GitHub |
| Does it change the global Git configuration? | No. Commit identity is written to each repository's own configuration |
| Does it work behind a proxy? | Yes, with the proxy setting. The Windows system proxy is not read |
