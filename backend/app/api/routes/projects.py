from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.schemas.project import Project
from app.services.site_data import SiteData, get_site_data

router = APIRouter(tags=["projects"])


@router.get("/projects", response_model=list[Project])
async def list_projects(site: Annotated[SiteData, Depends(get_site_data)]) -> list[Project]:
    return site.projects


@router.get("/projects/{slug}", response_model=Project)
async def get_project(slug: str, site: Annotated[SiteData, Depends(get_site_data)]) -> Project:
    project = site.get_project(slug)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project '{slug}' not found")
    return project
