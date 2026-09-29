import httpx


async def test_list_projects(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/projects")
    assert response.status_code == 200

    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 3

    slugs = {project["slug"] for project in body}
    assert slugs == {"bug-fixer", "fastapi-expense-tracker", "rideshare-api"}

    for project in body:
        assert project["githubUrl"].startswith("https://github.com/")
        assert isinstance(project["stack"], list)
        assert len(project["stack"]) >= 1


async def test_get_project_by_slug(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/projects/rideshare-api")
    assert response.status_code == 200

    body = response.json()
    assert body["slug"] == "rideshare-api"
    assert body["name"] == "RideShare API"
    assert body["liveUrl"] == "https://rideshare-api.fastapicloud.dev/docs"


async def test_get_project_with_no_live_url(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/projects/bug-fixer")
    assert response.status_code == 200
    assert response.json()["liveUrl"] is None


async def test_get_project_not_found(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/projects/does-not-exist")
    assert response.status_code == 404
