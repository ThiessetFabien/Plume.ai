import requests
import json

BASE_URL = "http://localhost:8000"
PLAYER_ID = 1

def test_quota_workflow():
    print("--- DÉMARRAGE DES TESTS DE QUOTA ---")
    
    # 1. Nettoyage de la semaine du 13 Mai 2024 (pour avoir un environnement propre)
    days_to_check = ["2024-05-13", "2024-05-14", "2024-05-15"]
    for day in days_to_check:
        requests.delete(f"{BASE_URL}/reservations/player/{PLAYER_ID}/day/{day}")
    print("✅ Nettoyage terminé.")

    # 2. Inscription Jour 1 (Lundi) - Créneau 1
    res = requests.post(f"{BASE_URL}/reservations/", json={
        "player_id": PLAYER_ID, "court_number": 0, "start_time": "2024-05-13T17:00:00", "duration": 60
    })
    print(f"Test 1 (Lundi 17h) : {res.status_code} - {res.text}")
    assert res.status_code == 200

    # 3. Inscription Jour 1 (Lundi) - Créneau 2
    res = requests.post(f"{BASE_URL}/reservations/", json={
        "player_id": PLAYER_ID, "court_number": 0, "start_time": "2024-05-13T18:00:00", "duration": 60
    })
    print(f"Test 2 (Lundi 18h) : {res.status_code} - {res.text}")
    assert res.status_code == 200

    # 4. Inscription Jour 2 (Mardi)
    res = requests.post(f"{BASE_URL}/reservations/", json={
        "player_id": PLAYER_ID, "court_number": 0, "start_time": "2024-05-14T17:00:00", "duration": 60
    })
    print(f"Test 3 (Mardi 17h) : {res.status_code} - {res.text}")
    assert res.status_code == 200

    # 5. Inscription Jour 3 (Mercredi) -> DOIT ÉCHOUER
    res = requests.post(f"{BASE_URL}/reservations/", json={
        "player_id": PLAYER_ID, "court_number": 0, "start_time": "2024-05-15T17:00:00", "duration": 60
    })
    print(f"Test 4 (Mercredi 17h - Bloqué) : {res.status_code} - {res.text}")
    assert res.status_code == 400
    assert "DAY_LIMIT_REACHED" in res.json()["detail"]
    assert "2024-05-13" in res.json()["detail"]
    assert "2024-05-14" in res.json()["detail"]
    print("✅ Blocage du 3ème jour et transmission des dates en conflit OK.")

    # 6. Suppression du Lundi
    res = requests.delete(f"{BASE_URL}/reservations/player/{PLAYER_ID}/day/2024-05-13")
    print(f"Test 5 (Annulation Lundi) : {res.status_code}")
    assert res.status_code == 204

    # 7. Ré-essai Mercredi -> DOIT RÉUSSIR
    res = requests.post(f"{BASE_URL}/reservations/", json={
        "player_id": PLAYER_ID, "court_number": 0, "start_time": "2024-05-15T17:00:00", "duration": 60
    })
    print(f"Test 6 (Mercredi 17h - Retry) : {res.status_code} - {res.text}")
    assert res.status_code == 200
    print("✅ Résolution de conflit par permutation OK.")

if __name__ == "__main__":
    try:
        test_quota_workflow()
        print("\n🏆 TOUS LES TESTS BACKEND SONT RÉUSSIS !")
    except Exception as e:
        print(f"\n❌ ÉCHEC DU TEST : {e}")
