import re
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse, RedirectResponse, Response

from app.api.routes import experience, health, profile, projects, skills
from app.core.config import get_settings

settings = get_settings()
DIST_DIR = Path(__file__).resolve().parents[1] / "dist"
SLUG_RE = re.compile(r"^[a-z0-9-]+$")

# Project pages that were public on the old site. They permanently redirect to the
# project list so old links, bookmarks and search results keep working.
REMOVED_PROJECT_REDIRECTS = {
    "bug-fixer": "/#additional-projects",
    "fastapi-expense-tracker": "/#projects",
}

# Baseline security headers for every response. The CSP only restricts framing,
# plugins, <base> and form targets; it deliberately leaves script/style sources
# open because the prerendered pages use inline bootstrap scripts.
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": (
        "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'"
    ),
    "Permissions-Policy": (
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
    ),
}
IMMUTABLE = "public, max-age=31536000, immutable"
REVALIDATE = "no-cache"


def cache_policy(path: str, content_type: str) -> str | None:
    """Cache-Control for a response, or None to leave the framework default."""
    if path.startswith("/assets/"):
        # Vite fingerprints everything under /assets, so it can be cached forever.
        return IMMUTABLE
    if path.startswith("/api/") or content_type.startswith("text/html"):
        return REVALIDATE
    if path in {"/resume.pdf", "/robots.txt", "/sitemap.xml"}:
        return "public, max-age=3600"
    if path.startswith("/images/") or path in {"/og-image.png", "/favicon.svg"}:
        return "public, max-age=86400"
    return None


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


@app.middleware("http")
async def response_headers(request: Request, call_next):
    """Security headers on every response and an explicit cache policy per path."""
    response = await call_next(request)
    for name, value in SECURITY_HEADERS.items():
        response.headers.setdefault(name, value)
    policy = cache_policy(request.url.path, response.headers.get("content-type", ""))
    if policy == IMMUTABLE and response.status_code >= 400:
        policy = REVALIDATE  # never pin a missing asset in caches
    if policy:
        response.headers["Cache-Control"] = policy
    return response


app.include_router(health.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(skills.router, prefix="/api")
app.include_router(experience.router, prefix="/api")


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
@app.api_route("/projects/{slug}/", methods=["GET", "HEAD"], include_in_schema=False)
def prerendered_project(slug: str) -> Response:
    """Serve the build-time prerendered case study without a trailing-slash redirect."""
    if slug in REMOVED_PROJECT_REDIRECTS:
        return RedirectResponse(REMOVED_PROJECT_REDIRECTS[slug], status_code=301)
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
