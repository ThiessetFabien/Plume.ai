# Audit Sécurité & RGPD - Plume.ai

Ce document évalue l'état actuel de l'application au regard des standards de sécurité modernes (OWASP) et de la conformité européenne (RGPD).

## 📊 Score Global : 65/100 (Portfolio-Ready)

L'application présente une excellente structure logicielle et une expérience utilisateur premium, mais souffre de lacunes critiques pour une mise en exploitation réelle ("Production-Ready").

---

## ⚖️ Conformité RGPD

### État Actuel
- **Minimisation des données** : ✅ Excellent. Seuls le nom, l'email et l'âge sont collectés.
- **Transparence** : ❌ Manquant. Pas de mention de politique de confidentialité dans le flux d'inscription.
- **Droit à l'effacement** : ❌ Incomplet. Aucun moyen pour un joueur de supprimer son profil via l'interface ou une API dédiée.

### Recommandations Prioritaires
1.  **Ajouter un endpoint DELETE /players/{id}** pour permettre l'exercice du droit à l'oubli.
2.  **Intégrer une mention RGPD** sur l'écran de profil mobile expliquant la finalité du traitement des données (gestion du club et IA).

---

## 🛡️ Sécurité Logicielle

### Vulnérabilités Identifiées
1.  **Absence d'Authentification (Critique)** :
    - L'API est ouverte. N'importe qui peut agir pour le compte de n'importe quel ID joueur.
    - Risque d'IDOR (Insecure Direct Object Reference) massif.
2.  **CORS Permissif** :
    - Actuellement configuré en `allow_origins=["*"]`.
    - Risque de Cross-Origin Request Forgery si des cookies de session étaient utilisés.
3.  **Logs & Monitoring** :
    - Pas de système de logs structuré pour tracer les actions sensibles (suppressions groupées).

### Recommandations Prioritaires
1.  **Implémentation JWT/OAuth2** : Sécuriser les routes `/players` et `/reservations`.
2.  **Middleware de Propriété (Ownership)** : Vérifier que le `player_id` de la requête correspond au joueur authentifié.
3.  **Restriction CORS** : Fixer les origines autorisées (ex: le domaine final et localhost uniquement).

---

## 🏗️ Qualité de l'Implémentation

### Points Forts
- **Validation stricte** : L'utilisation systématisée de Pydantic et de types SQL stricts prévient la plupart des injections de données absurdes.
- **Robustesse du Quota** : La nouvelle règle des 2 jours par semaine est implémentée avec une couverture de tests unitaires satisfaisante.

### Points Faibles
- **Couverture de tests** : Les tests unitaires restent limités aux scénarios nominaux. Manque de tests de "Stress" ou de concurrence (Race Condition sur le quota de 20 places).

---

## 🚀 Prochaines Étapes Suggérées

| Priorité | Tâche | Impact |
| :--- | :--- | :--- |
| **P0** | Système d'Auth (Login/Register) | Sécurité & RGPD |
| **P1** | Suppression de compte (Droit à l'oubli) | Conformité légale |
| **P2** | Logs d'audit backend | Robustesse |
| **P3** | Empty States & Feedback UX | Expérience utilisateur |
