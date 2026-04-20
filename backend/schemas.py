from pydantic import BaseModel, Field, ConfigDict, field_validator
import re
from datetime import datetime, UTC
from typing import List, Optional


# --- SCHÉMAS ATTENDANCE ---
# OWASP A03:2021 : Validation stricte des types et portées
class AttendanceBase(BaseModel):
    date: datetime = Field(..., description="Date et heure de l'entraînement")
    duration: int = Field(
        ..., gt=14, lt=481, description="Durée en minutes (entre 15 et 480)"
    )


class AttendanceCreate(AttendanceBase):
    player_id: int = Field(..., description="ID du joueur associé")


class Attendance(AttendanceBase):
    id: int
    player_id: int

    model_config = ConfigDict(from_attributes=True)


# --- SCHÉMAS PLAYER ---
# Prévention contre les données absurdes ou malveillantes
class PlayerBase(BaseModel):
    full_name: str = Field(
        ..., min_length=2, max_length=100, description="Nom complet du joueur"
    )
    email: str = Field(
        ...,
        pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
        description="Email valide",
    )
    age: Optional[int] = Field(
        None, ge=5, le=120, description="Âge réaliste (5 à 120 ans)"
    )
    gender: Optional[str] = Field(
        "Autre", description="Genre M, F ou Autre"
    )
    average_frequency: Optional[float] = Field(
        0.0, ge=0.0, le=7.0, description="Fréquence d'entraînement hebdo (0-7)"
    )
    rgpd_consent: bool = Field(False, description="Consentement explicite aux CGU/RGPD")
    consent_date: Optional[datetime] = None
    role: str = Field("player", description="Rôle RBAC (player/admin)")


class PlayerCreate(PlayerBase):
    password: str = Field(
        ...,
        min_length=12,
        description="Mot de passe (min 12 chars, Maj, Min, Chiffre, Spécial — ANSSI)",
    )

    @field_validator("password")
    @classmethod
    def validate_password_complexity(cls, v: str) -> str:
        """Validation manuelle ANSSI (le moteur regex Pydantic v2 ne supporte pas les look-aheads)."""
        if not re.search(r"[A-Z]", v):
            raise ValueError("Le mot de passe doit contenir au moins une majuscule.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Le mot de passe doit contenir au moins une minuscule.")
        if not re.search(r"[0-9]", v):
            raise ValueError("Le mot de passe doit contenir au moins un chiffre.")
        if not re.search(r"[@$!%*?&]", v):
            raise ValueError("Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&).")
        return v


class Player(PlayerBase):
    id: int
    attendances: List[Attendance] = []

    model_config = ConfigDict(from_attributes=True)


# --- SCHÉMAS AUTH ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


# --- SCHÉMAS STATS ---
class PlayerStats(PlayerBase):
    """
    Schéma enrichi pour l'IA (Phase 2)
    Retourne les infos du joueur et une liste filtrée de ses présences (30j).
    """

    id: int
    total_attendances: int
    attendance_rate: float = Field(
        0.0, description="Taux de présence sur les 30 derniers jours (%)"
    )
    recent_sessions: List[Attendance] = Field(..., alias="attendances")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class PlayerGhost(BaseModel):
    """Schéma pour les joueurs inactifs (Membres Fantômes)."""

    id: int
    full_name: str
    email: str
    last_attendance_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


# --- SCHÉMAS COPILOTE IA ---
class CopilotMessage(BaseModel):
    """Réponse générée par l'IA Groq (Phase 2)."""

    message: str
    player_id: int
    generated_at: datetime = Field(default_factory=lambda: datetime.now(UTC).replace(tzinfo=None))


class CoachingMessageBase(BaseModel):
    message: str
    player_id: int


class CoachingMessageCreate(CoachingMessageBase):
    pass


class CoachingMessage(CoachingMessageBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- SCHÉMAS RÉSERVATION (Phase 2.5) ---
class ReservationBase(BaseModel):
    court_number: Optional[int] = Field(0, ge=0, le=5, description="Numéro du terrain (0 si quota)")
    start_time: datetime = Field(..., description="Date et heure de début")
    duration: int = Field(60, description="Durée en minutes")


class ReservationCreate(ReservationBase):
    player_id: int


class Reservation(ReservationBase):
    id: int
    player_id: int

    model_config = ConfigDict(from_attributes=True)

# --- SCHÉMAS AUDIT LOG ---
class AuditLogBase(BaseModel):
    target_player_id: int
    user_email: str
    action: str

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
