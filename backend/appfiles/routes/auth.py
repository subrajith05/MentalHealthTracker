from fastapi import APIRouter, Depends, HTTPException, status
from .. import  models, schemas, database, hashing, utils
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(tags=["Authentication"])

get_db = database.get_db

#Registering a new user
@router.post('/register', response_model=schemas.ShowUser, status_code=status.HTTP_201_CREATED)
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    if not db.query(models.User).filter(models.User.email == request.email).first():
        new_user = models.User(
            name=request.name,
            email=request.email,
            password=hashing.Hash.bcrypt(request.password),
            role="user"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with email id already exists"
        )
    


##Endpoint for user login
@router.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #Searching for user
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with email {request.username} not found. Try registering as new user"
        )
    
    #Verify the password
    if not hashing.Hash.verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )
    
    #Create JWT token
    access_token = utils.create_access_token(data={"sub": user.email})

    return schemas.Token(
        access_token=access_token,
        token_type="bearer"
    )
    
