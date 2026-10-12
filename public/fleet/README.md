# Fleet photos — the cars in the showroom

These files are the photos of the **showroom** on the Fleet page and the home
page, the vehicle pages and the booking app. Replace a photo **keeping the
exact same filename**, then run:

```bash
npm run fleet:prepare
```

The script measures where the car sits in each photo (so every car is framed
the same way on stage, tyres on the same floor line) and cuts its silhouette
for the light sweep (`silhouettes/`). Commit both the photo and what the
script writes (`silhouettes/` and `src/lib/fleetPhotos.ts`).

| File | Vehicle |
|------|---------|
| `mercedes-s-class.jpg` | Mercedes Classe S |
| `mercedes-e-class.jpg` | Mercedes Classe E |
| `mercedes-v-class.jpg` | Mercedes Classe V |
| `range-rover.jpg` | Range Rover |
| `bus-18.jpg` | Bus 18 Posti |

## What a photo needs

- **A studio shot on a white or very light background** (a configurator-style
  cut-out, like the current ones). The stage lights the car by blending the
  photo onto it, so the background disappears; a photo taken in the street
  would show as a rectangle.
- **Three-quarter front view, the front of the car towards the left**, as
  now: cars drive in from the right, so they move forwards.
- Any aspect ratio and margins: the framing is automatic. At least ~1200 px
  wide, a reasonable weight (≈200–500 KB); Next.js optimises the rest.
- JPG (keep the `.jpg` name). For a PNG, upload it with the same base name and
  change the extension in `src/lib/images.ts`.

## Licensing reminder

Use photos you own or that are licensed for commercial use (e.g. your own
shots, or stock under a permissive licence such as Unsplash). The car models
themselves are fine to show — it's the *photograph* that carries copyright, so
don't pull images off the open web without a licence.
