from pydantic import BaseModel
from typing import Optional

class BlogCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class BlogOut(BaseModel):
    id: int
    title: str
    content: str
    image_url: Optional[str] = None
    likes: int

    class Config:
        from_attributes = True