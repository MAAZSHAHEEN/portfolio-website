from functools import lru_cache

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables / .env file."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = Field(
        default="production", validation_alias=AliasChoices("ENVIRONMENT", "FASTAPI_ENV")
    )
    frontend_origin: str = "http://localhost:5173"

    # Public origin every canonical URL points at.
    canonical_origin: str = "https://maazshaheen.tech"
    # Legacy hosts that should 301 to canonical_origin. Opt-in: enable only after
    # confirming the custom domain does not reach the app with one of these Host
    # headers, otherwise the redirect would loop.
    legacy_host_redirect: bool = False
    legacy_hosts: list[str] = ["maaz-shaheen-portfolio.fastapicloud.dev"]

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    return Settings()
