from app.schemas.base import CamelModel


class Education(CamelModel):
    degree: str
    institution: str
    start_year: int
    end_year: int


class LookingFor(CamelModel):
    roles: list[str]
    fields: list[str]
    locations: list[str]


class Profile(CamelModel):
    name: str
    title: str
    tagline: str
    bio: str
    location: str
    email: str
    github: str
    linkedin: str
    resume_url: str
    looking_for: LookingFor
    education: list[Education]
