import re
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, RedirectResponse, Response

from app.api.routes import health, profile, projects, skills
from app.core.config import get_settings

settings = get_settings()
DIST_DIR = Path(__file__).resolve().parents[1] / "dist"
SLUG_RE = re.compile(r"^[a-z0-9-]+$")

app = FastAPI(
    title="Portfolio API",
    description="Backend API serving validated profile, project, and skills data.",
    version="0.2.0",
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

if settings.is_development:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.middleware("http")
async def legacy_host_redirect(request: Request, call_next):
    """Permanently redirect legacy hosts to the canonical origin (opt-in)."""
    if settings.legacy_host_redirect:
        host = request.headers.get("host", "").split(":")[0].lower()
        canonical_host = settings.canonical_origin.split("://", 1)[-1].lower()
        if host in settings.legacy_hosts and host != canonical_host:
            target = settings.canonical_origin.rstrip("/") + request.url.path
            if request.url.query:
                target += f"?{request.url.query}"
            return RedirectResponse(target, status_code=301)
    return await call_next(request)


app.include_router(health.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(skills.router, prefix="/api")


@app.api_route("/api/{path:path}", methods=["GET", "HEAD"], include_in_schema=False)
def missing_api(path: str) -> None:
    """Unknown API paths must never fall through to the React HTML shell."""
    raise HTTPException(status_code=404, detail="Not Found")


def _not_found_page() -> Response:
    page = DIST_DIR / "404.html"
    if page.is_file():
        return FileResponse(page, status_code=404, media_type="text/html")
    raise HTTPException(status_code=404, detail="Not Found")


@app.api_route("/projects/{slug}", methods=["GET", "HEAD"], include_in_schema=False)
def prerendered_project(slug: str) -> Response:
    """Serve the build-time prerendered case study without a trailing-slash redirect."""
    page = DIST_DIR / "projects" / slug / "index.html"
    if SLUG_RE.fullmatch(slug) and page.is_file():
        return FileResponse(page, media_type="text/html")
    return _not_found_page()


# Development uses Vite and does not require a build. Production fails early
# if its frontend distribution or prerendered pages are missing. Unknown paths
# get the prerendered 404 page with a real 404 status.
app.frontend(
    "/",
    directory=DIST_DIR,
    fallback="404.html",
    check_dir=not settings.is_development,
)
