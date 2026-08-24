from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.models.models import Booking, BlogPost, AvailableTime
from app.services.email import send_system_email
from app.core.database import get_db
from app.schemas.schemas import BookingCreate

app = FastAPI()

# Configured origins to bypass browser CORS policies
origins = [
    "https://modern-trend-hair-styling.pages.dev",
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    new_booking = Booking(
        name=booking.name, 
        email=booking.email, 
        date=booking.date, 
        time=booking.time
    )
    db.add(new_booking)
    db.commit()
    send_system_email("New Booking", f"Booking for {booking.date} at {booking.time}.")
    return {"message": "Booking created"}

@app.get("/api/blogs")
def get_blogs(db: Session = Depends(get_db)):
    return db.query(BlogPost).all()

@app.post("/api/blogs/{post_id}/like")
def like_blog(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        post.likes += 1
        db.commit()
    return {"message": "Liked"}

@app.post("/api/admin/schedule")
def set_exception(date: str, is_blocked: bool, db: Session = Depends(get_db)):
    exception = AvailableTime(date_exception=date, is_blocked=is_blocked)
    db.add(exception)
    db.commit()
    return {"message": "Schedule updated"}