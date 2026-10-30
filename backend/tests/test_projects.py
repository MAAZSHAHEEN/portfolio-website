import json

import httpx

from app.services.site_data import SITE_DATA_PATH

PUBLIC_SLUGS = ["rideshare-api", "gemma-4-coding-agent", "hireloop-ai"]
REMOVED_SLUGS = ["bug-fixer", "fastapi-expense-tracker"]
FORBIDDEN_TERMS = ["expense tracker", "fastapi-expense-tracker", "beam", "searchproof"]


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
    # EC2/Nginx only as the v1 deployment the main-branch README documents.
    assert "v1 (main branch) was deployed on AWS EC2 behind Nginx" in text
    assert "194 tests passing in CI" in body["testing"]["summary"]
    assert "rideshare-v2" in body["testing"]["summary"]
    assert "systemd" not in text


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


async def test_rideshare_is_the_only_featured_case_study(client: httpx.AsyncClient) -> None:
    body = (await client.get("/api/projects")).json()
    assert [p["slug"] for p in body if p["featured"]] == ["rideshare-api"]
    rideshare = body[0]
    for key in ["diagram", "dataModel", "endpoints", "example", "statusCodes", "decisions"]:
        assert rideshare[key], key
    assert "194 tests" in rideshare["testing"]["summary"]
    assert {row["code"] for row in rideshare["statusCodes"]} >= {401, 403, 404, 409, 422}


async def test_honest_labels(client: httpx.AsyncClient) -> None:
    body = {p["slug"]: p for p in (await client.get("/api/projects")).json()}
    assert body["gemma-4-coding-agent"]["kind"] == "Competition work"
    assert body["hireloop-ai"]["kind"] == "Personal product · built with Bolt + Supabase"
    assert "until I disabled" not in json.dumps(body["hireloop-ai"])


def test_site_json_drops_unverifiable_skill() -> None:
    assert "claude" not in SITE_DATA_PATH.read_text(encoding="utf-8").lower()


async def test_repair_api_is_a_compact_additional_project(client: httpx.AsyncClient) -> None:
    body = (await client.get("/api/additional-projects")).json()
    assert len(body) == 1
    card = body[0]
    assert card["name"] == "AI Python Repair API"
    assert card["label"] == "Prototype (2026)"
    assert card["githubUrl"] == "https://github.com/MAAZSHAHEEN/bug-fixer"
    assert card["note"].startswith("Early prototype; no test suite yet.")
    assert "fastapicloud" not in json.dumps(card)
    raw = json.loads(SITE_DATA_PATH.read_text(encoding="utf-8"))
    assert "bug-fixer" not in [p["slug"] for p in raw["projects"]]


def test_rideshare_has_no_region_framing() -> None:
    raw = SITE_DATA_PATH.read_text(encoding="utf-8").lower()
    for term in ["khyber", "pakhtunkhwa", "intercity", "lahore–islamabad", "lahore-islamabad"]:
        assert term not in raw, term
    data = json.loads(SITE_DATA_PATH.read_text(encoding="utf-8"))
    rideshare = next(p for p in data["projects"] if p["slug"] == "rideshare-api")
    neutral = "a ride-sharing backend connecting drivers and passengers"
    assert neutral in rideshare["description"].lower()


def test_hireloop_build_disclosure() -> None:
    data = json.loads(SITE_DATA_PATH.read_text(encoding="utf-8"))
    hireloop = next(p for p in data["projects"] if p["slug"] == "hireloop-ai")
    sentence = "Built using Bolt.new and Supabase, with AI-assisted code generation."
    assert sentence in hireloop["description"]
    assert sentence in hireloop["role"]
    text = json.dumps(hireloop).lower()
    assert "i disabled" not in text and "my fix" not in text


def test_repair_api_is_labelled_prototype_without_demo() -> None:
    data = json.loads(SITE_DATA_PATH.read_text(encoding="utf-8"))
    repair = next(p for p in data["additionalProjects"] if p["id"] == "ai-python-repair-api")
    assert "prototype" in repair["label"].lower()
    assert "liveUrl" not in repair and "demoUrl" not in repair
    assert "no authentication" in repair["note"]
