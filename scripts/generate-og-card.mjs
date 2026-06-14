// Generates the social-share / Open Graph card at public/og-default.jpg.
//
// The card pairs James's portrait (faded into the brand-dark background, the way
// it sits on the site) with a faint preview of the interactive travel map — the
// same equirectangular country silhouettes and pins the WorldMap component
// draws — so a share preview shows both the person and how much he travels.
//
// Run: npm run og   (or: node scripts/generate-og-card.mjs)
//
// The committed public/og-default.jpg is the deliverable; only re-run this when
// the portrait, branding, or travel data changes. Rendering needs `sharp` plus
// the Fraunces and Inter TrueType fonts visible to fontconfig — without them the
// type falls back to a generic serif/sans. Map data and the country count are
// read live from src/data and src/data/site.ts so the card stays in sync.
//
// Brand tokens mirror tailwind.config.mjs: accent #F5A524, ink-950 #0A0A0B,
// paper-50 #FAFAF7, base/office pins #4ade80. Fonts: Fraunces + Inter.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Card geometry
// ---------------------------------------------------------------------------
const W = 1200;
const H = 630;

// The map data lives in a 1000x500 equirectangular space (see WorldMap.astro).
const MAP_W = 1000;
const MAP_H = 500;
const MAP_SCALE = W / MAP_W; // 1.2 — fill the card width
const MAP_OFFSET_Y = (H - MAP_H * MAP_SCALE) / 2; // centre vertically (15)

const project = (lat, lon) => ({
  x: ((lon + 180) / 360) * MAP_W,
  y: ((90 - lat) / 180) * MAP_H,
});
const toCard = (lat, lon) => {
  const { x, y } = project(lat, lon);
  return { x: x * MAP_SCALE, y: y * MAP_SCALE + MAP_OFFSET_Y };
};

// ---------------------------------------------------------------------------
// Pull the live-ish data straight from the repo so the card stays in sync.
// ---------------------------------------------------------------------------
function readSource(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function loadCountryShapes() {
  const src = readSource('src/data/countryShapes.ts');
  const re = /code:\s*'([A-Z]{2})',\s*d:\s*'([^']+)'/g;
  const shapes = [];
  for (const m of src.matchAll(re)) shapes.push({ code: m[1], d: m[2] });
  return shapes;
}

function loadCentroids() {
  const src = readSource('src/data/countryCentroids.ts');
  const re = /([A-Z]{2}):\s*\{\s*lat:\s*(-?[0-9.]+),\s*lon:\s*(-?[0-9.]+)\s*\}/g;
  const out = {};
  for (const m of src.matchAll(re)) out[m[1]] = { lat: +m[2], lon: +m[3] };
  return out;
}

function loadCountryCount() {
  const src = readSource('src/data/site.ts');
  const m = src.match(/countryCount:\s*(\d+)/);
  return m ? +m[1] : 57;
}

const shapes = loadCountryShapes();
const centroids = loadCentroids();
const countryCount = loadCountryCount();

// Travel pins (orange) — the curated, globe-spanning stops from travels.ts.
const travelCodes = ['UZ', 'PK', 'CN', 'PS', 'IL', 'UA', 'EG', 'ZA', 'CL'];
// Base / office pins (green) — home in the UK, HRV office in France.
const baseCodes = ['GB', 'FR'];
const visited = new Set([...travelCodes, ...baseCodes]);

// ---------------------------------------------------------------------------
// Layer 1 — background: brand-dark canvas + faint dotted-silhouette world map.
// ---------------------------------------------------------------------------
const countryPaths = shapes
  .map((s) => {
    const isVisited = visited.has(s.code);
    const fill = isVisited ? '#F5A524' : '#FAFAF7';
    const op = isVisited ? '0.28' : '0.10';
    return `<path d="${s.d}" fill="${fill}" fill-opacity="${op}" />`;
  })
  .join('');

const pinMarkup = (codes, color) =>
  codes
    .filter((c) => centroids[c])
    .map((c) => {
      const { x, y } = toCard(centroids[c].lat, centroids[c].lon);
      return `
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="${color}" fill-opacity="0.16" />
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${color}" />
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="none" stroke="#0A0A0B" stroke-opacity="0.5" stroke-width="1.2" />`;
    })
    .join('');

const backgroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="62%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#16161a" />
      <stop offset="100%" stop-color="#0A0A0B" />
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)" />
  <g transform="translate(0 ${MAP_OFFSET_Y}) scale(${MAP_SCALE})">
    ${countryPaths}
  </g>
  ${pinMarkup(travelCodes, '#F5A524')}
  ${pinMarkup(baseCodes, '#4ade80')}
</svg>`;

// ---------------------------------------------------------------------------
// Layer 2 — the portrait, faded into the background on the right.
// ---------------------------------------------------------------------------
const PORTRAIT_W = 520; // narrower + right-anchored so the subject sits right
const PORTRAIT_X = W - PORTRAIT_W; // 680

// The alpha mask is the product of two gradients: a horizontal one that lets
// the studio-blue creep in very gradually (eased/convex, so black→portrait is
// soft like the site's mask) and a vertical one that softens the top/bottom
// edges. librsvg ignores `mix-blend-mode`, so the two are rendered separately
// and multiplied in sharp to guarantee the horizontal fade is preserved.
const gradMask = (gradient) =>
  Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT_W}" height="${H}">
  <defs>${gradient}</defs>
  <rect width="${PORTRAIT_W}" height="${H}" fill="#000" />
  <rect width="${PORTRAIT_W}" height="${H}" fill="url(#g)" />
</svg>`);

