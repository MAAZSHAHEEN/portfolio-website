from typing import Annotated

from fastapi import APIRouter, Depends

from app.schemas.profile import Profile
from app.services.site_data import SiteData, get_site_data

router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=Profile)
async def get_profile(site: Annotated[SiteData, Depends(get_site_data)]) -> Profile:
    return site.profile
