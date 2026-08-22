import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Fetch the URL from Render's environment variables
DATABASE_URL = os.environ.get("DATABASE_URL")

# Create the SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# The missing dependency function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()