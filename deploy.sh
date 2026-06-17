#!/bin/bash
# ============================================================
# KODAVARA — Deploy Script
# Builds the Docker image, pushes to registry, then
# pulls and restarts on the remote host with one compose file.
#
# Setup:
#   export REMOTE_HOST=your-vps-ip
#   export REMOTE_USER=root          # or your SSH user
#   chmod +x deploy.sh && ./deploy.sh
# ============================================================

set -euo pipefail

REGISTRY="${REGISTRY:-ghcr.io/logikwise/kodavara-web}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
FULL_IMAGE="${REGISTRY}:${IMAGE_TAG}"

REMOTE_HOST="${REMOTE_HOST:-your-server-ip}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/opt/kodavara}"

GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
log() { echo -e "${CYAN}[kodavara]${NC} $1"; }
ok()  { echo -e "${GREEN}✓${NC} $1"; }

# ── Build ────────────────────────────────────────────────────
log "Building: ${FULL_IMAGE}"
docker build --platform linux/amd64 -t "${FULL_IMAGE}" .
ok "Build complete"

# ── Push ─────────────────────────────────────────────────────
log "Pushing: ${FULL_IMAGE}"
docker push "${FULL_IMAGE}"
ok "Push complete"

# ── Deploy ───────────────────────────────────────────────────
log "Deploying to ${REMOTE_HOST}..."

ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<REMOTE
  set -e
  mkdir -p ${REMOTE_DIR}
  cd ${REMOTE_DIR}

  # Copy compose file if not already there
  # (or you can git pull on the server instead)

  docker compose pull
  docker compose up -d --remove-orphans
  docker image prune -f

  echo ""
  docker ps --filter name=kodavara --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
REMOTE

ok "Deployed to ${REMOTE_HOST}"
log "Live at http://${REMOTE_HOST}"
