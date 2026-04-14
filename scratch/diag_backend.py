import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    print("Testing /health...")
    try:
        response = client.get("/health")
        print(f"Status: {response.status_code}")
        print(f"Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

def test_login():
    print("\nTesting login /token...")
    try:
        response = client.post("/token", data={"username": "lucas.tester@example.com", "password": "Plume_2026!"})
        print(f"Status: {response.status_code}")
        print(f"Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_health()
    test_login()
