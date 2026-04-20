import multiprocessing
import os

# Configuration Gunicorn pour un déploiement Lean & Robuste
# Adaptation dynamique aux ressources (ANSSI / Cloud-Ready)

bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"

# Recommandation : 2 * cores + 1
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"

# Timeout large pour les appels IA (Groq peut être lent parfois)
timeout = 120
keepalive = 5

# Logs
loglevel = os.getenv("LOG_LEVEL", "info")
accesslog = "-"  # Sortie standard pour Docker/Cloud
errorlog = "-"
