---
description: Développer une nouvelle feature de bout en bout (PO → Tech Lead → Dev → QA).
---

# Workflow : Nouvelle Feature

Utilise ce workflow pour toute nouvelle fonctionnalité (ex. réservation terrain, message coaching, alerte membre fantôme).

Remplace `[FEATURE]` par une description courte de ce que tu veux construire.

---

## Étapes

1. **Product Owner** — Rédiger la user story
   > « En tant que PO, rédige une user story pour [FEATURE] avec ses critères d'acceptation. »

2. **Tech Lead** — Produire le plan d'implémentation
   > « En tant que Tech Lead, produis un plan d'implémentation Markdown pour [FEATURE] en te basant sur la user story ci-dessus. Scope : fichiers concernés uniquement. »

3. **Senior Dev Backend** *(si API concernée)*
   > « En tant que Senior Dev, implémente [FEATURE] selon le plan du Tech Lead. Scope : [fichiers listés dans le plan]. »

4. **Senior Dev Mobile** *(si écran concerné)*
   > « En tant que Senior Dev Mobile, implémente l'écran [FEATURE] dans mobile/. »

5. **QA Agent** — Valider la feature
   > « En tant que QA, propose 5 à 10 tests critiques pour couvrir [FEATURE] et ses cas limites. »

---

## Règles
- Ne pas sauter l'étape Tech Lead — le plan écrit est obligatoire avant tout code.
- Scope max : 1–3 fichiers par étape Dev.
- Si une étape révèle un blocage, remonter au rôle précédent avant de continuer.
