from pydantic import EmailStr, Field

from app.schemas.base import CamelModel


class ContactRequest(CamelModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=1, max_length=2000)
    # Honeypot field: real users never fill this in. Bots that autofill every
    # field will trip it, and the submission is silently dropped.
    company: str = Field(default="", max_length=200)


class ContactResponse(CamelModel):
    success: bool
    detail: str
