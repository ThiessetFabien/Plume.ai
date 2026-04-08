# Cahier des Charges - Prototype "Plume.ai"

## 1. Contexte, Objectifs et Philosophie
L'association de Badminton de Cuincy souhaite moderniser le suivi de l'assiduité de ses joueurs. L'application **Plume.ai** a pour but d'offrir une solution sur-mesure répondant à cette problématique via une approche novatrice basée sur la donnée et l'intelligence artificielle.

Ce projet est piloté par une méthodologie stricte **"Portfolio-First & AI-First"** visant à maximiser la valorisation d'un profil technique :
- **L'approche "AI-First" :** Prouver la capacité d'un développeur (Tech Lead) à déléguer l'écriture du code de manière millimétrée à des agents IA via du Prompt Engineering avancé, multipliant la productivité par 10 sans sacrifier la Clean Architecture.
- **L'approche "Portfolio-First" :** Démontrer des compétences hybrides (*Business Data Analyst* et *Web/Mobile*) à de futurs recruteurs, où chaque fonctionnalité, chaque choix d'API souveraine, et chaque commit Git est un argument d'embauche.

## 2. Gratuité et Open Source (Souveraineté Numérique)
L'ensemble de la pile technologique sélectionnée pour ce projet repose sur des outils **100% Open Source et gratuits** (Python, React Native, PostgreSQL). 
Cela garantit à l'association de Cuincy une absence totale de frais de licences logicielles ("Vendor Lock-in") et une transparence totale sur le traitement des données de ses adhérents.

## 3. La "Feature Waow" Unique (MVP Ultime)
Pour maximiser l'impact lors d'une démonstration tout en minimisant le temps de développement, le prototype se concentre sur **une seule fonctionnalité spectaculaire : Le Copilote Hybride IA (Santé & Engagement)**.

### Le problème métier de Cuincy : "Les membres fantômes"
L'association affiche complet, mais de nombreux terrains restent vides car certains inscrits ne se présentent pas (baisse de motivation, oubli). Pour un profil *Business Data Analyst*, c'est un cas d'école de **Churn Prediction** (Prédiction d'abandon).

