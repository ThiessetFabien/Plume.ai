from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from datetime import datetime, timedelta


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
        average_frequency=player.average_frequency,
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
        player_id=attendance.player_id,
    )
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance


# --- LOGIQUE STATS (Phase 2 : Copilote IA) ---


def get_player_stats(db: Session, player_id: int, days: int = 30):
    # Récupérer le joueur
    player = get_player(db, player_id)
    if not player:
        return None

    # Calculer la date limite (ex: 30 jours glissants)
    limit_date = datetime.utcnow() - timedelta(days=days)

    # Filtrer les sessions d'entraînement sur cette période
    recent_attendances = (
        db.query(models.Attendance)
        .filter(
            models.Attendance.player_id == player_id,
            models.Attendance.date >= limit_date,
        )
        .all()
    )

    total_attendances = len(recent_attendances)

    # Calcul du taux de présence (Business / UX Insight)
    # Objectif sur 30 jours = fréquence_hebdo * (30/7)
    expected_sessions = (player.average_frequency or 0) * (days / 7)
    attendance_rate = (
        round((total_attendances / expected_sessions) * 100, 1)
        if expected_sessions > 0
        else 0.0
    )

    # On retourne un objet Pydantic propre (Phase 2 : Robustesse)
    return schemas.PlayerStats(
        id=player.id,
        full_name=player.full_name,
        email=player.email,
        age=player.age,
        average_frequency=player.average_frequency,
        attendance_rate=attendance_rate,
        total_attendances=total_attendances,
        attendances=recent_attendances,
    )


# --- LOGIQUE COACHING (Phase 2) ---
def create_coaching_message(db: Session, player_id: int, message: str):
    db_message = models.CoachingMessage(player_id=player_id, message=message)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_coaching_history(db: Session, player_id: int, skip: int = 0, limit: int = 10):
    return (
        db.query(models.CoachingMessage)
        .filter(models.CoachingMessage.player_id == player_id)
        .order_by(models.CoachingMessage.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


# --- LOGIQUE GHOSTS (Phase 2) ---


def get_ghost_players(db: Session, threshold_days: int = 21):
    """
    Retourne les joueurs n'ayant pas eu de séance depuis X jours (ou jamais).
    """
    threshold_date = datetime.utcnow() - timedelta(days=threshold_days)

    # Sous-requête pour obtenir la date de dernière présence par joueur
    # (Data Engineering : Optimisation par aggrégation)
    last_attendance_sub = (
        db.query(
            models.Attendance.player_id,
            func.max(models.Attendance.date).label("last_date"),
        )
        .group_by(models.Attendance.player_id)
        .subquery()
    )

    # Jointure pour récupérer les infos joueurs + date de dernière séance
    ghosts_query = (
        db.query(
            models.Player.id,
            models.Player.full_name,
            models.Player.email,
            last_attendance_sub.c.last_date.label("last_attendance_date"),
        )
        .outerjoin(
            last_attendance_sub, models.Player.id == last_attendance_sub.c.player_id
        )
        .filter(
            (last_attendance_sub.c.last_date < threshold_date)
            | (last_attendance_sub.c.last_date.is_(None))
        )
        .all()
    )

    return ghosts_query


# --- LOGIQUE RÉSERVATION (Phase 2.5) ---
def get_reservations_by_day(db: Session, date: datetime):
    # Début et fin de la journée demandée
    start_of_day = datetime(date.year, date.month, date.day, 0, 0, 0)
    end_of_day = start_of_day + timedelta(days=1)

    return (
        db.query(models.Reservation)
        .filter(
            models.Reservation.start_time >= start_of_day,
            models.Reservation.start_time < end_of_day,
        )
        .all()
    )


def create_reservation(db: Session, reservation: schemas.ReservationCreate):
    # 1. Vérification de conflit (Un terrain ne peut être réservé deux fois sur le même créneau)
    # Pour simplifier, on vérifie si une résa commence exactement au même moment sur le même terrain
    existing = (
        db.query(models.Reservation)
        .filter(
            models.Reservation.court_number == reservation.court_number,
            models.Reservation.start_time == reservation.start_time,
        )
        .first()
    )

    if existing:
        return None  # Conflit détecté

    db_reservation = models.Reservation(
        court_number=reservation.court_number,
        start_time=reservation.start_time,
        duration=reservation.duration,
        player_id=reservation.player_id,
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation
