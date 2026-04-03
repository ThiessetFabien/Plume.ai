# Plume.ai - État Courant du Projet

Ce document sert de mémoire vive persistante pour l'agent IA. Il doit être mis à jour après chaque tâche majeure ou en fin de session.

---

## 📅 Dernière mise à jour : 2026-04-03 | 18:32
## 🚀 Statut Actuel : Phase 1 LIVRÉE (dettes ouvertes) | Phase 2 EN COURS (3 tâches restantes)

## ✅ Tâches Complétées :
*   [x] Initialisation du dépôt Git.
*   [x] Configuration Docker (Postgres, Metabase).
*   [x] Backend FastAPI minimal avec SQLAlchemy.
*   [x] Modèles `Player` et `Attendance` créés.
*   [x] Script de Seed (50 données) fonctionnel.
*   [x] Endpoints CRUD de base opérationnels.
*   [x] CRÉATION DE LA COUCHE DE PERSISTANCE AGENT (.agent/).
*   [x] SÉCURISATION DU MOT DE PASSE POSTGRESQL (Secrets).
*   [x] CENTRALISATION DU .ENV À LA RACINE.
*   [x] **RESTAURATION DU .ENV.EXAMPLE (Template sécurisé)**.
*   [x] **INTÉGRATION GROQ (Llama 3.3) VALIDÉE**.
*   [x] **REFACTORISATION MODULAIRE (Routers/Services) TERMINÉE**.
*   [x] **ALIGNEMENT DES SCHÉMAS ET DU CRUD OPÉRATIONNEL**.

## 🚧 En cours (Phase 2 — dettes + tâches restantes) :
*   [ ] **Dette 1.A** : Seed → 50+ entrées réalistes (`seed.py`).
*   [ ] **Dette 1.B** : Anonymisation prompt Groq → `Joueur_{ID}` (`services/ai_service.py`).
*   [ ] **Dette 1.C** : 5 tests `pytest` sur les endpoints CRUD.
*   [ ] **Dette 1.D** : Tag Git `v0.1.0` + commit formel sur `main`.
*   [ ] **Tâche 2.2b** : RGPD — anonymisation bloquante.
*   [ ] **Tâche 2.3** : Modèle `CoachingMessage` + endpoint historique coaching.
*   [ ] **Tâche 2.4** : Endpoint membres fantômes (absence > 21 jours).

## 📋 Prochaines étapes recommandées :
1.  Solder les dettes 1.B + 1.D (rapide, haute valeur).
2.  Implémenter Tâche 2.4 — membres fantômes (US-02 PO).
3.  Démarrer Phase 3 Mobile une fois Phase 2 soldée.

---

## 💡 Notes de Contextes (Key Insights)
*   **Connexion DB** : `DATABASE_URL` via `.env` unique à la racine — stable.
*   **Infrastructure** : Docker Compose prêt, `backend_api` stable.
*   **Agents** : 11 rôles définis dans `.agent/roles.md` (enrichis le 2026-04-03).
*   **Versioning** : Pas encore de tag `v0.1.0` — bloquant (Dette 1.D).
*   **RGPD** : Nom du joueur encore exposé dans prompt Groq — bloquant (Dette 1.B).
*   **UI Mobile** : Démarrage conditionné à la clôture Phase 2.
