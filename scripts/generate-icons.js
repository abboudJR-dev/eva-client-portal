/**
 * Generate PWA icons for EVA Interiors Client Portal.
 * Creates PNG icons from SVG templates using sharp.
 * Run: node scripts/generate-icons.js
 */
const fs = require("fs");
const path = require("path");

// Check if sharp is available
let sharp;
try {
  sharp = require("sharp");
} catch {
  console.log("sharp not installed. Generating SVG fallbacks and using them directly.");
  sharp = null;
}

const ICONS_DIR = path.join(__dirname, "..", "public", "icons");

// EVA brand icon - elegant "E" monogram on dark background with gold accent
function createIconSvg(size, maskable = false) {
  const padding = maskable ? Math.round(size * 0.2) : Math.round(size * 0.1);
  const innerSize = size - padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const fontSize = Math.round(innerSize * 0.55);
  const lineY = centerY + fontSize * 0.18;
  const lineWidth = Math.round(innerSize * 0.35);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#1A1A1A" rx="${maskable ? 0 : Math.round(size * 0.15)}"/>
  <text x="${centerX}" y="${centerY + fontSize * 0.35}" font-family="Georgia, serif" font-size="${fontSize}" font-weight="bold" fill="#FDFBF7" text-anchor="middle">E</text>
  <rect x="${centerX - lineWidth / 2}" y="${lineY + fontSize * 0.25}" width="${lineWidth}" height="${Math.max(2, Math.round(size * 0.015))}" fill="#C5A258" rx="1"/>
</svg>`;
}

const icons = [
  { name: "icon-192.png", size: 192, maskable: false },
  { name: "icon-512.png", size: 512, maskable: false },
  { name: "icon-maskable-192.png", size: 192, maskable: true },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
];

async function generate() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  for (const icon of icons) {
    const svg = createIconSvg(icon.size, icon.maskable);
    const svgPath = path.join(ICONS_DIR, icon.name.replace(".png", ".svg"));

    if (sharp) {
      const pngPath = path.join(ICONS_DIR, icon.name);
      await sharp(Buffer.from(svg)).png().toFile(pngPath);
      console.log(`Generated: ${icon.name}`);
    } else {
      // Write SVG as fallback
      fs.writeFileSync(svgPath, svg);
      console.log(`Generated SVG fallback: ${svgPath}`);
    }
  }

  // Also create apple-touch-icon (180x180)
  const appleSvg = createIconSvg(180, false);
  if (sharp) {
    await sharp(Buffer.from(appleSvg)).png().toFile(path.join(ICONS_DIR, "apple-touch-icon.png"));
    console.log("Generated: apple-touch-icon.png");
  } else {
    fs.writeFileSync(path.join(ICONS_DIR, "apple-touch-icon.svg"), appleSvg);
    console.log("Generated SVG fallback: apple-touch-icon.svg");
  }
}

generate().catch(console.error);
