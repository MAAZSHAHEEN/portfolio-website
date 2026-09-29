from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables / .env file."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # General
    environment: str = "development"
    frontend_origin: str = "http://localhost:5173"

    # Anthropic (AI chat)
    anthropic_api_key: str | None = None
    anthropic_model: str = "claude-sonnet-5-5"

    # Contact form - SMTP
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_use_tls: bool = True

    # Contact form - Resend (alternative to SMTP)
    resend_api_key: str | None = None

    # Contact form - where messages get sent
    contact_to_email: str = "maazshaheen5566@gmail.com"
    contact_from_email: str = "no-reply@portfolio.local"

    # Rate limiting
    rate_limit_contact: str = "5/hour"
    rate_limit_chat: str = "20/hour"

    @property
    def is_development(self) -> bool:
        return self.environment.lower() == "development"

    @property
    def email_configured(self) -> bool:
        return bool(self.resend_api_key) or bool(
            self.smtp_host and self.smtp_username and self.smtp_password
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()
