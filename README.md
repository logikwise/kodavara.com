# Kodavara Website

Static marketing website for [kodavara.com](https://kodavara.com) — served via nginx in a Docker container.

---

## Local Development

```bash
# Run locally on http://localhost:80
docker compose up

# Rebuild after file changes
docker compose up --build

# Stop
docker compose down
```

Or just open `index.html` directly in a browser — no build step needed.

---

## Project Structure

```
kodavara.com/
├── index.html
├── services.html
├── frameworks.html
├── about.html
├── contact.html
├── signature.html          # Email signature — hosted, not linked on site
├── css/main.css
├── js/
│   ├── main.js             # GSAP animations
│   └── components.js       # Shared nav & footer
├── Dockerfile
├── nginx.conf
├── docker-compose.yml      # Single compose file for all environments
├── deploy.sh               # Manual deploy script
└── .github/workflows/
    └── deploy.yml          # Auto-deploy on push to main
```

---

## Deployment

### Automatic (GitHub Actions — push to deploy)

Every push to `main` builds a new image, pushes it to `ghcr.io`, copies
`docker-compose.yml` to your VPS, and restarts the container.

**One-time setup:**

1. Install Docker on your Hostinger VPS:
   ```bash
   curl -fsSL https://get.docker.com | sh
   mkdir -p /opt/kodavara
   ```

2. Add these **GitHub Secrets** (Settings → Secrets → Actions):

   | Secret | Value |
   |--------|-------|
   | `HOSTINGER_HOST` | Your VPS IP address |
   | `HOSTINGER_USER` | SSH username (usually `root`) |
   | `HOSTINGER_SSH_KEY` | Your private SSH key (full contents) |

3. Push to `main` — everything else is automatic.

---

### Manual Deploy

```bash
export REMOTE_HOST=your-vps-ip
export REMOTE_USER=root
chmod +x deploy.sh
./deploy.sh
```

---

### First-time deploy on VPS (no CI)

```bash
# On your Hostinger VPS
mkdir -p /opt/kodavara
cd /opt/kodavara

# Copy docker-compose.yml here, then:
docker compose pull
docker compose up -d
```

---

## Updating

```bash
# Local change → push → auto-deploys in ~2 min
git add .
git commit -m "your change"
git push
```

---

## Image

- Base: `nginx:alpine` (~25MB)
- Registry: `ghcr.io/logikwise/kodavara-web:latest`
- Port: `80`
- Traefik-ready with `kodavara.com` routing labels
