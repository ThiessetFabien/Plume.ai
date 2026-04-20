import sys
import os
import requests

BASE_URL = "http://localhost:8000"

def test_audit_and_zero_trust():
    print("🛡️ Démarrage des vérifications sécuritaires...")

    # 1. Vérification Zero Trust (Accès non autorisé)
    print("\n[TEST] Zero Trust sur /reservations/day/2030-01-01 sans Token")
    response = requests.get(f"{BASE_URL}/reservations/day/2030-01-01")
    if response.status_code == 401:
        print("✅ Accès bloqué avec succès (Zero Trust actif).")
    else:
        print(f"❌ Faille d'authentification : statut {response.status_code}")
        return False

    # 2. Obtenir un jeton d'accès pour les tests (Anonymisé)
    test_user = os.getenv("TEST_PLAYER_EMAIL", "test@plume.ai")
    login_data = {"username": test_user, "password": os.getenv("DEFAULT_PLAYER_PASSWORD")}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    if response.status_code != 200:
        print("❌ Impossible de se connecter en tant que Lucas.")
        return False
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Effectuer une action auditable
    print("\n[TEST] Génération d'une trace d'audit (HDS)")
    response = requests.get(f"{BASE_URL}/players/stats", headers=headers)
    if response.status_code == 200:
        print("✅ Statistiques récupérées.")
    else:
        print(f"❌ Erreur lors de la récupération des statistiques : {response.text}")
        return False

    return True

if __name__ == "__main__":
    success = test_audit_and_zero_trust()
    if not success:
        sys.exit(1)
    print("\n✅ Tous les tests sont passés avec succès !")
