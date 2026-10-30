from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas.experience import Experience
from app.services.site_data import SiteData, get_site_data

router = APIRouter(tags=["experience"])


@router.get("/experience", response_model=list[Experience])
async def get_experience(site: Annotated[SiteData, Depends(get_site_data)]) -> list[Experience]:
    return site.experience
