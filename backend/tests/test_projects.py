import json

import httpx

from app.services.site_data import SITE_DATA_PATH

PUBLIC_SLUGS = ["rideshare-api", "hireloop-ai", "gemma-4-coding-agent"]
REMOVED_SLUGS = ["bug-fixer", "fastapi-expense-tracker"]
FORBIDDEN_TERMS = ["bug-fixer", "expense tracker", "fastapi-expense-tracker"]


async def test_list_projects_exactly_three_public(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/projects")
    assert response.status_code == 200

    body = response.json()
    assert [project["slug"] for project in body] == PUBLIC_SLUGS

    for project in body:
        assert project["status"]
        assert isinstance(project["stack"], list) and project["stack"]
        extra = [item["url"] for item in project["links"]]
        for link in [project["githubUrl"], project["liveUrl"], *extra]:
            assert link is None or link.startswith("https://")


async def test_rideshare_is_v2_branch_without_unverified_hosting(
    client: httpx.AsyncClient,
) -> None:
    response = await client.get("/api/projects/rideshare-api")
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "RideShare API v2"
    assert body["githubUrl"].endswith("/rideshare-api/tree/rideshare-v2")
    assert body["liveUrl"] == "https://rideshare-api.fastapicloud.dev/docs"
    text = json.dumps(body)
    assert "EC2" not in text and "Nginx" not in text


async def test_projects_without_public_repo(client: httpx.AsyncClient) -> None:
    for slug in ["hireloop-ai", "gemma-4-coding-agent"]:
        response = await client.get(f"/api/projects/{slug}")
        assert response.status_code == 200
        assert response.json()["githubUrl"] is None


async def test_removed_projects_are_gone(client: httpx.AsyncClient) -> None:
    for slug in REMOVED_SLUGS:
        response = await client.get(f"/api/projects/{slug}")
        assert response.status_code == 404


def test_site_json_contains_no_removed_projects() -> None:
    raw = SITE_DATA_PATH.read_text(encoding="utf-8").lower()
    for term in FORBIDDEN_TERMS:
        assert term not in raw, term


async def test_get_project_not_found(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/projects/does-not-exist")
    assert response.status_code == 404
