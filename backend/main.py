from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routers import players, attendances, copilot, reservations, auth, admin

# Création des tables (si elles n'existent pas)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Plume.ai API",
    description="Backend modulaire 10/10 pour la gestion d'un club de badminton et coaching IA.",
    version="1.1.0",
)

# Configuration CORS (Durcissement OWASP/HDS)
import os
trusted_origins = os.getenv("TRUSTED_ORIGINS", "http://localhost:19006,http://localhost:3000").split(",")
trusted_origins = [origin.strip() for origin in trusted_origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=trusted_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Inclusion des Routers
app.include_router(auth.router)
app.include_router(players.router)
app.include_router(attendances.router)
app.include_router(copilot.router)
app.include_router(reservations.router)
app.include_router(admin.router)


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
