# ============================================================================
# Dockerfile pour le front-end VitalSync (Nginx)
#
# Utilise nginx:stable-alpine pour sa légèreté (~25 Mo) et sa stabilité.
# L'image Alpine réduit la surface d'attaque en production.
# ============================================================================

FROM nginx:stable-alpine

# Métadonnées
LABEL maintainer="VitalSync DevOps Team"
LABEL description="VitalSync Frontend - Nginx serving static files"

# Supprimer la configuration Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre configuration Nginx personnalisée (avec proxy_pass)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques du front-end
COPY index.html /usr/share/nginx/html/index.html

# Exposer le port HTTP
EXPOSE 80

# Nginx s'exécute au premier plan (requis par Docker)
CMD ["nginx", "-g", "daemon off;"]
