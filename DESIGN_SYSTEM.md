# Mentenaz Forge — Design System

## Philosophy

Dark-first developer tool with a purple accent identity. The aesthetic balances VS Code familiarity (dark theme, left/bottom dock layout, status bar, tabs) with a distinctive glowing-purple personality. Every surface is intentionally dim so accent colors and status signals pop when they appear. The overall feel is **professional, focused, and subtly futuristic** — more signal, less chrome.

---

## Color System

### Background Stack (darkest → lightest)

| Layer | Token | Hex | Where |
|---|---|---|---|
| Outer chrome (body pre-React) | — | `#0a0a0f` | `index.html` |
| Panel body / editor area | `$bg` | `#1e1e1e` | Default background |
| Card / header / title bar | `$bg-card` | `#2a2a2a` | All panel headers, docks |
| Elevated card / hover | `$bg-card-alt` | `#313131` | Hover states, table rows, inactive tabs |
| Input fields | `$bg-input` | `#3c3c3c` | Text inputs, search boxes |
| Deepest panel (term, git-ops) | — | `#0d0d0f` | Terminal, GitOps panel body |

Four layers of background depth create subtle hierarchy without visual noise. The deepest backgrounds are reserved for terminal/code-output panels where reading contrast matters most.

### Accent — Purple

| Token | Hex | Usage |
|---|---|---|
| `$accent` | `#9333ea` | Primary accent: active borders, status bar, badges, focus rings, links |
| `$accent-light` | `#a855f7` | Hover states, active text, progress bars |
| `$accent-hover` | ~`#7a27d1` | Button hover (darkened) |
| `$forge-purple-light` | `#d8b4fe` | Monaco context menu hover text |
| `$forge-purple-mid` | `#7c3aed` | Monaco context menu hover backgrounds |

Purple is the brand identifier. It appears sparingly — active tab indicators, focus rings, the status bar, badges — creating deliberate punctuation against the dark canvas. Too much purple would fatigue; the restraint is intentional.

### Secondary — Olive-Green

| Token | Hex | Usage |
|---|---|---|
| `$accent-green` | `#8fb000` | Run buttons, success states, active version indicators |
| `$accent-green-hover` | ~`#729000` | Green button hover (darkened) |

Green is used exclusively for **action acceptance** — run, save, success. Never decorative.

### Text

| Token | Hex | Contrast ratio vs `#1e1e1e` | Usage |
|---|---|---|---|
| `$text-primary` | `#c8c8c8` | ~9.5:1 | Body text, active labels |
| `$text-secondary` | `#9a9a9a` | ~6.5:1 | Metadata, secondary info |
| `$text-muted` | `#6b7280` | ~4:1 | Placeholders, inactive items, labels |
| `$text-active` | `#ffffff` | 18:1 | Active/selected text (rare) |

Text hierarchy is flattened — only three text levels. We rely on size + color + weight for hierarchy rather than color alone.

### Status Colors

| Token | Hex | Usage |
|---|---|---|
| `$color-success` | `#89d185` | Running processes, checkmarks, public badges |
| `$color-warning` | `#cca700` | Warnings, slow execution, risk alerts |
| `$color-danger` | `#f44747` | Errors, kill/delete actions, close button hover |
| `$color-info` | `#a855f7` (purple) | Info diagnostics, informational indicators |

Status colors match VS Code conventions (red=error, yellow=warning, green=success) but use a warmer yellow and a softer red than the default VS Code palette.

### Borders

| Token | Hex | Usage |
|---|---|---|
| `$border` | `#3a3a3a` | All structural dividers |
| `$border-focus` | `#9333ea` (accent) | Focus rings |

Borders are subtle — 1px, medium gray. They separate without drawing attention. Focus rings use the accent purple.

### Glows

- Purple glow: `drop-shadow(0 0 6px rgba(147, 51, 234, 0.55)) drop-shadow(0 0 12px rgba(147, 51, 234, 0.2))` — applied to activity bar icons on hover and the loading logo pulse animation
- Green glow: `rgba(143, 176, 0, 0.3)` — run button hover

Glows are the one "flashy" design element. They're earned through interaction.

---

## Typography

