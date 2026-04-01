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
    message = ai_service.generate_coaching_message(player_id, stats)
    
    return {
        "player_id": player_id,
        "message": message
    }
