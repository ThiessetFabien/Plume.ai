from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# --- SCHÉMAS ATTENDANCE ---
# OWASP A03:2021 : Validation stricte des types et portées
class AttendanceBase(BaseModel):
    date: datetime = Field(..., description="Date et heure de l'entraînement")
    duration: int = Field(..., gt=14, lt=481, description="Durée en minutes (entre 15 et 480)")

class AttendanceCreate(AttendanceBase):
    player_id: int = Field(..., description="ID du joueur associé")

class Attendance(AttendanceBase):
    id: int
    player_id: int

    class Config:
        from_attributes = True

# --- SCHÉMAS PLAYER ---
# Prévention contre les données absurdes ou malveillantes
class PlayerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Nom complet du joueur")
    age: Optional[int] = Field(None, ge=5, le=120, description="Âge réaliste (5 à 120 ans)")
    average_frequency: Optional[float] = Field(0.0, ge=0.0, le=7.0, description="Fréquence d'entraînement hebdo (0-7)")

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    attendances: List[Attendance] = []

    class Config:
        from_attributes = True

# --- SCHÉMAS STATS ---
class PlayerStats(Player):
    """
    Schéma enrichi pour l'IA (Phase 2)
    Retourne les infos du joueur et une liste filtrée de ses présences (30j).
    """
    total_sessions: int
    total_minutes: int
    average_duration: float

# --- SCHÉMAS COPILOTE IA ---
class CopilotMessage(BaseModel):
    """Réponse générée par l'IA Groq (Phase 2)."""
    message: str
    player_id: int
    generated_at: datetime = Field(default_factory=datetime.utcnow)
