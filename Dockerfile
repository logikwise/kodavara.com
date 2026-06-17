# ============================================================
# KODAVARA — Static Site Docker Image
# Base: nginx:alpine (tiny ~25MB footprint)
# ============================================================
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy site files
COPY . /usr/share/nginx/html/

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
