
FROM nginx:alpine

# Créer l'utilisateur non-root
RUN adduser -D -u 1001 -s /bin/sh nginxuser

# Créer le dossier pour le socket et donner les permissions
RUN mkdir -p /var/run && \
    chown -R nginxuser:nginxuser /var/run

COPY ./public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Donner les permissions
RUN chown -R nginxuser:nginxuser /usr/share/nginx/html && \
    chown -R nginxuser:nginxuser /var/cache/nginx && \
    chown -R nginxuser:nginxuser /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginxuser:nginxuser /var/run/nginx.pid

USER nginxuser

EXPOSE 80

# Health check qui fonctionne avec l'utilisateur non-root
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=5 \
    CMD curl --fail http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
