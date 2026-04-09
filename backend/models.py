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
    attendances = relationship(
        "Attendance", back_populates="owner", cascade="all, delete-orphan"
    )


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    duration = Column(Integer)  # en minutes
    player_id = Column(Integer, ForeignKey("players.id"))

    # Relation inverse : Une présence appartient à un joueur unique
    owner = relationship("Player", back_populates="attendances")


class CoachingMessage(Base):
    __tablename__ = "coaching_messages"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    player_id = Column(Integer, ForeignKey("players.id"))

    # Relation : Un message appartient à un joueur
    player = relationship("Player")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    court_number = Column(Integer, nullable=False)  # Terrains 1 à 5
    start_time = Column(DateTime, nullable=False)
    duration = Column(Integer, default=60)  # Minutes
    player_id = Column(Integer, ForeignKey("players.id"))

    # Relation : Une réservation appartient à un joueur
    owner = relationship("Player")
