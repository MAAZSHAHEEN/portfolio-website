from app.schemas.base import CamelModel


class Experience(CamelModel):
    """One role. Entries with ``visible: false`` stay in site.json but are never served."""

    role: str
    company: str
    start: str
    end: str
    location: str | None = None
    summary: str | None = None
    highlights: list[str] = []
    visible: bool = True
