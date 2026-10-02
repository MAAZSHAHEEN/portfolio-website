# AGENTS.md

Project rules and conventions for the Maaz Shaheen portfolio monorepo. Read
this before making changes.

## Golden rule: content lives in one place

**All personal content (profile, bio, education, skills, projects) lives in
`backend/app/data/site.json`.** Never hardcode names, bios, project
descriptions, links, or any other personal facts directly in frontend
components or backend route handlers. The frontend only ever renders data it
fetched from the API; the API only ever serves data validated from
`site.json`. The only personal-text exception is the static title/description
in `frontend/index.html`, available before JavaScript/API requests run. Keep
those values aligned with the profile when editing it. The public CV is a
separate owner-provided asset (currently a placeholder).

If a piece of content is genuinely unknown or needs the site owner's input,
add a short, honest placeholder in `site.json` and mark it with a
`TODO(maaz): ...` comment/value so it's easy to find and fix later. Never
invent metrics, employers, users, awards, or live demo links that aren't
explicitly provided.

## Stack

**Backend** - `backend/`
- Python >=3.11, FastAPI, Uvicorn, Pydantic v2, pydantic-settings
- Package manager: `uv` (`pyproject.toml` + `uv.lock`)
- Ruff for linting/formatting, pytest + httpx for tests
- Layout:
  - `app/main.py` - FastAPI app instance, CORS, router mounting
  - `app/api/routes/` - one module per resource
  - `app/core/` - settings (`config.py`)
  - `app/schemas/` - Pydantic models (camelCase in/out via `CamelModel`)
  - `app/services/` - cached, Pydantic-validated site data loading
  - `app/data/site.json` - the single source of truth for content

**Frontend** - `frontend/`
- React 19 + Vite + TypeScript (strict mode)
- Tailwind CSS v4 (`@tailwindcss/vite`) + shadcn/ui (Base UI primitives)
- Motion (Framer Motion) for animation, respecting `prefers-reduced-motion`
- TanStack Query for server state, React Router for routing
- lucide-react for general icons (brand icons like GitHub/LinkedIn are local
  SVGs in `src/components/icons.tsx` since lucide-react v1 dropped brand icons)
- Self-hosted fonts via Fontsource: Fraunces (display) + Inter (body)
- ESLint + Prettier for linting/formatting
- Path alias `@/*` -> `src/*`
- Dev proxy: `/api` -> `http://localhost:8000` (see `vite.config.ts`)

## Conventions

- Backend schemas use `CamelModel` (see `app/schemas/base.py`) so
  `site.json` (camelCase) and JSON API responses stay camelCase, matching
  idiomatic TypeScript on the frontend.
- New read-only content endpoints should follow the existing pattern in
  `app/api/routes/`: a thin route that depends on `get_site_data()` and
  returns a Pydantic model/list.
- Frontend data fetching goes through `src/lib/api.ts` (typed fetch client)
  and `src/lib/queries.ts` (TanStack Query hooks) - components should not call
  `fetch` directly.
- Keep components small and focused; shared UI primitives go in
  `src/components/ui/` (shadcn), layout chrome in `src/components/layout/`,
  page sections in `src/components/sections/`.
- Never commit `.env` files. Keep `.env.example` up to date whenever a new
  environment variable is introduced.
- Run `ruff check . && ruff format .` in `backend/` and
  `pnpm lint && pnpm format` in `frontend/` before committing.

## Design tokens (frontend)

Defined as CSS variables in `src/index.css`:
- Light theme background `#f6f4f0`, dark theme background `#0d0d0f`.
- Brand accent `#e8834a` (`--brand`) for filled buttons/badges, always paired
  with dark text (`--brand-foreground: #1c1917`) for contrast.
- Accent text/links (`--brand-link`) use a darker amber `#b84c12` on the light
  theme (AA contrast on `#f6f4f0`) and `#e8834a` on the dark theme.
- Fonts: `--font-display` (Fraunces) for headings, `--font-sans` (Inter) for
  body text.

## Current scope and process

Implemented: read-only profile/skills/project/health APIs, all homepage
sections, project detail pages, catch-all frontend 404, safe theme storage,
route/hash scrolling, and backend tests. Contact uses email/social links.
There is no contact form endpoint, email service, rate limiting, AI chat,
CI/CD, Docker, or deployment configuration.

Work in focused phases. Check in with the owner before expanding scope.
Commit or push only when the owner requests it. Validate backend tests,
Ruff lint/format checks, frontend lint, strict TypeScript checks, and the
production build before handing off changes.
