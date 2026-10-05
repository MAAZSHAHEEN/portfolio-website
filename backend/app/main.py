from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import health, profile, projects, skills
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Portfolio API",
    description="Backend API serving validated profile, project, and skills data.",
    version="0.1.0",
)

if settings.is_development:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(health.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(skills.router, prefix="/api")


@app.api_route("/api/{path:path}", methods=["GET", "HEAD"], include_in_schema=False)
def missing_api(path: str) -> None:
    """Unknown API paths must never fall through to the React HTML shell."""
    raise HTTPException(status_code=404, detail="Not Found")


# Development uses Vite and does not require a build. Production fails early
# if its frontend distribution or SPA entrypoint is missing.
app.frontend(
    "/",
    directory=Path(__file__).resolve().parents[1] / "dist",
    fallback="index.html",
    check_dir=not settings.is_development,
)
