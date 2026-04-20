# Stratégie de Déploiement — Plume.ai

Ce document résume les options de mise en production pour le projet Plume.ai, avec un focus sur la minimisation des coûts pour un club d'environ 70 joueurs.

---

## 🏗️ Architecture du Projet
Le projet est composé de trois briques distinctes à héberger :
1.  **Backend** : API FastAPI (Python/Docker).
2.  **Données** : Base de données PostgreSQL + Dashboards Metabase (Docker).
3.  **Frontend** : Application Mobile (React Native / Expo).

---

## ☁️ Options d'Hébergement (Backend & DB)

| Plateforme | Coût Estimé | Avantages | Inconvénients |
| :--- | :--- | :--- | :--- |
| **VPS (IONOS)** | **~1€ / mois (12 mois)** | Prix d'appel imbattable. Idéal pour lancer le projet à coût quasi nul. | Le prix remonte après un an (~5-7€). |
| **VPS (Hetzner/OVH)** | **~4.50€ / mois** | Le moins cher sur la durée pour tout faire tourner (API + DB + Metabase). | Demande une configuration manuelle (Docker, SSL). |
| **Railway.app** | **~5-10$ / mois** | Déploiement automatique via GitHub. Très simple. SSL inclus. | Metabase peut vite coûter cher en RAM. |
| **Vercel / Netlify** | **0€ (Front) / ⚠️ (Back)** | Excellent pour la version Web de l'app. | **Incompatible avec Metabase.** Pas de base de données incluse. |
| **Oracle Cloud** | **0€ (Gratuit)** | Puissant et totalement gratuit. | Inscription très difficile. Complexité réseau. |

---

## 📱 Distribution Mobile (Android & iOS)

Pour 70 joueurs, la question de la distribution est cruciale pour le budget.

### Option 1 : Les Stores Officiels (Le plus pro)
*   **Android (Play Store)** : 25$ une seule fois.
*   **iOS (App Store)** : 99$ / an.
*   **Avantage** : Confiance des utilisateurs, mises à jour automatiques.

### Option 2 : PWA (Le plus économique)
*   **Coût** : **0€**.
*   **Méthode** : L'application mobile est exportée en version Web et installée via le navigateur ("Ajouter à l'écran d'accueil").
*   **Avantage** : Aucun frais, pas de processus de validation Apple/Google.

---

## 🎯 Recommandations du Tech Lead

### Scénario "Budget Serré" (Recommandé pour commencer)
1.  **Backend** : Un **VPS Starter** (ex: Hetzner CX21 à 4.50€). On y installe Docker pour faire tourner l'API, Postgres et Metabase ensemble.
2.  **Mobile** : Déploiement en **PWA** hébergé gratuitement sur **Vercel**.
    *   **Coût total : ~4.50€ / mois.**

### Scénario "Professionnel / Portfolio"
1.  **Backend** : **Railway** pour l'API et la DB, VPS pour Metabase (pour économiser la RAM).
2.  **Mobile** : Publication sur le **Play Store** (Android) + **PWA** pour les utilisateurs iOS pour éviter les 99$/an.
    *   **Coût total : ~10-15€ / mois + 25$ une fois.**

---

## 🛠️ Prochaines étapes techniques
Pour préparer l'un ou l'autre de ces scénarios, nous devons :
1.  **Optimiser le Dockerfile** : Retirer le mode `--reload` et configurer Gunicorn.
2.  **Gérer les Secrets** : S'assurer qu'aucune clé ne fuite via les variables d'environnement.
## 🤖 Automatisation (CI/CD via GitHub)

Pour un projet de portfolio, l'automatisation est un "must-have" :
1.  **GitHub Actions** : Automatise les tests et le build Docker à chaque commit.
2.  **GHCR (GitHub Container Registry)** : Stocke vos images Docker gratuitement.
3.  **Watchtower** (optionnel) : Un petit container sur votre VPS qui met à jour l'app automatiquement dès qu'une nouvelle image est disponible sur GitHub.

### Scénario "Gagnant" (Le plus optimisé)
- **Hébergement** : VPS IONOS (1€/mois).
- **Pipeline** : GitHub Actions -> Build Docker -> Push GHCR -> Déploiement auto sur VPS.
- **Mobile** : Version Web sur Vercel (Gratuit).
