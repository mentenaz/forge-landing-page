# AGENTS.md — Mentenaz Forge Landing Page

Mentenaz Forge marketing site + auth gateway. Next.js 16 / React 19 / TypeScript, deployed on **Vercel** (separate repo from the Tauri desktop app).

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc → Next.js build (Vercel uses this)
npm run start        # Production server (local preview)
npx tsc --noEmit     # TS type-check
npm run lint         # ESLint (eslint-config-next)
```

SCSS via `sass` v1.101. **Tabs** for indentation. React 19 compiler enabled (`babel-plugin-react-compiler`).

## Environment Variables

Set these in Vercel dashboard → Settings → Environment Variables:

```
# Forge Supabase (project: daquiwsaqffoxtqijwzo)
NEXT_PUBLIC_SUPABASE_URL=https://daquiwsaqffoxtqijwzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# AI Twin Supabase (project: fqcmblxweslqhspgnluw)
NEXT_PUBLIC_TWIN_URL=https://fqcmblxweslqhspgnluw.supabase.co
NEXT_PUBLIC_TWIN_ANON_KEY=sb_publishable_QQa-b2S...

# GitHub webhook (used server-side only)
GITHUB_WEBHOOK_SECRET=880cecf114416842376881e124ea1f8601e51842910af643f42e9b847ce2137e
```

Local: `.env.local` (gitignored).

## Architecture

### Pages (`src/app/`)

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing page — hero, features grid, roadmap, footer |
| `/forge-ai` | Static | AI Twin feature page |
| `/ai` | Static | AI overview with 3 modes (chat / code-assist / brainstorm) |
| `/ai/chat` | Client | **Main chat interface** — guest mode (5 free messages via HuggingFace) + authenticated mode (full AI Twin via Supabase Edge Functions) |
| `/login` | Client | Email/password login via AI Twin Supabase |
| `/signup` | Client | Registration → interview → topics flow |
| `/signup/interview` | Client | 5-chapter AI interview, streaming responses |
| `/signup/topics` | Client | Topic selection grid, upserts to `topic` table |
| `/dashboard` | Static | Authenticated landing page |
| `/extensions` | Static | Extension marketplace (Supabase `extensions` table) |
| `/extensions/detail` | Client | Extension detail — reads `?id=` from search params |
| `/extensions/submit` | Static | Extension submission form |
| `/app/shortcuts` | Static | Keyboard shortcuts reference |
| `/app/welcome` | Static | Welcome / onboarding |
| `/app/whats-new` | Static | Changelog |

### Two Supabase Projects

The site talks to **two separate Supabase projects**:

1. **Forge project** (`daquiwsaqffoxtqijwzo`) — `supabase.ts` client
   - Tables: `extensions`, `github_releases`, `profiles`
   - Edge Functions: `guest-chat`, `ai-chat`, `github-webhook`

2. **AI Twin project** (`fqcmblxweslqhspgnluw`) — `twin.ts` client
   - Tables: `identity`, `topic`, `messages`, `session_messages`, `profiles`
   - Edge Functions: `chat`, `code-assist`, `brainstorm`, `interview`, `generate-identity`, `update-topic-weight`, `send-forge-registration-confirmation`

**Never mix them up.** Imports:
- `import { supabase } from "@/lib/supabase"` → Forge project
- `import { twin } from "@/lib/twin"` → AI Twin project
- Auth helpers: `import { ... } from "@/lib/twin-auth"` (uses AI Twin project)

### Auth Flow

```
Guest (no auth)
  └─ 5 free messages via HuggingFace (guest-chat Edge Function)
  └─ After 5: limit banner with signup CTA

Signup flow:
  /signup → email + password → /signup/interview (5 chapters) → /signup/topics → /dashboard

Authenticated:
  └─ Full AI Twin access (chat / code-assist / brainstorm)
  └─ Session via Supabase auth (twin-auth.ts caches + refreshes tokens)
  └─ Bearer token forwarded to AI Twin Edge Functions
