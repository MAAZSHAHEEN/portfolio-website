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


@pytest.mark.parametrize("slug", ["not-a-project", "..%2f..%2fetc"])
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


@pytest.mark.parametrize(
    ("path", "target"),
    [
        ("/projects/bug-fixer", "/#additional-projects"),
        ("/projects/bug-fixer/", "/#additional-projects"),
        ("/projects/fastapi-expense-tracker", "/#projects"),
    ],
)
async def test_removed_project_slugs_redirect_home(client, dist, path, target):
    response = await client.get(path)
    assert response.status_code == 301
    assert response.headers["location"] == target


async def test_security_headers_on_html_api_and_errors(client, dist):
    for path in ["/projects/rideshare-api", "/api/health", "/does-not-exist"]:
        response = await client.get(path)
        assert response.headers["x-content-type-options"] == "nosniff"
        assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
        assert response.headers["x-frame-options"] == "DENY"
        assert "frame-ancestors 'none'" in response.headers["content-security-policy"]
        assert "camera=()" in response.headers["permissions-policy"]


async def test_cache_policy(client, dist):
    page = await client.get("/projects/rideshare-api")
    assert page.headers["cache-control"] == "no-cache"
    missing = await client.get("/assets/missing-000.js")
    assert missing.status_code == 404
    assert "immutable" not in missing.headers.get("cache-control", "")
    api = await client.get("/api/health")
    assert api.headers["cache-control"] == "no-cache"


def test_cache_policy_static_files():
    assert main.cache_policy("/assets/index-abc123.js", "text/javascript") == main.IMMUTABLE
    assert main.cache_policy("/resume.pdf", "application/pdf") == "public, max-age=3600"
    assert main.cache_policy("/images/projects/x.webp", "image/webp") == "public, max-age=86400"
    assert main.cache_policy("/", "text/html; charset=utf-8") == "no-cache"
