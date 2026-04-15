import sys
import os
import time
import requests

# URL de base du backend
BASE_URL = "http://localhost:8000"

def verify_hardening():
    print("🚀 Démarrage de la vérification finale de sécurité (Hardening)...")
    
    # 1. Vérification de l'Encryption au repos via psql
    print("\n[STEP 1] Vérification de l'Encryption via SQL...")
    import subprocess
    cmd = ["docker", "exec", "plume_db", "psql", "-U", "plume_admin", "-d", "plume_ai", "-c", "SELECT age, gender FROM players LIMIT 1;"]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if "gAAAAAB" in result.stdout:
        print("✅ DB Encryption : OK (Données illisibles détectées)")
    else:
        print("❌ DB Encryption : ÉCHEC (Données en clair !)")
        print(result.stdout)
        return False

    # 2. Test Connection (ANSSI Rules)
    print("\n[STEP 2] Test de connexion (ANSSI Password)...")
    login_data = {"username": "lucas.tester@example.com", "password": os.getenv("DEFAULT_PLAYER_PASSWORD", "Plume_ChangeMe_2026")}
    response = requests.post(f"{BASE_URL}/token", data=login_data)
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("✅ Login : OK (Accès autorisé)")
    else:
        print(f"❌ Login : ÉCHEC ({response.status_code})")
        print(response.text)
        return False

    # 3. Test Déchiffrement & Audit Log
    print("\n[STEP 3] Test Déchiffrement & Audit Log...")
    headers = {"Authorization": f"Bearer {token}"}
    resp_stats = requests.get(f"{BASE_URL}/players/stats", headers=headers)
    
    if resp_stats.status_code == 200 and isinstance(resp_stats.json().get("age"), int):
        print(f"✅ Déchiffrement API : OK (Age déchiffré: {resp_stats.json()['age']})")
    else:
        print("❌ Déchiffrement API : ÉCHEC")
        return False

    # Laisser le temps à la BackgroundTask
    time.sleep(2)
    
    # Vérifier l'Audit Log
    cmd_log = ["docker", "exec", "plume_db", "psql", "-U", "plume_admin", "-d", "plume_ai", "-c", "SELECT action, user_email FROM audit_logs ORDER BY timestamp DESC LIMIT 1;"]
    result_log = subprocess.run(cmd_log, capture_output=True, text=True)
    if "READ_STATS" in result_log.stdout and "lucas.petit" in result_log.stdout:
        print("✅ Audit Log : OK (Trace détectée en base)")
    else:
        print("❌ Audit Log : ÉCHEC (Trace manquante)")
        print(result_log.stdout)
        return False

    return True

if __name__ == "__main__":
    if verify_hardening():
        print("\n🏆 TOUS LES SYSTÈMES DE SÉCURITÉ SONT OPÉRATIONNELS !")
    else:
        print("\n🚨 ÉCHEC DE LA VÉRIFICATION !")
        sys.exit(1)
