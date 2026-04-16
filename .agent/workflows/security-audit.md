---
description: Effectuer un audit de sécurité ciblé ou une revue de code orientée sécurité (OWASP/HDS/Zero Trust).
---

# Workflow : Security Audit

Utilise ce workflow pour analyser un sous-système, une API ou l'application entière afin de garantir la conformité aux normes de sécurité requises par Plume.ai.

Remplace `[CIBLE]` par le domaine à auditer (ex: API de réservation, gestion des sessions, base de données).

---

## Étapes

1. **Security Lead** — Cadrage de l'audit
   > « En tant que responsable de la sécurité, définis le périmètre de l'audit sur [CIBLE]. Identifie les risques OWASP probables et les exigences HDS applicables (ex: PII, chiffrement, logs). »

2. **Security Analyst Agent** — Audit statique du code
   > « En tant qu'analyste de sécurité, effectue une revue de code statique (`view_file`, `grep_search`) sur [CIBLE].
   > Cherche :
   > - Les endpoints exposés publiquement sans `Depends(get_current_player)` (Faille Zero Trust).
   > - Les données sensibles non chiffrées "at rest" avec l'approche Fernet (Faille HDS).
   > - Les opérations de création/modification non journalisées via `crud.create_audit_log` (Faille HDS/Traçabilité).
   > - Les injections potentielles ou validations Pydantic manquantes (Faille OWASP). »

3. **Tech Lead** — Plan de remédiation
   > « En tant que Tech Lead, propose un plan d'implémentation (fichier Markdown) pour corriger les vulnérabilités trouvées lors de l'étape 2. »

4. **Security Engineer** — Correction du code
   > « En tant qu'ingénieur sécurité, implémente les correctifs définis dans le plan de remédiation. »

5. **QA & SecOps Agent** — Vérification et Pénétration
   > « En tant qu'agent QA/SecOps, crée et exécute un script de test (ex: via `test_something.py` ou `curl`) pour valider que les vulnérabilités sur [CIBLE] sont bien corrigées et que l'authentification/l'autorisation bloquent les accès illégitimes. »

---

## Règles HDS Incontournables
- **Traçabilité** : Toute action de lecture (READ) sur le profil/statistiques, de création (CREATE) ou suppression (DELETE) sur les présences, messages de coaching ou réservations DOIT générer une entrée `AuditLog`.
- **Zero Trust** : Pas d'endpoint public sauf `/auth/token`, `/players/` (création) et `/health`. Tous les autres doivent authentifier l'identité.
