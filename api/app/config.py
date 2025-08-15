from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    app_name: str = "Vacation Calendar API"
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    provider: str = os.getenv("PROVIDER", "nager")
    allowed_origins: list[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

settings = Settings()