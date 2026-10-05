import pytest

from app.core.config import Settings


def test_environment_defaults_are_production_safe(monkeypatch):
    monkeypatch.delenv("ENVIRONMENT", raising=False)
    monkeypatch.delenv("FASTAPI_ENV", raising=False)
    assert not Settings(_env_file=None).is_development
    monkeypatch.setenv("FASTAPI_ENV", "development")
    assert Settings(_env_file=None).is_development
    monkeypatch.setenv("ENVIRONMENT", "production")
    assert not Settings(_env_file=None).is_development


@pytest.mark.parametrize("path", ["/api/unknown", "/api/projects/not-a-project"])
async def test_api_not_found_never_becomes_spa_html(client, path):
    response = await client.get(path, headers={"Accept": "text/html"})
    assert response.status_code == 404
    assert response.headers["content-type"] == "application/json"


async def test_openapi_remains_available(client):
    response = await client.get("/openapi.json")
    assert response.status_code == 200
    assert "/api/profile" in response.json()["paths"]
    assert "/api/{path}" not in response.json()["paths"]
