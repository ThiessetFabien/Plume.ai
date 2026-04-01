from sqlalchemy.orm import Session
import models, schemas

# --- LOGIQUE PLAYER ---
def get_player(db: Session, player_id: int):
    return db.query(models.Player).filter(models.Player.id == player_id).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(
        full_name=player.full_name,
        email=player.email,
        age=player.age, 
        average_frequency=player.average_frequency
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

# --- LOGIQUE ATTENDANCE ---
def get_attendances(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Attendance).offset(skip).limit(limit).all()

def create_player_attendance(db: Session, attendance: schemas.AttendanceCreate):
    db_attendance = models.Attendance(
        date=attendance.date,
        duration=attendance.duration,
        player_id=attendance.player_id
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

# --- LOGIQUE STATS (Phase 2 : Copilote IA) ---
from datetime import datetime, timedelta

def get_player_stats(db: Session, player_id: int, days: int = 30):
    # Récupérer le joueur
    player = get_player(db, player_id)
    if not player:
        return None
    
    # Calculer la date limite (ex: 30 jours glissants)
    limit_date = datetime.utcnow() - timedelta(days=days)
    
    # Filtrer les sessions d'entraînement sur cette période
    recent_attendances = db.query(models.Attendance).filter(
        models.Attendance.player_id == player_id,
        models.Attendance.date >= limit_date
    ).all()
    
    total_attendances = len(recent_attendances)
    
    # Calcul du taux de présence (Business / UX Insight)
    # Objectif sur 30 jours = fréquence_hebdo * (30/7)
    expected_sessions = (player.average_frequency or 0) * (days / 7)
    attendance_rate = round((total_attendances / expected_sessions) * 100, 1) if expected_sessions > 0 else 0.0
    
    # On retourne un objet Pydantic propre (Phase 2 : Robustesse)
    return schemas.PlayerStats(
        id=player.id,
        full_name=player.full_name,
        email=player.email,
        age=player.age,
        average_frequency=player.average_frequency,
        attendance_rate=attendance_rate,
        total_attendances=total_attendances,
        attendances=recent_attendances
    )
