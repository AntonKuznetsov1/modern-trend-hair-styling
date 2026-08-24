from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.models.models import Booking, BlogPost, AvailableTime
from app.services.email import send_system_email
from app.core.database import get_db
from app.schemas.schemas import BookingCreate

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

class BlogCreate(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None

@app.get("/api/blogs")
def get_blogs(db: Session = Depends(get_db)):
    return db.query(BlogPost).order_by(BlogPost.id.desc()).all()

@app.post("/api/blogs")
def create_blog(blog: BlogCreate, db: Session = Depends(get_db)):
    new_post = BlogPost(
        title=blog.title,
        content=blog.content,
        image_url=blog.image_url,
        likes=0
    )
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