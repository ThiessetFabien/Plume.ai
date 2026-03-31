# Utilisation de Python 3.11 en version alpine (ultra-léger, Portfolio First)
FROM python:3.11-alpine

WORKDIR /app

# Optimisation du cache Docker : on copie d'abord les requirements
COPY requirements.txt ./

# Installation des dépendances systèmes (nécessaires pour compiler psycopg2 sur alpine)
RUN apk add --no-cache gcc musl-dev libpq-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apk del gcc musl-dev

# Copier le reste du code backend
COPY . .

EXPOSE 8000

# Commande de lancement avec hot-reload (crucial pour le confort de dev)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
