import httpx


async def test_get_profile(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/profile")
    assert response.status_code == 200

    body = response.json()
    assert body["name"] == "Maaz Shaheen"
    assert body["title"] == "Python / FastAPI Backend Developer"
    assert body["email"] == "maazshaheen5566@gmail.com"
    assert body["github"].startswith("https://github.com/")
    assert body["linkedin"].startswith("https://www.linkedin.com/")

    assert "lookingFor" in body
    assert set(body["lookingFor"].keys()) == {"roles", "fields", "locations"}

    assert isinstance(body["education"], list)
    assert len(body["education"]) >= 1
    assert "degree" in body["education"][0]
    assert "startYear" in body["education"][0]
    assert "endYear" in body["education"][0]
