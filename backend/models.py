from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, TypeDecorator
from sqlalchemy.orm import relationship
from database import Base
import datetime
from security_internal import encrypt_data, decrypt_data


class EncryptedField(TypeDecorator):
    """
    Type personnalisé pour chiffrer/déchiffrer automatiquement les données sensibles.
    ANSSI : Protection des données au repos.
    """
    impl = String(500)  # On prévoit large car Fernet augmente la taille

    def process_bind_param(self, value, dialect):
        if value is not None:
            return encrypt_data(str(value))
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            decrypted = decrypt_data(value)
            # Tenter de convertir en int ou float pour la transparence
            try:
                if "." in decrypted:
                    return float(decrypted)
                return int(decrypted)
            except (ValueError, TypeError):
                return decrypted
        return value



class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    age = Column(EncryptedField)
    gender = Column(EncryptedField, default="Autre")
    average_frequency = Column(EncryptedField, default="0.0")
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="player")  # RBAC : player ou admin
    
    # RGPD : Consentement explicite pour les données sensibles (HDS-Ready)
    rgpd_consent = Column(Integer, default=0)  # 0: non, 1: oui (SQLite friendly)
    consent_date = Column(DateTime)

    # Relation : Un joueur peut avoir plusieurs présences
    attendances = relationship(
        "Attendance", back_populates="owner", cascade="all, delete-orphan"
    )
    # Relation : Un joueur peut avoir plusieurs messages de coaching
    coaching_messages = relationship(
        "CoachingMessage", back_populates="player", cascade="all, delete-orphan"
    )
    # Relation : Un joueur peut avoir plusieurs réservations
    reservations = relationship(
        "Reservation", back_populates="owner", cascade="all, delete-orphan"
    )


class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=lambda: datetime.datetime.now(datetime.UTC).replace(tzinfo=None))
    duration = Column(EncryptedField)  # en minutes (chiffré)
    player_id = Column(Integer, ForeignKey("players.id"), index=True)

    # Relation inverse : Une présence appartient à un joueur unique
    owner = relationship("Player", back_populates="attendances")


class CoachingMessage(Base):
    __tablename__ = "coaching_messages"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.UTC).replace(tzinfo=None))
    player_id = Column(Integer, ForeignKey("players.id"), index=True)

    # Relation : Un message appartient à un joueur
    player = relationship("Player", back_populates="coaching_messages")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    court_number = Column(EncryptedField, nullable=False)  # Terrains 1 à 5 (chiffré)
    start_time = Column(DateTime, nullable=False, index=True)
    duration = Column(EncryptedField, default="60")  # Minutes (chiffré)
    player_id = Column(Integer, ForeignKey("players.id"), index=True)

    # Relation : Une réservation appartient à un joueur
    owner = relationship("Player", back_populates="reservations")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    target_player_id = Column(Integer, index=True, nullable=True)
    user_email = Column(String, nullable=False)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.UTC).replace(tzinfo=None))