| Font | Role | Weights |
|---|---|---|
| **Oxanium** | Heading / display | 700 (Bold), 800 (ExtraBold) |
| **Outfit** | Body / UI | 400 (Regular), 600 (SemiBold) |
| **Cascadia Code / Consolas** | Monospace / code | 400 (Regular) |

### Scale

| Size | Where |
|---|---|
| 9px | Tiny labels, column types, core counts, badge dots |
| 10px | Section titles (uppercase), timestamps, status badges |
| 11px | Sidebar tabs, form labels, breadcrumbs, kbd keys, small buttons |
| 12px | Panel body text, table data, status bar, tooltips |
| 13px | **Base UI size** (`$font-size-ui`): all default text, dropdown items, tab labels |
| 14px | Command palette input, search input, action icons |
| 16px | Section headings, shortcuts panel header |
| 2rem (32px) | Editor empty-state watermark text |

Oxanium is reserved for branding moments (watermark, window title "Mentenaz Forge"). Outfit carries the entire UI. Monospace is for code, terminal, process metrics, DB input — anywhere raw data is shown.

All UI text is `user-select: none` (global reset). Code in Monaco is selectable by design.

---

## Layout & Space

### Shell Dimensions

| Element | Size |
|---|---|
| Activity bar | `48px` wide |
| Title bar | `35px` tall |
| Status bar | `22px` tall |
| Editor / dock tabs | `40px` tall (`$tab-height`) |
| Bottom panel (default) | `200px` tall |
| Dock resize handle | `4px` |
| Sidebar panel (default) | `240px` wide |

All dock widths (left/right) default to `280px`. Bottom dock defaults to `320px`. Minimum sizes: left/right `180px`, bottom `100px`. Maximum: left/right `700px`, bottom `600px`.

### Spacing Pattern

- **Tight:** `0.25rem` (4px) — icon gaps, badge spacing, small separations
- **Base:** `0.5rem` (8px) — standard padding, button gaps
- **Relaxed:** `0.75rem` (12px) — tab padding, card padding
- **Loose:** `1rem` (16px) — panel content padding, modal padding

### Layout Engine

CSS Flexbox everywhere. The shell is a columnar flex container:
```
workspace (column, 100vh)
├── title-bar (fixed 35px)
├── body (flex: 1, row)
│   ├── activity-bar (fixed 48px)
│   ├── dock-left (resizable)
│   ├── resizer (10px)
│   ├── center (flex: 1, column)
│   │   ├── editor-area (flex: 1)
│   │   ├── resizer-h (10px)
│   │   └── dock-bottom (resizable)
│   ├── resizer (10px)
│   └── dock-right (resizable)
└── status-bar (fixed 22px)
```

The `.dockContent` container uses `overflow: hidden; min-height: 0` — this is critical for flex children to resolve `height: 100%` correctly. Each panel manages its own internal scroll.

---

## Component Patterns

### Buttons (4 tiers)

| Tier | Style | Example |
|---|---|---|
| **Primary** | `$accent-green` bg, white text, bold | Run Script, Save, Connect |
| **Secondary** | Transparent, `$border` border, `$text-muted` text | Cancel, Clear, Close |
| **Danger** | `rgba(#f44747, 0.15)` bg, `#f44747` color | Stop, Delete, Kill |
| **Accent ghost** | `rgba(#9333ea, 0.08)` bg, `#9333ea` border | Add, Open, Build |

Standard button sizing: `24–26px` height, `11–12px` font, `3px` border-radius.

### Inputs

```
height: 24–26px
background: $bg-input (#3c3c3c)
border: 1px solid $border (#3a3a3a)
border-radius: 3px
padding: 0 8px
color: $text-primary
font-family: $font-mono (for code inputs)
font-size: 11–12px
Focus: border-color → $accent (#9333ea)
```

### Labels / Section Titles

```
font-size: 10–11px
font-weight: 600–700
text-transform: uppercase
letter-spacing: 0.04–0.08em
color: $text-muted (#6b7280)
```

### Tabs (editor, dock, sidebar)

```
height: $tab-height (40px)
font-size: $font-size-ui (13px)
color: $text-muted (inactive) / $text-primary (active)
border-bottom/top: 2px solid transparent (active → $accent)
```

Editor tabs additionally show a close button (opacity 0, visible on hover) and a modified indicator (`●` dot + italic label).

