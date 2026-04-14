from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
import models
from database import get_db
from services import ai_service
from dependencies import get_current_player

router = APIRouter(
    prefix="/copilot",
    tags=["Intelligence"],
)


@router.post("/", response_model=schemas.CopilotMessage)
def generate_copilot_message(
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    """Génère un conseil IA personnalisé pour le joueur connecté."""
    # 1. Récupération des stats via CRUD
    stats = crud.get_player_stats(db, player_id=current_player.id)
    if not stats:
        raise HTTPException(status_code=404, detail="Statistiques non trouvées")

    # 2. Appel au service IA déporté
    message_text = ai_service.generate_coaching_message(current_player.id, stats)

    # 3. Persistance du message dans l'historique
    crud.create_coaching_message(db, player_id=current_player.id, message=message_text)

    return {"player_id": current_player.id, "message": message_text}


@router.get("/history", response_model=List[schemas.CoachingMessage])
def get_coaching_history(
    skip: int = 0, 
    limit: int = 10, 
    db: Session = Depends(get_db),
    current_player: models.Player = Depends(get_current_player)
):
    """Récupère l'historique des conseils IA du joueur connecté."""
    history = crud.get_coaching_history(db, player_id=current_player.id, skip=skip, limit=limit)
    return history
