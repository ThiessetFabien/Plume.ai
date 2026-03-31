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

- **Tâche 0.0 (Configuration Dépôt & CI/CD) :** "Génère un `.gitignore` très strict (excluant `.env`, `node_modules`, bases locales) pour préparer mon dépôt. Configure un workflow GitHub Actions vierge (`.github/workflows/ci.yml`) que nous templaterons plus tard avec Python, puis exécute le premier commit d'initialisation du projet."
- **Tâche 0.1 (DevOps) :** "Rédige le fichier `docker-compose.yml` incluant PostgreSQL (données) et Metabase (Dashboarding), puis crée un `Makefile` pour tout lancer. Ensuite, commit (feat:)."
- **Tâche 0.2 (Backend & Sécurité) :** "Génère le répertoire `backend/`, les `requirements.txt` (FastAPI, SQLAlchemy) et un `Dockerfile` Python minimal avec CORS Middleware. N'oublie pas le `.env.example` et effectue un commit propre."
- **Tâche 0.3 (Frontend) :** "Génère l'application React Native vierge via `npx create-expo-app mobile --template blank` et sécurise l'étape par un commit formel."


### PHASE 1 : La Donnée (Profil Data Analyst)

- **Tâche 1.1 (Base de Données) :** "Crée le fichier `models.py` dans le backend avec SQLAlchemy. Je veux deux tables simples : `Player` (nom, age, frequence_moyenne) et `Attendance` (player_id, date, duration). Utilise Pydantic pour les schémas de validation."
- **Tâche 1.2 (Script de Peplement) :** "Écris un script Python de *Seed* (ex: `seed.py`) qui injecte 50 fausses données d'assiduité réalistes dans PostgreSQL. C'est crucial pour que je puisse brancher Metabase et avoir de beaux graphiques à montrer en soutenance."

---

### PHASE 2 : L'Intelligence (L'API Métier & Groq)

- **Tâche 2.1 (API Data) :** "Crée la route GET `/api/players/{id}/stats` dans `main.py` qui renvoie l'historique d'assiduité du joueur des 30 derniers jours."
- **Tâche 2.2 (Copilote IA & RGPD) :** "Intègre le SDK officiel de Groq. Crée la route POST `/api/copilot/{id}`. Extrais les stats d'assiduité, assure-toi de les **anonymiser totalement** (aucun nom propre, juste 'Joueur_ID'), puis injecte-les dans LLaMa 3 pour générer un SMS (Santé ou Motivation)."

---

### PHASE 3 : L'Interface (Le Smartphone)

- **Tâche 3.1 (L'Écran d'Accueil) :** "Modifie `App.tsx` dans le dossier mobile. Utilise la librairie `react-native-chart-kit` pour afficher un graphique d'assiduité. Assure-toi que l'URL des requêtes pointe vers **l'IP réseau local (ex: 192.168.1.X)** et non `localhost`, indispensable pour Expo."
- **Tâche 3.2 (L'Intégration du Bouton Waow) :** "Ajoute le bouton 'Mon Bilan IA' sous le graphique. Au clic, déclenche un `fetch` vers notre route `/api/copilot/{id}` et affiche chaleureusement le message généré par LLaMa 3."

---

### PHASE 4 : Le "Clou du Spectacle" (Data Analyst)

- **Tâche 4.1 (Configuration Metabase) :** Cette étape est manuelle. "Va sur `http://localhost:3000` (Metabase). Connecte-le à PostgreSQL. Crée un Camembert avec la répartition des âges, et une Courbe temporelle du remplissage des terrains."

---

## 🎯 Comment travailler avec Antigravity sur ce fichier ?

Il vous suffit de surligner la "Tâche X.X" directement dans l'éditeur et de dire à Antigravity (ou de taper dans le chat) : 
**"Fais cette tâche."**

Puis, une fois qu'il a généré le code, demandez-lui toujours : 
**"Comment je vérifie manuellement que ça marche ?"** (Il vous donnera alors une commande `curl` ou l'emplacement où regarder sur votre mobile).
