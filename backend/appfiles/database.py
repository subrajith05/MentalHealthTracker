from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#Databasae URL
SQLALCHEMY_DATABASAE_URL = 'sqlite:///../MentalHealth.db'

#Creating engine to connect with the database
engine = create_engine(SQLALCHEMY_DATABASAE_URL,
                       connect_args={"check_same_thread": False})

#Instance to create a session 
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

#Function to create a database session to be used in api calls
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()