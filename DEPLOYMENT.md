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
docker build -t chauffeur-sk-luxury-milano .
docker run --rm -p 3000:3000 chauffeur-sk-luxury-milano
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

On submit, the booking/contact forms open a modal with two channels:

- **WhatsApp** → a `wa.me` deep link to `SITE.whatsapp`, pre-filled, and
- **Email** → posts the structured booking to `POST /api/quote`, which sends it
  **server-side via AWS SES** (always written in Italian).

### AWS SES routing (the "WP Mail SMTP via SES" equivalent)

`/api/quote` sends through SES when these env vars are set (see `.env.example`):

| Var | Purpose |
|-----|---------|
| `AWS_REGION` | SES region, e.g. `eu-south-1` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM creds with `ses:SendEmail` (or an instance role) |
| `SES_FROM_EMAIL` | A **verified** SES sending identity, e.g. `info@chauffeurskmilano.it` |
| `SES_TO_EMAIL` | Where bookings land. **One or more** recipients, comma-separated — mix the domain webmail and external inboxes, e.g. `info@chauffeurskmilano.it,maksymnoleggio@gmail.com` |

The customer's email is set as the message **Reply-To**, so the operator can
reply straight from their inbox. The endpoint validates every field
server-side and rejects bots via a hidden honeypot.

**Customer confirmation:** after the operator notification, a **contact-form**
submission also triggers an elegant branded HTML confirmation to the customer's
own address, recapping what they sent — in the language they were browsing in.
It is best-effort (a failure never fails the request) and only runs for the
contact form, which is where the customer's email is collected. Because it
sends to a visitor-supplied address, it needs SES **production access** to work
for arbitrary recipients; consider adding rate-limiting / a CAPTCHA before
heavy public exposure, as the honeypot is the only abuse guard today.

**SES setup:** verify `SES_FROM_EMAIL` (or its whole domain via DKIM) as an
identity in the SES console, then **request production access** to leave the
sandbox — in the sandbox SES only delivers to verified recipients. Once in
production, `SES_TO_EMAIL` (and any Reply-To) can be any external address.

**Graceful fallback:** if the SES vars are absent, `/api/quote` returns `503`
and the modal falls back to a `mailto:` to `SITE.email`. So the site works with
zero email infrastructure, and the WhatsApp channel is always available.
`SITE` (`src/lib/site.ts`) remains the single source of truth for the public
address; for delivery to an off-domain inbox without SES you can instead add a
webmail forwarding rule (`info@ → maksymnoleggio@gmail.com`, the `emailBackend`).

## Analytics, consent & SEO

### Build-time vs runtime config

`NEXT_PUBLIC_*` vars are **inlined into the bundle when the image is built**, so
`docker-compose.yml` passes them as `build.args` (not runtime `environment`).
The values are read from your `.env`, so the normal deploy command picks them up:

```bash
docker compose up -d --build   # re-bakes NEXT_PUBLIC_* from .env into the image
```

> Changing an analytics ID or the Search Console token therefore requires a
> rebuild (the `--build` flag), not just a restart.

This covers `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_ID` and the
two `NEXT_PUBLIC_UMAMI_*` vars. The SES/AWS vars stay runtime `environment`.

### Two analytics providers (both optional)

| Provider | Env | Consent banner? | Notes |
|----------|-----|-----------------|-------|
| **GA4** | `NEXT_PUBLIC_GA_ID` (`G-…`) | **Yes** | Boots with Consent Mode v2 *denied by default*; cookies/Ads signals only fire after the visitor accepts. The banner is localized into all 7 site languages. |
| **Umami** | `NEXT_PUBLIC_UMAMI_SRC` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | No | Cookieless, GDPR-friendly baseline traffic. Runs for every visitor with no banner. |

With neither set, **no tracking scripts are emitted and no banner is shown** —
the site is clean by default.

**Self-hosting Umami** (cookieless, fits this VPS — Caddy gives it HTTPS via the
same label trick):

```yaml
# add to a compose stack on the same host (shares the `caddy` network)
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    environment:
      DATABASE_URL: postgresql://umami:umami@umami-db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: change-me
    networks: [caddy, default]
    labels:
      caddy: "analytics.chauffeurskmilano.it"
      caddy.reverse_proxy: "{{upstreams 3000}}"
```

Then set `NEXT_PUBLIC_UMAMI_SRC=https://analytics.chauffeurskmilano.it/script.js`
and the `WEBSITE_ID` from the Umami dashboard, and rebuild.

### Google Search Console

Put the verification token (the `content` of the
`<meta name="google-site-verification">` tag, or use the DNS method instead) in
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` and rebuild. After it verifies, submit
`https://chauffeurskmilano.it/sitemap.xml` in Search Console.

### What's already wired for SEO

- Canonical URL + per-page Open Graph/Twitter metadata on every route.
- `robots.txt` + multilingual `sitemap.xml` (hreflang alternates, blog posts).
- JSON-LD: `LocalBusiness`/`LimousineService`, `Organization`, `WebSite`,
  per-post `BlogPosting`, `FAQPage`, and `BreadcrumbList` on every internal page.
- Security headers + LCP image `priority`/`preconnect` for Core Web Vitals.

## Notes

- **Different domain?** Change the two `caddy_0` / `caddy_1` host labels in
  `docker-compose.yml` (and `SITE.url` in `src/lib/site.ts`).
- **Brand assets** (logo, favicon, social card) live in `public/` — see
  `public/README.md`.
- The image runs as a non-root user and has a built-in healthcheck.
