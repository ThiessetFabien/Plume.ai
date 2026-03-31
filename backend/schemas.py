from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- SCHÉMAS ATTENDANCE ---
class AttendanceBase(BaseModel):
    date: datetime
    duration: int

class AttendanceCreate(AttendanceBase):
    player_id: int

class Attendance(AttendanceBase):
    id: int
    player_id: int

    class Config:
        from_attributes = True

# --- SCHÉMAS PLAYER ---
class PlayerBase(BaseModel):
    name: str
    age: Optional[int] = None
    average_frequency: Optional[float] = 0.0

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    attendances: List[Attendance] = []

    class Config:
        from_attributes = True
