# Plan d'Implémentation et Exécution (Plume.ai)

## Contexte (Philosophie AI-First & Portfolio-First)
Ce document formalise l'exécution des travaux de développement décrits dans `ROADMAP.md` et `cahier_des_charges.md`. L'application se concentre sur l'effet Whaou d'un "Copilote Hybride IA", développé via une méthodologie "AI-First" (Pilotage fin d'agents IA) et "Portfolio-First" (Priorisation absolue de la qualité des commits Git et de la Clean Architecture pour un entretien technique).
Ce plan a été sauvegardé "en dur" dans le dépôt Git pour ne jamais être perdu lors des changements de sessions ou de dossiers.

## Exécution Atomique
Le développement sera mené séquentiellement. Chaque module devra être explicitement ordonné ("Fais la tâche X") via l'Open Manager :

### Phase 0 : Infrastructure & Ops (Fondations DevOps)
- **Configuration CI/CD** : Initialisation Git local et pipeline `GitHub Actions` pour valider le code backend par linter à chaque validation.
- **Docker Compose** : Orchestration en local de `PostgreSQL` (stockage robuste) et `Metabase` (outil de BI open source).
- **Backend FastAPI** : Amorce du fichier central `main.py`, gestionnaire de paquets (`requirements.txt`), et empaquetage `Dockerfile` optimisé.
- **Frontend** : Application visuelle gérée par `React Native/Expo` dans un dossier `mobile/`.

### Phase 1 : Organisation de la Data
- Modélisation SQL (via `SQLAlchemy`) des entités majeures : Joueur (Player) et Assiduité (Attendance).
- Script Python de *seed* pour préparer la data-visualisation.

### Phase 2 : Couche de Services (API & IA)
- Implémentation de la lecture d'historique depuis PostgreSQL.
- Connexion asynchrone sécurisée (via fichier caché `.env` et RGPD/Anonymisation) à l'API LLM Cloud `Groq` (ou `Mistral AI`). Ce module construira le "Copilote Hybride Santé & Engagement".

### Phase 3 : Interaction Utilisateur Mobile
- Conception applicative du Dashboard d'assiduité (`react-native-chart-kit`).
- Connexion réseau mobile configurée vers l'IP locale dynamique (ex: `192.168.1.X`) au lieu du piège `localhost`.
- Implémentation du bouton "Mon Copolite IA", affichant le retour asynchrone généré par l'IA.

## Verification Plan
1. **Tests automatisés** : Linter CI via Github Actions pour assurer un standard de code "Data Engineer" ou "Tech Lead".
2. **Vérification manuelle** : Succès de `make up`, requêtes via Swagger (`/docs`), et visualisation du rendu mobile via Expo Go.
