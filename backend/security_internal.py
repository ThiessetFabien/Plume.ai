import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Re-chargement forcé en cas d'exécution hors main (ex: shell ou tests)
load_dotenv()

ENCRYPTION_KEY = os.getenv("PLUME_ENCRYPTION_KEY")

if not ENCRYPTION_KEY:
    # Fail-safe : On refuse de démarrer sans clé de chiffrement (OWASP A02:2021)
    raise ValueError("CRITICAL: PLUME_ENCRYPTION_KEY missing in environment. Data encryption at rest is mandatory.")

_fernet = Fernet(ENCRYPTION_KEY.encode()) if ENCRYPTION_KEY else None

def encrypt_data(data: str) -> str:
    """Chiffre une chaîne de caractères en base64 via Fernet."""
    if not data:
        return data
    # _fernet est garanti d'exister ici grâce au raise au démarrage
    return _fernet.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    """Déchiffre un token Fernet pour retrouver la chaîne originale."""
    if not token or not _fernet:
        return token
    try:
        return _fernet.decrypt(token.encode()).decode()
    except Exception:
        # En cas d'erreur (ex: donnée non chiffrée en base), on retourne brut pour éviter crash
        return token
