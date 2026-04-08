from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

import crud, schemas
from database import get_db

router = APIRouter(
    prefix="/players",
    tags=["Joueurs"]
)

@router.post("/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    return crud.create_player(db=db, player=player)

@router.get("/", response_model=List[schemas.Player])
def read_players(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    players = crud.get_players(db, skip=skip, limit=limit)
    return players

@router.get("/ghost", response_model=List[schemas.PlayerGhost], tags=["Intelligence"])
def read_ghost_players(threshold_days: int = 21, db: Session = Depends(get_db)):
    """Identification des joueurs n'ayant pas eu de séance depuis X jours."""
    return crud.get_ghost_players(db, threshold_days=threshold_days)

@router.get("/{player_id}", response_model=schemas.Player)
def read_player(player_id: int, db: Session = Depends(get_db)):
    db_player = crud.get_player(db, player_id=player_id)
    if db_player is None:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    return db_player

@router.get("/{player_id}/stats", response_model=schemas.PlayerStats)
def read_player_stats(player_id: int, db: Session = Depends(get_db)):
    stats = crud.get_player_stats(db, player_id=player_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Joueur non trouvé ou pas de données")
    return stats
