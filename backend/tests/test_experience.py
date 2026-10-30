import json

import httpx

from app.services.site_data import SITE_DATA_PATH, SiteData


async def test_no_experience_is_published(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/experience")
    assert response.status_code == 200
    assert response.json() == []
    assert "al sarih" not in SITE_DATA_PATH.read_text(encoding="utf-8").lower()


def test_experience_schema_still_filters_hidden_entries(tmp_path) -> None:
    raw = json.loads(SITE_DATA_PATH.read_text(encoding="utf-8"))
    raw["experience"] = [
        {"role": "Role", "company": "Shown", "start": "2025", "end": "Present"},
        {"role": "Role", "company": "Hidden", "start": "2025", "end": "Present", "visible": False},
    ]
    path = tmp_path / "site.json"
    path.write_text(json.dumps(raw), encoding="utf-8")
    assert [entry.company for entry in SiteData(path).experience] == ["Shown"]
