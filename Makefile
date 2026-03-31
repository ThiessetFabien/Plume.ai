.PHONY: up down logs db-logs api-logs mobile-dev

# ==============================================================================
# COMMANDES DEVOPS (Portfolio First)
# Ce fichier centralise et simplifie les scripts complexes de l'application
# ==============================================================================

# Lance toute la stack métier (Postgres, API, Metabase) en arrière-plan
up:
	docker compose up -d

# Arrête toute la stack
down:
	docker compose down

# Affiche tous les logs
logs:
	docker compose logs -f

# Logs de l'API (pratique pour le débug Python/FastAPI)
api-logs:
	docker compose logs -f backend_api

# Logs de la base de données
db-logs:
	docker compose logs -f postgres

# Lance l'application mobile React Native en mode dev
mobile-dev:
	cd mobile && npx expo start
