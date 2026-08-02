# Forge Landing Page — TODO

## Resolved

- [x] Hosting: Vercel for site, Afrihost for installer files (manual upload)
- [x] Downloads page: queries Afrihost URLs directly — no Supabase `releases` table needed
- [x] GitHub Releases workflow: dropped — avoids API quota burn, installers uploaded manually

## Architecture

Installers are built locally on your machine via `npm run tauri build`, then manually
uploaded to Afrihost via file manager / SFTP. The `/downloads` page on Vercel links
directly to Afrihost-hosted files. No CI builds installers.

## 1. `/downloads` page

- [ ] Define URL convention for Afrihost-hosted installers, e.g.:
  ```
  https://yourdomain.co.za/releases/v0.1.0/Mentenaz%20Forge_0.1.0_x64-setup.exe
  https://yourdomain.co.za/releases/v0.1.0/mentenaz-forge_0.1.0_amd64.deb
  ```
- [ ] Create the page — read download links from a config constant or Supabase table
- [ ] Platform selector (Windows / Linux), download button points to Afrihost URL
- [ ] Show version, file size, changelog snippet

## 2. `/admin` page (Supabase-auth gated)

- [ ] Gate route on AI Twin Supabase Auth session (`twin-auth.ts`)
- [ ] Wizard step 1: paste the Afrihost download URL
- [ ] Wizard step 2: `HEAD` request to verify it resolves (200) + read `Content-Length` / `Content-Type`
- [ ] Wizard step 3: metadata form — version, platform, changelog
- [ ] Store links in a simple `download_links` table (or just verify manually and hardcode in config)
- [ ] Optional: if links live in Supabase, `/downloads` reads from table instead of hardcoded config

## 3. Landing page fixes (still pending)

- [ ] Repo references: `mentenaz-forge` → `forge-landing-page` or correct GitHub URL — download links + Issues link currently 404
- [ ] Installer filenames — actual NSIS output is `Mentenaz Forge_0.1.0_x64-setup.exe` (**space**, not `Mentenaz.Forge`) — confirm real filenames before publishing
- [ ] RAM stat — currently `28MB`; confirm real idle vs under-load numbers
- [ ] "Free and open source" copy — not true while `mentenaz/forge` is private; either drop "open source" or make the repo public
- [ ] Extensions stat (`6`) — source unclear, verify against real data or remove
- [ ] Remove `console.log` debug lines from `/ai/chat` page before production deploy
