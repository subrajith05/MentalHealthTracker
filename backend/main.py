from fastapi import FastAPI
from appfiles.routes import auth, checkins, resources
from appfiles import models, database
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(database.engine)


app = FastAPI()

app.include_router(auth.router, prefix='/auth')
app.include_router(checkins.router)
app.include_router(resources.router)

# Allow frontend origin(s)
origins = [
    "http://localhost:5173",  # Vite frontend
    "http://127.0.0.1:5173",
    "https://mental-health-tracker-amber-theta.vercel.app", # Deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # which domains can talk to backend
    allow_credentials=True,
    allow_methods=["*"],         # allow all HTTP methods
    allow_headers=["*"],         # allow all headers
)

@app.get("/health")
def health():
    return {"status": "ok"}