```

### AI Chat Page (`/ai/chat`)

This is the most complex page. Key behaviors:

- **Guest mode**: Sends to `guest-chat` Edge Function on Forge project → falls back to HuggingFace free inference → topic-aware Forge knowledge fallback
- **Auth mode**: Sends to AI Twin project (`chat` / `code-assist` / `brainstorm` Edge Functions)
- **Streaming**: SSE via `fetch` + `ReadableStream`. Parses `data:` lines, dispatches `{prefix}-chunk` and `{prefix}-done` events
- **SSE buffering**: `sseBufferRef` accumulates partial lines, `{stream: true}` on `TextDecoder`
- **Debounce**: `streamingRef` + 500ms guard prevents React state-batching double-sends
- **Markdown**: `react-markdown` + `remark-gfm` for assistant messages
- **Guest limit**: `GUEST_LIMIT = 5` tracked in component state
- **Modes**: `chat` (general), `code` (code-assist), `brainstorm` (ideas)

### Edge Functions (`supabase/functions/`)

Deployed to Forge project:
- **`guest-chat`**: Forge knowledge base in system prompt, topic-aware fallbacks (Forge info / installation / AI features / general), 80-char SSE chunks
- **`ai-chat`**: Proxies to AI Twin project, forwards user Bearer token
- **`github-webhook`**: Processes GitHub release events → inserts into `github_releases` table

Deployed to AI Twin project (in `forge/supabase/functions/`):
- **`chat`**: General AI chat with CRITICAL RULES (no hedging, direct answers, concise)
- **`code-assist`**: Code-focused with same direct-answer rules
- **`brainstorm`**: Creative ideation with same direct-answer rules
- **`interview`**: 5-chapter onboarding interview
- **`generate-identity`**: Extracts 5 identity docs from interview
- **`update-topic-weight`**: Upserts topic preferences
- **`send-forge-registration-confirmation`**: HTML email matching Forge design system

Deploy commands:
```bash
cd forge  # The Tauri monorepo root
npx supabase functions deploy guest-chat --project-ref daquiwsaqffoxtqijwzo --no-verify-jwt
npx supabase functions deploy ai-chat --project-ref daquiwsaqffoxtqijwzo --no-verify-jwt
npx supabase functions deploy github-webhook --project-ref daquiwsaqffoxtqijwzo --no-verify-jwt
```

### Design System

Matches the Tauri desktop app:

| Token | Value |
|---|---|
| `$accent` / `--accent` | `#9333ea` (purple) |
| `--accent-green` | `#8fb000` |
| `--accent-light` | `#a855f7` |
| `--bg` / `--bg-page` | `#0a0a0f` / `#111118` |
| `--bg-card` | `#1e1e1e` |
| `--bg-input` | `#18181b` |
| `--bg-tag` | `#27272a` |
| `--border` | `#2a2a2a` |
| `--text-active` | `#f4f4f5` |
| `--text-primary` | `#d4d4d8` |
| `--text-secondary` | `#a1a1aa` |
| `--text-muted` | `#6b7280` |
| `--font-heading` | `Oxanium` |
| `--font-body` | `Outfit` |
| `--font-mono` | `Cascadia Code` |

### IPC / Data Layer

No IPC — this is a web app. Data fetching:
- **Static pages**: Supabase queries at build time (server components)
- **Dynamic pages**: Client-side `supabase.from(...)` calls
- **Edge Functions**: `fetch()` to Supabase function URLs with anon key

### Database Tables (Forge project)

| Table | Purpose |
|---|---|
| `extensions` | Marketplace extensions (id, name, author, tier, downloads, etc.) |
| `github_releases` | Cached GitHub releases for the changelog |
| `profiles` | User profiles (linked to auth) |

### Database Tables (AI Twin project)

| Table | Purpose |
|---|---|
| `identity` | 5 identity docs per user (unique: user_id + document_type) |
| `topic` | User topic preferences with weights |
| `messages` | Chat history |
| `session_messages` | Session-level message cache |
| `profiles` | User profiles |

## Gotchas

| Area | Rule |
|---|---|
| Two Supabase projects | `supabase.ts` = Forge, `twin.ts` = AI Twin — never mix |
| Auth is on AI Twin | `twin-auth.ts` manages sessions against `fqcmblxweslqhspgnluw` |
| `useSearchParams` | Must be wrapped in `<Suspense>` or Next.js static export fails |
| Extensions `[id]` | Was `[id]` dynamic route, now `detail?id=xxx` query param (client-side) |
| Guest chat | Forge project Edge Function → HuggingFace fallback → Forge knowledge |
| Auth chat | Forwards Bearer token to AI Twin project Edge Functions |
| Stream prefixes | `ai-twin` vs `ai-twin-explain` — distinct to avoid event collision |
| SSE buffering | `sseBufferRef` + `{stream: true}` TextDecoder — don't remove |
| Double-send | `streamingRef` + 500ms debounce — React state batching race condition |
| Markdown | `react-markdown` + `remark-gfm` on assistant messages only |
| Vercel | No `output: "export"` — Vercel handles SSR/serverside natively |
| Edge Function secrets | Set via `npx supabase secrets set KEY=val --project-ref ID` |
| Registration email | Template matches Forge design system — update HTML in Edge Function for branding changes |

## Vercel Deployment

This repo deploys to Vercel automatically on push to `main`.

**Vercel Settings:**
- Framework: Next.js (auto-detected)
- Build command: `npm run build` (default)
- Output directory: `.next` (default — NOT `out/`)
- Node.js version: 20+ (auto-detected)
- Install command: `npm install` (auto-detected)

**No `output: "export"`** — Vercel runs server-side features natively. The `out/` directory and `.htaccess` are artifacts from an earlier cPanel deployment attempt and can be ignored.

**Environment variables** must be set in Vercel dashboard, not `.env.local` (which is gitignored).

## Reference docs

- `../forge/AGENTS.md` — Desktop app architecture (Tauri v2)
- `DESIGN_SYSTEM.md` — Visual tokens and component patterns
- `FEATURES.md` — Feature inventory
- `CLAUDE.md` — Extended context
