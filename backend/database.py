from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Charger les secrets (Data Analyst : Toujours sécuriser l'URL de connexion)
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Création du moteur (Engine) : Le cœur de l'interaction avec Postgres
engine = create_engine(DATABASE_URL)

# Usine à sessions (SessionLocal) : Pour chaque requête API, une nouvelle session propre
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base commune pour tous nos futurs modèles SQL (Standard SQLAlchemy 2.x)
Base = declarative_base()
