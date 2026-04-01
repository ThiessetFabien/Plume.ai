# Plume.ai - État Courant du Projet

Ce document sert de mémoire vive persistante pour l'agent IA. Il doit être mis à jour après chaque tâche majeure ou en fin de session.

---

## 📅 Dernière mise à jour : 2026-04-01 | 14:24
## 🚀 Statut Actuel : Phase 1 - Sécurisation & Persistance

## ✅ Tâches Complétées :
*   [x] Initialisation du dépôt Git.
*   [x] Configuration Docker (Postgres, Metabase).
*   [x] Backend FastAPI minimal avec SQLAlchemy.
*   [x] Modèles `Player` et `Attendance` créés.
*   [x] Script de Seed (50 données) fonctionnel.
*   [x] Endpoints CRUD de base opérationnels.
*   [x] **CRÉATION DE LA COUCHE DE PERSISTANCE AGENT (.agent/)**.

## 🚧 En cours :
*   [/] Sécurisation du mot de passe PostgreSQL (Secrets).
*   [/] Centralisation du fichier `.env` à la racine.

## 📋 Prochaines étapes :
1.  Rétablir la connexion Backend -> DB avec le nouveau mot de passe.
2.  Passer à la **Phase 2 : L'Intelligence (Groq)**.
3.  Développer la route `/api/copilot/{id}`.

---

## 💡 Notes de Contextes (Key Insights)
*   **Connexion DB** : Actuellement en transition pour utiliser `DATABASE_URL` via un `.env` unique.
*   **Infrastructure** : Docker Compose prêt, `backend_api` dépend de `postgres` (healthcheck).
*   **UI Mobile** : Non démarrée (Phase 3).
