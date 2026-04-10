---
description: Restauration du contexte d'agent Plume.ai après un crash ou nouvelle session.
---

# Workflow de Restauration Plume.ai

Pour toute nouvelle session ou après un crash, suis ces étapes dans l'ordre pour redevenir opérationnel :

1. **Scanner le dépôt** : Lister les fichiers `.agent/` pour identifier les fichiers de contexte disponibles.
2. **Lire les rôles** : `view_file` sur `.agent/roles.md` — comprendre les 11 agents, leurs scopes et leurs règles d'économie de tokens.
3. **Lire l'état courant** : `view_file` sur `.agent/current_state.md` — savoir où en est le projet (phase, tâches complétées, blocages).
4. **Lire la roadmap** : `view_file` sur `docs/ROADMAP.md` — vision globale et prochaines étapes.
5. **Charger les variables** : Vérifier `.env` à la racine (Postgres, Groq API Key, secrets).
6. **Identifier le rôle actif** : En fonction de la demande, activer le bon agent (Token Guardian orchestre si ambigu).

---

## // turbo-all

1. Inspecter les logs Docker : `docker compose logs --tail 20`
2. Vérifier l'état de Postgres : `docker exec plume_db pg_isready -U plume_admin`
3. Vérifier l'API Backend : `curl -s http://localhost:8000/health`
