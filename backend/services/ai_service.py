import os
from groq import Groq
import schemas, models
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

_groq_client = None

def get_groq_client():
    """Lazy loader pour le client Groq afin d'éviter les crashs si la clé est absente."""
    global _groq_client
    if _groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            return None
        _groq_client = Groq(api_key=api_key)
    return _groq_client

def generate_coaching_message(player_id: int, stats) -> str:
    """Génère un message de coaching via Llama 3.3."""
    client = get_groq_client()
    if not client:
        raise HTTPException(
            status_code=503, 
            detail="Service IA temporairement indisponible (Clé API manquante)."
        )

    system_prompt = (
        "Tu es le coach de badminton expert de Plume.ai. Ta mission est de motiver le joueur et de lui donner un conseil technique court (1-2 phrases) basé sur son assiduité."
    )
    
    user_content = f"""
    Données du Joueur_{player_id} sur les 30 derniers jours :
    - Taux de présence : {stats.attendance_rate}%
    - Nombre total de séances : {stats.total_attendances}
    - Fréquence cible : {stats.average_frequency} fois/semaine
    
    Rédige le message de coaching Plume parfait pour lui en t'adressant directement à lui.
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.7,
            max_tokens=200
        )
        return completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA : {str(e)}")
