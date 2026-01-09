from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import schemas, models, utils, database
from datetime import datetime, timezone, timedelta

router = APIRouter(
    prefix='/resources',
    tags=["Resources"]
)

get_db = database.get_db

#Endpoint to add a new resource(Accesible only to admins)
@router.post('/', response_model=schemas.ShowResource)
def add_resource(request: schemas.Resource, db: Session = Depends(get_db), current_user: models.User = Depends(utils.get_current_user)):
    if current_user.role!="admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Only admins can add resources"
        )
    new_resource = models.Resources(
        title=request.title,
        link=request.link,
        category=request.category
    )
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    db.close()
    return new_resource

#Endpoint to suggest resources based on the most frequent mood of the past week
@router.get("/suggestions")
def get_suggestions(db: Session = Depends(get_db), current_user: models.User = Depends(utils.get_current_user)):
    seven_days = datetime.now(timezone.utc) - timedelta(days=7)

    #Fetching the most frequent mood
    frequent_mood = (db.query(models.Moods.mood, func.count(models.Moods.mood))
                     .filter(models.Moods.timestamp>=seven_days)
                     .group_by(models.Moods.mood)
                     .order_by(func.count(models.Moods.mood).desc())
                     .first()
    )
    
    if frequent_mood:
        mood = frequent_mood[0]
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No entries found in the past week"
        )
    
    suggestions = {
        "mood": mood,
        "resources": [{"title": r.title, "link": r.link} for r in db.query(models.Resources).filter(models.Resources.category==mood).all()]
    }
    return suggestions