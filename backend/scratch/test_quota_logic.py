import sys
import os
import time
from datetime import datetime, timedelta

# Dans le conteneur Docker, le code est dans /app
sys.path.insert(0, '/app')

import crud, models, schemas, database

# Nettoyage / Setup pour le test
db = next(database.get_db())
models.Base.metadata.create_all(bind=database.engine)

timestamp = int(datetime.now().timestamp())

# Créer 20 joueurs distincts
players = []
for i in range(20):
    email = f"test_quota_{timestamp}_{i}@example.com"
    p = crud.create_player(db, schemas.PlayerCreate(
        full_name=f"Quota Tester {i}", 
        email=email,
        password="Plume_Placeholder_Secret"
    ))
    players.append(p)

extra_player = crud.create_player(db, schemas.PlayerCreate(
    full_name="Extra Tester", 
    email=f"test_quota_extra_{timestamp}@example.com",
    password="Plume_Placeholder_Secret"
))
weekly_player = crud.create_player(db, schemas.PlayerCreate(
    full_name="Weekly Tester", 
    email=f"test_weekly_{timestamp}@example.com",
    password="Plume_Placeholder_Secret"
))

# --- TEST 1 : Quota Global ---
print("\n--- [TEST 1] QUOTA GLOBAL (20 PLACES PAR CRÉNEAU) ---")
slot_time = datetime(2030, 1, 1, 10, 0, 0)

for p in players[:20]:
    crud.create_reservation(db, schemas.ReservationCreate(player_id=p.id, start_time=slot_time, duration=60))
print("✅ 20 réservations distinctes créées avec succès.")

# La 21ème doit lever une ValueError
try:
    crud.create_reservation(db, schemas.ReservationCreate(player_id=extra_player.id, start_time=slot_time, duration=60))
    print("❌ ÉCHEC : La 21ème réservation aurait dû être rejetée !")
    sys.exit(1)
except ValueError:
    print("✅ 21ème réservation bloquée (Quota atteint OK).")


# --- TEST 2 : Plafond Hebdomadaire (2 par semaine) ---
print("\n--- [TEST 2] PLAFOND HEBDOMADAIRE (MAX 2 SÉANCES) ---")
time_slot_1 = datetime(2030, 2, 4, 18, 0, 0) # Lundi 4 Février 2030
time_slot_2 = time_slot_1 + timedelta(days=1)
time_slot_3 = time_slot_1 + timedelta(days=2)

crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=time_slot_1))
crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=time_slot_2))
print("✅ 2 réservations dans la même semaine créées avec succès.")

try:
    crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=time_slot_3))
    print("❌ ÉCHEC : La 3ème réservation dans la semaine aurait dû être rejetée !")
    sys.exit(1)
except ValueError:
    print("✅ 3ème réservation dans la même semaine bloquée (Plafond OK).")


# --- TEST 3 : Reset Hebdomadaire ---
print("\n--- [TEST 3] NOUVELLE SEMAINE CALENDAIRE (COMPTEUR RÉINITIALISÉ) ---")
time_slot_next_week = time_slot_1 + timedelta(days=7)
try:
    res = crud.create_reservation(db, schemas.ReservationCreate(player_id=weekly_player.id, start_time=time_slot_next_week))
    print("✅ Réservation sur la semaine suivante autorisée (Réinitialisation OK).")
except ValueError:
    print("❌ ÉCHEC : La réservation sur la nouvelle semaine a été bloquée à tort !")
    sys.exit(1)

print("\n🚀 TOUS LES TESTS SONT AU VERT !")

# --- TEARDOWN : Nettoyage de la base de données après les tests ---
print("\n🧹 Nettoyage des données de test...")
from sqlalchemy import text
all_test_ids = [p.id for p in players] + [extra_player.id, weekly_player.id]
ids_str = ','.join(str(i) for i in all_test_ids)

db.execute(text(f'DELETE FROM coaching_messages WHERE player_id IN ({ids_str})'))
db.execute(text(f'DELETE FROM reservations WHERE player_id IN ({ids_str})'))
db.execute(text(f'DELETE FROM attendances WHERE player_id IN ({ids_str})'))
db.execute(text(f'DELETE FROM players WHERE id IN ({ids_str})'))
db.commit()
print(f"✅ {len(all_test_ids)} joueurs de test et leurs données supprimés.")
