from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.models.models import Booking, BlogPost, AvailableTime
from app.services.email import send_system_email
from app.core.database import get_db
# Assume get_db is a dependency yielding a database session

app = FastAPI()

@app.post("/api/bookings")
def create_booking(name: str, email: str, date: str, time: str, db: Session = Depends(get_db)):
    new_booking = Booking(name=name, email=email, date=date, time=time)
    db.add(new_booking)
    db.commit()
    send_system_email("New Booking", f"Booking for {date} at {time}.")
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
    # Add authentication dependency using ADMIN_PASSWORD here
    exception = AvailableTime(date_exception=date, is_blocked=is_blocked)
    db.add(exception)
    db.commit()
    return {"message": "Schedule updated"}