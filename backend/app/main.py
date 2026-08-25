import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from app.models.models import Base, Booking, BlogPost, DefaultSlot, BlockedDate, BlockedTime, CustomSlot
from app.core.database import get_db, engine

# Automatically create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

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

# --- Schemas ---
class AdminLogin(BaseModel):
    password: str

class BlogCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

class BookingCreate(BaseModel):
    name: str
    email: str
    date: str
    time: str

class SlotCreate(BaseModel):
    time: str

class BlockedDateCreate(BaseModel):
    date: str

class DateSlotCreate(BaseModel):
    date: str
    time: str


# --- Admin Authentication Endpoint ---
@app.post("/api/admin/login")
def admin_login(payload: AdminLogin):
    admin_password = os.environ.get("ADMIN_PASSWORD", "password")
    if payload.password == admin_password:
        return {"authenticated": True, "token": "admin-session-active"}
    raise HTTPException(status_code=401, detail="Invalid admin password")


# --- Blog Endpoints ---
@app.get("/api/blogs")
def get_blogs(db: Session = Depends(get_db)):
    return db.query(BlogPost).order_by(BlogPost.id.desc()).all()

@app.post("/api/blogs")
def create_blog(blog: BlogCreate, db: Session = Depends(get_db)):
    new_post = BlogPost(title=blog.title, content=blog.content, image_url=blog.image_url, likes=0)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@app.delete("/api/blogs/{post_id}")
def delete_blog(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(post)
    db.commit()
    return {"message": "Post deleted"}

@app.post("/api/blogs/{post_id}/like")
def like_blog(post_id: int, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if post:
        post.likes += 1
        db.commit()
    return {"message": "Liked"}


# --- Booking Endpoints ---
@app.get("/api/bookings")
def get_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).order_by(Booking.id.desc()).all()

@app.post("/api/bookings")
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    existing = db.query(Booking).filter(
        Booking.date == booking.date, 
        Booking.time == booking.time,
        Booking.status != "cancelled"
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Time slot already booked")

    new_booking = Booking(
        name=booking.name,
        email=booking.email,
        date=booking.date,
        time=booking.time,
        status="confirmed"
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@app.delete("/api/bookings/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking cancelled"}


# --- Availability Endpoints ---
@app.get("/api/availability/slots")
def get_available_slots(date: str = Query(...), db: Session = Depends(get_db)):
    is_blocked_date = db.query(BlockedDate).filter(BlockedDate.date == date).first()
    if is_blocked_date:
        return []

    default_times = [s.time for s in db.query(DefaultSlot).all()]
    custom_times = [c.time for c in db.query(CustomSlot).filter(CustomSlot.date == date).all()]
    
    all_times = set(default_times + custom_times)

    blocked_times = set([b.time for b in db.query(BlockedTime).filter(BlockedTime.date == date).all()])
    available = all_times - blocked_times

    booked_times = set([b.time for b in db.query(Booking).filter(
        Booking.date == date, 
        Booking.status != "cancelled"
    ).all()])
    
    final_slots = list(available - booked_times)
    return sorted(final_slots)

@app.get("/api/availability/settings")
def get_availability_settings(db: Session = Depends(get_db)):
    return {
        "default_slots": db.query(DefaultSlot).all(),
        "blocked_dates": db.query(BlockedDate).all(),
        "blocked_times": db.query(BlockedTime).all(),
        "custom_slots": db.query(CustomSlot).all()
    }

# Default Slots Management
@app.post("/api/availability/default-slots")
def add_default_slot(slot: SlotCreate, db: Session = Depends(get_db)):
    new_slot = DefaultSlot(time=slot.time)
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@app.delete("/api/availability/default-slots/{slot_id}")
def delete_default_slot(slot_id: int, db: Session = Depends(get_db)):
    slot = db.query(DefaultSlot).filter(DefaultSlot.id == slot_id).first()
    if slot:
        db.delete(slot)
        db.commit()
    return {"message": "Slot deleted"}

# Blocked Dates Management
@app.post("/api/availability/block-date")
def block_date(item: BlockedDateCreate, db: Session = Depends(get_db)):
    existing = db.query(BlockedDate).filter(BlockedDate.date == item.date).first()
    if not existing:
        new_block = BlockedDate(date=item.date)
        db.add(new_block)
        db.commit()
        db.refresh(new_block)
        return new_block
    return existing

@app.delete("/api/availability/block-date/{block_id}")
def unblock_date(block_id: int, db: Session = Depends(get_db)):
    item = db.query(BlockedDate).filter(BlockedDate.id == block_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Date unblocked"}

# Blocked Times Management
@app.post("/api/availability/block-time")
def block_time(item: DateSlotCreate, db: Session = Depends(get_db)):
    new_block = BlockedTime(date=item.date, time=item.time)
    db.add(new_block)
    db.commit()
    db.refresh(new_block)
    return new_block

@app.delete("/api/availability/block-time/{block_id}")
def unblock_time(block_id: int, db: Session = Depends(get_db)):
    item = db.query(BlockedTime).filter(BlockedTime.id == block_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Time unblocked"}

# Custom Date Slots Management
@app.post("/api/availability/custom-slot")
def add_custom_slot(item: DateSlotCreate, db: Session = Depends(get_db)):
    new_slot = CustomSlot(date=item.date, time=item.time)
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@app.delete("/api/availability/custom-slot/{slot_id}")
def delete_custom_slot(slot_id: int, db: Session = Depends(get_db)):
    item = db.query(CustomSlot).filter(CustomSlot.id == slot_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Custom slot removed"}