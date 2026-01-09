# Mental Health Tracker
A full-stack FastAPI + React web app to log moods, view weekly patterns, and get personalized resource suggestions.

### Backend
- FastAPI + SQLAlchemy + SQLite
- JWT Authentication
- RESTful endpoints for users, moods, and suggestions

### Frontend
- React (Vite) + Recharts
- Protected routes with JWT tokens
- Modern dashboard UI

### Setup
1. `cd backend && pip install -r requirements.txt`
2. `cd frontend && npm install`
3. Run backend: `uvicorn main:app --reload`
4. Run frontend: `npm run dev`
