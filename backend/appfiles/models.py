from .database import Base
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

#Users table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="user")

    moodlog = relationship("Moods",back_populates="member")

#Mood logs
class Moods(Base):
    __tablename__ = "moodlogs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood = Column(Enum("happy","sad", "stressed", "calm", "neutral", name="Mood"), nullable=False)
    note = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.now(timezone.utc))

    member = relationship("User", back_populates="moodlog")

#Resources table
class Resources(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    link = Column(String)
    category = Column(String)