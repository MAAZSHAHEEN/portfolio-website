from app.schemas.base import CamelModel


class SkillGroup(CamelModel):
    group: str
    items: list[str]
