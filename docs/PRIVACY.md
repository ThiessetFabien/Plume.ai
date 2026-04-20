# Politique de Confidentialité & Minimisation des Données (RGPD)

Plume.ai s'engage à respecter la vie privée de ses utilisateurs et à minimiser la collecte de données personnelles au strict nécessaire pour le bon fonctionnement du service.

## 1. Données Collectées & Finalités

Conformément au principe de **minimisation des données** (Art. 5 du RGPD), voici le détail des informations collectées :

| Donnée | Type | Finalité | Durée de conservation |
| :--- | :--- | :--- | :--- |
| **Nom complet** | Identité | Identification du membre au club et personnalisation de l'interface. | Durée de l'adhésion + 1 an. |
| **Email** | Contact | Identifiant de connexion et communication administrative. | Durée de l'adhésion + 1 an. |
| **Mot de passe** | Sécurité | Authentification sécurisée (Haché via Argon2/Bcrypt). | Jusqu'à suppression du compte. |
| **Âge** | Profiling | Adaptation des conseils de l'IA (intensité physique recommandée). | Durée de l'adhésion. |
| **Sexe / Genre** | Profiling | Accord grammatical de l'IA et conseils morpho-spécifiques. | Durée de l'adhésion. |
| **Fréquence** | Métrique | Calcul du taux d'assiduité et alertes "Membres Fantômes". | Durée de l'adhésion. |
| **Présences** | Activité | Suivi de la progression et génération du tableau de bord. | 24 mois. |

## 2. Sécurité des Données (HDS-Ready)

*   **Chiffrement au repos** : Les données sensibles (`age`, `gender`) sont chiffrées en base de données (AES-256 via Fernet) pour empêcher toute lecture directe en cas de compromission physique du serveur.
*   **Chiffrement en transit** : Tous les échanges sont sécurisés via TLS (HTTPS).
*   **Hachage** : Les mots de passe ne sont jamais stockés en clair.

## 3. Droits des Utilisateurs

Vous disposez des droits suivants sur vos données :
*   **Droit d'accès** : Consulter vos données directement via votre profil.
*   **Droit de rectification** : Modifier vos informations depuis l'application.
*   **Droit à l'effacement** : Demander la suppression totale de votre compte et des données associées.
*   **Droit à la portabilité** : (Prochainement) Export de vos données d'entraînement.

## 4. Consentement

Le traitement des données relatives au profilage (âge, sexe) n'est effectué qu'après obtention de votre **consentement explicite** lors de la création de votre compte. Vous pouvez retirer ce consentement à tout moment en demandant la suppression de votre compte.

---
*Dernière mise à jour : 19 Avril 2026*
