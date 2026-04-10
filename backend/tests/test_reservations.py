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

# ==========================================
# TESTS SYSTÈME DE RÉSERVATION
# ==========================================


def test_create_reservation_nominal():
    """Vérifie la création d'une réservation valide."""
    # 1. On crée un joueur d'abord
    client.post(
        "/players/", json={"full_name": "Reserv Tester", "email": "test@res.fr"}
    )

    # 2. On réserve le terrain 1
    response = client.post(
        "/reservations/",
        json={
            "player_id": 1,
            "court_number": 1,
            "start_time": "2024-05-10T10:00:00",
            "duration": 60,
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["court_number"] == 1
    assert data["player_id"] == 1


def test_create_reservation_quota_days():
    """Vérifie la règle des 2 jours max par semaine."""
    # 1. On crée un nouveau joueur
    p_resp = client.post("/players/", json={"full_name": "Quota Tester", "email": "quota@test.fr"})
    p_id = p_resp.json()["id"]

    # 2. Jour 1 (Lundi) - Créneau 1: OK
    client.post("/reservations/", json={
        "player_id": p_id, "court_number": 0, "start_time": "2024-05-13T10:00:00", "duration": 60
    })

    # 3. Jour 1 (Lundi) - Créneau 2: OK (Même jour)
    resp = client.post("/reservations/", json={
        "player_id": p_id, "court_number": 0, "start_time": "2024-05-13T11:00:00", "duration": 60
    })
    assert resp.status_code == 200

    # 4. Jour 2 (Mardi) - Créneau 1: OK
    resp = client.post("/reservations/", json={
        "player_id": p_id, "court_number": 0, "start_time": "2024-05-14T10:00:00", "duration": 60
    })
    assert resp.status_code == 200

    # 5. Jour 3 (Mercredi) - Créneau 1: KO (Quota 2 jours atteint)
    resp = client.post("/reservations/", json={
        "player_id": p_id, "court_number": 0, "start_time": "2024-05-15T10:00:00", "duration": 60
    })
    assert resp.status_code == 400
    assert "DAY_LIMIT_REACHED" in resp.json()["detail"]
    # Vérifie que les jours réservés sont listés
    assert "2024-05-13" in resp.json()["detail"]
    assert "2024-05-14" in resp.json()["detail"]


def test_delete_player_day_reservations():
    """Vérifie la suppression en bloc d'une journée pour un joueur."""
    # Le joueur a des résas le 2024-05-13
    p_id = 3 # (D'après la suite des tests)
    
    # On supprime tout le Lundi 13
    resp = client.delete(f"/reservations/player/{p_id}/day/2024-05-13")
    assert resp.status_code == 204

    # On vérifie que les résas du 13 sont parties
    # Note: On utilise l'API de base
    day_resp = client.get("/reservations/day/2024-05-13")
    data = day_resp.json()
    # Il ne devrait plus rester de résas pour ce joueur sur ce jour
    assert all(r["player_id"] != p_id for r in data)
