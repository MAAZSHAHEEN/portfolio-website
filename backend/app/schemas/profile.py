from app.schemas.base import CamelModel


class Education(CamelModel):
    degree: str
    institution: str
    start_year: int
    end_year: int


class LookingFor(CamelModel):
    roles: list[str]
    locations: list[str]


class Profile(CamelModel):
    name: str
    title: str
    tagline: str
    bio: str
    location: str
    timezone: str
    availability: str
    email: str
    github: str
    linkedin: str
    resume_url: str
    resume_updated: str | None = None
    looking_for: LookingFor
    education: list[Education]
