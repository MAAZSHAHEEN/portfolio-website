from typing import cast

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.routes import contact, health, profile, projects, skills
from app.core.config import get_settings
from app.core.limiter import limiter

settings = get_settings()

app = FastAPI(
    title="Maaz Shaheen - Portfolio API",
    description="Backend API serving profile, project, and skills data for maazshaheen.dev",
    version="0.1.0",
)

app.state.limiter = limiter


async def _handle_rate_limit_exceeded(request: Request, exc: Exception) -> Response:
    """Adapts slowapi's handler to FastAPI's generic ExceptionHandler signature."""
    return _rate_limit_exceeded_handler(request, cast(RateLimitExceeded, exc))


app.add_exception_handler(RateLimitExceeded, _handle_rate_limit_exceeded)

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
app.include_router(contact.router, prefix="/api")
