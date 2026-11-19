-- First-open steps for the macOS disk images, which are not code-signed yet.
-- Off until a macOS release is published; switch it on with
--   UPDATE install_methods SET is_active = true WHERE platform = 'macos';
INSERT INTO install_methods (product, platform, label, command, note, sort_order, is_active) VALUES
  ('forge-super', 'macos', 'First open (not code-signed yet)',
   'xattr -cr "/Applications/Mentenaz Forge Super.app"',
   'Copy the app to Applications and run this once in Terminal, or open System Settings, Privacy & Security and choose Open Anyway. Use the Apple Silicon disk image on M-series Macs and the Intel one on older Macs.',
   10, false);
