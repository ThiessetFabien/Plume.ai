# Workflow Git : Plume.ai (Main/Dev/Feat)

Ce projet utilise un workflow Git inspiré de **Gitflow** pour garantir une stabilité maximale et une traçabilité rigoureuse lors du développement multi-agents.

## Stratégie de Branches

| Branche | Rôle | Source | Destination |
| :--- | :--- | :--- | :--- |
| `main` | Production / Stable | `dev` | - |
| `dev` | Intégration / Staging | `main` | `main` |
| `feat/*` | Nouvelles fonctionnalités | `dev` | `dev` |
| `fix/*` | Correctifs | `dev` / `main` | `dev` / `main` |

## Pourquoi ce choix ?

1. **Isolation** : La branche `main` ne contient que du code testé et prêt à être déployé.
2. **Parallélisme** : Plusieurs fonctionnalités peuvent être développées sur des branches `feat/*` distinctes sans polluer la branche de production.
3. **Qualité** : Chaque merge vers `main` est une "Release" officielle qui nécessite un bilan de phase complet.

## Commandes clés

```bash
# Commencer un travail
git checkout dev
git checkout -b feat/nom-de-la-feature

# Finaliser
git add .
git commit -m "feat: mon message"
git checkout dev
git merge feat/nom-de-la-feature
```
