from app.schemas.base import CamelModel


class ProjectLink(CamelModel):
    label: str
    url: str


class ProjectImage(CamelModel):
    src: str
    alt: str
    width: int
    height: int


class Project(CamelModel):
    slug: str
    name: str
    status: str
    description: str
    stack: list[str]
    github_url: str | None = None
    live_url: str | None = None
    live_label: str | None = None
    links: list[ProjectLink] = []
    image: ProjectImage | None = None
    highlights: list[str] = []
    problem: str
    architecture: str
    what_i_learned: str
