# Deployment

The site is a **static-first Next.js 16 app** that builds to a self-contained
standalone server (`output: 'standalone'`) and ships as a small Docker image.
Reverse proxying + HTTPS on the VPS is handled by **Caddy** via container
labels — no Caddyfile editing, no manual certificates.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # ESLint (flat config, eslint.config.mjs)
npm run build      # production build
npm start          # serve the production build
```

## Run the production image locally

```bash
docker build -t sm-luxury-chauffeur .
docker run --rm -p 3000:3000 sm-luxury-chauffeur
# open http://localhost:3000
```

## Deploy to the VPS (Docker + Caddy)

### 1. One-time: a Caddy reverse proxy on the host

The app container advertises itself to Caddy through labels. You need a Caddy
instance running [`lucaslorentz/caddy-docker-proxy`](https://github.com/lucaslorentz/caddy-docker-proxy)
on a shared Docker network. Set this up once per host:

```bash
docker network create caddy
```

```yaml
# caddy/docker-compose.yml  (run this stack once, it serves every app on the box)
services:
  caddy:
    image: lucaslorentz/caddy-docker-proxy:ci-alpine
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      CADDY_INGRESS_NETWORKS: caddy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - caddy

networks:
  caddy:
    external: true

volumes:
  caddy_data:
  caddy_config:
```

```bash
cd caddy && docker compose up -d
```

Caddy now watches Docker for `caddy.*` labels and configures itself live,
fetching/renewing Let's Encrypt certificates automatically.

### 2. Deploy this app

Point the domain's DNS (`chauffeurskmilano.it` and `www`) at the VPS, then:

```bash
git clone <repo> sm-chauffer && cd sm-chauffer
cp .env.example .env        # optional: add the Search Console token
docker compose up -d --build
```

That's it. The labels in `docker-compose.yml` tell Caddy to:

- serve `https://chauffeurskmilano.it` → reverse-proxy to the container's port 3000,
- 301-redirect `https://www.chauffeurskmilano.it` → the apex.

### Updating

```bash
git pull
docker compose up -d --build      # rebuild + recreate, zero Caddy changes
```

## Email / form delivery

The contact and booking forms have **no backend and use no AWS SES** — by
design. On submit they offer the visitor two handoffs:

- **WhatsApp** → a `wa.me` deep link to `SITE.whatsapp`, pre-filled with the
  booking, and
- **Email** → a `mailto:` link to `SITE.email`, opening the visitor's own mail
  client with the booking pre-filled (always written in Italian).

Both targets come from a single source of truth: `SITE` in `src/lib/site.ts`.

**Routing bookings to an external inbox** (e.g. a Gmail not on the domain):
the recommended setup keeps the public `mailto:` target as the branded
`info@chauffeurskmilano.it` and adds a **forwarding rule in your domain webmail**
(`info@ → maksymnoleggio@gmail.com`, the `emailBackend` value). This:

- keeps the personal address out of visitors' mail clients,
- needs no code change and no mail-sending infrastructure,
- delivers every submission to the external inbox.

To retarget the `mailto:` directly instead, change `SITE.email` — it updates
the forms, footer, contact page and structured data in one place.

> If you later want forms that send automatically server-side (and are
> end-to-end testable), that requires adding an API route with SES or domain
> SMTP — a deliberate step up from the current zero-infra approach.

## Notes

- **Different domain?** Change the two `caddy_0` / `caddy_1` host labels in
  `docker-compose.yml` (and `SITE.url` in `src/lib/site.ts`).
- **Brand assets** (logo, favicon, social card) live in `public/` — see
  `public/README.md`.
- The image runs as a non-root user and has a built-in healthcheck.
