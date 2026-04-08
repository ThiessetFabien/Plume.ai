from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud, schemas, models
from database import get_db
from services import ai_service

router = APIRouter(
    prefix="/players",  # On garde le préfixe /players pour la cohérence de l'API
    tags=["Intelligence"]
)

@router.post("/{player_id}/copilot/", response_model=schemas.CopilotMessage)
def generate_copilot_message(player_id: int, db: Session = Depends(get_db)):
    # 1. Récupération des stats via CRUD
    stats = crud.get_player_stats(db, player_id=player_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Joueur non trouvé")
    
    # 2. Appel au service IA déporté
    message_text = ai_service.generate_coaching_message(player_id, stats)
    
    # 3. Persistance du message dans l'historique (Tâche 2.3)
    crud.create_coaching_message(db, player_id=player_id, message=message_text)
    
    return {
        "player_id": player_id,
        "message": message_text
    }

@router.get("/{player_id}/coaching-history", response_model=List[schemas.CoachingMessage])
def get_player_coaching_history(player_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """Récupère l'historique des conseils IA pour un joueur."""
    history = crud.get_coaching_history(db, player_id=player_id, skip=skip, limit=limit)
    return history
