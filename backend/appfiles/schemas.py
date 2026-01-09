from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum
from typing import Optional

#user schema
class User(BaseModel):
    name: str
    email: EmailStr
    password: str

#schema to display user details
class ShowUser(BaseModel):
    name: str
    email: EmailStr

    class Config:
        from_attributes = True

#schema for getting login data
class LoginUser(BaseModel):
    email: EmailStr
    password: str

#schema for returning token
class Token(BaseModel):
    access_token: str
    token_type: str

#schema for token request
class TokenData(BaseModel):
    email: str | None = None

#mood types
class MoodList(Enum):
    HAPPY = "happy"
    SAD = "sad"
    STRESSED = "stressed"
    NEUTRAL = "neutral"
    CALM = "calm"

#schema to input a mood checkin
class CheckIn(BaseModel):
    mood: MoodList
    note: Optional[str] = None

#schema to display a CheckIn
class ShowCheckIn(BaseModel):
    id: int
    user_id: int
    mood: str
    note: Optional[str] = None
    timestamp: datetime

class Resource(BaseModel):
    title: str
    link: str
    category: str

class ShowResource(BaseModel):
    id: int
    title: str
    link: str
    category: str

    class Config:
        from_attributes = True
