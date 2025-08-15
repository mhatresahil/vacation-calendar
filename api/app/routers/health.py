from fastapi import APIRouter

router = APIRouter(tags=["meta"])

@router.get("/health")
async def health():
    return {"ok": True}