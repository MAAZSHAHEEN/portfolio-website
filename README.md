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
| `ANTHROPIC_API_KEY` | API key for the "Ask about Maaz" chat (Phase 3) | - |
| `ANTHROPIC_MODEL` | Anthropic model id | `claude-sonnet-5-5` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USERNAME` / `SMTP_PASSWORD` / `SMTP_USE_TLS` | SMTP settings for the contact form (Phase 3) | - |
| `RESEND_API_KEY` | Alternative to SMTP for sending contact emails (Phase 3) | - |
| `CONTACT_TO_EMAIL` | Where contact form submissions are sent | `maazshaheen5566@gmail.com` |
| `CONTACT_FROM_EMAIL` | From address for outgoing contact emails | `no-reply@portfolio.local` |
| `RATE_LIMIT_CONTACT` | Rate limit for `/api/contact` | `5/hour` |
| `RATE_LIMIT_CHAT` | Rate limit for `/api/chat` | `20/hour` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API. Leave empty locally (uses the Vite dev proxy). | - |

## Content

All personal content (bio, education, skills, projects) lives in
[`backend/app/data/site.json`](./backend/app/data/site.json). The API and
frontend never hardcode personal facts - see the "Golden rule" in
[AGENTS.md](./AGENTS.md).

## Backend commands

```powershell
cd backend
uv run ruff check .        # lint
uv run ruff format .       # format
uv run pytest              # tests (added in Phase 4)
```

## Frontend commands

```powershell
cd frontend
pnpm lint            # ESLint
pnpm format          # Prettier (write)
pnpm format:check    # Prettier (check only)
pnpm build           # typecheck + production build
```

## Deployment

Deployment steps (Vercel/Netlify for the frontend, Dockerized backend on
Render/Railway/Fly.io, GitHub Actions CI) will be documented here in Phase 4.
