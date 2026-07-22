# Mentenaz Forge — Feature Reference

A Tauri v2 desktop developer cockpit: system monitoring, multi-engine editor, LSP, Git/GitHub, databases, terminal, AI assistant, and task automation — all in one app.

---

## 1. System Monitor (Cockpit)

Left-dock default panel. Real-time dashboard with persistent sysinfo sampling (1s tick):

- **CPU:** Total utilization + per-core breakdown, sparkline history
- **RAM:** Used/total GB, sparkline
- **Disk:** Per-mount used/total, sparkline
- **Network:** Per-interface I/O (up/down), sparkline
- **Processes:** Grouped by Managed / System / User, per-process CPU + memory sparklines
- **Uptime:** System uptime display

Backend: persistent `sysinfo::System` (never `new_all()` per call — blocks 200ms). Emits `cockpit-tick` events.

---

## 2. Editor (Multi-Engine)

Full file editor with four swappable engines (configured in Settings):

| Engine | Tech | Use case |
|---|---|---|
| Monaco | `monaco-editor` | Full VS Code editor experience |
| CodeMirror | `codemirror` 6 | Lightweight alternative |
| Minimal | `<textarea>` | Zero-dependency fallback |
| Forge Engine | Rust custom buffer | Experimental Rust-native editor |

### File Tree

- Recursive directory browser with lazy expansion
- Create / rename / delete files & folders (right-click context menu + top buttons)
- Copy / paste files with overwrite confirmation
- Copy path to clipboard
- Icon mapping by extension (40+ file types)
- Git status badges (staged, modified, added, deleted)

### Editor Features

- Syntax highlighting via Monaco (80+ language grammars) or CodeMirror
- Language auto-detection (filename, extension, shebang sniffing)
- Multiple open tabs with dirty indicators
- Tab close confirmation on unsaved changes
- Session persistence (dirty tabs restored across restarts)
- Virtual `forge://` tabs: problems view, database schema graph, task chain, database workbench
- Markdown preview (split-view source + rendered)
- Breadcrumb bar showing file path segments
- Cursor position (`Ln X, Col Y`) shown in status bar

---

## 3. Language Server Protocol (LSP)

Full LSP integration with transparent JSON-RPC proxy architecture:

### Supported Servers

| Language | Server |
|---|---|
| TypeScript / JavaScript | `typescript-language-server` |
| C# / Razor / Blazor | `roslyn-language-server` (Microsoft official) |
| Rust | `rust-analyzer` |
| Deno | `deno lsp` |

### Features

- Diagnostics (errors, warnings, info) — shown inline via Monaco decorations ("Error Lens" style) and grouped in Problems panel
- Completions with trigger characters
- Hover documentation
- Go-to-definition (same-file scroll + cross-file tab navigation via Ctrl+click)
- Find references
- Code actions, signature help, formatting, folding ranges
- Diagnostics scan across entire workspace
- Per-workspace connection registry

Architecture: Rust spawns server subprocess, proxies Content-Length–framed JSON-RPC messages via Tauri events. All protocol logic lives in TypeScript (`src/services/lsp-connection.ts`).

---

## 4. Git Operations

Full git integration via `git2` crate (left-dock panel):

- **Status:** staged + unstaged files with per-file diff
- **Staging:** stage/unstage individual files or all at once
- **Commit:** message input + commit action
- **Diff:** side-by-side file diff with Accept/Exclude per chunk
- **History:** commit log with OID, message, author, time ago, expandable commit diff
- **Remote:** fetch / pull / push / sync (combined fetch+pull)
- **Branch:** ahead/behind counts vs upstream
- **Init:** initialize a new repo
- **Remote management:** add / set-url for remotes
- **Insights:** file frequency chart (most-changed files), contributor activity, risk alerts
- **Git graph:** mini SVG commit graph
- **AI Fix-It:** gather error context + file content + git diff for AI-assisted fixing

---

## 5. GitHub Integration

42 backend commands via `gh` CLI + REST API (left-dock "Mentenaz Helm" panel):

### Auth & Profile
- Auth: login, logout, auth status, token retrieval, scope verification
- Profile: view/edit authenticated user, lookup any user

### Repositories
- List / get / create / rename / update repos
- Clone repo with progress
- Branch listing, collaborator management (add/remove)
- Repo invitations (accept/decline)
- Organization invitations
- Topics management

### Repository Detail Tabs
- **Actions:** workflow runs with status
- **Deployments:** active and past deployments
- **Issues:** filterable by state
- **Pull Requests:** filterable by state
- **Releases:** list and create releases
- **Tags:** list tags
- **Security:** Dependabot alerts, secret scanning alerts
- **Traffic:** views, clones, referrers, popular paths (7-day / 14-day)
- **Packages:** list packages and versions

### Screen Navigation
Multi-screen UI: Menu → Auth → RepoList → RepoDetail → sub-tabs. Supports Gate (error/retry), CloneOptions, CloneProgress, AccountSecurity.

---

