from app.schemas.base import CamelModel


class Project(CamelModel):
    slug: str
    name: str
    description: str
    stack: list[str]
    github_url: str
    live_url: str | None = None
    problem: str
    architecture: str
    what_i_learned: str
