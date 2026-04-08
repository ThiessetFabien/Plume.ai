from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app
from database import get_db, Base

# Base de données en mémoire pour des tests rapides et isolés (Portfolio Standard)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# On recrée un schéma propre pour chaque run
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Remplacement de la dépendance FastAPI
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# ==========================================
# TESTS CRUD AUTOMATISÉS (Pytest)
# ==========================================

def test_create_player():
    """Test 1: Création d'un joueur."""
    response = client.post(
        "/players/",
        json={"full_name": "Test QA", "email": "qa@badminton.fr", "age": 30, "average_frequency": 2.0}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["full_name"] == "Test QA"
    assert data["email"] == "qa@badminton.fr"
    assert "id" in data

def test_read_players():
    """Test 2: Récupération de la liste des joueurs."""
    response = client.get("/players/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1  # Le joueur du premier test
    assert data[0]["full_name"] == "Test QA"

def test_read_player_by_id():
    """Test 3: Récupération d'un joueur par son ID."""
    response = client.get("/players/1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["email"] == "qa@badminton.fr"

def test_create_attendance():
    """Test 4: Création d'une présence pour ce joueur."""
    response = client.post(
        "/attendances/",
        json={"player_id": 1, "date": "2023-10-27T18:00:00", "duration": 120}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["player_id"] == 1
    assert data["duration"] == 120
    assert "id" in data

def test_read_player_stats():
    """Test 5: La route métier des statistiques."""
    response = client.get("/players/1/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_attendances" in data
    assert "attendance_rate" in data
    assert data["total_attendances"] == 0  # Notre date "2023-10-27" est en dehors des 30 derniers jours, donc totale = 0 sur les 30 derniers jours selon comment stats est codé

