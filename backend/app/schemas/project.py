from typing import Literal

from app.schemas.base import CamelModel


class ProjectLink(CamelModel):
    label: str
    url: str


class ProjectImage(CamelModel):
    src: str
    alt: str
    width: int
    height: int


class DiagramNode(CamelModel):
    label: str
    detail: str
    kind: Literal["client", "service", "db", "cache"]
    connects_to: str | None = None


class Diagram(CamelModel):
    flow: list[DiagramNode]
    aside: list[DiagramNode] = []
    caption: str


class DataTable(CamelModel):
    name: str
    columns: str
    note: str | None = None


class Endpoint(CamelModel):
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"]
    path: str
    auth: bool
    summary: str


class ApiExample(CamelModel):
    title: str
    request: str
    response: str
    caption: str | None = None


class StatusCode(CamelModel):
    code: int
    meaning: str
    example: str


class Decision(CamelModel):
    title: str
    body: str


class Testing(CamelModel):
    summary: str
    items: list[str] = []
    ci_url: str | None = None
    ci_label: str | None = None


class Project(CamelModel):
    slug: str
    name: str
    kind: str
    featured: bool = False
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
    users: str | None = None
    role: str | None = None
    features: list[str] = []
    architecture: str
    diagram: Diagram | None = None
    data_model: list[DataTable] = []
    endpoints: list[Endpoint] = []
    example: ApiExample | None = None
    status_codes: list[StatusCode] = []
    decisions: list[Decision] = []
    security: list[str] = []
    testing: Testing | None = None
    deployment: list[str] = []
    limits: list[str] = []
    what_i_learned: str
