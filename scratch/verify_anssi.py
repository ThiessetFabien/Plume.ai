import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from pydantic import ValidationError
import schemas

def test_anssi_password():
    print("Testing ANSSI Password Validation...")
    passwords = [
        ("weak", False),
        ("Short1!", False),
        ("NoSpecialChar123", False),
        ("NO_LOWERCASE_1!", False),
        ("no_uppercase_1!", False),
        ("ValidPassword123!", True),
        ("Stronger_Password_2024!", True),
    ]
    
    for pwd, expected in passwords:
        try:
            schemas.PlayerCreate(
                full_name="Test",
                email="test@test.ai",
                password=pwd,
                age=25,
                gender="M",
                average_frequency=2.0
            )
            res = True
        except ValidationError:
            res = False
        
        status = "PASS" if res == expected else "FAIL"
        print(f"[{status}] Pwd: {pwd} -> Expected: {expected}, Got: {res}")
        if status == "FAIL":
            sys.exit(1)

if __name__ == "__main__":
    test_anssi_password()
