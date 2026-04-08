# Plume.ai - État Courant du Projet

Ce document sert de mémoire vive persistante pour l'agent IA. Il doit être mis à jour après chaque tâche majeure ou en fin de session.

---

## 📅 Dernière mise à jour : 2026-04-08 | 16:10
## 🚀 Statut Actuel : Phase 2 TERMINÉE ✅ | Phase 2.5 (Réservation) TERMINÉE ✅

## ✅ Tâches Complétées :
*   [x] Initialisation du dépôt Git.
*   [x] Configuration Docker (Postgres, Metabase).
*   [x] Backend FastAPI avec SQLAlchemy 2.0.
*   [x] Modèles `Player`, `Attendance`, `CoachingMessage` et `Reservation`.
*   [x] Script de Seed réaliste avec Faker.
*   [x] **ANONYMISATION RGPD** sur Groq (Llama 3.3).
*   [x] **HISTORIQUE COACHING** (Persistance et API).
*   [x] **MEMBRES FANTÔMES** (Endpoint de détection).
*   [x] **SYSTÈME DE RÉSERVATION** (Modèle, CRUD, Conflits et Tests).
*   [x] **SUITE DE TESTS PYTEST** (CRUD + Réservations).
*   [x] **CONVENTION GIT UNIFORMISÉE** dans `.agent/roles.md`.

## 🚧 En cours (Phase 3 — L'Interface Mobile) :
*   [ ] Configuration Expo / React Native.
*   [ ] Mise en place du Design System.
*   [ ] Développement du Dashboard.

## 📋 Prochaines étapes recommandées :
1.  Démarrer la Phase 3.1 : Infrastructure Mobile & Client API.
2.  Définir le thème visuel (Navigation, Couleurs).

---

## 💡 Notes de Contextes (Key Insights)
*   **Connexion DB** : Stable via Docker.
*   **Sécurité** : Audit de Phase 2 positif (Secrets isolés, Injections parées).
*   **Git** : Utiliser désormais les Conventional Commits type `feat(scope): message`.
*   **IA** : Toujours anonymiser le nom du joueur avant l'envoi au prompt.
