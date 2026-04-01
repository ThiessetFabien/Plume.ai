from sqlalchemy.orm import Session
import models, schemas

# --- LOGIQUE PLAYER ---
def get_player(db: Session, player_id: int):
    return db.query(models.Player).filter(models.Player.id == player_id).first()

def get_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Player).offset(skip).limit(limit).all()

def create_player(db: Session, player: schemas.PlayerCreate):
    db_player = models.Player(
        name=player.name, 
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
