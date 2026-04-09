import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal
import models

# Initialisation de Faker (en français pour plus de réalisme Portfolio)
fake = Faker("fr_FR")


def seed_db():
    print("🚀 Démarrage du peuplement de la base de données Premium...")
    db = SessionLocal()

    # Nettoyage GLOBAL (Standard QA : Repartir de zéro pour les tests)
    db.query(models.CoachingMessage).delete()
    db.query(models.Reservation).delete()
    db.query(models.Attendance).delete()
    db.query(models.Player).delete()
    db.commit()

    # 1. Création de Joueurs avec des profils stratégiques (Expert Business)
    profiles = [
        {
            "full_name": "Lucas Petit",
            "email": "lucas.tester@example.com",
            "age": 28,
            "freq": 4.0,
        },  # Le Pro
        {
            "full_name": "Sophie Martin",
            "email": "s.martin@gmail.com",
            "age": 35,
            "freq": 2.0,
        },  # L'Amateur
        {
            "full_name": "Marc Dubois",
            "email": "m.dubois@outlook.com",
            "age": 52,
            "freq": 1.0,
        },  # Le Débutant
        {
            "full_name": "Emma Bernard",
            "email": "emma.b@club.fr",
            "age": 22,
            "freq": 3.0,
        },  # L'Espoir
    ]

    created_players = []
    for p in profiles:
        player = models.Player(
            full_name=p["full_name"],
            email=p["email"],
            age=p["age"],
            average_frequency=p["freq"],
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
            attendance_date = end_date - timedelta(days=random.randint(0, 30))
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
        0: ["17:00", "18:00", "19:00", "20:00", "21:00"], # Lundi = 0 en Python weekday()
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
