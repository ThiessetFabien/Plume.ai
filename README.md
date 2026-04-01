# 🏸 Plume.ai - L'IA au service du Badminton

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React Native](https://img.shields.io/badge/Mobile-React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Groq](https://img.shields.io/badge/IA-LLaMa_3_Groq-orange?style=for-the-badge)](https://groq.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**Plume.ai** est une application intelligente conçue pour l'Association de Badminton de Cuincy. Elle résout le problème des "membres fantômes" en utilisant l'analyse de données et l'IA générative pour booster l'engagement et l'assiduité des joueurs.

---

## ✨ La "Feature Waow" : Le Copilote IA
Plume.ai ne se contente pas de lister des présences. Son **Copilote IA (LLaMa 3 via Groq)** analyse l'historique d'assiduité pour générer des recommandations personnalisées :
- **Prévention Santé** : "Tu as joué 4 fois cette semaine, attention à tes tendons !"
- **Motivation** : "On ne t'a pas vu depuis 15 jours, tes partenaires t'attendent mardi !"

## 🛠️ Stack Technique
- **Backend** : FastAPI (Python 3.11) - Architecture modulaire et typesafe.
- **Base de Données** : PostgreSQL 16.
- **Frontend** : React Native / Expo (en cours).
- **Orchestration** : Docker & Docker Compose.
- **Intelligence** : Groq API (LLaMa 3.3 70B).

---

## 🚀 Démarrage Rapide (Docker)

Assurez-vous d'avoir Docker et un fichier `.env` configuré (voir `.env.example`).

```bash
# Lancer l'infrastructure complète (DB + Backend)
make up

# Initialiser la base avec des données de test Premium
docker exec -it plume_backend python seed.py
```

L'API est alors accessible sur : `http://localhost:8000/docs`

---

## 📅 Roadmap & Vision
Le projet suit une méthodologie **Portfolio-First** avec un versioning strict (Conventional Commits). 
Consultez la [ROADMAP.md](./docs/ROADMAP.md) pour le détail des phases.

## ⚖️ Licence
Ce projet est sous licence MIT - Voir le fichier [LICENSE](./LICENSE) pour plus de détails.
