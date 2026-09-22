import os
import re

import httpx
from fastapi import FastAPI, HTTPException

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    jira_url: str
    jira_email: str
    jira_token: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()

JIRA_URL = settings.jira_url
JIRA_EMAIL = settings.jira_email
JIRA_TOKEN = settings.jira_token

app = FastAPI()

ISSUE_KEY_PATTERN = re.compile(r"^[A-Z][A-Z0-9_]*-\d+$")


@app.get("/api/health")
async def health():
    return {"status": "ok"}


async def jira_search(jql: str) -> list[dict]:
    issues: list[dict] = []
    next_page_token: str | None = None

    async with httpx.AsyncClient(
        base_url=JIRA_URL,
        auth=(JIRA_EMAIL, JIRA_TOKEN),
        timeout=10,
    ) as client:
        while True:
            body = {
                "jql": jql,
                "fields": [
                    "summary",
                    "status",
                    "issuetype",
                    "parent",
                    "assignee",
                    "labels",
                    "original_estimate",
                    "timespent",
                    "timetracking",
                    # sprint
                    "customfield_10020"
                ],
                "maxResults": 100,
            }

            if next_page_token is not None:
                body["nextPageToken"] = next_page_token

            response = await client.post(
                "/rest/api/3/search/jql",
                json=body,
            )

            response.raise_for_status()

            data = response.json()

            issues.extend(data["issues"])

            if data.get("isLast", True):
                break

            next_page_token = data["nextPageToken"]

    return issues


@app.get("/api/hierarchy/{root_key}")
async def get_hierarchy(root_key: str):
    root_key = root_key.upper()

    if not ISSUE_KEY_PATTERN.match(root_key):
        raise HTTPException(
            status_code=400,
            detail="Invalid Jira issue key",
        )

    root_results = await jira_search(
        f'key = "{root_key}" AND statusCategory != "done"'
    )

    if not root_results:
        raise HTTPException(
            status_code=404,
            detail="Issue not found",
        )

    root = root_results[0]

    issues = {
        root["key"]: root,
    }

    frontier = [root["key"]]

    while frontier:
        parent_keys = ", ".join(
            f'"{key}"'
            for key in frontier
        )

        children = await jira_search(
            f"parent in ({parent_keys})"
        )

        frontier = []

        for child in children:
            if child["key"] in issues:
                continue

            issues[child["key"]] = child
            frontier.append(child["key"])

    return build_tree(root["key"], issues)


def build_tree(
    key: str,
    issues: dict[str, dict],
) -> dict:
    issue = issues[key]

    children = [
        child
        for child in issues.values()
        if child["fields"].get("parent", {}).get("key") == key
    ]

    return {
        "key": key,
        "summary": issue["fields"]["summary"],
        "status": issue["fields"]["status"],
        "issueType": issue["fields"]["issuetype"]["name"],
        "labels": issue["fields"]["labels"],
        "timetracking": issue["fields"].get("timetracking"),
        "sprint": issue["fields"].get("customfield_10020")[0] if issue["fields"].get("customfield_10020") else None,
        "assignee": issue["fields"]["assignee"],
        "children": [
            build_tree(child["key"], issues)
            for child in children
        ],
    }