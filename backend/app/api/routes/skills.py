from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas.skill import SkillGroup
from app.services.site_data import SiteData, get_site_data

router = APIRouter(tags=["skills"])


@router.get("/skills", response_model=list[SkillGroup])
async def get_skills(site: Annotated[SiteData, Depends(get_site_data)]) -> list[SkillGroup]:
    return site.skills
