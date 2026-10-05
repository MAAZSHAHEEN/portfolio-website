# Maaz Shaheen - Portfolio

A personal portfolio site built as a monorepo: a FastAPI backend serving all
personal content from a single JSON source of truth, and a React + Vite
frontend that renders it.

See [AGENTS.md](./AGENTS.md) for stack details and project conventions.

## Project structure

```
portfolio-website/
  backend/    FastAPI app (Python, uv)
  frontend/   React + Vite app (TypeScript, pnpm)
```

## Prerequisites

- Python 3.11+
- [uv](https://docs.astral.sh/uv/)
- Node 22+
- [pnpm](https://pnpm.io/)

## Local setup

### Backend

```powershell
cd backend
uv sync
copy .env.example .env
uv run uvicorn app.main:app --reload --port 8000
```

The API is now running at http://localhost:8000, with interactive docs at
http://localhost:8000/docs.

### Frontend

In a separate terminal:

```powershell
cd frontend
pnpm install
copy .env.example .env
pnpm dev
```

The site is now running at http://localhost:5173. In development, the Vite
dev server proxies `/api/*` requests to the backend at
`http://localhost:8000` (see `frontend/vite.config.ts`), and production uses the same relative `/api/*` paths. No API hostname is needed.

## Environment variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `ENVIRONMENT` | `development` or `production`; explicitly use development locally | `production` |
| `FRONTEND_ORIGIN` | Development-only allowed CORS origin | `http://localhost:5173` |

### Frontend (`frontend/.env`)

`VITE_SITE_URL` is the actual portfolio HTTPS origin, without a path or query.
It is required for `pnpm build`; development defaults to the local Vite origin.
This is public build configuration, not a secret. Do not put API keys in Vite variables.
The frontend always calls same-origin `/api/*` endpoints.

## Content

All personal content (bio, education, skills, projects) lives in
[`backend/app/data/site.json`](./backend/app/data/site.json).
React components render personal facts from the API - see the "Golden rule" in
[AGENTS.md](./AGENTS.md).

Public metadata in `frontend/index.html` and the static social card are a
small, explicit exception: crawlers can read them before JavaScript/API
requests run. Keep the title, descriptions, Person JSON-LD, and social-card
text aligned with `site.json` when changing the profile.
The owner's CV is served from `frontend/public/resume.pdf` at `/resume.pdf`
and is copied into the production build by Vite.

## Current functionality

- Homepage: Hero, Selected Projects, About, Skills, Education, and Contact.
- Self-hosted Inter and JetBrains Mono, amber accents, technical project cards,
  categorized skill lists, and responsive light/dark surfaces.
- Project detail pages at `/projects/:slug`, with separate not-found and
  load-error states and a retry action for load failures.
- Catch-all frontend 404 page, client-side section navigation, and route scrolling.
- Light/dark theme with system-preference fallback, safe optional persistence,
  responsive navigation, and reduced-motion support.
- Contact uses mailto, email copying, GitHub, and LinkedIn links.
- Read-only API: `GET /api/health`, `/api/profile`, `/api/skills`,
  `/api/projects`, and `/api/projects/{slug}`.
- Backend tests cover API and deployment configuration. No contact submission endpoint, email service,
  rate limiting, or AI chat is implemented.

## Public metadata

`VITE_SITE_URL` supplies canonical, Open Graph, Twitter image, and Person
JSON-LD URLs in the initial built HTML. Vite also generates `robots.txt` and
`sitemap.xml` using this origin and actual project slugs from `site.json`.
No modification dates are guessed. Public assets include `og-image.png`
(1200 x 630), the portfolio favicon, and the owner-provided CV.

`RouteMetadata` updates the document title and description from API data on
project routes, restores homepage metadata on return, and adds `noindex` to
missing routes/projects. It does not treat network/server failures as 404s.
Canonical, social metadata, and structured data remain static homepage
metadata. Runtime changes do not provide separate initial HTML/social
previews for project URLs. FastAPI supplies the React shell for browser navigation
to deep routes; React handles its own unknown-route page.

## Backend commands

```powershell
cd backend
uv run ruff check .        # lint
uv run ruff format .       # format
uv run pytest              # tests
```

## Frontend commands

```powershell
cd frontend
pnpm lint            # ESLint
pnpm format          # Prettier (write)
pnpm format:check    # Prettier (check only)
pnpm exec tsc -b      # strict TypeScript checks
pnpm build           # typecheck + production build
```

## Full-stack deployment preparation

Architecture: React/Vite source in `frontend/` -> `backend/dist/` ->
FastAPI `app.frontend()` -> one FastAPI Cloud application. FastAPI 0.141.1
already supports frontend serving; its standard extra supplies the CLI.
`backend/pyproject.toml` declares `app.main:app` as the entrypoint.

### Build and test locally

From the repository root, in PowerShell:

```powershell
cd frontend
pnpm install
$env:VITE_SITE_URL = Read-Host 'Actual portfolio HTTPS origin assigned by FastAPI Cloud'
pnpm build
cd ../backend
uv sync
$env:ENVIRONMENT = 'production'
uv run uvicorn app.main:app --port 8000
```

Use only this FastAPI server to test `/`, all three project routes,
`/resume.pdf`, `/robots.txt`, `/sitemap.xml`, `/og-image.png`, API endpoints,
`/docs`, and `/openapi.json`. Browser navigation uses the `index.html`
fallback; missing asset requests return 404. Unknown `/api/*` requests
remain JSON 404s. Production startup requires the distribution and index.

For development, set `ENVIRONMENT=development` in `backend/.env` (copy the
example), or in the terminal, and retain the two-server workflow above.
`uv run fastapi dev` also recognizes the entrypoint and development mode.
No frontend build is needed to run the development API. Restore the terminal
variable to development after local production testing. CORS permits only
the configured development origin; production needs no CORS middleware.

### Future deployment (not performed yet)

Once the actual portfolio hostname is known, set `VITE_SITE_URL` to that
HTTPS origin, rebuild, then from `backend/` run:

```powershell
uv sync
uv run fastapi deploy
```

Do not deploy an old or test-origin build. The hostname is not guessed.
For validation before a hostname is assigned, `https://deployment-test.invalid`
may be used as an explicitly non-deployable test origin. It MUST be replaced
and the frontend rebuilt before upload. Production builds reject missing
origins, localhost, and the obsolete GitHub Pages hostname.

Cloud builds Python dependencies, not the frontend: always run `pnpm build`
locally before each deployment. Deploy from `backend/`, whose package contains
`pyproject.toml`, `uv.lock`, `app/` (including `site.json`), and `dist/`.
`dist/` stays gitignored but `backend/.fastapicloudignore` explicitly includes
it in Cloud uploads and excludes environments, caches, tests, and IDE files.
Do not upload `.env` files or commit Cloud credentials. Set
`ENVIRONMENT=production` in the portfolio application's Cloud environment.
No paid API keys or application secrets are required.

Create/select a new portfolio app in the available third slot only when
approved. Do not link this directory to the existing `bug-fixer` or
`rideshare-api` apps. If the hostname is assigned during initial setup,
rebuild using that assigned origin before the final deployment. No Cloud
app, deployment, or GitHub push has been performed by this preparation.

Later, after purchasing `maazshaheen.dev`, connect it in FastAPI Cloud,
set `VITE_SITE_URL=https://maazshaheen.dev`, rebuild, and redeploy. Updating a
Cloud runtime variable alone does not change static frontend metadata.
