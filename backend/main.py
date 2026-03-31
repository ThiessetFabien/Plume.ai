from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Charger les variables du fichier .env (s'il existe en dev local)
load_dotenv()

app = FastAPI(
    title="Plume.ai API",
    description="Backend 'Portfolio First' pour suivi club de sport et Copilote IA.",
    version="1.0.0",
)

# Sécurité Critique (CORS Middleware) : Autoriser le dialogue réseau avec le Frontend
# Sans ce filtre, l'application React Native obtiendrait une erreur 'Network Error' en contactant l'API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En production strict, on listerait les IP autorisées.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Système"])
async def check_health():
    """ 
    Route de diagnostic (Healthcheck)
    Vérifie la robustesse de l'API et la complétion des secrets d'environnement.
    """
    database_url = os.getenv("DATABASE_URL")
    groq_key = os.getenv("GROQ_API_KEY")
    
    return {
        "status": "UP",
        "service": "Plume.ai Backend",
        "database": "Configured" if database_url else "Missing Configuration (Verify .env)",
        "ia_copilot_ready": "Groq Key Active" if groq_key and groq_key != "your_dummy_groq_api_key_here" else "Pending Groq Configuration"
    }
