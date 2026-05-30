/**
 * Generates branded placeholder photos for each fleet vehicle in
 * public/fleet/<id>.jpg so the referenced image paths resolve before the real
 * car photos are added. Replace each file in place (same filename) with a real
 * photo — no code change needed. See public/fleet/README.md.
 *
 * Run with:  node scripts/generate-fleet-placeholders.mjs
 *
 * Self-contained (no deps): renders an RGB buffer and encodes a baseline JPEG.
 * The JPEG encoder is a port of Jon Olick's public-domain jo_write_jpg.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const FLEET_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fleet');

const INK = [10, 10, 10];
const GOLD = [255, 168, 6];

const GLYPHS = {
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
};

// ---- Render an RGB buffer (ink card, gold "SM" monogram + thin frame) --------
function renderCard(width, height) {
  const rgb = Buffer.alloc(width * height * 3);
  for (let i = 0; i < width * height; i++) {
    rgb[i * 3] = INK[0];
    rgb[i * 3 + 1] = INK[1];
    rgb[i * 3 + 2] = INK[2];
  }
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = (y * width + x) * 3;
    rgb[idx] = c[0];
    rgb[idx + 1] = c[1];
    rgb[idx + 2] = c[2];
  };

  // thin gold border inset
  const m = Math.round(Math.min(width, height) * 0.06);
  for (let x = m; x < width - m; x++) {
    for (let t = 0; t < 2; t++) {
      put(x, m + t, GOLD);
      put(x, height - 1 - m - t, GOLD);
    }
  }
  for (let y = m; y < height - m; y++) {
    for (let t = 0; t < 2; t++) {
      put(m + t, y, GOLD);
      put(width - 1 - m - t, y, GOLD);
    }
  }

  // centered "SM" monogram
  const text = 'SM';
  const cols = text.length * 5 + (text.length - 1);
  const px = Math.round((height * 0.32) / 7);
  const offX = Math.round((width - cols * px) / 2);
  const offY = Math.round((height - 7 * px) / 2);
  let cursor = 0;
  for (const ch of text) {
    const g = GLYPHS[ch];
    for (let gy = 0; gy < 7; gy++) {
      for (let gx = 0; gx < 5; gx++) {
        if (g[gy][gx] !== '1') continue;
        for (let dy = 0; dy < px; dy++)
          for (let dx = 0; dx < px; dx++)
            put(offX + (cursor + gx) * px + dx, offY + gy * px + dy, GOLD);
      }
    }
    cursor += 6;
  }
  return rgb;
}

// ---- Baseline JPEG encoder (port of jo_write_jpg, public domain) -------------
const ZIG = [
  0, 1, 5, 6, 14, 15, 27, 28, 2, 4, 7, 13, 16, 26, 29, 42, 3, 8, 12, 17, 25, 30, 41, 43,
  9, 11, 18, 24, 31, 40, 44, 53, 10, 19, 23, 32, 39, 45, 52, 54, 20, 22, 33, 38, 46, 51,
  55, 60, 21, 34, 37, 47, 50, 56, 59, 61, 35, 36, 48, 49, 57, 58, 62, 63,
];
const YQT = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57,
  69, 56, 14, 17, 22, 29, 51, 87, 80, 62, 18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55,
  64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100,
  103, 99,
];
const UVQT = [
  17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99,
  99, 99, 47, 66, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
  99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
];
const AASF = [
  2.8284271247461903, 3.923141121612922, 3.695518130045147, 3.4172281320837523,
  2.8284271247461903, 2.2227928712566236, 1.5307337294603596, 0.7803612880645741,
];
const STD_DC_LUM_NRC = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
const STD_DC_LUM_VAL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const STD_AC_LUM_NRC = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
const STD_AC_LUM_VAL = [
  0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51,
  0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1,
  0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18,
  0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
  0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57,
  0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75,
  0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92,
  0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
  0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
  0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8,
  0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2,
  0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
];
const STD_DC_CHR_NRC = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
const STD_DC_CHR_VAL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const STD_AC_CHR_NRC = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
const STD_AC_CHR_VAL = [
  0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21, 0x31, 0x06, 0x12, 0x41, 0x51, 0x07,
  0x61, 0x71, 0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91, 0xa1, 0xb1, 0xc1, 0x09,
  0x23, 0x33, 0x52, 0xf0, 0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34, 0xe1, 0x25,
  0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
  0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56,
  0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74,
  0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
  0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
  0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba,
  0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6,
  0xd7, 0xd8, 0xd9, 0xda, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf2,
  0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa,
];

function computeHuffmanTable(nrcodes, values) {
  const table = [];
  let code = 0;
  let k = 0;
  for (let bits = 1; bits <= 16; bits++) {
    for (let j = 1; j <= nrcodes[bits]; j++) {
      table[values[k]] = [code, bits];
      code++;
      k++;
    }
    code <<= 1;
  }
  return table;
}

function encodeJPEG(width, height, rgb, quality = 80) {
  const out = [];
  const push = (b) => out.push(b & 0xff);
  const push16 = (v) => {
    push(v >> 8);
    push(v & 0xff);
  };

  quality = quality < 50 ? Math.floor(5000 / quality) : 200 - quality * 2;
  const YTable = new Array(64);
  const UVTable = new Array(64);
  for (let i = 0; i < 64; i++) {
    let y = Math.floor((YQT[i] * quality + 50) / 100);
    let uv = Math.floor((UVQT[i] * quality + 50) / 100);
    YTable[ZIG[i]] = Math.min(255, Math.max(1, y));
    UVTable[ZIG[i]] = Math.min(255, Math.max(1, uv));
  }
  const fdtblY = new Array(64);
  const fdtblUV = new Array(64);
  for (let row = 0, k = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++, k++) {
      fdtblY[k] = 1 / (YTable[ZIG[k]] * AASF[row] * AASF[col]);
      fdtblUV[k] = 1 / (UVTable[ZIG[k]] * AASF[row] * AASF[col]);
    }
  }

  const YDC = computeHuffmanTable(STD_DC_LUM_NRC, STD_DC_LUM_VAL);
  const YAC = computeHuffmanTable(STD_AC_LUM_NRC, STD_AC_LUM_VAL);
  const UVDC = computeHuffmanTable(STD_DC_CHR_NRC, STD_DC_CHR_VAL);
  const UVAC = computeHuffmanTable(STD_AC_CHR_NRC, STD_AC_CHR_VAL);

  // ---- Header ----
  push16(0xffd8); // SOI
  // APP0 / JFIF
  push16(0xffe0);
  push16(16);
  push(0x4a); push(0x46); push(0x49); push(0x46); push(0x00);
  push(1); push(1); push(0); push16(1); push16(1); push(0); push(0);
  // DQT
  push16(0xffdb);
  push16(132);
  push(0);
  for (let i = 0; i < 64; i++) push(YTable[i]);
  push(1);
  for (let i = 0; i < 64; i++) push(UVTable[i]);
  // SOF0
  push16(0xffc0);
  push16(17);
  push(8);
  push16(height);
  push16(width);
  push(3);
  push(1); push(0x11); push(0);
  push(2); push(0x11); push(1);
  push(3); push(0x11); push(1);
  // DHT
  const writeDHT = (cls, id, nrcodes, values) => {
    push16(0xffc4);
    push16(19 + values.length);
    push((cls << 4) | id);
    for (let i = 1; i <= 16; i++) push(nrcodes[i]);
    for (const v of values) push(v);
  };
  writeDHT(0, 0, STD_DC_LUM_NRC, STD_DC_LUM_VAL);
  writeDHT(1, 0, STD_AC_LUM_NRC, STD_AC_LUM_VAL);
  writeDHT(0, 1, STD_DC_CHR_NRC, STD_DC_CHR_VAL);
  writeDHT(1, 1, STD_AC_CHR_NRC, STD_AC_CHR_VAL);
  // SOS
  push16(0xffda);
  push16(12);
  push(3);
  push(1); push(0x00);
  push(2); push(0x11);
  push(3); push(0x11);
  push(0); push(0x3f); push(0);

  // ---- Entropy-coded scan ----
  let bitBuf = 0;
  let bitCnt = 0;
  const writeBits = (bs) => {
    bitCnt += bs[1];
    bitBuf |= bs[0] << (24 - bitCnt);
    while (bitCnt >= 8) {
      const c = (bitBuf >> 16) & 0xff;
      push(c);
      if (c === 0xff) push(0);
      bitBuf = (bitBuf << 8) & 0xffffff;
      bitCnt -= 8;
    }
  };

  const dct = (d) => {
    const tmp0 = d[0] + d[7], tmp7 = d[0] - d[7];
    const tmp1 = d[1] + d[6], tmp6 = d[1] - d[6];
    const tmp2 = d[2] + d[5], tmp5 = d[2] - d[5];
    const tmp3 = d[3] + d[4], tmp4 = d[3] - d[4];
    let tmp10 = tmp0 + tmp3, tmp13 = tmp0 - tmp3;
    const tmp11 = tmp1 + tmp2, tmp12 = tmp1 - tmp2;
    d[0] = tmp10 + tmp11;
    d[4] = tmp10 - tmp11;
    let z1 = (tmp12 + tmp13) * 0.707106781;
    d[2] = tmp13 + z1;
    d[6] = tmp13 - z1;
    tmp10 = tmp4 + tmp5;
    const tmp11b = tmp5 + tmp6, tmp12b = tmp6 + tmp7;
    const z5 = (tmp10 - tmp12b) * 0.382683433;
    const z2 = 0.5411961 * tmp10 + z5;
    const z4 = 1.306562965 * tmp12b + z5;
    const z3 = tmp11b * 0.707106781;
    const z11 = tmp7 + z3, z13 = tmp7 - z3;
    d[5] = z13 + z2;
    d[3] = z13 - z2;
    d[1] = z11 + z4;
    d[7] = z11 - z4;
  };

  const calcBits = (v) => {
    let tmp = v < 0 ? -v : v;
    const val = v < 0 ? v - 1 : v;
    let bits = 1;
    while ((tmp >>= 1)) bits++;
    return [val & ((1 << bits) - 1), bits];
  };

  const DU = new Array(64);
  const processDU = (CDU, fdtbl, DC, HTDC, HTAC) => {
    const EOB = HTAC[0x00];
    const M16 = HTAC[0xf0];
    const row = new Array(8);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) row[j] = CDU[i * 8 + j];
      dct(row);
      for (let j = 0; j < 8; j++) CDU[i * 8 + j] = row[j];
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) row[j] = CDU[j * 8 + i];
      dct(row);
      for (let j = 0; j < 8; j++) CDU[j * 8 + i] = row[j];
    }
    for (let i = 0; i < 64; i++) {
      const v = CDU[i] * fdtbl[i];
      DU[ZIG[i]] = Math.round(v);
    }
    const diff = DU[0] - DC;
    if (diff === 0) {
      writeBits(HTDC[0]);
    } else {
      const bits = calcBits(diff);
      writeBits(HTDC[bits[1]]);
      writeBits(bits);
    }
    let end0 = 63;
    while (end0 > 0 && DU[end0] === 0) end0--;
    if (end0 === 0) {
      writeBits(EOB);
      return DU[0];
    }
    for (let i = 1; i <= end0; i++) {
      const start = i;
      while (DU[i] === 0 && i <= end0) i++;
      let nrzeroes = i - start;
      if (nrzeroes >= 16) {
        const lng = nrzeroes >> 4;
        for (let n = 1; n <= lng; n++) writeBits(M16);
        nrzeroes &= 15;
      }
      const bits = calcBits(DU[i]);
      writeBits(HTAC[(nrzeroes << 4) + bits[1]]);
      writeBits(bits);
    }
    if (end0 !== 63) writeBits(EOB);
    return DU[0];
  };

  const YDU = new Array(64);
  const UDU = new Array(64);
  const VDU = new Array(64);
  let DCY = 0, DCU = 0, DCV = 0;
  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 8) {
      for (let r = 0; r < 8; r++) {
        const yy = Math.min(y + r, height - 1);
        for (let c = 0; c < 8; c++) {
          const xx = Math.min(x + c, width - 1);
          const p = (yy * width + xx) * 3;
          const R = rgb[p], G = rgb[p + 1], B = rgb[p + 2];
          const k = r * 8 + c;
          YDU[k] = 0.299 * R + 0.587 * G + 0.114 * B - 128;
          UDU[k] = -0.16874 * R - 0.33126 * G + 0.5 * B;
          VDU[k] = 0.5 * R - 0.41869 * G - 0.08131 * B;
        }
      }
      DCY = processDU(YDU, fdtblY, DCY, YDC, YAC);
      DCU = processDU(UDU, fdtblUV, DCU, UVDC, UVAC);
      DCV = processDU(VDU, fdtblUV, DCV, UVDC, UVAC);
    }
  }
  // flush remaining bits
  writeBits([0x7f, 7]);
  push16(0xffd9); // EOI
  return Buffer.from(out);
}

// ---- Emit --------------------------------------------------------------------
mkdirSync(FLEET_DIR, { recursive: true });
const ids = ['mercedes-s-class', 'mercedes-e-class', 'mercedes-v-class', 'range-rover', 'bus-18'];
const W = 1200, H = 960; // 5:4, matches FleetCard's aspect-[5/4]
const rgb = renderCard(W, H);
for (const id of ids) {
  writeFileSync(join(FLEET_DIR, `${id}.jpg`), encodeJPEG(W, H, rgb, 82));
}
console.log(`Wrote ${ids.length} placeholder JPGs to public/fleet/: ${ids.map((i) => i + '.jpg').join(', ')}`);
