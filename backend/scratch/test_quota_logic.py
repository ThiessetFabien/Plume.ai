import sys
import os
from datetime import datetime, timedelta

# Dans le conteneur Docker, le code est dans /app
sys.path.insert(0, '/app')

import crud, models, schemas, database

# Nettoyage / Setup pour le test
db = next(database.get_db())
models.Base.metadata.create_all(bind=database.engine)

timestamp = int(datetime.now().timestamp())

# 1. TEST QUOTA (20 places par créneau)
print("--- [TEST 1] QUOTA GLOBAL (20 PLACES PAR CRÉNEAU) ---")
slot_time = datetime(2026, 5, 5, 17, 0, 0)  # Un lundi à 17h (date fictive pour les tests)

# Créer 20 joueurs distincts et leur réservation respective
players = []
for i in range(20):
    email = f"test_quota_{timestamp}_{i}@example.com"
    p = crud.create_player(db, schemas.PlayerCreate(full_name=f"Quota Tester {i}", email=email))
    players.append(p)
    res = crud.create_reservation(db, schemas.ReservationCreate(player_id=p.id, start_time=slot_time))
    if not res:
        print(f"❌ FAILED: Impossible de créer la réservation {i+1}/20")
        sys.exit(1)

print("✅ 20 réservations distinctes créées avec succès.")

# 21ème joueur -> doit être bloqué (quota atteint)
extra_player_email = f"test_quota_{timestamp}_extra@example.com"
extra_player = crud.create_player(db, schemas.PlayerCreate(full_name="Extra Player", email=extra_player_email))
res_21 = crud.create_reservation(db, schemas.ReservationCreate(player_id=extra_player.id, start_time=slot_time))
if res_21 is None:
    print("✅ 21ème réservation bloquée (Quota atteint OK).")
else:
    print("❌ ERROR: La 21ème réservation n'a pas été bloquée !")
    sys.exit(1)

# 2. TEST PLAFOND HEBDOMADAIRE (2 par semaine calendaire)
print("\n--- [TEST 2] PLAFOND HEBDOMADAIRE (MAX 2 SÉANCES) ---")
weekly_email = f"test_weekly_{timestamp}@example.com"
weekly_player = crud.create_player(db, schemas.PlayerCreate(full_name="Weekly Tester", email=weekly_email))

# Resa 1 : Lundi de la semaine de test
res1 = crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=datetime(2026, 5, 5, 18, 0, 0)))
# Resa 2 : Jeudi de la même semaine
res2 = crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=datetime(2026, 5, 7, 19, 0, 0)))

if res1 and res2:
    print("✅ 2 réservations dans la même semaine créées avec succès.")
else:
    print("❌ ERROR: Impossible de créer les 2 premières réservations.")
    sys.exit(1)

# Resa 3 : Samedi de la même semaine -> doit être bloquée
res3 = crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=datetime(2026, 5, 9, 10, 0, 0)))
if res3 is None:
    print("✅ 3ème réservation dans la même semaine bloquée (Plafond OK).")
else:
    print("❌ ERROR: La 3ème réservation n'a pas été bloquée !")
    sys.exit(1)

# 3. TEST SEMAINE SUIVANTE (doit réinitialiser le compteur)
print("\n--- [TEST 3] NOUVELLE SEMAINE CALENDAIRE (COMPTEUR RÉINITIALISÉ) ---")
res_next_week = crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=datetime(2026, 5, 11, 17, 0, 0)))
if res_next_week:
    print("✅ Réservation sur la semaine suivante autorisée (Réinitialisation OK).")
else:
    print("❌ ERROR: La réservation sur la semaine suivante aurait dû être autorisée !")
    sys.exit(1)

print("\n🚀 TOUS LES TESTS SONT AU VERT !")