### Modals / Overlays

```
backdrop: fixed, inset 0, rgba(0,0,0,0.45–0.55), z-index 500–1001
modal body: $bg-card, 1px $border, border-radius 8–10px,
  box-shadow 0 8px 32–40px rgba(0,0,0,0.4–0.45)
```

The overlay z-index stack:
- Command palette: `1000`
- Shortcuts panel: `1001`
- FixIt modal: `500`
- Context menus: `9999`

### Status Badges

```
font-size: 9–10px, font-weight: 700
text-transform: uppercase, letter-spacing: 0.05em
padding: 1px 4–6px, border-radius: 3px
```

### Panel Body (standard)

```scss
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-size: $font-size-ui;  // 13px
}
```

### Resize Handles

```
10px hotzone (transparent until hover)
Hover: $accent purple background
z-index: 20
```

---

## Dark-Specific Choices

- **No pure black backgrounds anywhere.** The deepest is `#0a0a0f` (barely-lit void) then `#0d0d0f` then `#1e1e1e`. Every layer has a tiny bit of luminance so borders remain visible.
- **`user-select: none`** globally — this is a tool, not a document. Only Monaco/code views allow selection.
- **`-webkit-app-region: drag`** on the title bar for window dragging; `no-drag` on interactive children.
- **Antialiasing:** `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale` — crisp text on dark backgrounds.
- **Scrollbars:** custom WebKit scrollbars everywhere — `4–6px` wide, transparent track, purple-thumb (`$accent`), `2px` border-radius. Thin enough not to clutter, visible enough to find.

---

## Animation

| Animation | Duration | Easing | What |
|---|---|---|---|
| `forgePulse` | 2s | ease-in-out infinite | ForgeLoader logo: scale 1→1.05, purple glow intensifies (breathing) |
| `forge-menu-fade-in` | 0.12s | ease-out | Monaco context menu: opacity 0→1, slide -4px→0 |
| `blink` | 1s | step-end infinite | Terminal cursor blink |
| `spin` | 0.6–1s | linear infinite | Loading spinners in FileTree, GitOps |
| Focus mode fade | 0.25s | ease | Chrome dims to 5% opacity |
| Transitions | 0.15s | ease | Hover states, color shifts, border changes |

Animations are subtle and functional — never decorative for its own sake.

---

## Focus Mode

Activated by `Ctrl+Shift+F`. Dismissed by `Escape`. When active:
- All chrome elements (title bar, activity bar, status bar, editor tabs, breadcrumb) fade to `opacity: 0.05; pointer-events: none`
- Only the editor content remains fully visible
- Transition: `opacity 0.25s ease`

This is the "distraction-free writing" pattern borrowed from VS Code's Zen Mode, stripped down.

---

## Theme & Customization

- Zoom: `--app-zoom` CSS custom property on `<html>`, controlled by Settings store. Range 0.5–2.0 in 0.1 steps.
- No theme switching (dark theme only). All tokens are Sass variables, not CSS custom properties, so runtime theme changes would require a full restyle.
- The `_monaco-context-menu.scss` file overrides Monaco's built-in context menu to use Forge's purple theme — applied globally since Monaco renders into its own shadow DOM.

---

## Design Token File Locations

- **All tokens:** `src/styles/_variables.scss`
- **Mixins:** `src/styles/_mixins.scss`
- **Fonts:** `src/styles/_fonts.scss`
- **Reset:** `src/styles/_reset.scss`
- **Global entry:** `src/styles/global.scss`
- **Shell layout:** `src/styles/components/_shell.scss`
- **Monaco override:** `src/styles/_monaco-context-menu.scss`
- **Module SCSS:** colocated with each component (`.module.scss`)

---

## Key Constraints

1. **No pure black.** Every surface has luminance (`#0a0a0f` minimum) to preserve border visibility.
2. **Purple is the only accent.** Green is reserved for actions, not decoration. Blue is avoided except where VS Code conventions demand it (tree selection highlight `#094771`).
3. **Text contrast is conservative.** At minimum 4:1 for muted text, ~9.5:1 for body — exceeds WCAG AA for primary/secondary text.
4. **Tab indentation** in all SCSS files (matching codebase convention).
