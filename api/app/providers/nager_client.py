from typing import TypedDict, List
import httpx
from datetime import datetime

NAGER_BASE = "https://date.nager.at"

class NagerCountry(TypedDict):
    countryCode: str
    name: str

class NagerHoliday(TypedDict):
    date: str            # "YYYY-MM-DD"
    localName: str
    name: str
    countryCode: str
    fixed: bool
    global_: bool | None  # key is "global" in API; we map to global_ to avoid keyword
    counties: list[str] | None
    launchYear: int | None
    types: list[str] | None

async def fetch_countries() -> list[NagerCountry]:
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(f"{NAGER_BASE}/api/v3/AvailableCountries")
        r.raise_for_status()
        return r.json()

async def fetch_public_holidays(year: int, country_code: str) -> list[NagerHoliday]:
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.get(f"{NAGER_BASE}/api/v3/PublicHolidays/{year}/{country_code}")
        r.raise_for_status()
        data = r.json()
        # normalize "global" -> "global_"
        for h in data:
            if "global" in h:
                h["global_"] = h["global"]
        return data