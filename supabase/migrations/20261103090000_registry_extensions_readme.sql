-- Each extension's README, captured when the registry sync builds it, so the catalogue's
-- detail page can show it. Read from the extension's own source folder at the pinned
-- commit, so it is the right one even for an extension that lives in a sub-folder of a
-- bigger repository.
--
--   readme            the README text (capped by the sync at 100 KB). NULL means "not
--                     captured yet"; an empty string means "looked, there is none".
--   readme_raw_base   where relative image links resolve to, for GitHub repositories
--                     (https://raw.githubusercontent.com/<owner>/<repo>/<commit>/<path>/)
--   readme_blob_base  where relative page links resolve to
--                     (https://github.com/<owner>/<repo>/blob/<commit>/<path>/)
--
-- The existing public read policy on registry_extensions covers the new columns. The
-- app's own API selects explicit columns and never sends the README.
ALTER TABLE registry_extensions
  ADD COLUMN readme TEXT,
  ADD COLUMN readme_raw_base TEXT,
  ADD COLUMN readme_blob_base TEXT;
