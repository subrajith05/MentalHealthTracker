from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, database, utils, models
from datetime import datetime, timezone, timedelta
from typing import List
from calendar import day_name

router = APIRouter(
    prefix="/checkin",
    tags=["Checkins"]
)

get_db = database.get_db

#Endpoint to add a new checkin
@router.post("/add", response_model=schemas.ShowCheckIn)
def add_checkin(
    request: schemas.CheckIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    new_checkin = models.Moods(
        mood=request.mood.value,
        note=request.note,
        user_id=current_user.id
    )
    db.add(new_checkin)
    db.commit()
    db.refresh(new_checkin)
    db.close()
    return new_checkin

#Endpoint to return the checkins from the past 7 days
@router.get("/show", response_model=List[schemas.ShowCheckIn])
def get_checkins(db: Session = Depends(get_db), current_user: models.User = Depends(utils.get_current_user)):
    seven_days = datetime.now(timezone.utc) - timedelta(days=7)

    checkin_list = db.query(models.Moods).filter(models.Moods.user_id==current_user.id).filter(models.Moods.timestamp>=seven_days).all()

    return checkin_list

#Endpoint to get a summary of the past 7 days
@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: models.User = Depends(utils.get_current_user)):
    seven_days = datetime.now(timezone.utc) - timedelta(days=7)
    
    moods = db.query(models.Moods).filter(models.Moods.user_id==current_user.id).filter(models.Moods.timestamp>=seven_days).all()

    mood_count = {}
    for m in moods:
        mood_count[m.mood]=mood_count.get(m.mood, 0)+1
    return {"total_checkins":len(moods), "mood_counts":mood_count}

#Endpoint to get the most frequent mode for each week of the day
@router.get("/patterns")
def get_patterns(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(utils.get_current_user)
):
    moods = db.query(models.Moods).filter(models.Moods.user_id == current_user.id).all()

    day_moods = {}
    for m in moods:
        day = m.timestamp.strftime("%A")  # e.g., "Monday", "Tuesday"
        day_moods.setdefault(day, []).append(m.mood)

    # Compute the most frequent mood for each day
    patterns = {}
    for day, mood_list in day_moods.items():
        most_frequent = max(set(mood_list), key=mood_list.count)
        patterns[day] = most_frequent

    return {"patterns": patterns}