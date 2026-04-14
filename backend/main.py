from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routers import players, attendances, copilot, reservations, auth

# Création des tables (si elles n'existent pas)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plume.ai API",
    description="Backend modulaire 10/10 pour la gestion d'un club de badminton et coaching IA.",
    version="1.0.0",
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des Routers
app.include_router(auth.router)
app.include_router(players.router)
app.include_router(attendances.router)
app.include_router(copilot.router)
app.include_router(reservations.router)


@app.get("/health", tags=["Système"])
def health_check():
    from services import ai_service

    groq_ready = (
        "Groq Key Active" if ai_service.get_groq_client() else "Groq Key Missing"
    )
    return {
        "status": "UP",
        "service": "Plume.ai Backend (Modular)",
        "database": "Configured",
        "ia_copilot_ready": groq_ready,
    }
