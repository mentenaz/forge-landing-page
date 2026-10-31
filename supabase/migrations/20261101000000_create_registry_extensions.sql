-- ============================================================
-- Forge Extension Registry (Zed extension_host-compatible)
-- Project: daquiwsaqffoxtqijwzo
--
-- Separate from the existing extensions / extension_submissions /
-- extension_installs tables (001_forge_website.sql), which are an
-- unrelated, already-shipped marketplace-submission feature with a
-- different, non-versioned shape (tier, single author string, no
-- schema_version/wasm_api_version/provides). Do not conflate the two.
--
-- One row per (id, version) ever synced from the forked
-- zed-industries/extensions repo, so /extensions/{id}/{version}/download
-- can serve a specific past version and history survives each sync. The
-- sync job (GitHub Action, TBD) is responsible for setting is_latest = true
-- on exactly one row per id and false on the rest whenever it inserts a
-- new version.
-- ============================================================

CREATE TABLE registry_extensions (
  id               TEXT        NOT NULL,
  version          TEXT        NOT NULL,
  is_latest        BOOLEAN     NOT NULL DEFAULT false,
  name             TEXT        NOT NULL,
  description      TEXT,
  authors          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  repository       TEXT        NOT NULL,
  schema_version   INTEGER,
  wasm_api_version TEXT,
  -- Kebab-case strings matching cloud_api_types::ExtensionProvides's serde
  -- rename, e.g. ["languages", "grammars"]. Not an enum column: the set of
  -- valid values lives in the Rust client and may grow — this table just
  -- stores and passes through whatever the sync job wrote.
  provides         JSONB       NOT NULL DEFAULT '[]'::jsonb,
  published_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  download_count   BIGINT      NOT NULL DEFAULT 0,
  -- Where the packaged .tar.gz actually lives (a GitHub Release asset URL).
  -- The API redirects here rather than proxying the bytes itself.
  artifact_url     TEXT        NOT NULL,

  PRIMARY KEY (id, version)
);

-- Every "latest" / "search" / "updates" lookup filters on is_latest first.
CREATE INDEX registry_extensions_latest_idx
  ON registry_extensions (id)
  WHERE is_latest;

-- Public, unauthenticated reads (matches Zed's own extension API, which
-- needs no account). All writes go through the service-role key in the
-- sync job's API route, never through this policy.
ALTER TABLE registry_extensions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to registry_extensions"
  ON registry_extensions FOR SELECT
  USING (true);
