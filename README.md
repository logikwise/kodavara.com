# Kodavara Website

Static marketing website for [kodavara.com](https://kodavara.com) — served via nginx in a Docker container.

---

## Local Development

### Option A — Docker (recommended)
```bash
# Build and run locally on http://localhost:8080
docker compose up

# Rebuild after file changes
docker compose up --build
```

### Option B — Plain browser
Just open `index.html` directly in a browser. No build step needed.

---

## Project Structure

```
kodavara/
├── index.html              # Homepage
├── services.html           # Services page
├── frameworks.html         # Frameworks & Accelerators
├── about.html              # About page
├── contact.html            # Contact page
├── signature.html          # Email signature (hosted, not linked on site)
├── css/
│   └── main.css            # All styles
├── js/
│   ├── main.js             # GSAP animations & interactions
│   └── components.js       # Shared nav & footer injection
├── Dockerfile              # nginx:alpine image
├── nginx.conf              # nginx server config
├── docker-compose.yml      # Local dev compose
├── docker-compose.prod.yml # Production overrides
├── deploy.sh               # Manual deploy script
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions CI/CD
```

---

## Deployment

### Automatic (GitHub Actions — recommended)

Every push to `main` automatically builds a new Docker image and deploys it to your Hostinger VPS.

**One-time setup:**

1. **Enable GitHub Container Registry** — already enabled for public repos via `ghcr.io`

2. **Add these GitHub Secrets** (Settings → Secrets → Actions):

   | Secret | Value |
   |--------|-------|
   | `HOSTINGER_HOST` | Your VPS IP address |
   | `HOSTINGER_USER` | SSH username (usually `root`) |
   | `HOSTINGER_SSH_KEY` | Your private SSH key (paste full contents) |

3. **On your Hostinger VPS**, make sure Docker is installed:
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

4. **Push to main** — the action builds, pushes to `ghcr.io`, and deploys automatically.

---

### Manual Deploy

```bash
# Set your config
export REGISTRY=ghcr.io/logikwise/kodavara-web
export REMOTE_HOST=your-vps-ip
export REMOTE_USER=root

# Run deploy script
chmod +x deploy.sh
./deploy.sh
```

---

### Deploy to Hostinger VPS directly (first time)

SSH into your VPS and run:

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Pull and run the image
docker pull ghcr.io/logikwise/kodavara-web:latest

docker run -d \
  --name kodavara \
  --restart always \
  -p 80:80 \
  ghcr.io/logikwise/kodavara-web:latest
```

---

## SSL / HTTPS (optional but recommended)

For free SSL on Hostinger VPS, install Caddy as a reverse proxy:

```bash
# Install Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install caddy
```

Create `/etc/caddy/Caddyfile`:
```
kodavara.com {
    reverse_proxy localhost:80
}
```

Then update your Docker run to use port `8080` instead of `80`:
```bash
docker run -d --name kodavara --restart always -p 8080:80 ghcr.io/logikwise/kodavara-web:latest
```

And update Caddyfile to `reverse_proxy localhost:8080`.

---

## Updating the Site

1. Edit HTML/CSS/JS files locally
2. `git add . && git commit -m "your change" && git push`
3. GitHub Actions builds and deploys automatically (~2 minutes)

---

## Image Size

The final Docker image is approximately **25–30MB** (nginx:alpine base).
