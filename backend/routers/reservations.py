from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

import crud
import schemas
import models
from database import get_db
from dependencies import get_current_player

router = APIRouter(prefix="/reservations", tags=["Réservations"])


@router.post("/", response_model=schemas.Reservation)
def create_reservation(
    reservation: schemas.ReservationCreate, 
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    """Effectue une réservation pour le joueur connecté."""
    # Sécurité IDOR : On force le player_id
    reservation.player_id = current_player.id
    try:
        db_res = crud.create_reservation(db=db, reservation=reservation)
        return db_res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/day/{date_str}", response_model=List[schemas.Reservation])
def read_reservations_by_day(
    date_str: str, 
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    """
    Récupère toutes les réservations pour un jour donné (format YYYY-MM-DD).
    """
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Format de date invalide. Utilisez YYYY-MM-DD."
        )

    return crud.get_reservations_by_day(db, date=date_obj)


@router.delete("/{reservation_id}", status_code=204)
def delete_reservation(
    reservation_id: int, 
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    """
    Supprime une réservation existante (Désinscription).
    Vérifie que la réservation appartient au joueur connecté.
    """
    # 1. Récupération pour vérification d'identité
    db_res = db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()
    if not db_res:
        raise HTTPException(status_code=404, detail="Réservation introuvable.")
    
    if db_res.player_id != current_player.id:
        raise HTTPException(status_code=403, detail="Vous n'êtes pas autorisé à supprimer cette réservation.")

    crud.delete_reservation(db, reservation_id=reservation_id)
    return None


@router.delete("/day/{date_str}", status_code=204)
def delete_player_day_reservations(
    date_str: str, 
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    """
    Supprime TOUTES les réservations du joueur CONNECTÉ pour un jour spécifique.
    Indispensable pour la permutation de jours (Quota 2 jours).
    """
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400, detail="Format de date invalide (YYYY-MM-DD)."
        )

    crud.delete_player_reservations_by_day(db, player_id=current_player.id, date=date_obj)
    return None
