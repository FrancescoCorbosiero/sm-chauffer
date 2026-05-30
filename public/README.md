# Brand assets — where the logo and images live

Everything in this `public/` folder is served from the site root. A file at
`public/logo.png` is reachable at `https://chauffeurskmilano.it/logo.png`.

**This is where you load the logo.** The files below currently contain
auto-generated *placeholders* (a gold "SM" monogram on the brand-ink
background). Replace each file in place — keep the **same filename and
dimensions** and everything else (the navbar, favicon, social previews and
SEO/structured data) picks them up automatically. No code changes needed.

To regenerate the placeholders from scratch: `node scripts/generate-brand-placeholders.mjs`.

## Asset checklist

| File | Used for | Recommended format & size | Referenced in |
|------|----------|---------------------------|----------------|
| `logo.png` | The header/navbar logo | Transparent PNG (or SVG), square, ≥ 512×512. Must read on **both** the white navbar and the dark hero. | `src/components/layout/Navbar.tsx` |
| `favicon.ico` | Browser tab icon | ICO, 32×32 (16/32/48 multi-size ideal) | `src/app/layout.tsx` → `metadata.icons.icon` |
| `apple-touch-icon.png` | iOS home-screen icon | Opaque PNG, 180×180 (iOS adds its own rounded corners) | `src/app/layout.tsx` → `metadata.icons.apple` |
| `og.png` | **Rich content** — link previews on WhatsApp, iMessage, Facebook, LinkedIn, X, etc. + the `logo`/`image` in JSON-LD structured data | PNG or JPG, exactly **1200×630** | `src/app/layout.tsx` (Open Graph + Twitter) and `src/components/seo/JsonLd.tsx` |

### About "rich content" / link previews

When the site URL is shared in a chat or posted on social media, the preview
card (big image + title + description) is driven by the **Open Graph** tags in
`src/app/layout.tsx`, which point at `og.png`. Search engines additionally read
the **JSON-LD** in `src/components/seo/JsonLd.tsx`, where `logo` points at
`logo.png` and `image` points at `og.png`. So:

- **Logo in Google Knowledge Panel / structured data** → `logo.png`
- **Social/chat share card image** → `og.png`

### Notes

- Prefer a **transparent** `logo.png` so it works over the light navbar and the
  dark homepage hero.
- If you switch `og.png` to a `.jpg`, update the three references listed in the
  table (search the repo for `og.png`).
- The favicon, apple icon and `og.png` can also be provided via Next.js file
  conventions (`src/app/icon.png`, `src/app/apple-icon.png`,
  `src/app/opengraph-image.png`). This project uses the explicit `public/`
  approach so all brand assets sit together in one folder — pick one approach,
  don't mix both for the same icon.
