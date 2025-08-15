from fastapi import APIRouter, Depends
from ..deps import get_redis
from ..providers.nager_client import fetch_countries
import json

router = APIRouter(prefix="/api", tags=["countries"])

@router.get("/countries")
async def list_countries(r = Depends(get_redis)):
    key = "countries:v1"
    cached = await r.get(key)
    if cached:
        return json.loads(cached)
    data = await fetch_countries()
    # Normalize to {code, name}
    normalized = [{"code": c["countryCode"], "name": c["name"]} for c in data]
    await r.set(key, json.dumps(normalized), ex=7*24*3600)  # 7 days
    return normalized