# AGENTS.md — Mentenaz Forge Landing Page

Marketing site + auth gateway for Mentenaz Forge. Next.js 16 / React 19 / TypeScript, deployed on **Vercel**. Separate from the Tauri desktop app (`../forge/`).

**Branch note:** Source code lives on `master`. The `main` branch currently holds only this file and README.

## Commands

```bash
npm run dev          # Next.js dev server
npm run build        # tsc → Next.js build (Vercel uses this)
npm run start        # Production server (local preview)
npx tsc --noEmit     # TS type-check
npm run lint         # ESLint (eslint-config-next)
```

No test framework. SCSS via `sass` v1.101. **Tabs** for indentation. React 19 compiler enabled (`reactCompiler: true` in `next.config.ts`).

## Environment Variables

```
# Forge Supabase (project: daquiwsaqffoxtqijwzo)
NEXT_PUBLIC_SUPABASE_URL=https://daquiwsaqffoxtqijwzo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# AI Twin Supabase (project: fqcmblxweslqhspgnluw)
NEXT_PUBLIC_TWIN_URL=https://fqcmblxweslqhspgnluw.supabase.co
NEXT_PUBLIC_TWIN_ANON_KEY=sb_publishable_QQa-b2S...

# GitHub webhook (server-side only)
GITHUB_WEBHOOK_SECRET=880cecf114416842376881e124ea1f8601e51842910af643f42e9b847ce2137e
```

Local: `.env.local` (gitignored). Vercel: set in dashboard → Settings → Environment Variables.

## Two Supabase Projects

**Never mix them up.** Two separate Supabase projects, two separate clients:

| Client | Import | Project |
|---|---|---|
| Forge | `import { supabase } from "@/lib/supabase"` | `daquiwsaqffoxtqijwzo` |
| AI Twin | `import { twin } from "@/lib/twin"` | `fqcmblxweslqhspgnluw` |

Auth helpers: `import { ... } from "@/lib/twin-auth"` (uses AI Twin project).

### Forge project tables
`extensions`, `extension_submissions`, `extension_installs`, `releases`, `release_assets`, `download_events`, `contact_submissions`, `page_views`, `site_stats`

### AI Twin project tables
`identity`, `topic`, `messages`, `session_messages`, `profiles`

## Pages (`src/app/`)

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing page — hero, features grid, roadmap, footer |
| `/forge-ai` | Static | AI Twin feature page |
| `/ai` | Static | AI overview with 3 modes |
| `/ai/chat` | Client | **Main chat interface** — guest (5 free via HuggingFace) + authenticated (full AI Twin) |
| `/ai/docs` | Static | AI documentation |
| `/login` | Client | Email/password login via AI Twin Supabase |
| `/signup` | Client | Registration → interview → topics flow |
| `/signup/interview` | Client | 5-chapter AI interview, streaming responses |
| `/signup/topics` | Client | Topic selection grid, upserts to `topic` table |
| `/dashboard` | Static | Authenticated landing |
| `/extensions` | Static | Extension marketplace |
| `/extensions/detail` | Client | Extension detail — reads `?id=` from search params |
| `/extensions/submit` | Static | Extension submission form |
| `/app/shortcuts` | Static | Keyboard shortcuts reference |
| `/app/welcome` | Static | Welcome / onboarding |
| `/app/whats-new` | Static | Changelog |

## Auth Flow

```
Guest (no auth) → 5 free messages via HuggingFace (guest-chat Edge Function)
Signup → /signup → email+password → /signup/interview (5 chapters) → /signup/topics → /dashboard
Authenticated → Full AI Twin access (chat/code-assist/brainstorm)
```

Session managed by `twin-auth.ts`: caches tokens in localStorage, auto-refreshes. `useSearchParams` must be wrapped in `<Suspense>` (Next.js requirement).

## Edge Functions (`supabase/functions/`)

Deployed to **Forge** project (`daquiwsaqffoxtqijwzo`):
- `guest-chat` — Forge knowledge base in system prompt, HuggingFace fallback, topic-aware responses
- `ai-chat` — Proxies to AI Twin project, forwards user Bearer token
- `github-webhook` — Processes GitHub release events → `github_releases` table

Deployed to **AI Twin** project (in `../forge/supabase/functions/`):
- `chat`, `code-assist`, `brainstorm` — AI modes with direct-answer rules
- `interview` — 5-chapter onboarding
- `generate-identity`, `update-topic-weight`, `send-forge-registration-confirmation`

### Deploy commands

```bash
cd ../forge  # The Tauri monorepo root (where supabase CLI is linked)
npx supabase functions deploy guest-chat --project-ref daquiwsaqffoxtqijwzo --no-verify-jwt
npx supabase functions deploy ai-chat --project-ref daquiwsaqffoxtqijwzo --no-verify-jwt
npx supabase functions deploy github-webhook --project-ref daquiwsaqffoxtqijwzo --no-verify-jwt
```

Edge Function secrets: `npx supabase secrets set KEY=val --project-ref ID`

## AI Chat (`/ai/chat`)

The most complex page. Key behaviors:
- **Guest mode**: `guest-chat` Edge Function → HuggingFace free inference → topic-aware Forge knowledge fallback
- **Auth mode**: Forwards Bearer token to AI Twin project Edge Functions
- **Streaming**: SSE via `fetch` + `ReadableStream`. Parses `data:` lines
- **SSE buffering**: `sseBufferRef` accumulates partial lines, `{stream: true}` on `TextDecoder`
- **Debounce**: `streamingRef` + 500ms guard prevents React state-batching double-sends
- **Guest limit**: `GUEST_LIMIT = 5` tracked in component state

## Deployment

**Vercel** — auto-deploys on push to `main` (or `master` depending on config).

- Build: `npm run build` (default)
- Output: `.next` (default — NOT `out/`)
- The `out/` directory and `.htaccess` at repo root are artifacts from an earlier cPanel deployment attempt. The `.htaccess` is still tracked in git on `master` but unused in production.
- `tsconfig.json` excludes `supabase/` — Edge Functions use Deno, not Node

## Gotchas

| Area | Rule |
|---|---|
| Two Supabase projects | `supabase.ts` = Forge, `twin.ts` = AI Twin — never mix |
| Auth is on AI Twin | `twin-auth.ts` manages sessions against `fqcmblxweslqhspgnluw` |
| `useSearchParams` | Must be wrapped in `<Suspense>` or build warns/errors |
| Extensions detail | Uses `?id=` query param (not dynamic `[id]` route) |
| Guest chat | Forge project Edge Function → HuggingFace fallback → Forge knowledge |
| Auth chat | Forwards Bearer token to AI Twin project Edge Functions |
| SSE buffering | `sseBufferRef` + `{stream: true}` TextDecoder — don't remove |
| Double-send | `streamingRef` + 500ms debounce — React state batching race condition |
| Markdown | `react-markdown` + `remark-gfm` on assistant messages only |
| `supabase/` excluded from TS | `tsconfig.json` excludes `supabase/` — Edge Functions use Deno |
| Empty `src/app/auth/` | Dead directory, no route. Delete if encountered |
| `supabase/.temp/` tracked | CLI temp files are in git on `master` — add to `.gitignore` if cleaning up |
| Edge Function drift | Deployed functions can silently diverge from local — diff before debugging |

## Reference docs

- `../forge/AGENTS.md` — Desktop app architecture (Tauri v2)
- `DESIGN_SYSTEM.md` — Visual tokens and component patterns
- `FEATURES.md` — Feature inventory
