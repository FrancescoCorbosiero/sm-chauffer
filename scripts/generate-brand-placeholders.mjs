/**
 * Generates the placeholder brand assets in `public/` so the site never ships
 * broken images. These are intentionally plain (a gold "SM" monogram on the
 * brand ink background) — replace the files with the real brand artwork when
 * it's ready. See `public/README.md` for the full asset checklist.
 *
 * Run with:  node scripts/generate-brand-placeholders.mjs
 *
 * Uses only Node built-ins (zlib) — no image libraries required.
 */
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const INK = [10, 10, 10]; // --color-ink   #0a0a0a
const GOLD = [255, 168, 6]; // --color-accent #ffa806

// 5x7 bitmap glyphs for the monogram letters.
const GLYPHS = {
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
};

// ---- PNG encoder (8-bit RGBA) ------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  // 10,11,12 = compression / filter / interlace = 0

  // raw scanlines, each prefixed with a 0 (None) filter byte
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0;
    rgba.copy(raw, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Drawing -----------------------------------------------------------------
function render(size, { bg, fg = GOLD, text = 'SM', scale = 0.42 }) {
  const w = size;
  const h = size;
  const rgba = Buffer.alloc(w * h * 4);

  // background (transparent when bg is null)
  if (bg) {
    for (let i = 0; i < w * h; i++) {
      rgba[i * 4] = bg[0];
      rgba[i * 4 + 1] = bg[1];
      rgba[i * 4 + 2] = bg[2];
      rgba[i * 4 + 3] = 255;
    }
  }

  // monogram geometry: each glyph is 5 wide, 7 tall, with 1 column gap.
  const cols = text.length * 5 + (text.length - 1);
  const px = Math.max(1, Math.round((h * scale) / 7)); // pixel size
  const totalW = cols * px;
  const totalH = 7 * px;
  const offX = Math.round((w - totalW) / 2);
  const offY = Math.round((h - totalH) / 2);

  let cursor = 0;
  for (const ch of text) {
    const glyph = GLYPHS[ch];
    if (!glyph) continue;
    for (let gy = 0; gy < 7; gy++) {
      for (let gx = 0; gx < 5; gx++) {
        if (glyph[gy][gx] !== '1') continue;
        const x0 = offX + (cursor + gx) * px;
        const y0 = offY + gy * px;
        for (let dy = 0; dy < px; dy++) {
          for (let dx = 0; dx < px; dx++) {
            const x = x0 + dx;
            const y = y0 + dy;
            if (x < 0 || y < 0 || x >= w || y >= h) continue;
            const idx = (y * w + x) * 4;
            rgba[idx] = fg[0];
            rgba[idx + 1] = fg[1];
            rgba[idx + 2] = fg[2];
            rgba[idx + 3] = 255;
          }
        }
      }
    }
    cursor += 6; // 5 glyph + 1 gap
  }
  return { w, h, rgba };
}

function renderRect(width, height, { bg, fg = GOLD, text = 'SM' }) {
  // Wide canvas (used for the social/OG card). Monogram centred.
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = bg[0];
    rgba[i * 4 + 1] = bg[1];
    rgba[i * 4 + 2] = bg[2];
    rgba[i * 4 + 3] = 255;
  }
  const cols = text.length * 5 + (text.length - 1);
  const px = Math.round((height * 0.34) / 7);
  const totalW = cols * px;
  const totalH = 7 * px;
  const offX = Math.round((width - totalW) / 2);
  const offY = Math.round((height - totalH) / 2);
  let cursor = 0;
  for (const ch of text) {
    const glyph = GLYPHS[ch];
    if (!glyph) continue;
    for (let gy = 0; gy < 7; gy++) {
      for (let gx = 0; gx < 5; gx++) {
        if (glyph[gy][gx] !== '1') continue;
        const x0 = offX + (cursor + gx) * px;
        const y0 = offY + gy * px;
        for (let dy = 0; dy < px; dy++) {
          for (let dx = 0; dx < px; dx++) {
            const idx = ((y0 + dy) * width + (x0 + dx)) * 4;
            rgba[idx] = fg[0];
            rgba[idx + 1] = fg[1];
            rgba[idx + 2] = fg[2];
            rgba[idx + 3] = 255;
          }
        }
      }
    }
    cursor += 6;
  }
  return { w: width, h: height, rgba };
}

// ---- ICO wrapper (PNG-in-ICO, supported by all modern browsers) --------------
function encodeIco(pngBuf, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry[0] = size >= 256 ? 0 : size; // width  (0 == 256)
  entry[1] = size >= 256 ? 0 : size; // height
  entry[2] = 0; // palette
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(pngBuf.length, 8); // data size
  entry.writeUInt32LE(6 + 16, 12); // data offset
  return Buffer.concat([header, entry, pngBuf]);
}

// ---- Emit --------------------------------------------------------------------
mkdirSync(PUBLIC_DIR, { recursive: true });

function writePng(name, drawing) {
  const png = encodePng(drawing.w, drawing.h, drawing.rgba);
  writeFileSync(join(PUBLIC_DIR, name), png);
  return png;
}

// Site logo — transparent background so it reads on both the white navbar and
// the dark hero. Square monogram.
writePng('logo.png', render(512, { bg: null, scale: 0.6 }));

// Apple touch icon — opaque ink background (iOS adds its own rounded mask).
writePng('apple-touch-icon.png', render(180, { bg: INK, scale: 0.5 }));

// Favicon — 32x32 PNG wrapped in an ICO container.
const faviconPng = encodePng(32, 32, render(32, { bg: INK, scale: 0.6 }).rgba);
writeFileSync(join(PUBLIC_DIR, 'favicon.ico'), encodeIco(faviconPng, 32));

// Open Graph / social card — 1200x630 ink card with the monogram.
writePng('og.png', renderRect(1200, 630, { bg: INK }));

console.log('Wrote placeholder assets to public/: logo.png, apple-touch-icon.png, favicon.ico, og.png');
