-- First-open steps for the macOS disk images, which are not code-signed yet.
-- Applied to the live database as version 20261119200436, and switched on there
-- once the first macOS release was published; this file matches that.
INSERT INTO install_methods (product, platform, label, command, note, sort_order, is_active) VALUES
  ('forge-super', 'macos', 'First open (not code-signed yet)',
   'xattr -cr "/Applications/Mentenaz Forge Super.app"',
   'Copy the app to Applications and run this once in Terminal, or open System Settings, Privacy & Security and choose Open Anyway. Use the Apple Silicon disk image on M-series Macs and the Intel one on older Macs.',
   10, true);
