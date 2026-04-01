import os
from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from groq import Groq

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

# --- DEPENDANCE IA (Phase 2 : Copilote) ---
def get_groq_client():
    """ 
    Initialisation paresseuse (Lazy Loading) du client Groq.
    Évite de faire crasher le serveur si la clé API est absente.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_dummy_groq_api_key_here":
        raise HTTPException(
            status_code=503, 
            detail="Service IA temporairement indisponible (Configuration manquante)."
        )
    return Groq(api_key=api_key)

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

@app.get("/players/{player_id}/stats/", response_model=schemas.PlayerStats, tags=["Joueurs"])
def read_player_stats(player_id: int, db: Session = Depends(get_db)):
    """
    Récupère les statistiques d'assiduité d'un joueur
    sur les 30 derniers jours pour analyse.
    """
    db_stats = crud.get_player_stats(db, player_id=player_id)
    if db_stats is None:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    return db_stats

# --- ENDPOINTS COPILOTE IA ---
@app.post("/players/{player_id}/copilot/", response_model=schemas.CopilotMessage, tags=["Intelligence"])
def generate_copilot_advice(player_id: int, db: Session = Depends(get_db)):
    """
    Génère un conseil de coaching personnalisé via LLaMa 3 (Groq).
    RGPD : Les données sont anonymisées avant envoi à l'IA.
    """
    # 1. Récupération des stats (notre contexte)
    stats = crud.get_player_stats(db, player_id=player_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    
    # 2. Préparation du Prompt (Coach Badminton & Santé)
    # Anonymisation : On n'envoie pas le nom, juste l'ID pour le contexte.
    system_prompt = (
        "Tu es un coach de badminton expert, spécialisé dans la préparation physique et la motivation. "
        "Ton rôle est de rédiger un message court (style SMS, max 250 caractères) pour encourager un joueur. "
        "Sois précis sur les chiffres, bienveillant mais exigeant sur la régularité. "
        "Utilise un ton qui inspire la santé et la performance."
    )
    
    user_content = f"""
    Stats d'assiduité du Joueur_{player_id} (30 derniers jours) :
    - Nombre de sessions : {stats.total_sessions}
    - Volume total : {stats.total_minutes} minutes
    - Moyenne par session : {stats.average_duration} min
    - Objectif de fréquence : {stats.average_frequency} fois par semaine
    
    Rédige le SMS de coaching parfait pour ce profil.
    """
    
    try:
        # 3. Appel à Groq via le helper sécurisé (Lazy Loading)
        groq_client = get_groq_client()
        
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.7,
            max_tokens=200
        )
        
        ai_message = completion.choices[0].message.content
        
        return {
            "message": ai_message,
            "player_id": player_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA : {str(e)}")

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