## 6. Database Panel

Multi-driver database explorer (bottom dock):

### Supported Drivers

| Driver | Crate | URL scheme |
|---|---|---|
| SQLite | `rusqlite` | File path (fallback) |
| PostgreSQL | `tokio-postgres` | `postgres://` / `postgresql://` |
| MySQL / MariaDB | `mysql_async` (rustls) | `mysql://` / `mariadb://` |
| MSSQL | `tiberius` (rustls) | `mssql://` / `sqlserver://` |

### Features

- **Two-level hierarchy:** ServerConnection → DatabaseConnection
- **Connection flow:** server credentials → authenticate → list databases → multi-select connect
- **SQL query editor** with syntax highlighting
- **Format SQL** button (supports dialect: sqlite/postgres/mysql/mssql)
- **Slow query detection:** amber color on exec time >1000ms
- **Table browser:** column metadata, paginated row data
- **Export:** table as SQL (`INSERT` statements) or JSON
- **Schema graph:** visual React Flow diagram with foreign key edges
- **Foreign key relationships:** `db_get_foreign_keys` feeds the schema graph
- **Connection persistence:** saved/loaded/cleared via `db-connections.json`

---

## 7. Terminal

Full PTY terminal emulator (bottom dock):

- Shell auto-detection: `pwsh.exe` → `cmd.exe` (Windows), `$SHELL` → `bash` (Unix)
- Powered by `portable-pty` crate with `@xterm/xterm` frontend
- Multiple independent sessions
- Resizable (rows/cols)
- xterm addon-fit for automatic size fitting

---

## 8. Script Runner

Single-script shell executor (bottom dock):

- Command input with working directory
- Real-time stdout/stderr streaming
- **ANSI color rendering** — colored output preserved and displayed
- **URL auto-linking** — clickable links in output
- **Fixed via PID** — `taskkill /F /T` on Windows, `sh -c` on Unix
- Persisted command and CWD across sessions
- One-script concurrency guard

---

## 9. Runtime Detection

- **Node.js:** `node --version`, NVM integration (installed + available versions via `nvm list` / `nvm list available`)
- **.NET:** project detection (`.csproj`, `.sln`, `.fsproj`, `.vbproj`)
- **Python:** runtime detection + package listing via `pip list`
- **Generic:** `query_runtime` runs any `<exe> --version`

---

## 10. Process Manager

Live process management (bottom dock):

- Full process list with PID, CPU%, memory, name
- **Adopt / release** — tag external processes as "Managed" in named buckets
- Automatic bucketing by executable name (node, dotnet, python*, postgres, mysqld, sqlservr, mongod, redis-server)
- Kill processes by PID

---

## 11. AI Twin

Supabase-backed personal AI assistant (left-dock panel + floating overlay):

### Backend
- Supabase Edge Functions + **Groq LLM** (`GROQ_API_KEY`, default model `llama-3.1-8b-instant`)
- SSE streaming: `{prefix}-chunk` / `{prefix}-done` events
- Config persisted as `ai-twin.json` in app config directory
- Gap detection via `CORRECTION_PATTERNS`

### Frontend
- **AiTwinV2Panel** (left dock): Connection state machine, 3 modes (Chat / Brainstorm / Code Assist), identity seeding, usage tracking
- **AiOverlay** (floating, Ctrl+Shift+K): Quick-access single-mode chat

### Context Building
Before each message, `buildAiContext()` assembles: active file path + content, open tabs list, LSP diagnostics, last script command + output, git branch + status.

### Edge Functions (hosted on Supabase)
chat, brainstorm, code-assist, context-builder, embed-text, extract-memory, flag-gap, ingest-item, resolve-gap, resolve-memory-conflict, search-vector-store, seed-identity, summarise-brainstorm, trigger-learning, update-topic-weight

---

## 12. Task Chains

Sequential pipeline executor (bottom dock):

### Step Types
| Step | Purpose |
|---|---|
| `Script` | Run a shell command |
| `WaitForPort` | Block until a TCP port is reachable |
| `DbMigration` | Execute a SQL migration against a database |
| `SetEnv` | Set an environment variable for subsequent steps |
| `Notify` | Show a notification (success/failure) |
| `AiCheck` | AI-driven check or validation |

### Features
- Visual chain editor (drag-and-drop step ordering)
- Template save / load / delete
- Sequential execution with continue-on-failure option
- Stop running chain

---

## 13. Problems Panel

LSP diagnostics viewer (bottom dock):

- Diagnostics grouped by file
- Severity icons: error (✕) / warning (⚠) / info (ℹ)
- AI Explain per-error and per-file with streaming explanation pane
- "Open in Editor" buttons to jump to source
- Virtual editor tab (`forge://problems`) renders inline in editor area
- Full-workspace diagnostics scan

---

## 14. Shell Features

### Title Bar
- Menu bar: File, Edit, View, Run — each with dropdown items and shortcut hints
- Command center: search-bar for quick file switching
- Window controls: minimize, maximize, close
- Window title "Mentenaz Forge" with gradient text

