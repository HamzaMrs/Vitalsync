# ============================================================================
# Dockerfile multi-stage pour le back-end VitalSync (Node.js/Express)
# 
# POURQUOI UN MULTI-STAGE BUILD ?
# 1. Sécurité : Le stage de production ne contient pas les devDependencies
#    (jest, supertest, eslint), réduisant la surface d'attaque. Les outils
#    de développement et de test ne sont jamais présents en production.
# 2. Taille d'image : L'image finale basée sur Alpine (~5 Mo de base) est
#    bien plus légère qu'une image node:20 classique (~900 Mo). Seules les
#    dépendances de production sont copiées dans le stage final.
# 3. Fiabilité : Les tests sont exécutés pendant le build. Si un test échoue,
#    l'image Docker ne sera pas construite, garantissant qu'aucune image
#    défectueuse n'est publiée.
# ============================================================================

# ---- Stage 1 : Test & Build ----
# Ce stage installe TOUTES les dépendances (y compris dev) et exécute les tests
FROM node:20-alpine AS builder

WORKDIR /app

# Copier d'abord les fichiers de dépendances pour optimiser le cache Docker
# Si package.json ne change pas, Docker réutilise le cache de npm install
COPY package.json package-lock.json* ./

# Installer toutes les dépendances (y compris devDependencies pour les tests)
RUN npm install

# Copier le reste du code source
COPY . .

# Exécuter les tests unitaires - si un test échoue, le build s'arrête
RUN npm test

# ---- Stage 2 : Production ----
# Image légère Alpine pour la production, ne contient que le nécessaire
FROM node:20-alpine AS production

# Métadonnées de l'image
LABEL maintainer="VitalSync DevOps Team"
LABEL description="VitalSync API - Back-end Node.js/Express"
LABEL version="1.0.0"

WORKDIR /app

# Copier uniquement les fichiers nécessaires au runtime
COPY package.json package-lock.json* ./

# Installer UNIQUEMENT les dépendances de production (pas de jest, supertest, etc.)
RUN npm install --only=production && npm cache clean --force

# Copier le code source depuis le stage builder
COPY --from=builder /app/server.js ./

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exposer le port de l'API
EXPOSE 3000

# Healthcheck intégré au conteneur
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Lancer le serveur
CMD ["node", "server.js"]
