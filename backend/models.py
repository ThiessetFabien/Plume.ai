from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    age = Column(Integer)
    average_frequency = Column(Float, default=0.0)

    # Relation : Un joueur peut avoir plusieurs présences (Data Scientist : Crucial pour les jointures)
    attendances = relationship("Attendance", back_populates="owner", cascade="all, delete-orphan")

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(Integer) # en minutes
    player_id = Column(Integer, ForeignKey("players.id"))

    # Relation inverse : Une présence appartient à un joueur unique
    owner = relationship("Player", back_populates="attendances")
