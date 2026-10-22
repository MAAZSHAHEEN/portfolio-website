import httpx
import pytest
from httpx import ASGITransport

from app import main


@pytest.fixture
def dist(tmp_path, monkeypatch):
    (tmp_path / "projects" / "rideshare-api").mkdir(parents=True)
    (tmp_path / "projects" / "rideshare-api" / "index.html").write_text("<h1>RideShare</h1>")
    (tmp_path / "404.html").write_text("<h1>Not found</h1>")
    monkeypatch.setattr(main, "DIST_DIR", tmp_path)
    return tmp_path


async def test_prerendered_project_served_without_redirect(client, dist):
    response = await client.get("/projects/rideshare-api")
    assert response.status_code == 200
    assert "RideShare" in response.text


@pytest.mark.parametrize("slug", ["bug-fixer", "fastapi-expense-tracker", "..%2f..%2fetc"])
async def test_unknown_project_gets_real_404(client, dist, slug):
    response = await client.get(f"/projects/{slug}")
    assert response.status_code == 404


@pytest.mark.parametrize(
    ("enabled", "host", "status"),
    [
        (True, "maaz-shaheen-portfolio.fastapicloud.dev", 301),
        (True, "maazshaheen.tech", 200),
        (False, "maaz-shaheen-portfolio.fastapicloud.dev", 200),
    ],
)
async def test_legacy_host_redirect(monkeypatch, enabled, host, status):
    monkeypatch.setattr(main.settings, "legacy_host_redirect", enabled)
    transport = ASGITransport(app=main.app)
    async with httpx.AsyncClient(transport=transport, base_url=f"http://{host}") as ac:
        response = await ac.get("/api/health?x=1")
    assert response.status_code == status
    if status == 301:
        assert response.headers["location"] == "https://maazshaheen.tech/api/health?x=1"
