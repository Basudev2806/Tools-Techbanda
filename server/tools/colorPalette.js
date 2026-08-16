import { Jimp } from "jimp";

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [Math.round(hue2rgb(p, q, h + 1 / 3) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - 1 / 3) * 255)];
}

function rotateHue(hex, degrees) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const newH = (((h + degrees) % 360) + 360) % 360;
  return rgbToHex(...hslToRgb(newH, s, l));
}

function adjustLightness(hex, delta) {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const newL = Math.min(100, Math.max(0, l + delta));
  return rgbToHex(...hslToRgb(h, s, newL));
}

function buildScheme(baseColor, schemeType) {
  switch (schemeType) {
    case "complementary":
      return [baseColor, rotateHue(baseColor, 180)];
    case "triadic":
      return [baseColor, rotateHue(baseColor, 120), rotateHue(baseColor, 240)];
    case "analogous":
      return [rotateHue(baseColor, -30), baseColor, rotateHue(baseColor, 30)];
    case "monochromatic":
      return [adjustLightness(baseColor, -30), adjustLightness(baseColor, -15), baseColor, adjustLightness(baseColor, 15), adjustLightness(baseColor, 30)];
    default:
      return [baseColor];
  }
}

async function extractPalette(imageDataUrl, count) {
  const buffer = Buffer.from(imageDataUrl.split(",")[1], "base64");
  const image = await Jimp.fromBuffer(buffer);

  // Downsample for speed — exact per-pixel precision isn't needed for a palette.
  const sample = image.clone().resize({ w: 80, h: 80 });
  const counts = new Map();

  sample.scan(0, 0, sample.width, sample.height, function (x, y, idx) {
    const r = this.bitmap.data[idx] >> 4 << 4;
    const g = this.bitmap.data[idx + 1] >> 4 << 4;
    const b = this.bitmap.data[idx + 2] >> 4 << 4;
    const key = `${r},${g},${b}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, count).map(([key]) => {
    const [r, g, b] = key.split(",").map(Number);
    return rgbToHex(r, g, b);
  });
}

/**
 * body: {
 *   mode: "extract" | "scheme",
 *   image?: string,          // data URL, required for extract
 *   count?: number,          // colors to extract, 3-10
 *   baseColor?: string,      // hex, required for scheme
 *   schemeType?: "complementary" | "analogous" | "triadic" | "monochromatic",
 * }
 */
export default async function colorPalette(body = {}) {
  const { mode = "scheme", image = "", count = 6, baseColor = "#3fb950", schemeType = "complementary" } = body;

  if (mode === "extract") {
    if (!image.startsWith("data:image/")) {
      return { ok: false, error: "Upload an image first." };
    }
    try {
      const n = Math.min(Math.max(Number(count) || 6, 3), 10);
      const colors = await extractPalette(image, n);
      return { ok: true, colors };
    } catch (err) {
      return { ok: false, error: "Could not process that image." };
    }
  }

  if (!/^#([0-9a-fA-F]{6})$/.test(baseColor)) {
    return { ok: false, error: "Base color must be a hex value, e.g. #3fb950." };
  }
  if (!["complementary", "analogous", "triadic", "monochromatic"].includes(schemeType)) {
    return { ok: false, error: "Unknown scheme type." };
  }

  return { ok: true, colors: buildScheme(baseColor, schemeType) };
}
