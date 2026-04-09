import random
from datetime import datetime, timedelta
from faker import Faker
from database import SessionLocal
import models

# Initialisation de Faker (en français pour plus de réalisme Portfolio)
fake = Faker("fr_FR")

def seed_db():
    print("🚀 Démarrage du peuplement de la base de données de stress-test...")
    db = SessionLocal()

    # Nettoyage GLOBAL (Standard QA : Repartir de zéro pour les tests)
    db.query(models.CoachingMessage).delete()
    db.query(models.Reservation).delete()
    db.query(models.Attendance).delete()
    db.query(models.Player).delete()
    db.commit()

    # 1. Création de Joueurs de masse (60 joueurs)
    # On commence par quelques profils fixes pour les tests spécifiques
    profiles = [
        {"full_name": "Lucas Petit", "email": "lucas.petit@badminton.fr", "age": 28, "freq": 4.0},
        {"full_name": "Sophie Martin", "email": "s.martin@gmail.com", "age": 35, "freq": 2.0},
    ]
    
    created_players = []
    for p in profiles:
        player = models.Player(full_name=p["full_name"], email=p["email"], age=p["age"], average_frequency=p["freq"])
        db.add(player)
        created_players.append(player)
    
    # On complète avec 58 joueurs aléatoires
    for i in range(58):
        player = models.Player(
            full_name=fake.name(),
            email=fake.email(),
            age=random.randint(18, 65),
            average_frequency=float(random.randint(1, 4))
        )
        db.add(player)
        created_players.append(player)

    db.commit()
    print(f"✅ {len(created_players)} profils joueurs créés.")

    # 2. Création de Présences historiques (30 derniers jours)
    end_date = datetime.utcnow()
    for player in created_players:
        # Entre 2 et 15 présences par joueur
        num_sessions = random.randint(2, 12)
        for _ in range(num_sessions):
            attendance_date = end_date - timedelta(days=random.randint(0, 30))
            duration = random.choice([60, 90, 120])
            attendance = models.Attendance(date=attendance_date, duration=duration, player_id=player.id)
            db.add(attendance)

    db.commit()
    print("✅ Données de présence injectées.")

    # 3. Création de Réservations Stratégiques (Le cœur du test)
    print("📅 Génération des réservations de test (Quotas & Limites)...")
    
    # Créneaux autorisés (0=Lun, 3=Jeu, 5=Sam en weekday() Python)
    auth_schedules = {
        0: ["17:00", "18:00", "19:00", "20:00", "21:00"],
        3: ["19:00", "20:00", "21:00"],
        5: ["09:00", "10:00", "11:00"],
    }

    # --- CAS 1 : Saturation d'un créneau (Quota 20/20) ---
    # On cible le lundi prochain
    next_monday = end_date + timedelta(days=(7 - end_date.weekday()) % 7)
    if next_monday <= end_date: # Si on est déjà lundi, on prend le lundi d'après
        next_monday += timedelta(days=7)
    
    target_slot_time = next_monday.replace(hour=17, minute=0, second=0, microsecond=0)
    
    # On prend 20 joueurs différents (excluant Lucas Petit pour un autre test)
    quota_players = [p for p in created_players if p.full_name != "Lucas Petit"][:20]
    for p in quota_players:
        res = models.Reservation(
            court_number=0,
            start_time=target_slot_time,
            duration=60,
            player_id=p.id,
        )
        db.add(res)
    print(f"🔥 Créneau saturé créé : Lundi {target_slot_time.strftime('%d/%m')} à 17h00 (20/20).")

    # --- CAS 2 : Limite Hebdomadaire atteinte (2/2) ---
    # Lucas Petit réserve 2 fois dans la semaine prochaine
    lucas = [p for p in created_players if p.full_name == "Lucas Petit"][0]
    
    # Resa 1 : Lundi 18h
    db.add(models.Reservation(
        court_number=0,
        start_time=next_monday.replace(hour=18, minute=0, second=0, microsecond=0),
        duration=60,
        player_id=lucas.id
    ))
    # Resa 2 : Jeudi 19h
    next_thursday = next_monday + timedelta(days=3)
    db.add(models.Reservation(
        court_number=0,
        start_time=next_thursday.replace(hour=19, minute=0, second=0, microsecond=0),
        duration=60,
        player_id=lucas.id
    ))
    print(f"🚫 Plafond atteint pour Lucas Petit : 2 résas créées en semaine {next_monday.strftime('%W')}.")

    # --- CAS 3 : Remplissage aléatoire pour réalisme UI ---
    # On remplit ~40 autres créneaux au hasard sur les 14 prochains jours
    other_players = [p for p in created_players if p.id not in [p.id for p in quota_players] and p.id != lucas.id]
    
    for _ in range(40):
        # Jour au hasard parmi les 14 prochains
        rand_day_offset = random.randint(0, 14)
        d = end_date + timedelta(days=rand_day_offset)
        
        if d.weekday() in auth_schedules:
            slot = random.choice(auth_schedules[d.weekday()])
            h, m = map(int, slot.split(':'))
            dt = d.replace(hour=h, minute=m, second=0, microsecond=0)
            
            # On vérifie de ne pas surcharger le créneau déjà saturé
            if dt == target_slot_time:
                continue
                
            db.add(models.Reservation(
                court_number=0,
                start_time=dt,
                duration=60,
                player_id=random.choice(other_players).id
            ))

    db.commit()
    print("✨ Base de données de stress-test synchronisée !")
    db.close()

if __name__ == "__main__":
    seed_db()
