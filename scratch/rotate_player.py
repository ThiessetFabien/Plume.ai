import sys
import os
from sqlalchemy.orm import Session
# Ajouter le backend au path pour importer les modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from database import SessionLocal
import models
from security import get_password_hash

def rotate_lucas_password():
    print("🛡️ Rotation du mot de passe de Lucas Petit...")
    db = SessionLocal()
    try:
        player = db.query(models.Player).filter(models.Player.email == "lucas.petit@badminton.fr").first()
        if not player:
            print("❌ Joueur Lucas Petit non trouvé.")
            return

        new_password = "Safe_Lucas_2026!"
        player.hashed_password = get_password_hash(new_password)
        db.commit()
        print(f"✅ Mot de passe de Lucas Petit mis à jour avec succès (nouveau: {new_password})")
    except Exception as e:
        print(f"❌ Erreur lors de la rotation : {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    rotate_lucas_password()
