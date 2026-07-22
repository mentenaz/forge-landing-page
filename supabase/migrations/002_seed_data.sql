-- ============================================================
-- Seed Data — Mentenaz Forge Website
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
INSERT INTO extensions (id, name, author, description, tier, downloads, official, version, license, icon_url) VALUES
  ('mentenaz.spfx-tools', 'SPFx Tools', 'Mentenaz', 'SharePoint Framework development utilities — generate webparts, deploy to tenant, manage packages.', 2, 1247, true, '1.2.0', 'MIT', '/icons/extentionsIcon.png'),
  ('mentenaz.supabase-panel', 'Supabase Panel', 'Mentenaz', 'Browse tables, run queries, and manage your Supabase project from inside Forge.', 2, 892, true, '1.0.3', 'MIT', '/icons/extentionsIcon.png'),
  ('community.docker-panel', 'Docker Manager', 'devops-pro', 'Manage Docker containers, images, and compose stacks from a visual panel.', 1, 456, false, '0.9.1', 'MIT', '/icons/extentionsIcon.png'),
  ('community.postman-lite', 'API Tester', 'restmaster', 'Lightweight REST/GraphQL client with environment variables and collection runner.', 1, 723, false, '1.1.0', 'MIT', '/icons/extentionsIcon.png'),
  ('community.sql-formatter', 'SQL Formatter', 'db-wizard', 'Format SQL queries with dialect-aware syntax. Supports Postgres, MySQL, SQLite, MSSQL.', 1, 312, false, '2.0.0', 'MIT', '/icons/extentionsIcon.png'),
  ('community.terraform-viewer', 'Terraform Viewer', 'infra-code', 'Visualize Terraform state files and resource dependency graphs.', 1, 198, false, '0.5.0', 'MIT', '/icons/extentionsIcon.png')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  author = EXCLUDED.author,
  description = EXCLUDED.description,
  tier = EXCLUDED.tier,
  downloads = EXCLUDED.downloads,
  official = EXCLUDED.official,
  version = EXCLUDED.version,
  license = EXCLUDED.license,
  icon_url = EXCLUDED.icon_url,
  updated_at = now();

-- ── Releases ────────────────────────────────────────────────
INSERT INTO releases (version, name, description, is_latest) VALUES
  ('0.1.0', 'v0.1.0 — Initial Release', 'First public release of Mentenaz Forge. Includes multi-engine editor, 7-language LSP, database workbench, GitHub desktop, AI Twin, system monitor, task chains, terminal, and script runner.', true)
ON CONFLICT (version) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_latest = EXCLUDED.is_latest;

-- ── Release Assets ──────────────────────────────────────────
INSERT INTO release_assets (release_id, platform, filename, file_size, download_url) VALUES
  ((SELECT id FROM releases WHERE version = '0.1.0'), 'windows', 'Mentenaz.Forge_x64-setup.exe', 42000000, 'https://github.com/mentenaz/mentenaz-forge/releases/download/v0.1.0/Mentenaz.Forge_x64-setup.exe'),
  ((SELECT id FROM releases WHERE version = '0.1.0'), 'linux-deb', 'mentenaz-forge_0.1.0_amd64.deb', 38000000, 'https://github.com/mentenaz/mentenaz-forge/releases/download/v0.1.0/mentenaz-forge_0.1.0_amd64.deb'),
  ((SELECT id FROM releases WHERE version = '0.1.0'), 'linux-appimage', 'Mentenaz.Forge.AppImage', 45000000, 'https://github.com/mentenaz/mentenaz-forge/releases/download/v0.1.0/Mentenaz.Forge.AppImage');

-- ── Site Stats ──────────────────────────────────────────────
INSERT INTO site_stats (key, value) VALUES
  ('total_downloads', 12450),
  ('total_extensions', 6),
  ('total_releases', 1),
  ('active_users', 342)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
