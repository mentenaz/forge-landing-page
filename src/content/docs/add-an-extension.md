The extension catalogue on the [Extensions page](/extensions) is what Forge Super installs from. There is no submission form: extensions get in one of two ways.

## 1. It is already in the public catalogue

Most extensions come from the public Zed extension catalogue (`zed-industries/extensions`). Our copy of that catalogue is kept up to date automatically, and a scheduled job builds each extension and publishes it here. If your extension is in the public catalogue, it appears on its own once the job reaches it. There is nothing to submit.

## 2. It is one only Forge Super carries

Some extensions are not in the public catalogue, or need changes to work well here. The Razor extension is an example: it is built from [`mentenaz/zed-razor`](https://github.com/mentenaz/zed-razor), a fork with fixes for `.cshtml` files. Those are added with a pull request to [`mentenaz/extensions`](https://github.com/mentenaz/extensions).

**What you need**

- Your extension in its own git repository, with an `extension.toml` (its `id`, `name`, `version`, `schema_version`, `authors` and `repository`), and a licence file.
- A commit you want to publish. The catalogue pins an exact commit, so a build is reproducible.

**The change to make**

1. Fork `mentenaz/extensions`.
2. Add your repository as a submodule, named after the extension's id:
   ```sh
   git submodule add https://github.com/you/your-extension.git extensions/your-extension
   ```
   and check out the commit you want to publish inside it.
3. Add an entry to `extensions.toml`, in alphabetical order. The version must match the one in your `extension.toml`:
   ```toml
   [your-extension]
   submodule = "extensions/your-extension"
   version = "0.1.0"
   ```
4. Open a pull request.

Once it is merged, the next scheduled build picks it up, usually within a day. The build uses the same tool Zed uses to package extensions. If it fails, the reason is listed in that run's summary, and you can fix it and update the pin.

## Updating an extension

Move the submodule to the new commit and raise the `version` in `extensions.toml` to match, then open a pull request. A version that has not changed is not rebuilt.

## What this page is not

It does not add extensions to the public Zed catalogue. For that, follow the process in the `zed-industries/extensions` repository.
