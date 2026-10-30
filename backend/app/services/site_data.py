import json
from functools import lru_cache
from pathlib import Path

from app.schemas.additional import AdditionalProject
from app.schemas.experience import Experience
from app.schemas.profile import Profile
from app.schemas.project import Project
from app.schemas.skill import SkillGroup

SITE_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "site.json"


class SiteData:
    """In-memory, validated view of app/data/site.json - the single source of
    truth for all personal content shown on the site."""

    def __init__(self, path: Path = SITE_DATA_PATH) -> None:
        raw = json.loads(path.read_text(encoding="utf-8"))
        self.profile = Profile.model_validate(raw["profile"])
        self.skills = [SkillGroup.model_validate(group) for group in raw["skills"]]
        self.projects = [Project.model_validate(project) for project in raw["projects"]]
        self.additional_projects = [
            AdditionalProject.model_validate(item) for item in raw.get("additionalProjects", [])
        ]
        entries = [Experience.model_validate(item) for item in raw.get("experience", [])]
        # Hidden entries stay in site.json for the owner but are never served.
        self.experience = [entry for entry in entries if entry.visible]

    def get_project(self, slug: str) -> Project | None:
        return next((p for p in self.projects if p.slug == slug), None)


@lru_cache
def get_site_data() -> SiteData:
    return SiteData()
