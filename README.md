# RDS Sandbox

A prototyping environment for the [Rapid7 Design System (RDS)](https://github.com/rapid7/Rapid7-UI-Foundations). Used to build, iterate, and review new component patterns and page templates against real product contexts before they land in the governed library.

## What's in here

Three security-domain page templates built with `@rapid7/rds` v3.3.0:

| Page | Template | Key RDS components |
|---|---|---|
| Security Dashboard | `DashboardTemplate` | `Kpi`, `SectionHeader`, `LinearProgress` |
| Detections | `ListingTemplate` | `SectionHeader`, `Table`, `Chip`, `TextField`, `Select` |
| Detection Details | `DetailsTemplate` | `DetailsPageHeader`, `Paper`, `LinearProgress` |

All pages are wired to the same mock data (`src/mock-data/`) and use no hardcoded color or spacing values — everything resolves through `RDSThemeProvider`.

## Getting started

```bash
# Install deps (requires access to the Rapid7 internal Nexus registry for @rapid7/* packages)
npm install

# Start the UI (port 5173) and comment server (port 3001) in separate terminals
npm run dev
node comment-server.js
```

Open [http://localhost:5173](http://localhost:5173).

## Theme toggle

The sidebar exposes four theme options via `RDSThemeProvider`:

- Original Dark *(default)*
- Original Light
- Callisto Dark
- Callisto Light

## Template architecture

Templates are pure layout shells with named slots — no data, no business logic. Pages compose content into those slots.

```
src/templates/
├── PageLayout.jsx          # App shell — sidebar + main + optional panel
├── DashboardTemplate.jsx   # header / kpiRow / cards
├── ListingTemplate.jsx     # header / filterBar / toolbar / dataView / pagination
└── DetailsTemplate.jsx     # header / summary (8col) / sections (4col) / panel
```

Page implementations sit alongside their templates and import only their scaffold:

```
src/templates/
├── SecurityDashboard.jsx   # uses DashboardTemplate
├── DetectionListing.jsx    # uses ListingTemplate
└── DetectionDetails.jsx    # uses DetailsTemplate
```

New prototypes go in `src/experimental/` and should be flagged with `// EXPERIMENTAL - needs RDS review`.

## Comment overlay

The sandbox includes a lightweight annotation tool for design reviews. Click the **Comment** button (bottom-right) to drop a pin anywhere on the page. The comment server persists pins to `comments/comments.json`.

**API** (port 3001):

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/comments?page=&elementId=` | List comments |
| `POST` | `/api/comments` | Create a comment |
| `PATCH` | `/api/comments/:id/resolve` | Resolve a comment |
| `POST` | `/api/comments/:id/reply` | Add a reply |

## Design system source of truth

| Resource | Location |
|---|---|
| Component library | `/Users/rhavens/projects/Rapid7-UI-Foundations` (`@rapid7/rds`) |
| Design guidelines | `/Users/rhavens/projects/knowledge-layer` |
| Token file | `knowledge-layer/tokens/rds-compiled.tokens.json` |
| Component rules | `knowledge-layer/components/<name>/<name>.md` |

## Rules

- Import components from `@rapid7/rds`, not `@mui/material` directly
- Import icons from `@mui/icons-material`
- All colors via MUI `sx` palette paths or `useTheme()` — no hardcoded hex values
- All spacing via MUI `spacing()` — no raw `px` values except borders
- Do not modify files in `src/components/` or `src/design-system/theme.js`
