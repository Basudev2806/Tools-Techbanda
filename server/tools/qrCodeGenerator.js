import QRCode from "qrcode";
import { Jimp } from "jimp";

function isHexColor(c) {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(c);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const n = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function hexToJimpColor(hex) {
  const [r, g, b] = hexToRgb(hex);
  return ((r << 24) | (g << 16) | (b << 8) | 255) >>> 0;
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function lerpColor(rgb1, rgb2, t) {
  return [lerp(rgb1[0], rgb2[0], t), lerp(rgb1[1], rgb2[1], t), lerp(rgb1[2], rgb2[2], t)];
}

// The three 7x7 finder-pattern blocks (the "eyes" in the corners) are kept
// as plain squares regardless of dot style — scanners rely on their exact
// shape to locate the code, so styling them risks unreadable codes.
function isFinderZone(x, y, size) {
  const inTL = x < 7 && y < 7;
  const inTR = x >= size - 7 && y < 7;
  const inBL = x < 7 && y >= size - 7;
  return inTL || inTR || inBL;
}

function getModules(text, errorCorrectionLevel) {
  const qr = QRCode.create(text, { errorCorrectionLevel });
  const { size, data } = qr.modules;
  return {
    size,
    isDark: (x, y) => !!(data[y * size + x] & 1),
  };
}

// Rounded-box signed-distance-ish containment test.
function inRoundedBox(px, py, x0, y0, x1, y1, radius) {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const hw = (x1 - x0) / 2;
  const hh = (y1 - y0) / 2;
  const dx = Math.max(Math.abs(px + 0.5 - cx) - (hw - radius), 0);
  const dy = Math.max(Math.abs(py + 0.5 - cy) - (hh - radius), 0);
  return dx * dx + dy * dy <= radius * radius;
}

function inCircle(px, py, x0, y0, x1, y1, scale) {
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const r = (Math.min(x1 - x0, y1 - y0) / 2) * scale;
  const ddx = px + 0.5 - cx;
  const ddy = py + 0.5 - cy;
  return ddx * ddx + ddy * ddy <= r * r;
}

function moduleColor(mx, my, totalModules, fgRgb, gradient, gradientRgb) {
  if (!gradient) return fgRgb;
  const t = (mx + my) / (2 * totalModules);
  return lerpColor(fgRgb, gradientRgb, t);
}

async function renderPng({ size, isDark, px, quiet, dotStyle, fgColor, bgColor, gradient, gradientColor }) {
  const totalModules = size + quiet * 2;
  const ppm = px / totalModules;
  const fgRgb = hexToRgb(fgColor);
  const gradientRgb = gradient ? hexToRgb(gradientColor) : null;

  const image = new Jimp({ width: px, height: px, color: hexToJimpColor(bgColor) });

  for (let my = 0; my < size; my++) {
    for (let mx = 0; mx < size; mx++) {
      if (!isDark(mx, my)) continue;

      const x0 = Math.round((mx + quiet) * ppm);
      const x1 = Math.round((mx + quiet + 1) * ppm);
      const y0 = Math.round((my + quiet) * ppm);
      const y1 = Math.round((my + quiet + 1) * ppm);
      const shape = isFinderZone(mx, my, size) ? "square" : dotStyle;
      const [r, g, b] = moduleColor(mx, my, totalModules, fgRgb, gradient, gradientRgb);
      const color = ((r << 24) | (g << 16) | (b << 8) | 255) >>> 0;
      const radius = Math.max(1, (x1 - x0) * 0.3);

      for (let py = y0; py < y1; py++) {
        for (let ppx = x0; ppx < x1; ppx++) {
          if (ppx < 0 || py < 0 || ppx >= px || py >= px) continue;
          let inside = true;
          if (shape === "rounded") inside = inRoundedBox(ppx, py, x0, y0, x1, y1, radius);
          else if (shape === "dots") inside = inCircle(ppx, py, x0, y0, x1, y1, 0.86);
          if (inside) image.setPixelColor(color, ppx, py);
        }
      }
    }
  }

  return image;
}

function renderSvgInner({ size, isDark, px, quiet, dotStyle, fgColor, bgColor, gradient, gradientColor }) {
  const totalModules = size + quiet * 2;
  const ppm = px / totalModules;
  const shapes = [];

  for (let my = 0; my < size; my++) {
    for (let mx = 0; mx < size; mx++) {
      if (!isDark(mx, my)) continue;
      const x0 = (mx + quiet) * ppm;
      const y0 = (my + quiet) * ppm;
      const shape = isFinderZone(mx, my, size) ? "square" : dotStyle;

      if (shape === "dots") {
        const r = (ppm / 2) * 0.86;
        shapes.push(`<circle cx="${(x0 + ppm / 2).toFixed(2)}" cy="${(y0 + ppm / 2).toFixed(2)}" r="${r.toFixed(2)}" />`);
      } else if (shape === "rounded") {
        const rad = (ppm * 0.3).toFixed(2);
        shapes.push(`<rect x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${ppm.toFixed(2)}" height="${ppm.toFixed(2)}" rx="${rad}" ry="${rad}" />`);
      } else {
        shapes.push(`<rect x="${x0.toFixed(2)}" y="${y0.toFixed(2)}" width="${ppm.toFixed(2)}" height="${ppm.toFixed(2)}" />`);
      }
    }
  }

  const fillAttr = gradient ? 'fill="url(#qrGradient)"' : `fill="${fgColor}"`;
  const gradientDef = gradient
    ? `<linearGradient id="qrGradient" x1="0" y1="0" x2="${px}" y2="${px}" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${fgColor}" />
        <stop offset="1" stop-color="${gradientColor}" />
      </linearGradient>`
    : "";

  return {
    defs: gradientDef,
    background: `<rect width="${px}" height="${px}" fill="${bgColor}" />`,
    group: `<g ${fillAttr}>${shapes.join("")}</g>`,
  };
}

function renderSvg(opts, border, bw, borderColor) {
  const { defs, background, group } = renderSvgInner(opts);
  const px = opts.px;

  if (!border) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${px} ${px}">
  <defs>${defs}</defs>
  ${background}
  ${group}
</svg>`;
  }

  const framedPx = px + bw * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${framedPx}" height="${framedPx}" viewBox="0 0 ${framedPx} ${framedPx}">
  <defs>${defs}</defs>
  <rect width="${framedPx}" height="${framedPx}" fill="${borderColor}" />
  <g transform="translate(${bw}, ${bw})">
    ${background}
    ${group}
  </g>
</svg>`;
}

/**
 * body: {
 *   text: string,
 *   size?: number,               // overall image size in px (square), 100-1000
 *   margin?: number,              // quiet zone width, in QR modules, 0-10
 *   fgColor?: string,             // hex, module color (gradient start)
 *   bgColor?: string,             // hex, background color
 *   errorCorrection?: "L"|"M"|"Q"|"H",
 *   dotStyle?: "square"|"rounded"|"dots",
 *   gradient?: boolean,
 *   gradientColor?: string,       // hex, gradient end color
 *   format?: "png"|"svg",
 *   logo?: string,                // data URL of a center logo/icon, optional (png format only)
 *   logoSizePercent?: number,     // logo width as % of QR size, 10-30
 *   border?: boolean,
 *   borderWidth?: number,         // px, 1-40
 *   borderColor?: string,         // hex
 * }
 */
export default async function qrCodeGenerator(body = {}) {
  const {
    text = "",
    size = 320,
    margin = 2,
    fgColor = "#000000",
    bgColor = "#ffffff",
    errorCorrection = "M",
    dotStyle = "square",
    gradient = false,
    gradientColor = "#3fb950",
    format = "png",
    logo = "",
    logoSizePercent = 20,
    border = false,
    borderWidth = 12,
    borderColor = "#3fb950",
  } = body;

  if (!text.trim()) return { ok: false, error: "Enter some text or a URL to encode." };
  if (!isHexColor(fgColor) || !isHexColor(bgColor)) {
    return { ok: false, error: "Colors must be hex values, e.g. #3fb950." };
  }
  if (gradient && !isHexColor(gradientColor)) {
    return { ok: false, error: "Gradient color must be a hex value." };
  }
  if (border && !isHexColor(borderColor)) {
    return { ok: false, error: "Border color must be a hex value." };
  }
  if (!["square", "rounded", "dots"].includes(dotStyle)) {
    return { ok: false, error: "Unknown dot style." };
  }
  if (logo && format === "svg") {
    return { ok: false, error: "Logo overlay is only supported for PNG export right now." };
  }

  const px = Math.min(Math.max(Number(size) || 320, 100), 1000);
  const quiet = Math.min(Math.max(Number(margin) ?? 2, 0), 10);
  const bw = Math.min(Math.max(Number(borderWidth) || 12, 1), 40);
  const logoPct = Math.min(Math.max(Number(logoSizePercent) || 20, 10), 30);
  const ecLevel = logo ? "H" : ["L", "M", "Q", "H"].includes(errorCorrection) ? errorCorrection : "M";

  try {
    const { size: qrSize, isDark } = getModules(text.trim(), ecLevel);
    const renderOpts = { size: qrSize, isDark, px, quiet, dotStyle, fgColor, bgColor, gradient, gradientColor };

    if (format === "svg") {
      const svg = renderSvg(renderOpts, border, bw, borderColor);
      const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
      return { ok: true, image: dataUrl };
    }

    let image = await renderPng(renderOpts);

    if (logo) {
      if (!logo.startsWith("data:image/")) return { ok: false, error: "Logo must be an uploaded image." };
      const logoBuffer = Buffer.from(logo.split(",")[1], "base64");
      const logoImg = await Jimp.fromBuffer(logoBuffer);

      const targetSize = Math.round(image.width * (logoPct / 100));
      const padding = Math.round(targetSize * 0.16);
      const padded = targetSize + padding * 2;

      const backing = new Jimp({ width: padded, height: padded, color: hexToJimpColor(bgColor) });
      const resizedLogo = logoImg.clone().resize({ w: targetSize, h: targetSize });
      backing.composite(resizedLogo, padding, padding);

      const offset = Math.round((image.width - padded) / 2);
      image.composite(backing, offset, offset);
    }

    if (border) {
      const framed = new Jimp({ width: image.width + bw * 2, height: image.height + bw * 2, color: hexToJimpColor(borderColor) });
      framed.composite(image, bw, bw);
      image = framed;
    }

    const outBuffer = await image.getBuffer("image/png");
    return { ok: true, image: `data:image/png;base64,${outBuffer.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not generate that QR code — check the input and try again." };
  }
}
