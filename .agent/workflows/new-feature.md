---
description: Développer une nouvelle feature de bout en bout (PO → Tech Lead → Dev → QA).
---

# Workflow : Nouvelle Feature

Utilise ce workflow pour toute nouvelle fonctionnalité (ex. réservation terrain, message coaching, alerte membre fantôme).

Remplace `[FEATURE]` par une description courte de ce que tu veux construire.

---

## Étapes

0. **Git branching (Automatique)**
   // turbo
   > « En tant que Tech Lead, crée une branche `feat/[FEATURE_NAME]` à partir de `dev` avant de commencer. »

1. **Product Owner** — Rédiger la user story
   > « En tant que PO, rédige une user story pour [FEATURE] avec ses critères d'acceptation. »
   > ⚠️ **Note Git** : La branche de travail `feat/[FEATURE_NAME]` doit impérativement partir de `dev`.

2. **Tech Lead** — Produire le plan d'implémentation
   > « En tant que Tech Lead, produis un plan d'implémentation Markdown pour [FEATURE] en te basant sur la user story ci-dessus. Scope : fichiers concernés uniquement. »

3. **Senior Dev Backend** *(si API concernée)*
   > « En tant que Senior Dev, implémente [FEATURE] selon le plan du Tech Lead. Scope : [fichiers listés dans le plan]. »

4. **Senior Dev Mobile** *(si écran concerné)*
   > « En tant que Senior Dev Mobile, implémente l'écran [FEATURE] dans mobile/. »

5. **🔍 Code Review & Test (OBLIGATOIRE avant tout commit)**
   > Vérifications systématiques **avant** de proposer le commit :
   > - **Revue statique** : Lire les fichiers modifiés (`view_file`) et détecter les bugs potentiels (imports manquants, props incorrectes, SafeAreaView oublié, etc.)
   > - **Vérification des routes** : S'assurer que tout nouvel écran est bien enregistré dans `App.js`
   > - **Vérification des imports** : Tous les composants et icônes utilisés sont importés
   > - **Compatibilité cross-platform** : SafeAreaView présent, comportement `KeyboardAvoidingView` adapté iOS/Android
   > - ⚠️ **Si un bug est trouvé, le corriger AVANT de passer à l'étape QA**

6. **🛡️ Security Check (OWASP/HDS) (Automatique)**
   > « En tant qu'Agent Sécurité, vérifie que [FEATURE] respecte le Zero Trust (Identity-first via `Depends(get_current_player)`), chiffre ses données sensibles "at rest" avec Fernet (si nécessaire), génère des traces d'audit (HDS) via `crud.create_audit_log` sur les accès/modifications, et filtre correctement toutes les entrées utilisateur via Pydantic. »

7. **QA Agent** — Valider la feature
   > « En tant que QA, propose 5 à 10 tests critiques pour couvrir [FEATURE] et ses cas limites. »

7. **Tech Lead** — Release / Merge (Production)
   > « En tant que Tech Lead, valide le merge de `feat/*` vers `dev`. »
   > 🚀 **Release** : La fusion de `dev` vers `main` est réservée aux livraisons officielles (fin de phase).

---

## Règles
- Ne pas sauter l'étape Tech Lead — le plan écrit est obligatoire avant tout code.
- **Gitflow** : On ne travaille **JAMAIS** directement sur `main`. On part de `dev`, on fusionne dans `dev`.
- **Jamais de commit sans passer par l'étape 5 (Code Review & Test).**
- Scope max : 1–3 fichiers par étape Dev.
- Si une étape révèle un blocage, remonter au rôle précédent avant de continuer.

