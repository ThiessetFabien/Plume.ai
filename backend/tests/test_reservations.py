from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from database import get_db, Base

# Isolation totale via SQLite in-memory (Standard Portfolio-Ready)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
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
    client.post("/players/", json={"full_name": "Reserv Tester", "email": "test@res.fr"})
    
    # 2. On réserve le terrain 1
    response = client.post(
        "/reservations/",
        json={"player_id": 1, "court_number": 1, "start_time": "2024-05-10T10:00:00", "duration": 60}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["court_number"] == 1
    assert data["player_id"] == 1

def test_create_reservation_conflict():
    """Vérifie qu'un conflit horaire est bien détecté et bloqué."""
    # Tente de réserver le même terrain au même créneau (déjà pris par le test précédent)
    response = client.post(
        "/reservations/",
        json={"player_id": 2, "court_number": 1, "start_time": "2024-05-10T10:00:00", "duration": 60}
    )
    assert response.status_code == 400
    assert "Conflit" in response.json()["detail"]

def test_get_reservations_day():
    """Vérifie la récupération du planning journalier."""
    response = client.get("/reservations/day/2024-05-10")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["court_number"] == 1

def test_get_reservations_invalid_date():
    """Vérifie la gestion d'erreur de format de date."""
    response = client.get("/reservations/day/10-05-2024") # Mauvais format
    assert response.status_code == 400
    assert "Format de date invalide" in response.json()["detail"]
