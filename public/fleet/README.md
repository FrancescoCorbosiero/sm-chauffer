# Fleet photos — drop your real car photos here

These files are the photos shown on the **Fleet** page and the homepage fleet
preview. They currently contain **branded placeholders** (the gold "SM"
monogram). Replace each one with a real photo of that vehicle — **keep the
exact same filename** and the site picks it up automatically, no code change.

| File | Vehicle |
|------|---------|
| `mercedes-s-class.jpg` | Mercedes Classe S |
| `mercedes-e-class.jpg` | Mercedes Classe E |
| `mercedes-v-class.jpg` | Mercedes Classe V |
| `range-rover.jpg` | Range Rover |
| `bus-18.jpg` | Bus 18 Posti |

## Specs

- **Aspect ratio: 5:4** (the cards crop to this). Recommended size **1200×960**.
- **Format:** JPG (keep the `.jpg` name). PNG works too — if you upload `.png`
  instead, just say so and I'll flip the one extension in `src/lib/images.ts`.
- Keep each file a reasonable weight (≈200–500 KB); Next.js optimises and
  resizes them automatically at build/serve time.

## Licensing reminder

Use photos you own or that are licensed for commercial use (e.g. your own
shots, or stock under a permissive licence such as Unsplash). The car models
themselves are fine to show — it's the *photograph* that carries copyright, so
don't pull images off the open web without a licence.

To regenerate the placeholders: `node scripts/generate-fleet-placeholders.mjs`.
