/**
 * Prepares the fleet photos for the showroom and the booking app:
 *
 *  - measures where the car sits inside each photo and writes
 *    src/lib/fleetPhotos.ts, so every car is framed the same way (same size
 *    on stage, tyres on the same floor line, reflection from the tyres);
 *  - cuts each car's silhouette to public/fleet/silhouettes/<name>.png, used
 *    as a mask for the light sweep on the paint and for the model selector.
 *
 * Run after replacing a photo in public/fleet/:
 *   npm run fleet:prepare
 *
 * Photos should show the car on a white or very light background (studio
 * cut-outs, as today). The car is what is clearly darker than the
 * background and not connected to it; the soft floor shadow is ignored.
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, extname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FLEET_DIR = join(ROOT, 'public', 'fleet');
const SIL_DIR = join(FLEET_DIR, 'silhouettes');
const OUT = join(ROOT, 'src', 'lib', 'fleetPhotos.ts');

// Car pixels are at least this much darker than the background (measuring).
const DARKER_BY = 95;
// Background flood fill: lighter than (background − this) counts as backdrop.
const FLOOD_BY = 70;
// Rows/columns need this share of car pixels to count (ignores specks).
const MIN_RUN = 0.004;
// Silhouettes are worked at up to this width, written at half of it.
const WORK_WIDTH = 1600;

function backgroundLevel(data, w, h) {
  const corner = [];
  for (const [cx, cy] of [
    [0, 0],
    [w - 8, 0],
    [0, h - 8],
    [w - 8, h - 8],
  ]) {
    for (let y = cy; y < cy + 8; y++) for (let x = cx; x < cx + 8; x++) corner.push(data[y * w + x]);
  }
  corner.sort((a, b) => a - b);
  return corner[Math.floor(corner.length / 2)];
}

function measureBox(data, w, h, bg) {
  const limit = bg - DARKER_BY;
  const cols = new Uint32Array(w);
  const rows = new Uint32Array(h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[y * w + x] < limit) {
        cols[x]++;
        rows[y]++;
      }
    }
  }
  const first = (arr, need) => arr.findIndex((v) => v >= need);
  const last = (arr, need) => arr.length - 1 - [...arr].reverse().findIndex((v) => v >= need);
  const colNeed = Math.max(1, Math.round(h * MIN_RUN));
  const rowNeed = Math.max(1, Math.round(w * MIN_RUN));
  const x0 = first(cols, colNeed);
  const y0 = first(rows, rowNeed);
  if (x0 < 0 || y0 < 0) return null;
  return [x0 / w, y0 / h, (last(cols, colNeed) + 1) / w, (last(rows, rowNeed) + 1) / h];
}

/** 1 = car, 0 = backdrop: everything the light backdrop does not reach from the edges. */
function silhouetteMask(data, w, h, bg) {
  const light = bg - FLOOD_BY;
  const seen = new Uint8Array(w * h); // 1 = backdrop
  const stack = [];
  const push = (i) => {
    if (!seen[i] && data[i] >= light) {
      seen[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (i >= w) push(i - w);
    if (i < w * (h - 1)) push(i + w);
  }

  // Keep the largest connected piece of car (drops stray specks).
  const label = new Int32Array(w * h).fill(-1);
  let best = -1;
  let bestSize = 0;
  let next = 0;
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || label[start] !== -1) continue;
    const id = next++;
    let size = 0;
    label[start] = id;
    stack.push(start);
    while (stack.length) {
      const i = stack.pop();
      size++;
      const x = i % w;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, i - w, i + w]) {
        if (j >= 0 && j < w * h && !seen[j] && label[j] === -1) {
          label[j] = id;
          stack.push(j);
        }
      }
    }
    if (size > bestSize) {
      bestSize = size;
      best = id;
    }
  }
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = label[i] === best ? 1 : 0;
  return mask;
}

async function prepare(file) {
  const src = join(FLEET_DIR, file);
  const meta = await sharp(src).metadata();
  const scale = Math.min(1, WORK_WIDTH / meta.width);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const { data } = await sharp(src).resize(w, h).greyscale().raw().toBuffer({ resolveWithObject: true });
  const bg = backgroundLevel(data, w, h);
  const box = measureBox(data, w, h, bg);
  if (!box) throw new Error(`${file}: no car found (is the background light?)`);

  const mask = silhouetteMask(data, w, h, bg);
  // Clip to the measured car: drops the floor shadow below the tyres.
  const [bx0, by0, bx1, by1] = [box[0] * w - 2, box[1] * h - 2, box[2] * w + 2, box[3] * h + 1];
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const x = i % w;
    const y = (i - x) / w;
    const inside = x >= bx0 && x <= bx1 && y >= by0 && y <= by1;
    rgba[i * 4] = 255;
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = mask[i] && inside ? 255 : 0;
  }
  const name = `${basename(file, extname(file))}.png`;
  // Written at half size: the downscale smooths the edges.
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .resize(Math.round(w / 2), Math.round(h / 2))
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(SIL_DIR, name));

  const r = (v) => Math.round(v * 1000) / 1000;
  return {
    width: meta.width,
    height: meta.height,
    box: box.map(r),
    silhouette: `/fleet/silhouettes/${name}`,
  };
}

mkdirSync(SIL_DIR, { recursive: true });
const files = readdirSync(FLEET_DIR)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();
const entries = [];
for (const file of files) {
  const m = await prepare(file);
  entries.push(
    `  '/fleet/${file}': {\n    width: ${m.width},\n    height: ${m.height},\n    box: [${m.box.join(', ')}],\n    silhouette: '${m.silhouette}',\n  },`,
  );
  console.log(file, m);
}

writeFileSync(
  OUT,
  `// Generated by scripts/prepare-fleet-photos.mjs (npm run fleet:prepare) — run
// it again after replacing a photo in public/fleet/. Do not edit by hand.

export interface FleetPhoto {
  width: number;
  height: number;
  /** The car inside the photo: [left, top, right, bottom] as fractions. */
  box: readonly [number, number, number, number];
  /** White car shape on transparent, same framing as the photo. */
  silhouette: string;
}

export const FLEET_PHOTOS: Record<string, FleetPhoto> = {
${entries.join('\n')}
};
`,
);
console.log(`wrote ${OUT}`);
