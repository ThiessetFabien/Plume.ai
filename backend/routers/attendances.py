from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
import models
from database import get_db
from dependencies import get_current_player

router = APIRouter(prefix="/attendances", tags=["Présences"])


@router.post("/", response_model=schemas.Attendance)
def create_attendance(
    attendance: schemas.AttendanceCreate, 
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    # Sécurité (OWASP A01:2021) : On force l'ID du joueur à celui authentifié
    attendance.player_id = current_player.id
    return crud.create_player_attendance(db=db, attendance=attendance)
