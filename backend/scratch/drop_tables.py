from database import engine
from models import Base
import models

print("🗑️  Suppression des anciennes tables...")
Base.metadata.drop_all(bind=engine)
print("✅ Tables supprimées.")

print("🆕 Recréation des tables avec les nouveaux index et cascades...")
Base.metadata.create_all(bind=engine)
print("✅ Schémas synchronisés.")
