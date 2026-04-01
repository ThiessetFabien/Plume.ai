import os
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Charger les variables du fichier .env (utile pour le healthcheck et Groq plus tard)
load_dotenv()

import models, schemas, crud
from database import SessionLocal, engine, Base

# Création des tables physiques au lancement (Portfolio First : Zéro friction)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plume.ai API",
    description="Backend 'Portfolio First' pour suivi club de sport et Copilote IA.",
    version="1.0.0",
)

# Sécurité Critique (CORS Middleware) : Autoriser le dialogue réseau avec le Frontend
# Sans ce filtre, l'application React Native obtiendrait une erreur 'Network Error' en contactant l'API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En production strict, on listerait les IP autorisées.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DEPENDANCE DB ---
def get_db():
    """Générateur de session de base de données pour chaque requête API."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ENDPOINTS PLAYERS ---
@app.post("/players/", response_model=schemas.Player, tags=["Joueurs"])
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    """Création d'un nouveau joueur dans le club."""
    return crud.create_player(db=db, player=player)

@app.get("/players/", response_model=List[schemas.Player], tags=["Joueurs"])
def read_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Liste tous les joueurs inscrits."""
    players = crud.get_players(db, skip=skip, limit=limit)
    return players

# --- ENDPOINTS ATTENDANCE ---
@app.post("/attendances/", response_model=schemas.Attendance, tags=["Présences"])
def create_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    """Enregistrer une présence à un entraînement."""
    return crud.create_player_attendance(db=db, attendance=attendance)

@app.get("/attendances/", response_model=List[schemas.Attendance], tags=["Présences"])
def read_attendances(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Historique global des présences."""
    attendances = crud.get_attendances(db, skip=skip, limit=limit)
    return attendances

@app.get("/health", tags=["Système"])
async def check_health():
    """ 
    Route de diagnostic (Healthcheck)
    Vérifie la robustesse de l'API et la complétion des secrets d'environnement.
    """
    database_url = os.getenv("DATABASE_URL")
    groq_key = os.getenv("GROQ_API_KEY")
    
    return {
        "status": "UP",
        "service": "Plume.ai Backend",
        "database": "Configured" if database_url else "Missing Configuration (Verify .env)",
        "ia_copilot_ready": "Groq Key Active" if groq_key and groq_key != "your_dummy_groq_api_key_here" else "Pending Groq Configuration"
    }