const hMask = gradMask(`
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#fff" stop-opacity="0" />
    <stop offset="6%" stop-color="#fff" stop-opacity="0" />
    <stop offset="16%" stop-color="#fff" stop-opacity="0.12" />
    <stop offset="26%" stop-color="#fff" stop-opacity="0.34" />
    <stop offset="35%" stop-color="#fff" stop-opacity="0.6" />
    <stop offset="42%" stop-color="#fff" stop-opacity="0.85" />
    <stop offset="48%" stop-color="#fff" stop-opacity="1" />
    <stop offset="100%" stop-color="#fff" stop-opacity="1" />
  </linearGradient>`);

const vMask = gradMask(`
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fff" stop-opacity="0" />
    <stop offset="16%" stop-color="#fff" stop-opacity="1" />
    <stop offset="86%" stop-color="#fff" stop-opacity="1" />
    <stop offset="100%" stop-color="#fff" stop-opacity="0" />
  </linearGradient>`);

const maskAlpha = await sharp(hMask)
  .composite([{ input: vMask, blend: 'multiply' }])
  .extractChannel('red') // grayscale luminance == desired alpha
  .toColourspace('b-w')
  .raw()
  .toBuffer();

// Keep this as 3-channel RGB (no alpha) so joinChannel can supply the mask as
// the alpha channel — calling ensureAlpha first would make joinChannel append
// a 5th channel and the gradient would be silently dropped.
const portraitBase = await sharp(path.join(root, 'src/assets/portrait.jpg'))
  .resize(PORTRAIT_W, H, { fit: 'cover', position: 'top' })
  // Mute it so it reads as a faded backdrop rather than a hero shot.
  .modulate({ saturation: 0.8, brightness: 0.97 })
  .toColourspace('srgb')
  .removeAlpha()
  .raw()
  .toBuffer();

// Apply the gradient as the alpha channel.
const portraitFinal = await sharp(portraitBase, {
  raw: { width: PORTRAIT_W, height: H, channels: 3 },
})
  .joinChannel(maskAlpha, { raw: { width: PORTRAIT_W, height: H, channels: 1 } })
  .png()
  .toBuffer();

// ---------------------------------------------------------------------------
// Layer 3 — foreground: contrast scrim on the left + all the type.
// ---------------------------------------------------------------------------
const statText = `${countryCount} countries and counting · all 7 continents`;

// Measure rendered text width so the chip background always wraps the full
// string (librsvg has no text-layout API, so trim a probe render instead).
async function measureTextWidth(text, { family, weight, size }) {
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="160">
    <rect width="2400" height="160" fill="#000" />
    <text x="20" y="100" font-family="${family}" font-weight="${weight}" font-size="${size}" fill="#fff">${text}</text>
  </svg>`;
  const { info } = await sharp(Buffer.from(probe)).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  return info.width;
}

const CHIP_FONT = 24;
const chipTextW = await measureTextWidth(statText, { family: 'Inter', weight: 600, size: CHIP_FONT });
const CHIP_DOT_CX = 34;
const CHIP_TEXT_X = 58;
const CHIP_W = Math.round(CHIP_TEXT_X + chipTextW + 30);
const CHIP_H = 52;

const foregroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0A0A0B" stop-opacity="0.86" />
      <stop offset="42%" stop-color="#0A0A0B" stop-opacity="0.68" />
      <stop offset="70%" stop-color="#0A0A0B" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#0A0A0B" stop-opacity="0" />
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#0A0A0B" flood-opacity="0.85" />
    </filter>
  </defs>

  <!-- legibility scrim under the text -->
  <rect width="${W}" height="${H}" fill="url(#scrim)" />

  <!-- brand strip, top edge -->
  <rect x="0" y="0" width="${W}" height="6" fill="#F5A524" />

  <g filter="url(#soft)">
    <!-- kicker -->
    <text x="80" y="150" font-family="Inter" font-weight="700" font-size="22"
          letter-spacing="3" fill="#F5A524">JAMESMARKEY.CO.UK</text>

    <!-- name -->
    <text x="76" y="290" font-family="Fraunces" font-weight="900" font-size="118"
          fill="#FAFAF7">James Markey MBE</text>

    <!-- tagline -->
    <text x="80" y="360" font-family="Inter" font-weight="600" font-size="34"
          fill="#FAFAF7" fill-opacity="0.92">Founder · Exporter · Traveller</text>

    <!-- supporting line -->
    <text x="80" y="408" font-family="Inter" font-weight="400" font-size="25"
          fill="#9CA3AF">Building tools at the cutting edge of technology.</text>
  </g>

  <!-- travel stat chip (width fits the full string) -->
  <g transform="translate(80 470)">
    <rect x="0" y="0" rx="${CHIP_H / 2}" ry="${CHIP_H / 2}" width="${CHIP_W}" height="${CHIP_H}"
          fill="#F5A524" fill-opacity="0.12" stroke="#F5A524" stroke-opacity="0.55" stroke-width="1.5" />
    <circle cx="${CHIP_DOT_CX}" cy="${CHIP_H / 2}" r="7" fill="#F5A524" />
    <text x="${CHIP_TEXT_X}" y="${CHIP_H / 2 + 8}" font-family="Inter" font-weight="600" font-size="${CHIP_FONT}"
          fill="#FAFAF7">${statText}</text>
  </g>
</svg>`;

// ---------------------------------------------------------------------------
// Compose and write.
// ---------------------------------------------------------------------------
const outPath = path.join(root, 'public/og-default.jpg');

await sharp(Buffer.from(backgroundSvg))
  .composite([
    { input: portraitFinal, left: PORTRAIT_X, top: 0 },
    { input: Buffer.from(foregroundSvg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(outPath);

const { size } = fs.statSync(outPath);
console.log(`Wrote ${path.relative(root, outPath)} — ${W}x${H}, ${(size / 1024).toFixed(0)} KB`);
