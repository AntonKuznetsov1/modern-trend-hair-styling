from pydantic import BaseModel, EmailStr

class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    date: str
    time: str