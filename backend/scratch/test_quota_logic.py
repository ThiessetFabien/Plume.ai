import sys
import os
from datetime import datetime, timedelta

# Ajouter le chemin du backend pour l'import
sys.path.append(os.getcwd() + "/backend")

import crud, models, schemas, database

# Nettoyage / Setup pour le test
db = next(database.get_db())
models.Base.metadata.create_all(bind=database.engine)

# Créer un joueur de test
player_email = f"test_quota_{datetime.now().timestamp()}@example.com"
player = crud.create_player(db, schemas.PlayerCreate(full_name="Quota Tester", email=player_email))

# 1. TEST QUOTA (20 places)
print("--- [TEST 1] QUOTA GLOBAL (20 PLACES) ---")
slot_time = datetime(2026, 4, 13, 17, 0, 0) # Un lundi à 17h
for i in range(20):
    res = crud.create_reservation(db, schemas.ReservationCreate(player_id=player.id, start_time=slot_time))
    if not res:
        print(f"FAILED: Impossible de créer la réservation {i+1} à 20")
        sys.exit(1)
print("✅ 20 réservations créées avec succès.")

# 21ème réservation sur le même créneau
res_21 = crud.create_reservation(db, schemas.ReservationCreate(player_id=player.id, start_time=slot_time))
if res_21 is None:
    print("✅ 21ème réservation bloquée (Quota OK).")
else:
    print("❌ ERROR: La 21ème réservation n'a pas été bloquée !")
    sys.exit(1)

# 2. TEST PLAFOND HEBDOMADAIRE (2 par semaine)
print("\n--- [TEST 2] PLAFOND HEBDOMADAIRE (2 PLACES) ---")
# On crée un nouveau joueur
new_player_email = f"test_weekly_{datetime.now().timestamp()}@example.com"
new_player = crud.create_player(db, schemas.PlayerCreate(full_name="Weekly Tester", email=new_player_email))

# Resa 1: Lundi
res1 = crud.create_reservation(db, schemas.ReservationCreate(player_id=new_player.id, start_time=datetime(2026, 4, 13, 18, 0, 0)))
# Resa 2: Jeudi (même semaine)
res2 = crud.create_reservation(db, schemas.ReservationCreate(player_id=new_player.id, start_time=datetime(2026, 4, 16, 19, 0, 0)))

if res1 and res2:
    print("✅ 2 réservations dans la semaine créées.")
else:
    print("❌ ERROR: Impossible de créer les 2 premières réservations.")
    sys.exit(1)

# Resa 3: Samedi (même semaine) -> Doit échouer
res3 = crud.create_reservation(db, schemas.ReservationCreate(player_id=new_player.id, start_time=datetime(2026, 4, 18, 10, 0, 0)))
if res3 is None:
    print("✅ 3ème réservation dans la même semaine bloquée (Plafond OK).")
else:
    print("❌ ERROR: La 3ème réservation n'a pas été bloquée !")
    sys.exit(1)

print("\n🚀 TOUT LES TESTS SONT AU VERT !")
