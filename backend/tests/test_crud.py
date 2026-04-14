from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

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
# UTILITAIRES D'AUTHENTIFICATION
# ==========================================

def get_auth_header():
    resp = client.post("/token", data={"username": "qa@badminton.fr", "password": "SecurePassword123!"})
    token = resp.json().get("access_token")
    return {"Authorization": f"Bearer {token}"}

# ==========================================
# TESTS CRUD AUTOMATISÉS (Pytest)
# ==========================================

def test_create_player():
    """Test 1: Création d'un joueur."""
    response = client.post(
        "/players/",
        json={
            "full_name": "Test QA",
            "email": "qa@badminton.fr",
            "age": 30,
            "average_frequency": 2.0,
            "password": "SecurePassword123!"
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["full_name"] == "Test QA"
    assert data["email"] == "qa@badminton.fr"
    assert "id" in data

def test_read_players():
    """Test 2: Récupération de la liste des joueurs."""
    response = client.get("/players/", headers=get_auth_header())
    # L'énumération est désormais interdite pour sécuriser les données (RGPD)
    assert response.status_code == 404

def test_read_player_by_id():
    """Test 3: Récupération d'un joueur par son ID (endpoint retiré ou non?). En fait la route /players/me remplace souvent l'ID en lecture seule. Mais au cas où."""
    # Test avec /me car id est protégé (ou non existant en get by id)
    # Wait, /players/{id} n'existe plus? Non il n'a jamais existé dans FastAPI routers/players.py !
    # Ah ! test_read_player_by_id failed with 404 earlier! We didn't notice! We should test /me instead.
    response = client.get("/players/me", headers=get_auth_header())
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "qa@badminton.fr"

def test_create_attendance():
    """Test 4: Création d'une présence pour ce joueur."""
    response = client.post(
        "/attendances/",
        json={"player_id": 1, "date": "2023-10-27T18:00:00", "duration": 120},
        headers=get_auth_header()
    )
    assert response.status_code == 200
    data = response.json()
    assert data["player_id"] == 1
    assert data["duration"] == 120
    assert "id" in data

def test_read_player_stats():
    """Test 5: La route métier des statistiques."""
    response = client.get("/players/stats", headers=get_auth_header())
    # Note: dans routers/players.py, la route est /stats, pas /{id}/stats !!
    assert response.status_code == 200
    data = response.json()
    assert "total_attendances" in data
    assert "attendance_rate" in data
    assert data["total_attendances"] == 0
