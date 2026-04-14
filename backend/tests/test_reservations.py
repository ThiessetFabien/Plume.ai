from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from database import get_db, Base

# Isolation totale via SQLite in-memory (Standard Portfolio-Ready)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)
app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def get_auth_header(email: str, password: str = "SecurePassword123!"):
    resp = client.post("/token", data={"username": email, "password": password})
    token = resp.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}

# ==========================================
# TESTS SYSTÈME DE RÉSERVATION
# ==========================================

def test_create_reservation_nominal():
    """Vérifie la création d'une réservation valide."""
    p_resp = client.post("/players/", json={"full_name": "Reserv Tester", "email": "test@res.fr", "password": "SecurePassword123!"})
    p_id = p_resp.json()["id"]
    headers = get_auth_header("test@res.fr")

    response = client.post(
        "/reservations/",
        json={
            "player_id": p_id, 
            "court_number": 1,
            "start_time": "2024-05-10T10:00:00",
            "duration": 60,
        },
        headers=headers
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["court_number"] == 0
    assert data["player_id"] == p_id 


def test_create_reservation_quota_days():
    """Vérifie la règle des 2 jours max par semaine."""
    p_resp = client.post("/players/", json={"full_name": "Quota Tester", "email": "quota@test.fr", "password": "SecurePassword123!"})
    p_id = p_resp.json()["id"]
    headers = get_auth_header("quota@test.fr")

    client.post("/reservations/", json={"player_id": p_id, "court_number": 0, "start_time": "2024-05-13T10:00:00", "duration": 60}, headers=headers)
    
    resp = client.post("/reservations/", json={"player_id": p_id, "court_number": 0, "start_time": "2024-05-13T11:00:00", "duration": 60}, headers=headers)
    assert resp.status_code == 200

    resp = client.post("/reservations/", json={"player_id": p_id, "court_number": 0, "start_time": "2024-05-14T10:00:00", "duration": 60}, headers=headers)
    assert resp.status_code == 200

    # 5. Jour 3 (Mercredi) - Créneau 1: KO (Quota 2 jours atteint)
    resp = client.post("/reservations/", json={"player_id": p_id, "court_number": 0, "start_time": "2024-05-15T10:00:00", "duration": 60}, headers=headers)
    assert resp.status_code == 400
    assert "DAY_LIMIT_REACHED" in resp.json()["detail"]


def test_delete_player_day_reservations():
    """Vérifie la suppression en bloc d'une journée pour un joueur."""
    headers = get_auth_header("quota@test.fr")
    
    # On supprime tout le Lundi 13 pour quota@test.fr
    resp = client.delete("/reservations/day/2024-05-13", headers=headers)
    assert resp.status_code == 204

    # On vérifie que les résas du 13 sont parties
    day_resp = client.get("/reservations/day/2024-05-13", headers=headers)
    assert day_resp.status_code == 200
    data = day_resp.json()
    
    me_resp = client.get("/players/me", headers=headers)
    p_id = me_resp.json()["id"]

    assert all(r["player_id"] != p_id for r in data)
