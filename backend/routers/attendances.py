from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/attendances", tags=["Présences"])


@router.post("/", response_model=schemas.Attendance)
def create_attendance(
    attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)
):
    return crud.create_player_attendance(db=db, attendance=attendance)
