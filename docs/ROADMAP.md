# Feuille de Route de Développement : Plume.ai

Ce document liste les étapes **atomiques** à confier à Antigravity (ou tout autre agent IA) pour construire le MVP "Plume.ai" sans aucun effet tunnel. Chaque étape correspond à un "Prompt" ou une tâche spécifique.

---

## ⚙️ Prérequis et Configurations Spécifiques (Portfolio First)

L'objectif de ce projet est de prouver votre ingénierie de développement via l'historique de votre code.

1. **Environnement Git Vierge (`git init`)** : Le socle de votre portfolio ! Tapez `git init` à la racine de votre dossier `Plume.ai` dès maintenant. Créer une archive locale étape-par-étape est capital pour un recruteur.
2. **Docker & Docker Compose** : Installés sur votre machine (pour PostgreSQL et Metabase).
2. **Node.js (LTS)** : Requis pour faire tourner l'application React Native (Expo) en local.


3. **Clé API Groq (L'IA Gratuite)** : 
   - Créez un compte gratuit sur [console.groq.com](https://console.groq.com).
   - Générez une clé API standard. L'agent IA vous demandera de l'insérer dans un fichier `.env` au niveau du backend pour l'authentification.
4. **L'application "Expo Go"** : Installée sur votre smartphone physique (iOS ou Android) pour voir l'application en direct au fil du code.
5. **Configuration du Rôle Moteur ("System Prompt")** : Avant de démarrer l'exécution, copiez ces instructions cruciales dans les paramètres de contexte de votre agent IA :
   > *"Agis comme un Tech Lead Senior et Mentor avec 15 ans d'expérience expert en Python (FastAPI), React Native et Ingénierie Data. Ton objectif est de développer un MVP avec moi pour mon portfolio. **RÈGLES CRITIQUES : (A) Mode Strictement ATOMIQUE.** Tu ne réaliseras qu'une seule micro-tâche à la fois, sans anticiper les étapes futures. (B) **Historisation Automatique.** À la fin de chaque tâche validée, tu proposeras et exécuteras le commit Git avec la norme 'Conventional Commits' (ex: `feat: Tâche 0.1 - base docker`). À chaque tâche, justifie tes choix pour m'apprendre, attends ma validation de fonctionnement avant d'ajouter de la complexité, puis sécurise ta version via .git.*

---


## 📝 Déroulé Atomique des Tâches (Les "Prompts")

Voici les étapes exactes à communiquer à l'IA, l'une après l'autre. Ne lancez la suivante que si la précédente tourne parfaitement.

### PHASE 0 : L'Infrastructure (Base de données, CI/CD, Git)
> *Note : Un beau portfolio, ce sont de beaux commits bien ordonnés !*

- [x] **Tâche 0.0 (Configuration Dépôt & CI/CD) :** "Génère un `.gitignore` très strict (excluant `.env`, `node_modules`, bases locales) pour préparer mon dépôt. Configure un workflow GitHub Actions vierge (`.github/workflows/ci.yml`) que nous templaterons plus tard avec Python, puis exécute le premier commit d'initialisation du projet."
- [x] **Tâche 0.1 (DevOps) :** "Rédige le fichier `docker-compose.yml` incluant PostgreSQL (données) et Metabase (Dashboarding), puis crée un `Makefile` pour tout lancer. Ensuite, commit (feat:)."
- [x] **Tâche 0.2 (Backend & Sécurité) :** "Génère le répertoire `backend/`, les `requirements.txt` (FastAPI, SQLAlchemy) et un `Dockerfile` Python minimal avec CORS Middleware. N'oublie pas le `.env.example` et effectue un commit propre."
- [x] **Tâche 0.3 (Frontend) :** "Génère l'application React Native vierge via `npx create-expo-app mobile --template blank` et sécurise l'étape par un commit formel."


### PHASE 1 : La Donnée (Profil Data Analyst)

- [x] **Tâche 1.1 (Base de Données) :** Modèles `Player` + `Attendance` créés avec SQLAlchemy 2.0 + Pydantic v2. Schémas de validation séparés dans `schemas.py`. ✅
- [x] **Tâche 1.2 (Script de Peuplement) :** Script `seed.py` opérationnel — 4 profils × ~6 sessions ≈ 26 lignes. ⚠️ *Objectif initial : 50 entrées non atteint.*
- [x] **Tâche 1.3 (Les Endpoints CRUD) :** Routes `GET`/`POST` joueurs & présences opérationnelles. Vérifiées via Swagger `/docs`. ✅

#### 🔧 Dettes Techniques Phase 1 (à solder avant `v1.0.0`)
- [x] **Dette 1.A (Seed) :** Augmenter le seed à 50+ entrées réalistes pour Metabase (`seed.py`).
- [x] **Dette 1.B (Anonymisation) :** Le nom du joueur est actuellement injecté dans le prompt Groq — remplacer par `Joueur_ID` (`services/ai_service.py`).
- [x] **Dette 1.C (Tests) :** Aucun test automatisé — ajouter au moins 5 tests `pytest` sur les endpoints CRUD.
- [x] **Dette 1.D (Release) :** Tag Git `v0.1.0` + commit formel `chore: close Phase 1 - data layer stable` à effectuer sur `main`.

---

### PHASE 2 : L'Intelligence (L'API Métier & Groq)

- [x] **Tâche 2.1 (API Data) :** Route `GET /players/{id}/stats` opérationnelle — historique 30 jours glissants, taux de présence calculé. ✅ *(Absorbée en avance pendant Phase 1)*
- [x] **Tâche 2.2a (Intégration Groq) :** SDK Groq intégré, Llama 3.3-70b opérationnel, lazy loading du client. ✅ *(Absorbée en avance pendant Phase 1)*
- [x] **Tâche 2.2b (RGPD / Anonymisation) :** ⚠️ *Fait* — Le nom du joueur a été remplacé par `Joueur_{ID}` dans le prompt envoyé à Groq (`services/ai_service.py`). Bloquant pour conformité RGPD.
- [x] **Tâche 2.3 (Historique Coaching) :** Stocker les messages Groq en base (nouveau modèle `CoachingMessage`) avec date + player_id. Endpoint `GET /players/{id}/coaching-history`. ✅
- [x] **Tâche 2.4 (Membres Fantômes) :** Endpoint `GET /players/ghost` — retourne les joueurs sans `Attendance` depuis > 21 jours avec email + dernière présence. ✅

### PHASE 2.5 : La Gestion des Terrains (Réservation) ✅

- [x] **Tâche 2.5a (Modèle & CRUD) :** Ajout du modèle `Reservation` (id, player_id, court_id, start_at, duration). Logique de vérification des conflits (un terrain ne peut pas être réservé deux fois sur le même créneau). ✅
- [x] **Tâche 2.5b (API Réservation) :** Endpoints `POST /reservations` pour réserver et `GET /reservations/day/{date}` pour visualiser le planning d'un jour donné. ✅

---

### PHASE 3 : L'Interface (Le Smartphone - React Native & Expo)

- [x] **Tâche 3.1 (Infrastructure Mobile) :** Configuration du client API (Axios/Fetch) avec gestion dynamique de l'IP du serveur (indispensable pour Expo Go). Mise en place d'un dossier `services/` et `theme/` pour le Design System. ✅
- [x] **Tâche 3.2 (Le Dashboard Premium) :** Création de l'écran d'accueil avec `react-native-chart-kit`. Affichage dynamique du taux de présence et des statistiques individuelles. Design soigné (Mode Sombre/Clair, dégradés). ✅
- [x] **Tâche 3.3 (L'Expérience Copilote) :** Intégration du coaching IA. Animation de chargement ("Thinking...") et affichage du message Llama 3 sous forme de carte interactive. ✅
- [x] **Tâche 3.4 (Historique & Mémoire) :** Nouvel écran pour consulter la liste des anciens conseils enregistrés (Tâche 2.3). Mise en place de la navigation (React Navigation). ✅
- [x] **Tâche 3.5 (Module de Réservation) :** Refonte capacitive — Sélection par créneau avec quota de 20 places et limite de 2 réservations hebdomadaires. ✅
- [x] **Tâche 3.6 (Saisie de Présence) :** Formulaire rapide pour ajouter une session d'entraînement, avec validation en temps réel. ✅
- [ ] **Tâche 3.7 (Audit & Stabilisation) :** Synchronisation forcée des versions Expo (SDK 54), configuration `pnpm` (hoisting) et sécurisation du `getBaseURL` pour supporter l'HTTPS.
- [x] **Fix 3.5a (Timezone & Quota UI) :** Correction du bug de décalage de date (toLocalDateStr vs toISOString UTC+2). Affichage clair des places restantes (X/20), badge "Dernières places" sous 5 disponibles, gestion d'erreur réseau. ✅

---

### PHASE 4 : Consolidation & Robustesse (Produit Durable)

- [ ] **Tâche 4.1 (Configuration Metabase) :** Cette étape est manuelle. "Va sur `http://localhost:3000` (Metabase). Connecte-le à PostgreSQL. Crée un Camembert avec la répartition des âges, et une Courbe temporelle du remplissage des terrains."
- [ ] **Tâche 4.2 (Authentification & Sécurité) :** Implémentation d'un système JWT/OAuth2 (ou session sécurisée) pour protéger les endpoints joueurs et réservations. Restriction du Middleware CORS.
- [ ] **Tâche 4.3 (Migrations & Maintenance) :** Initialisation d'Alembic pour la base de données. Refactorisation de `create_all` vers un système de migration pérenne.

### PHASE 5 : Sécurisation Mobile & Mise en Production 🛡️

- [ ] **Tâche 5.1 (Rate Limiting) :** Protéger l'API Groq contre les abus via un limiteur de débit côté backend.
- [ ] **Tâche 5.2 (User Acceptance Testing - UAT) :** Test complet du parcours utilisateur (Saisie -> Stats -> Historique -> Réservation) sur un appareil physique.
- [ ] **Tâche 5.3 (Déploiement) :**
    - [ ] Configuration utilisateur non-root dans Docker.
    - [ ] Image de production optimisée (sans `--reload`).
    - [ ] Nettoyage des `console.log` et des secrets dans le bundle mobile.

---

## 🎯 Comment travailler avec Antigravity sur ce fichier ?

Il vous suffit de surligner la "Tâche X.X" directement dans l'éditeur et de dire à Antigravity (ou de taper dans le chat) : 
**"Fais cette tâche."**

Puis, une fois qu'il a généré le code, demandez-lui toujours : 
**"Comment je vérifie manuellement que ça marche ?"** (Il vous donnera alors une commande `curl` ou l'emplacement où regarder sur votre mobile).
