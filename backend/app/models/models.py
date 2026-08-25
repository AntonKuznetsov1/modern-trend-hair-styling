from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    date = Column(String)
    time = Column(String)
    status = Column(String, default="pending")

class BlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    image_url = Column(String, nullable=True)
    likes = Column(Integer, default=0)

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password_hash = Column(String)

class DefaultSlot(Base):
    __tablename__ = "default_slots"
    id = Column(Integer, primary_key=True, index=True)
    time = Column(String)

class BlockedDate(Base):
    __tablename__ = "blocked_dates"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, unique=True)

class BlockedTime(Base):
    __tablename__ = "blocked_times"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    time = Column(String)

class CustomSlot(Base):
    __tablename__ = "custom_slots"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String)
    time = Column(String)