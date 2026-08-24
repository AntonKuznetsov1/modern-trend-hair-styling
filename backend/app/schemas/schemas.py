from pydantic import BaseModel, EmailStr
from typing import Optional

class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    date: str
    time: str

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