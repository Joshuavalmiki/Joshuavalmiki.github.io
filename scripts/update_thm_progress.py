#!/usr/bin/env python3
"""Fetch only publicly exposed TryHackMe profile data. No login/session cookies."""
import json, os, sys
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from pathlib import Path

USERNAME = os.environ.get("THM_USERNAME", "LOSERxTOBI")
BASE = "https://tryhackme.com/api/v2/public-profile"

def get_json(url):
    req = Request(url, headers={"User-Agent": "LOSERxTOBI-public-progress-tracker/1.0", "Accept": "application/json"})
    try:
        with urlopen(req, timeout=25) as response:
            if response.status != 200:
                raise RuntimeError(f"TryHackMe returned HTTP {response.status}")
            payload = json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"TryHackMe public endpoint could not be read: {exc}") from exc
    if not isinstance(payload, (dict, list)):
        raise RuntimeError("Unexpected response format from TryHackMe; refusing to write a snapshot.")
    if isinstance(payload, dict) and any(k in payload for k in ("error", "errors")) and not any(k in payload for k in ("data", "user", "profile", "username")):
        raise RuntimeError("TryHackMe returned an error payload; refusing to record it as progress.")
    return payload

def unwrap(obj):
    for key in ("data", "profile", "user", "result"):
        if isinstance(obj, dict) and isinstance(obj.get(key), dict):
            obj = obj[key]
    return obj if isinstance(obj, dict) else {}

def pick(obj, keys):
    for key in keys:
        if key in obj and obj[key] is not None and isinstance(obj[key], (str, int, float, bool)):
            return obj[key]
    return None

def main():
    profile_url = BASE + "?" + urlencode({"username": USERNAME})
    rooms_url = BASE + "/completed-rooms?" + urlencode({"username": USERNAME, "limit": 100, "page": 1})
    profile_payload = get_json(profile_url)
    rooms_payload = get_json(rooms_url)
    profile = unwrap(profile_payload)
    rooms_obj = rooms_payload if isinstance(rooms_payload, dict) else {}
    for key in ("data", "result"):
        if isinstance(rooms_obj.get(key), dict):
            rooms_obj = rooms_obj[key]
    docs = rooms_obj.get("docs") or rooms_obj.get("rooms") or rooms_obj.get("completedRooms")
    if not isinstance(docs, list):
        raise RuntimeError("Completed-room response did not contain a recognised room list; refusing to guess.")
    total = rooms_obj.get("totalDocs")
    if not isinstance(total, int):
        total = None
    fields = {
        "points": pick(profile, ("totalPoints", "totalPoint", "points", "score")),
        "rank": pick(profile, ("rank", "globalRank")),
        "level": pick(profile, ("level", "userLevel")),
        "streak": pick(profile, ("streak", "currentStreak")),
        "badges_count": len(profile["badges"]) if isinstance(profile.get("badges"), list) else None,
    }
    fields = {k: v for k, v in fields.items() if v is not None}
    snapshot = {
        "username": USERNAME,
        "profile_url": f"https://tryhackme.com/p/{USERNAME}",
        "checked_at_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source": "TryHackMe public profile endpoints (unofficial/unsupported)",
        "public_profile_retrieved": True,
        "public_stats": fields,
        "completed_rooms_visible_on_first_page": len(docs),
        "completed_rooms_total": total,
        "completed_rooms_total_is_exact": total is not None,
        "learning_path_percentages": None,
        "note": "Private learning-path percentages are not inferred from public profile data."
    }
    out = Path("tryhackme-progress.json")
    out.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    day = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    history = Path("PROGRESS-HISTORY.md")
    if not history.exists():
        history.write_text("# TryHackMe Public Progress History\n\nDaily snapshots of publicly retrievable account-level stats. Learning-path percentages are not available from this public tracker.\n\n| Checked (UTC) | Points | Rank | Level | Badges | Completed rooms total |\n|---|---:|---:|---:|---:|---:|\n", encoding="utf-8")
    stats = snapshot["public_stats"]
    values = [stats.get("points", "—"), stats.get("rank", "—"), stats.get("level", "—"), stats.get("badges_count", "—"), total if total is not None else "unknown"]
    row = f"| {snapshot['checked_at_utc']} | " + " | ".join(map(str, values)) + " |\n"
    old = history.read_text(encoding="utf-8")
    if day not in old:
        history.write_text(old + row, encoding="utf-8")
    print(json.dumps(snapshot, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
