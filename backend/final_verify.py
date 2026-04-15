import sys
import os
import requests
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from pydantic import ValidationError
import schemas

def test_pydantic_validator():
    print("Testing Pydantic Validator (ANSSI rules)...")
    valid_data = {
        "full_name": "Fabien Thiesset",
        "email": "fabien@test.ai",
        "password": os.getenv("DEFAULT_PLAYER_PASSWORD", "Plume_ChangeMe_2026"),
        "age": 30,
        "average_frequency": 2.0,
        "gender": "M"
    }
    
    # Test valid
    try:
        schemas.PlayerCreate(**valid_data)
        print("[PASS] Valid password accepted.")
    except Exception as e:
        print(f"[FAIL] Valid password rejected: {e}")
        return False

    # Test invalid (length)
    try:
        data = valid_data.copy()
        data["password"] = "Short1!"
        schemas.PlayerCreate(**data)
        print("[FAIL] Short password accepted.")
        return False
    except ValidationError:
        print("[PASS] Short password rejected correctly.")

    # Test invalid (no special)
    try:
        data = valid_data.copy()
        data["password"] = "NoSpecialChar123"
        schemas.PlayerCreate(**data)
        print("[FAIL] No special char password accepted.")
        return False
    except ValidationError:
        print("[PASS] Password without special char rejected correctly.")

    return True

if __name__ == "__main__":
    if test_pydantic_validator():
        print("\nVerification successful!")
    else:
        sys.exit(1)
