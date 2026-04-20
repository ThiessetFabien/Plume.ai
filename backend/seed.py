import random
import os
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal, engine
import models
from security import get_password_hash

# Initialisation de Faker (en français pour plus de réalisme Portfolio)
fake = Faker("fr_FR")


def seed_db():
    print("🚀 Démarrage du peuplement de la base de données Premium...")
    # S’assurer que les tables existent (surtout après un DROP)
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Nettoyage GLOBAL (Standard QA : Repartir de zéro pour les tests)
    db.query(models.AuditLog).delete()
    db.query(models.CoachingMessage).delete()
    db.query(models.Reservation).delete()
    db.query(models.Attendance).delete()
    db.query(models.Player).delete()
    db.commit()

    # 1. Création de Joueurs avec des profils stratégiques (Expert Business)
    profiles = [
        {
            "full_name": "Utilisateur Test",
            "email": os.getenv("TEST_PLAYER_EMAIL", "test@plume.ai"),
            "age": 28,
            "gender": "M",
            "freq": 4.0,
        },  # Le Pro
        {
            "full_name": "Sophie Martin",
            "email": "s.martin@gmail.com",
            "age": 35,
            "gender": "F",
            "freq": 2.0,
        },  # L'Amateur
        {
            "full_name": "Marc Dubois",
            "email": "m.dubois@outlook.com",
            "age": 52,
            "gender": "M",
            "freq": 1.0,
        },  # Le Débutant
        {
            "full_name": "Emma Bernard",
            "email": "emma.b@club.fr",
            "age": 22,
            "gender": "F",
            "freq": 3.0,
        },  # L'Espoir
    ]

    # Utilisation du mot de passe par défaut de l'environnement (ou fallback générique)
    default_password = os.getenv("DEFAULT_PLAYER_PASSWORD", "Plume_ChangeMe_2026")
    
    created_players = []
    for p in profiles:
        player = models.Player(
            full_name=p["full_name"],
            email=p["email"],
            age=p["age"],
            gender=p["gender"],
            average_frequency=p["freq"],
            hashed_password=get_password_hash(default_password)
        )
        db.add(player)
        created_players.append(player)

    db.commit()
    print(f"✅ {len(created_players)} profils experts créés.")

    # 2. Création de Présences réalistes (UX/UI Designer Insight)
    end_date = datetime.utcnow()

    for player in created_players:
        # On simule l'assiduité selon le profil
        # Lucas (Pro) : 12 séances sur 30j (100% de 4/semaine ~ 16, mais on en met 12)
        # Marc (Débutant) : 2 séances sur 30j (50% de 1/semaine)

        num_sessions = (
            12
            if player.full_name == "Lucas Petit"
            else 2
            if player.full_name == "Marc Dubois"
            else 6
        )

        for i in range(num_sessions):
            # Assiduité aléatoire dans le passé
            days_ago = random.randint(0, 30)
            base_date = end_date - timedelta(days=days_ago)
            
            # S'assurer que la date est un jour d'ouverture (Lundi=0, Jeudi=3, Samedi=5)
            while base_date.weekday() not in [0, 3, 5]:
                base_date -= timedelta(days=1)
            
            # Définir l'heure selon le jour
            if base_date.weekday() == 0:
                hour = random.choice([17, 18, 19, 20])
                minute = 30
            elif base_date.weekday() == 3:
                hour = random.choice([19, 20, 21])
                minute = 0
            else: # Samedi
                hour = random.choice([9, 10, 11])
                minute = 0
                
            attendance_date = base_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            
            duration = random.choice([60, 90, 120])

            attendance = models.Attendance(
                date=attendance_date, duration=duration, player_id=player.id
            )
            db.add(attendance)

    db.commit()
    print("✅ Données de présence injectées avec succès.")

    # 3. Création de Réservations futures (Logiciel de gestion club)
    print("📅 Génération des réservations de terrains...")
    
    # Créneaux autorisés
    auth_schedules = {
        0: ["17:30", "18:30", "19:30", "20:30"],            # Lundi = 0 en Python weekday()
        3: ["19:00", "20:00", "21:00"],                   # Jeudi = 3
        5: ["09:00", "10:00", "11:00"],                   # Samedi = 5
    }
    
    for i in range(5):
        # Chercher une date valide dans le futur (7 prochains jours)
        future_day = end_date + timedelta(days=i)
        
        # Trouver le prochain jour autorisé
        while future_day.weekday() not in auth_schedules:
            future_day += timedelta(days=1)
            
        valid_slots = auth_schedules[future_day.weekday()]
        chosen_slot = random.choice(valid_slots)
        hour, minute = map(int, chosen_slot.split(':'))
        
        res_date = future_day.replace(hour=hour, minute=minute, second=0, microsecond=0)

        reservation = models.Reservation(
            court_number=0,
            start_time=res_date,
            duration=60,
            player_id=random.choice(created_players).id,
        )
        db.add(reservation)

    db.commit()
    print("✅ Réservations futures créées sur les créneaux officiels.")
    print("✨ Base de données synchronisée et prête pour le Copilot IA !")
    db.close()


if __name__ == "__main__":
    seed_db()
