from typing import TypedDict
from datetime import date
from ..providers.nager_client import fetch_public_holidays

class Holiday(TypedDict):
    date: str        # YYYY-MM-DD
    name: str
    localName: str

async def get_holidays(year: int, country: str) -> list[Holiday]:
    # For now, just Nager. Later: branch by settings.provider and add adapters.
    raw = await fetch_public_holidays(year, country)
    return [{"date": h["date"], "name": h["name"], "localName": h["localName"]} for h in raw]