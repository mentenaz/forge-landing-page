-- Releases now belong to a product, so Forge Super releases (dev-vN) never mix
-- with, or take the "latest" flag from, the legacy Tauri app (0.x.y). Every row
-- that exists today is a legacy release, which is what the default gives them.
ALTER TABLE releases
  ADD COLUMN product TEXT NOT NULL DEFAULT 'forge-legacy'
  CHECK (product IN ('forge-super', 'forge-legacy'));

CREATE INDEX idx_releases_product_latest ON releases(product, is_latest);

-- Install methods that are not files: commands to run. Direct downloads still
-- come from release_assets; this holds the apt line, winget, and so on. A
-- method is switched on with is_active, so adding one later (winget, once it
-- is published) is a data change.
CREATE TABLE install_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL DEFAULT 'forge-super',
  platform TEXT NOT NULL,                       -- windows, linux
  label TEXT NOT NULL,
  command TEXT NOT NULL,
  note TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE install_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active install_methods"
  ON install_methods FOR SELECT USING (is_active);
CREATE POLICY "Service role full access install_methods"
  ON install_methods FOR ALL USING (auth.role() = 'service_role');

INSERT INTO install_methods (product, platform, label, command, note, sort_order, is_active) VALUES
  ('forge-super', 'linux', 'Debian, Ubuntu and Kali',
   'curl -fsSL https://downloads.mentenaz-server.com/install.sh | sudo sh',
   'Adds the Forge Super apt repository and installs it. Updates arrive with apt upgrade.',
   10, true),
  -- Not published yet. Switch it on (UPDATE install_methods SET is_active = true
  -- WHERE command LIKE 'winget%') when the package is accepted.
  ('forge-super', 'windows', 'winget',
   'winget install Mentenaz.Forge.Super',
   'Updates with winget upgrade.',
   10, false);
