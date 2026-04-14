from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from datetime import datetime, timedelta
from security import get_password_hash


# --- LOGIQUE PLAYER ---
def get_player(db: Session, player_id: int):
    return db.query(models.Player).filter(models.Player.id == player_id).first()


def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()


def get_player_by_email(db: Session, email: str):
    return db.query(models.Player).filter(models.Player.email == email).first()


def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(
        full_name=player.full_name,
        email=player.email,
        age=player.age,
        gender=player.gender,
        average_frequency=player.average_frequency,
        hashed_password=get_password_hash(player.password),
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
    # 1. Vérification du Quota Global (Max 20 places par créneau)
    total_slots_taken = (
        db.query(models.Reservation)
        .filter(models.Reservation.start_time == reservation.start_time)
        .count()
    )
    if total_slots_taken >= 20:
        raise ValueError("Le quota maximum de 20 joueurs est déjà atteint pour ce créneau.")

    # 2. Vérification du Plafond Hebdomadaire (Max 2 JOURS par semaine calendaire)
    current_time = reservation.start_time
    days_since_monday = current_time.weekday()
    start_of_week = current_time.replace(
        hour=0, minute=0, second=0, microsecond=0
    ) - timedelta(days=days_since_monday)
    end_of_week = start_of_week + timedelta(days=7)

    # Récupérer toutes les réservations du joueur pour cette semaine
    existing_reservations = (
        db.query(models.Reservation)
        .filter(
            models.Reservation.player_id == reservation.player_id,
            models.Reservation.start_time >= start_of_week,
            models.Reservation.start_time < end_of_week,
        )
        .all()
    )

    # Extraire les dates uniques (YYYY-MM-DD)
    reserved_days = {res.start_time.date().isoformat() for res in existing_reservations}
    requested_day = current_time.date().isoformat()

    # Si le jour demandé est nouveau ET qu'on a déjà 2 jours réservés
    if requested_day not in reserved_days and len(reserved_days) >= 2:
        # On passe les jours réservés dans le message d'erreur pour le frontend
        days_list = ",".join(sorted(list(reserved_days)))
        raise ValueError(f"DAY_LIMIT_REACHED|{days_list}")

    # 3. Création de la réservation
    db_reservation = models.Reservation(
        court_number=0,
        start_time=reservation.start_time,
        duration=reservation.duration,
        player_id=reservation.player_id,
    )
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation


def delete_reservation(db: Session, reservation_id: int):
    db_res = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if db_res:
        db.delete(db_res)
        db.commit()
        return True
    return False


def delete_player_reservations_by_day(db: Session, player_id: int, date: datetime):
    """
    Supprime toutes les réservations d'un joueur pour une journée spécifique.
    Utile pour la résolution de conflits de quota.
    """
    start_of_day = datetime(date.year, date.month, date.day, 0, 0, 0)
    end_of_day = start_of_day + timedelta(days=1)

    deleted_count = (
        db.query(models.Reservation)
        .filter(
            models.Reservation.player_id == player_id,
            models.Reservation.start_time >= start_of_day,
            models.Reservation.start_time < end_of_day,
        )
        .delete(synchronize_session=False)
    )
    db.commit()
    return deleted_count > 0

