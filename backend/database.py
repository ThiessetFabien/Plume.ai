from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
import os
from dotenv import load_dotenv

# Charger les secrets (Data Analyst : Toujours sécuriser l'URL de connexion)
load_dotenv()

# Gestion dynamique de l'hôte (Docker vs Local)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Si on tourne en local (hors Docker), on remplace 'postgres' par 'localhost'
if SQLALCHEMY_DATABASE_URL and "postgres:5432" in SQLALCHEMY_DATABASE_URL:
    import socket
    try:
        # On teste si l'hôte 'postgres' est résolvable
        socket.gethostbyname("postgres")
    except socket.gaierror:
        # Si non (on est hors Docker), on bascule sur localhost
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres:5432", "localhost:5432")

# Création du moteur (Engine) : Le cœur de l'interaction avec Postgres
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Usine à sessions (SessionLocal) : Pour chaque requête API, une nouvelle session propre
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base commune pour tous nos futurs modèles SQL (Standard SQLAlchemy 2.0)
class Base(DeclarativeBase):
    pass


# Dépendance cruciale : Fournit une session DB à chaque endpoint FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
