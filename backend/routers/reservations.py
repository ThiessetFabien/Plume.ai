from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import crud
import schemas
from database import get_db

router = APIRouter(
    prefix="/reservations",
    tags=["Réservations"]
)

@router.post("/", response_model=schemas.Reservation)
def create_reservation(reservation: schemas.ReservationCreate, db: Session = Depends(get_db)):
    db_res = crud.create_reservation(db=db, reservation=reservation)
    if db_res is None:
        raise HTTPException(status_code=400, detail="Conflit de réservation : le terrain est déjà occupé sur ce créneau.")
    return db_res

@router.get("/day/{date_str}", response_model=List[schemas.Reservation])
def read_reservations_by_day(date_str: str, db: Session = Depends(get_db)):
    """
    Récupère toutes les réservations pour un jour donné (format YYYY-MM-DD).
    """
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Format de date invalide. Utilisez YYYY-MM-DD.")
        
    return crud.get_reservations_by_day(db, date=date_obj)
