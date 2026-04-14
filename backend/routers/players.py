from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import crud
import schemas
import models
from database import get_db
from dependencies import get_current_player

router = APIRouter(prefix="/players", tags=["Joueurs"])


@router.post("/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    """Inscription d'un nouveau joueur."""
    db_player = crud.get_player_by_email(db, email=player.email)
    if db_player:
        raise HTTPException(
            status_code=400, detail="Cet email est déjà enregistré."
        )
    return crud.create_player(db=db, player=player)


@router.get("/me", response_model=schemas.Player)
def read_player_me(current_player: models.Player = Depends(get_current_player)):
    """Récupère le profil du joueur actuellement connecté."""
    return current_player


@router.get("/", response_model=List[schemas.Player])
def read_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit)
    return players


@router.get("/ghost", response_model=List[schemas.PlayerGhost], tags=["Intelligence"])
def read_ghost_players(threshold_days: int = 21, db: Session = Depends(get_db)):
    """Identification des joueurs n'ayant pas eu de séance depuis X jours."""
    return crud.get_ghost_players(db, threshold_days=threshold_days)


@router.get("/stats", response_model=schemas.PlayerStats)
def read_player_stats(
    db: Session = Depends(get_db), 
    current_player: models.Player = Depends(get_current_player)
):
    """Calcul des statistiques d'assiduité du joueur connecté."""
    stats = crud.get_player_stats(db, player_id=current_player.id)
    if not stats:
        raise HTTPException(
            status_code=404, detail="Statistiques non trouvées"
        )
    return stats
