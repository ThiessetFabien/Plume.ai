---
description: Restauration du contexte d'agent Plume.ai après un crash.
---

# Workflow de Restauration Plume.ai

Pour toute nouvelle session ou après un crash, suis ces étapes pour redevenir opérationnel :

1.  **Scanner le dépôt** : Lister les fichiers `.agent/`.
2.  **Lire les rôles** : `view_file` sur `.agent/roles.md` pour comprendre ton expertise.
3.  **Lire l'état courant** : `view_file` sur `.agent/current_state.md` pour savoir où tu en es.
4.  **Lire la roadmap** : `view_file` sur `docs/ROADMAP.md` pour la vision globale.
5.  **Charger les variables** : Vérifier le `.env` à la racine pour la connectivité (Postgres, Groq).

---

## // turbo-all
1.  Inspecter les logs Docker : `docker compose logs --tail 20`
2.  Vérifier l'état de Postgres : `docker exec plume_db pg_isready -U plume_admin`
3.  Vérifier l'API Backend : `curl -s http://localhost:8000/docs`
