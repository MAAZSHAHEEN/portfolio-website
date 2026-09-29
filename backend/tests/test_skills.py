import httpx


async def test_get_skills(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/skills")
    assert response.status_code == 200

    body = response.json()
    assert isinstance(body, list)
    assert len(body) >= 1

    groups = {group["group"] for group in body}
    assert "Backend" in groups

    for group in body:
        assert isinstance(group["items"], list)
        assert len(group["items"]) >= 1
