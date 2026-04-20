from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from collections import Counter

import crud
import models
import schemas
from database import get_db
from dependencies import get_current_admin

router = APIRouter(prefix="/admin", tags=["Administration"])

@router.get("/stats", dependencies=[Depends(get_current_admin)])
def get_global_stats(
    background_tasks: BackgroundTasks,
    current_admin: models.Player = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Retourne les KPIs globaux du club.
    Accessible uniquement aux administrateurs.
    """
    # HDS : Audit log pour l'accès aux données globales
    background_tasks.add_task(
        crud.create_audit_log, 
        target_id=current_admin.id, 
        user_email=current_admin.email, 
        action="READ_ADMIN_STATS"
    )

    total_players = db.query(models.Player).count()
    
    # Statistiques basiques pour le MVP
    total_attendances = db.query(models.Attendance).count()
    total_reservations = db.query(models.Reservation).count()
    
    # Nombre de membres fantômes (inactifs depuis 21 jours)
    ghost_players = crud.get_ghost_players(db, threshold_days=21)
    
    # Calcul des pics d'assiduité (simplifié en RAM pour le MVP à partir des 100 dernières présences)
    recent_attendances = db.query(models.Attendance).order_by(models.Attendance.date.desc()).limit(100).all()
    
    # 0 = Lundi, 6 = Dimanche en Python weekday()
    days_counter = Counter([a.date.weekday() for a in recent_attendances])
    hours_counter = Counter([a.date.hour for a in recent_attendances])
    
    # Formater pour le frontend
    peak_days = [{"day": d, "count": c} for d, c in days_counter.items()]
    peak_hours = [{"hour": h, "count": c} for h, c in hours_counter.items()]
    
    return {
        "total_players": total_players,
        "total_attendances": total_attendances,
        "total_reservations": total_reservations,
        "ghost_players_count": len(ghost_players),
        "peak_days": sorted(peak_days, key=lambda x: x["count"], reverse=True)[:3],
        "peak_hours": sorted(peak_hours, key=lambda x: x["count"], reverse=True)[:3]
    }
