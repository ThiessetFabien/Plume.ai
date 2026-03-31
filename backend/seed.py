import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal, engine
import models

# Initialisation de Faker (en français pour plus de réalisme Portfolio)
fake = Faker('fr_FR')

def seed_db():
    print("🚀 Démarrage du peuplement de la base de données...")
    db = SessionLocal()
    
    # Nettoyage optionnel pour éviter les doublons lors des tests (Standard Data Analysis)
    db.query(models.Attendance).delete()
    db.query(models.Player).delete()
    
    # 1. Création de 8 Joueurs avec des profils variés
    players = []
    for _ in range(8):
        player = models.Player(
            name=fake.name(),
            age=random.randint(18, 65),
            average_frequency=round(random.uniform(1.0, 4.0), 1)
        )
        db.add(player)
        players.append(player)
    
    db.commit()
    print(f"✅ {len(players)} joueurs créés.")

    # 2. Création de 50 Présences (Attendances) réalistes
    # On simule des présences sur les 60 derniers jours
    attendances_count = 0
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=60)

    for _ in range(50):
        # Choisir un joueur au hasard (certains seront plus assidus que d'autres)
        player = random.choice(players)
        
        # Générer une date aléatoire entre start_date et end_date
        random_days = random.randint(0, 60)
        attendance_date = start_date + timedelta(days=random_days)
        
        # Durées typiques de badminton : 60, 90 ou 120 minutes
        duration = random.choice([60, 90, 120])
        
        attendance = models.Attendance(
            date=attendance_date,
            duration=duration,
            player_id=player.id
        )
        db.add(attendance)
        attendances_count += 1

    db.commit()
    print(f"✅ {attendances_count} enregistrements de présence injectés.")
    print("✨ Base de données prête pour Metabase !")
    db.close()

if __name__ == "__main__":
    seed_db()
