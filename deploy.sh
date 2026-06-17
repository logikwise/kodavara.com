#!/bin/bash
# ============================================================
# KODAVARA — Deploy Script
# Builds the Docker image, tags it, and pushes to your
# registry, then pulls and restarts on the remote host.
#
# Setup:
#   1. Set environment variables below (or export them before running)
#   2. chmod +x deploy.sh
#   3. ./deploy.sh
# ============================================================

set -euo pipefail

# ── Configuration ────────────────────────────────────────────
# Edit these or export them as env vars before running

IMAGE_NAME="${IMAGE_NAME:-kodavara-web}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Docker Hub example:  your-dockerhub-username/kodavara-web
# GHCR example:        ghcr.io/logikwise/kodavara-web
REGISTRY="${REGISTRY:-ghcr.io/logikwise/kodavara-web}"

# Remote server (Hostinger VPS)
REMOTE_HOST="${REMOTE_HOST:-your-server-ip}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/opt/kodavara}"

FULL_IMAGE="${REGISTRY}:${IMAGE_TAG}"

# ── Colors ───────────────────────────────────────────────────
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${CYAN}[kodavara]${NC} $1"; }
ok()  { echo -e "${GREEN}✓${NC} $1"; }
warn(){ echo -e "${YELLOW}!${NC} $1"; }

# ── Build ────────────────────────────────────────────────────
log "Building Docker image: ${FULL_IMAGE}"
docker build \
  --platform linux/amd64 \
  -t "${IMAGE_NAME}:${IMAGE_TAG}" \
  -t "${FULL_IMAGE}" \
  .
ok "Build complete"

# ── Push to registry ─────────────────────────────────────────
log "Pushing to registry: ${FULL_IMAGE}"
docker push "${FULL_IMAGE}"
ok "Push complete"

# ── Deploy to remote server ──────────────────────────────────
log "Deploying to ${REMOTE_HOST}..."

ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<REMOTE
  set -e

  # Create directory if needed
  mkdir -p ${REMOTE_DIR}

  # Pull latest image
  echo "Pulling ${FULL_IMAGE}..."
  docker pull ${FULL_IMAGE}

  # Stop and remove existing container (if running)
  docker stop kodavara 2>/dev/null || true
  docker rm   kodavara 2>/dev/null || true

  # Run new container
  docker run -d \
    --name kodavara \
    --restart always \
    -p 80:80 \
    --memory 128m \
    --cpus 0.5 \
    ${FULL_IMAGE}

  # Verify it's running
  sleep 3
  docker ps --filter name=kodavara --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

  # Clean up old images
  docker image prune -f
REMOTE

ok "Deployed successfully to ${REMOTE_HOST}"
log "Site should be live at http://${REMOTE_HOST}"
