import httpx
import pytest
from httpx import ASGITransport

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def test_submit_contact_success(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/contact",
        json={"name": "Jane Doe", "email": "jane@example.com", "message": "Hello there!"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True


async def test_submit_contact_honeypot_is_silently_dropped(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/contact",
        json={
            "name": "Bot",
            "email": "bot@example.com",
            "message": "spam",
            "company": "I am a bot",
        },
    )
    assert response.status_code == 200
    assert response.json()["success"] is True


async def test_submit_contact_rejects_invalid_email(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/contact",
        json={"name": "Jane Doe", "email": "not-an-email", "message": "Hello there!"},
    )
    assert response.status_code == 422
