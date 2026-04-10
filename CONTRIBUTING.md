# Contribuer à Plume.ai 🏸

Merci de votre intérêt pour Plume.ai, l'application IA de coaching et réservation pour le Badminton ! Ce projet fait partie d'un portfolio démontrant des compétences Fullstack, IA et Data, mais toute suggestion ou retour est le bienvenu.

## Standard de Contribution

### 1. Protocole Agentia (Si vous utilisez une IA)
Nous utilisons un flux multi-agents structuré. Veuillez consulter `.agent/roles.md` et `.agent/workflows/` pour comprendre les responsabilités :
- Tech Lead pour l'architecture.
- Senior Dev pour l'implémentation.
- UX/UI pour le design.

### 2. Normes de Code
- **Backend (Python)** : FastAPI strict, SQLAlchemy 2.0 type-hints, Black + Flake8. Zero Warnings.
- **Frontend (Expo)** : React Native fonctionnel, styling centralisé dans `theme/colors.js`.
- **Commits** : Nous suivons les [Conventional Commits](https://www.conventionalcommits.org/). Vous devez préfixer vos messages de commits (`feat:`, `fix:`, `docs:`, `chore:`).
- **Gitflow** :
  - `main` : Production.
  - `dev` : Intégration en cours.
  - Nouvelles features : créer une branche `feat/votre-fonctionnalite` à partir de `dev`.

### 3. Lancer en local
1. Créez un fichier `.env` basé sur `.env.example`.
2. Lancez les conteneurs PostgreSQL et Metabase via `docker compose up -d`.
3. Lancez le backend dans `backend/` via `uvicorn main:app --reload`.
4. Lancez l'application mobile dans `mobile/` via `npm start`.

### 4. Tests
Toute Pull Request doit réussir l'intégration continue locale (tests backend) et valider la structure de l'infrastructure (`mobile/verify-infra.js`).

Bon développement et bons matchs !