### Fonctionnement du "Copilote IA" :
1. **L'analyse d'assiduité :** Le joueur visualise un graphique de ses heures jouées. S'il n'est pas venu depuis 3 semaines, la courbe le montre clairement.
2. **Le bouton "Mon Bilan IA" :** Le joueur sollicite l'assistant.
3. **Le Backend Python** extrait ses statistiques depuis PostgreSQL (date de dernière venue, moyenne annuelle).
4. **L'Intelligence Artificielle (LLaMa 3 par l'API Groq)** génère un message hyper-personnalisé à double tranchant selon le profil du joueur :
   - *Cas A (Le Sur-engagé) :* L'IA alerte sur les risques de sollicitation excessive (ex: *Attention Fabien, 4 séances cette semaine ! Ménage tes tendons !*).
   - *Cas B (Le Décrocheur) :* L'IA détecte l'absence prolongée et génère un texte de motivation engageant, ludique ou de "rappel à l'ordre" bienveillant pour le faire revenir sur les terrains (ex: *On ne t'a pas vu depuis 3 semaines Fabien, tes coéquipiers t'attendent mardi prochain ! C'est le moment de relancer la machine.*).

**Pourquoi cette feature est redoutable sur un CV ?**
- Elle résout un vrai problème métier "business" (Taux de remplissage effectif des terrains associatifs).
- Elle prouve la capacité à collecter et analyser la donnée (Data Engineer / Analyst).
- Elle exploite intelligemment les capacités de rédaction contextuelle des LLM (Génération de SMS de rétention).

### L'aspect "Gestion Capacitaire" : La Réservation de Terrains
Pour assurer le bon fonctionnement du club au quotidien, le système intègre une gestion de réservation en temps réel :
1. **Disponibilité des Terrains** : Visualisation des 5 terrains disponibles sur des créneaux de 60 minutes.
2. **Équité & Flux** : Un joueur ne peut réserver qu'un créneau à la fois, garantissant une rotation fluide des membres.
3. **Analytique Terrain** : Les données de réservation alimentent directement les dashboards Metabase pour l'optimisation des horaires d'ouverture.

## 4. Stack Technique Hybride
La "Golden Stack" du prototype permet d'épouser au mieux l'état de l'art actuel du développement logiciel :

### Les interfaces (Développement Front)
- **React Native (Expo) :** Développement multi-plateforme ultra-rapide en TypeScript.

### L'intelligence Métier (Développement Back-End & Data)
- **Python (FastAPI) :** Moteur central performant assurant la manipulation rapide des flux de données.
- **PostgreSQL :** Base de Données gratuite et leader de l'industrie pour sa solidité analytique.

### L'Intelligence Artificielle "Cloud Sans Serveur" (Brique Modulaire)
- **API Groq (Moteur LLaMa 3) :** Pour le développement du prototype interactif (MVP), l'application s'appuiera sur l'API gratuite et ultra-rapide de Groq (hébergement américain). Cela permet de ne pas surcharger la machine de développement tout en offrant des temps de réponse sous la seconde.
- **La perspective "Souveraineté Numérique" (Production) :** L'architecture du backend Python (FastAPI) est pensée de façon agnostique (modulaire). Lors d'une présentation ou d'un passage à l'échelle pour l'association de Cuincy, il sera trivial de remplacer la brique Groq par un **modèle Mistral AI** (Champion français hébergé en Europe). Cet argument garantira la conformité parfaite au RGPD et la *Souveraineté des Données de Santé* si le projet quitte le statut de prototype, sans devoir réécrire l'application de base.

## 5. Livrables Prévoyants (Phase 0)
1. **Infrastructure Dockerisée :** Définissant les interactions Postgres et API.
2. **Back-end Restful API :** Point de bascule complet entre le mobile, la base de données et l'API IA.
3. **Application Mobile "Copilote" :** Une vue unique épurée affichant le graphique d'assiduité et la recommandation de santé IA.

## 6. Qualité Logicielle : Versioning et Intégration Continue (CI/CD)
Pour garantir la robustesse du prototype et briller lors d'une évaluation technique, l'application intègre les standards DevOps majeurs :
- **Versioning Pro (Git) :** L'historique des modifications suivra la norme *Conventional Commits* (ex: `feat: ajout de la route santé`, `fix: correction du graphique`). C'est un prérequis indiscutable pour un profil Dev de haut niveau.
- **Intégration Continue (GitHub Actions) :** À chaque sauvegarde d'étape (commit poussé sur le serveur distant), un pipeline automatisé vérifiera la qualité du code (Linting Python, formattage) pour s'assurer que le standard ne régresse jamais. Le code de ce pipeline est inclus dès la Phase 0.

## 7. Sécurité & Pratiques Architecturales Intermédiaires
L'application esquive les 4 "pièges de développeur junior" les plus courants afin de démontrer une compétence réelle en ingénierie et data-privacy :
- **Gestion des Secrets (.env) :** Aucune clé API (comme celle de l'IA) ni aucun identifiant de base de données ne sera figé dans le code. Le fichier `.gitignore` est priorisé.
- **Réseau Mobile Dynamique :** Architecture conçue avec une reconnaissance des contraintes du réseau local (Expo/React Native) communiquant avec IP dynamiques, échappant au blocage courant du "localhost".
- **Prévention CORS :** Le backend (FastAPI) est implémenté avec `CORSMiddleware` dès la phase d'initialisation pour prévenir les rejets de connexions web et mobile inattendus.
- **Conformité RGPD "Data Privacy" :** Les données transférées dans le monde de l'IA générative (via cloud ou local) sont rigoureusement *anonymisées* coté Python (ex: mapping nominatif filtré avant l'injection dans le prompt LLaMa) pour garantir l'intégrité de la vie privée des membres du club.
