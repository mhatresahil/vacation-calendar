from fastapi import APIRouter, Query, Depends, HTTPException
from ..deps import get_redis
from ..services.holiday_service import get_holidays
from ..services.calendar_service import build_month_payload, quarter_to_months
import json

router = APIRouter(prefix="/api", tags=["calendar"])

@router.get("/holidays")
async def holidays(country: str, year: int = Query(..., ge=1900, le=2999), r = Depends(get_redis)):
    key = f"holidays:v1:{country}:{year}"
    try:
        cached = await r.get(key)
    except Exception:
        cached = None
    if cached:
        return json.loads(cached)
    try:
        data = await get_holidays(year, country)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Provider error: {e}")
    try:
        await r.set(key, json.dumps(data), ex=24*3600)
    except Exception:
        pass
    return data

@router.get("/calendar/month")
async def calendar_month(
    country: str,
    year: int = Query(..., ge=1900, le=2999),
    month: int = Query(..., ge=1, le=12),
    r = Depends(get_redis)
):
    key = f"month:v1:{country}:{year}:{month}"
    try:
        cached = await r.get(key)
    except Exception:
        cached = None
    if cached:
        return json.loads(cached)

    # Get holidays for the country/year (use cache separate from month cache)
    hkey = f"holidays:v1:{country}:{year}"
    try:
        hcached = await r.get(hkey)
    except Exception:
        hcached = None

    if hcached:
        hols = json.loads(hcached)
    else:
        try:
            hols = await get_holidays(year, country)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Provider error: {e}")
        try:
            await r.set(hkey, json.dumps(hols), ex=24*3600)
        except Exception:
            pass

    payload = build_month_payload(year, month, hols)
    try:
        await r.set(key, json.dumps(payload), ex=6*3600)
    except Exception:
        pass
    return payload

@router.get("/calendar/quarter")
async def calendar_quarter(
    country: str,
    year: int = Query(..., ge=1900, le=2999),
    quarter: int = Query(..., ge=1, le=4),
    r = Depends(get_redis)
):
    key = f"quarter:v1:{country}:{year}:{quarter}"
    try:
        cached = await r.get(key)
    except Exception:
        cached = None
    if cached:
        return json.loads(cached)

    months = quarter_to_months(quarter)

    # Get holidays for the country/year (use cache separate from quarter cache)
    hkey = f"holidays:v1:{country}:{year}"
    try:
        hcached = await r.get(hkey)
    except Exception:
        hcached = None

    if hcached:
        hols = json.loads(hcached)
    else:
        try:
            hols = await get_holidays(year, country)
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Provider error: {e}")
        try:
            await r.set(hkey, json.dumps(hols), ex=24*3600)
        except Exception:
            pass

    months_payload = [build_month_payload(year, m, hols) for m in months]
    payload = {"year": year, "quarter": quarter, "months": months_payload}

    try:
        await r.set(key, json.dumps(payload), ex=6*3600)
    except Exception:
        pass
    return payload