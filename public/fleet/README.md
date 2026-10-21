# Fleet photos

The car photos shown on the fleet cards (home, /fleet, service pages), the
/fleet/… pages, the booking wizard, the price estimator and the comparison
table. Replace a file in place — **keep the exact same filename** — and the
site picks it up with no code change.

| File | Vehicle |
|------|---------|
| `mercedes-s-class.jpg` | Mercedes Classe S (also the /about story image) |
| `mercedes-e-class.jpg` | Mercedes Classe E |
| `mercedes-v-class.jpg` | Mercedes Classe V |
| `range-rover.jpg` | Range Rover |
| `bus-18.jpg` | Bus 18 Posti |

## Specs

- **Car cut out on a white (or transparent) background.** The photo is shown
  whole, never cropped, on a white card — a photo of the car in a street
  would show up as a framed rectangle.
- **Landscape, ≥ 1600 px wide**, the car filling most of the frame like the
  current photos. `range-rover.jpg` (577×433) and `bus-18.jpg` (812×450) are
  the ones most worth replacing.
- **Format:** JPG (keep the `.jpg` name). For a transparent PNG, upload the
  `.png` and change that one extension in `src/lib/images.ts`.
- Up to ~1 MB each is fine; Next.js resizes and compresses them.

## Licensing reminder

Use photos you own or that are licensed for commercial use (e.g. your own
shots, or stock under a permissive licence such as Unsplash). The car models
themselves are fine to show — it's the *photograph* that carries copyright, so
don't pull images off the open web without a licence.

`scripts/generate-fleet-placeholders.mjs` overwrites these files with
placeholder images: don't run it now that the real photos are in.
