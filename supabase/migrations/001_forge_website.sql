-- ============================================================
-- Mentenaz Forge — Website Database Schema
-- Project: daquiwsaqffoxtqijwzo
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
CREATE TABLE extensions (
  id TEXT PRIMARY KEY,                          -- e.g. "mentenaz.spfx-tools"
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,              -- 1=schema, 2=code
  downloads INTEGER NOT NULL DEFAULT 0,
  official BOOLEAN NOT NULL DEFAULT false,
  version TEXT NOT NULL DEFAULT '1.0.0',
  license TEXT NOT NULL DEFAULT 'MIT',
  icon_url TEXT,
  repository_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Extension Submissions (pending review) ───────────────────
CREATE TABLE extension_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  extension_id TEXT NOT NULL,
  tier INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',       -- pending, approved, rejected
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Extension Install Events ────────────────────────────────
CREATE TABLE extension_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  extension_id TEXT NOT NULL REFERENCES extensions(id) ON DELETE CASCADE,
  user_ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Releases ────────────────────────────────────────────────
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,                            -- e.g. "v0.1.0 — Initial Release"
  description TEXT,
  is_latest BOOLEAN NOT NULL DEFAULT false,
  release_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Release Assets (per-platform binaries) ──────────────────
CREATE TABLE release_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,                        -- windows, linux-deb, linux-appimage, linux-rpm
  filename TEXT NOT NULL,
  file_size BIGINT,                              -- bytes
  download_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Download Events ─────────────────────────────────────────
CREATE TABLE download_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES release_assets(id) ON DELETE CASCADE,
  extension_id TEXT REFERENCES extensions(id) ON DELETE SET NULL,
  user_ip INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Contact / Feedback Submissions ──────────────────────────
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',            -- new, read, replied
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Page Views (analytics) ──────────────────────────────────
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  user_ip INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Site Stats (cached counters) ────────────────────────────
CREATE TABLE site_stats (
  key TEXT PRIMARY KEY,                          -- "total_downloads", "total_extensions", etc.
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_extensions_author ON extensions(author);
CREATE INDEX idx_extensions_tier ON extensions(tier);
CREATE INDEX idx_extensions_official ON extensions(official);
CREATE INDEX idx_extension_installs_ext ON extension_installs(extension_id);
CREATE INDEX idx_extension_installs_date ON extension_installs(created_at);
CREATE INDEX idx_extension_submissions_status ON extension_submissions(status);
CREATE INDEX idx_release_assets_release ON release_assets(release_id);
CREATE INDEX idx_release_assets_platform ON release_assets(platform);
CREATE INDEX idx_download_events_asset ON download_events(asset_id);
CREATE INDEX idx_download_events_date ON download_events(created_at);
CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_views_date ON page_views(created_at);

-- ── RLS (Row Level Security) ────────────────────────────────
ALTER TABLE extensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE extension_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Public read access for extensions, releases, assets, stats
CREATE POLICY "Public can read extensions" ON extensions FOR SELECT USING (true);
CREATE POLICY "Public can read releases" ON releases FOR SELECT USING (true);
CREATE POLICY "Public can read release_assets" ON release_assets FOR SELECT USING (true);
CREATE POLICY "Public can read site_stats" ON site_stats FOR SELECT USING (true);

-- Public can insert submissions, installs, downloads, page views, contact
CREATE POLICY "Anyone can submit extension" ON extension_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log install" ON extension_installs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log download" ON download_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log page view" ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit contact" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Service role full access (for admin/edge functions)
CREATE POLICY "Service role full access extensions" ON extensions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access submissions" ON extension_submissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access installs" ON extension_installs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access releases" ON releases FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access assets" ON release_assets FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access downloads" ON download_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access contact" ON contact_submissions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access page_views" ON page_views FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access stats" ON site_stats FOR ALL USING (auth.role() = 'service_role');
