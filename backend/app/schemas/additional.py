from app.schemas.base import CamelModel


class AdditionalProject(CamelModel):
    """A compact card below the case studies: no detail page, code link only."""

    id: str
    name: str
    label: str
    description: str
    stack: list[str]
    github_url: str | None = None
    note: str | None = None
