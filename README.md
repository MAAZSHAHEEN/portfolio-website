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
`http://localhost:8000` (see `frontend/vite.config.ts`), so no `VITE_API_URL`
is needed locally.

## Environment variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `ENVIRONMENT` | `development` or `production` | `development` |
| `FRONTEND_ORIGIN` | Allowed CORS origin for the frontend | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API. Leave empty locally (uses the Vite dev proxy). | - |

## Content

All personal content (bio, education, skills, projects) lives in
[`backend/app/data/site.json`](./backend/app/data/site.json).
React components render personal facts from the API - see the "Golden rule" in
[AGENTS.md](./AGENTS.md).

The title and description in `frontend/index.html` are a small, explicit
exception: static metadata is available before JavaScript runs, including to
clients that do not execute the app. Keep these two values aligned with
`site.json` when changing the profile; no build-time generator is required.
`frontend/public/resume.pdf` is still a placeholder and needs the owner's CV.

## Current functionality

- Homepage: Hero, About, Skills, Projects, Education, and Contact.
- Project detail pages at `/projects/:slug`, with separate not-found and
  load-error states and a retry action for load failures.
- Catch-all frontend 404 page, client-side section navigation, and route scrolling.
- Light/dark theme with system-preference fallback, safe optional persistence,
  responsive navigation, and reduced-motion support.
- Contact uses mailto, email copying, GitHub, and LinkedIn links.
- Read-only API: `GET /api/health`, `/api/profile`, `/api/skills`,
  `/api/projects`, and `/api/projects/{slug}`.
- Seven backend tests. No contact submission endpoint, email service,
  rate limiting, or AI chat is implemented.

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

## Deployment status

Deployment automation and hosting configuration are not included. The frontend
supports `VITE_API_URL` for a separate backend origin; the backend permits the
configured `FRONTEND_ORIGIN`. A frontend host must serve `index.html` for app
routes such as `/projects/:slug` so direct navigation works with BrowserRouter.
