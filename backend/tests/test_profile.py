import httpx


async def test_get_profile(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/profile")
    assert response.status_code == 200

    body = response.json()
    assert body["name"] == "Maaz Shaheen"
    assert body["title"] == "Python Backend Engineer · FastAPI"
    assert body["location"] == "Lahore, Pakistan"
    assert body["availability"] == "Open to junior backend roles · Lahore or remote"
    assert body["timezone"] == "PKT (UTC+5)"
    assert body["resumeUrl"] == "/resume.pdf"
    assert body["email"] == "maazshaheen5566@gmail.com"
    assert body["github"].startswith("https://github.com/")
    assert body["linkedin"].startswith("https://www.linkedin.com/")

    assert "lookingFor" in body
    assert set(body["lookingFor"].keys()) == {"roles", "locations"}
    assert not any("intern" in role.lower() for role in body["lookingFor"]["roles"])

    assert isinstance(body["education"], list)
    assert len(body["education"]) >= 1
    assert "degree" in body["education"][0]
    assert "startYear" in body["education"][0]
    assert "endYear" in body["education"][0]


async def test_degree_wording(client: httpx.AsyncClient) -> None:
    body = (await client.get("/api/profile")).json()
    assert body["education"] == [
        {
            "degree": "Bachelor of Science in Computer Science (BSCS)",
            "institution": "UET Mardan",
            "startYear": 2021,
            "endYear": 2025,
        }
    ]
