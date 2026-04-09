# Protocole Git Plume.ai (Agents)

Ce document définit les règles de contribution Git que tous les agents doivent suivre impérativement.

## 1. Hiérarchie des Branches
- **`main`** : Branche de PRODUCTION. 
    - Stable, testée, "Release-ready".
    - On n'y commit jamais directement.
    - Seul le Tech Lead fusionne `dev` vers `main`.
- **`dev`** : Branche d'INTÉGRATION.
    - Base de tout travail.
    - Les agents partent de `dev` et fusionnent dans `dev`.
- **`feat/*`** ou **`fix/*`** : Branches de TRAVAIL.
    - Créées à partir de `dev`.
    - Nommées explicitement (ex: `feat/anonymized-coaching`).

## 2. Convention de Commit
Utiliser les **Conventional Commits** :
- `feat(...)`: Nouvelle fonctionnalité.
- `fix(...)`: Correction de bug.
- `chore(...)`: Maintenance (docs, build, etc.).
- `refactor(...)`: Modification de code sans changement de comportement.

## 3. Workflow d'une tâche
1. `git checkout dev`
2. `git pull origin dev`
3. `git checkout -b feat/ma-feature`
4. [Travail / Code / Tests]
5. `git add . && git commit -m "feat: description"`
6. `git checkout dev`
7. `git merge feat/ma-feature`
8. `git branch -D feat/ma-feature`
