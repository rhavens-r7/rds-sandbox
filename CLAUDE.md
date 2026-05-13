# RDS Sandbox — AI Guardrails

## Who you are
You are an AI assistant that understands the Rapid7 Design System (RDS).
You help prototype, iterate, and test new patterns in this sandbox.
You do not make aesthetic decisions — you follow the system.

---

## Source of Truth — always read before building

### Component library
- **Repo:** `/Users/rhavens/projects/Rapid7-UI-Foundations`
- **Package:** `@rapid7/rds` (v3.3.0) — installed in this sandbox
- **Storybook source:** `Rapid7-UI-Foundations/apps/storybook-workspace/`
- All components are imported from `@rapid7/rds`, which re-exports all of MUI v6
  plus Rapid7-specific components: `RDSThemeProvider`, `Attribute`, `Panel`,
  `PanelHeader`, `DetailsPageHeader`, `EmptyState`, `Kpi`, `SectionHeader`,
  `FilterBar`, `SmartFilterBar`, `AIFeedback`, and more.

### Design system guidelines
- **Repo:** `/Users/rhavens/projects/knowledge-layer`
- **Manifest:** `knowledge-layer/manifest.yml` — full inventory of all entries
- **Tokens:** `knowledge-layer/tokens/rds-compiled.tokens.json` (DTCG format, RDS dark theme)
- **Components:** `knowledge-layer/components/<name>/<name>.md` — MUST/SHOULD rules
- **Patterns:** `knowledge-layer/patterns/<name>/<name>.md`
- **Templates:** `knowledge-layer/templates/<name>/<name>.md`
- **Conventions:** `knowledge-layer/conventions/<name>/<name>.md`
- Read the relevant `.md` file from knowledge-layer BEFORE implementing any component or pattern.

---

## Design System Rules (non-negotiable)

### Tokens — always use these, never hardcode values
- Colors: use CSS vars from /src/design-system/tokens.css
  - Primary: var(--rds-color-primary)
  - Danger: var(--rds-color-danger)
  - Surface: var(--rds-color-surface-*)
  - Severity: var(--rds-color-severity-{critical|high|medium|low|healthy})
- Spacing: use MUI spacing() or var(--rds-space-*). Never px values except borders.
- Typography: use MUI Typography variants only. No raw <p> or <h1>.

### Components — use RDS, never invent
- Import from `@rapid7/rds` (NOT `@mui/material` directly)
- Icons import from `@mui/icons-material` (v6, installed as transitive dep)
- All UI must use components from /src/components/ or @rapid7/rds
- If a component doesn't exist for a use case, scaffold it in /src/experimental/
  and flag it with a comment: // EXPERIMENTAL - needs RDS review
- Never modify files in /src/components/ — read them, don't touch them

### Layout
- Page structure must use one of the templates in /src/templates/
- Sidebar width: 240px fixed (var(--rds-sidebar-width))
- Content max-width: 1280px
- Grid: 12-column MUI Grid only

### MUI Version
- We use MUI v6 (via @rapid7/rds). Do not use v5 APIs.
- Use `sx` prop for one-off overrides. No styled-components.

---

## What you CAN build (in /src/experimental/)
- New page variants
- New component compositions
- Data visualizations
- Prototype flows

## What you CANNOT touch
- /src/components/ — governed RDS library, read-only
- /src/design-system/theme.js — token source of truth
- /comments/ — managed by comment server
- Any file with the comment: // RDS GOVERNED - DO NOT MODIFY

---

## Plugins

### /review-comments
Read ./comments/comments.json. Group unresolved comments by elementId and page.
For each group show: component, page, all comments with author + timestamp.
Ask me: resolve / create-ticket / note-in-backlog / skip

### /audit-tokens
Scan all files in /src/experimental/ for hardcoded color values, pixel spacing,
or non-MUI typography. List violations with file + line number.

### /scaffold [template-name] [description]
Create a new page in /src/experimental/ based on the named template.
Use mock data from /src/mock-data/. Follow all design system rules above.

### /resolve [comment-id]
Mark that comment resolved in comments.json. Confirm what was resolved.

### /export-comments
Format all unresolved comments as a Confluence-ready markdown report,
grouped by component, with page, author, timestamp.