### Activity Bar
- Vertical icon rail for left-dock panel switching
- Panel icons with hover glow animation (purple drop-shadow)
- Active state indicator (left border accent)
- Settings gear at the bottom

### Status Bar
- Left: cursor position (`Ln X, Col Y`), LSP error count
- Right: scan button (LSP diagnostics scan), AI usage stats, language label, encoding "UTF-8"
- Accent purple background

### Docking System
- Left, right, and bottom resizable docks
- Drag handles (10px hotzone, purple on hover)
- Bottom dock collapse/expand strip
- Panel tabs for switching within a dock
- Min/max size constraints per dock

### Focus Mode (Ctrl+Shift+F)
Dims all chrome (title bar, activity bar, status bar, editor tabs, breadcrumb) to 5% opacity. Only editor content remains. Exit via Escape.

### Command Palette (Ctrl+P / Ctrl+Shift+P)
- File mode (Ctrl+P): fuzzy search across open tabs
- Command mode (Ctrl+Shift+P): list of available actions with keyboard shortcut hints

---

## 15. Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+P | File palette |
| Ctrl+Shift+P | Command palette |
| Ctrl+O | Open file |
| Ctrl+Shift+E | Open folder |
| Ctrl+S | Save |
| Ctrl+Shift+S | Save all |
| Ctrl+W | Close tab |
| Ctrl+B | Toggle sidebar |
| Ctrl+= / Ctrl+- / Ctrl+0 | Zoom in / out / reset |
| Ctrl+Shift+K | Toggle AI Overlay |
| Ctrl+Shift+F | Focus mode |
| Ctrl+Shift+F5 | Run task chain |
| Ctrl+1–6 | Navigate to Cockpit / Editor / Git Ops / AI Twin / Processes / Database |
| Ctrl+/ | Keyboard shortcuts reference |
| F5 / Shift+F5 | Run / Stop script |
| Escape | Exit focus mode |

---

## 16. Forge Engine (Custom Rust Editor)

Experimental Rust-native editor backend, selectable in Settings:

| Command | Function |
|---|---|
| `editor_open_file` | Load file into buffer |
| `editor_set_content` | Replace entire buffer |
| `editor_insert` | Insert at offset |
| `editor_delete_range` | Delete range |
| `editor_replace_range` | Replace range with text |
| `editor_move_cursor` | Move cursor |
| `editor_select_range` | Select range |
| `editor_get_snapshot` | Get display snapshot |

### Architecture
- `buffer.rs`: TextBuffer (String content, single Selection, version counter)
- `selection.rs`: SelectionsCollection placeholder
- `syntax.rs`: Regex tokenizer for TS/JS/Rust (LazyLock)
- `snapshot.rs`: DisplaySnapshot (IPC contract)

Every mutation returns a fresh `DisplaySnapshot` — React renders it as styled DOM. No client-side editor state.

---

## 17. Utilities & Infrastructure

### Settings & Persistence
- Editor engine selection: Monaco / CodeMirror / Minimal / Zed Engine
- Zoom level (0.5–2.0 in 0.1 steps, stored as `--app-zoom` CSS property)
- Workspace restore: open tabs and dirty content survive restarts
- Settings persisted as `forge_settings_v1`, workspace as `forge-workspace`

### Notifications
- Toast notification queue (info / warning / error)
- Auto-dismiss with configurable duration
- Action buttons on notifications

### Activity Log
- Categorized logging: LSP, script, database, git, GitHub, PTY, app
- Levels: info, success, warn, error

### Windows Jump List
- Recent workspace paths in Windows taskbar jump list

### Tauri Plugins
- `tauri-plugin-opener` — OS default handler for URLs/files
- `tauri-plugin-dialog` — native file/folder open dialogs, confirmation dialogs

### Capability Grants
All native features explicitly granted in `src-tauri/capabilities/default.json`.

---

## 18. Technology Stack

| Layer | Technology |
|---|---|
| Desktop runtime | Tauri v2 |
| Backend | Rust (tokio async) |
| Frontend | React 19 + TypeScript |
| Build | Vite (port 1420, strictPort) |
| State | Zustand (14 stores) |
| Styling | SCSS (sass v1.101, tabs) |
| Editor | Monaco / CodeMirror 6 / Custom Forge Engine |
| Terminal | portable-pty + xterm |
| Git | git2 (libgit2) |
| GitHub | gh CLI + REST API |
| DB drivers | rusqlite, tokio-postgres, mysql_async, tiberius |
| LSP | Custom JSON-RPC proxy (4+ language servers) |
| AI | Supabase Edge Functions + Groq LLM |
| Metrics | sysinfo |
| Diagrams | React Flow |
| Fonts | Oxanium (heading), Outfit (body) |

**Total: ~140 backend commands, 16 panels, 14 stores, 42 GitHub API commands, 4 database drivers, 4 editor engines, 4+ LSP servers, 6 task chain step types.**
