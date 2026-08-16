import { Jimp } from "jimp";
import JSZip from "jszip";

const DENSITIES = [
  ["mdpi", 1],
  ["hdpi", 1.5],
  ["xhdpi", 2],
  ["xxhdpi", 3],
  ["xxxhdpi", 4],
];

const PRESETS = {
  launcher: { baseDp: 48, folder: "mipmap", defaultName: "ic_launcher" },
  notification: { baseDp: 24, folder: "drawable", defaultName: "ic_stat_notify" },
  generic: { baseDp: 24, folder: "drawable", defaultName: "ic_action_item" },
  adaptive: { baseDp: 108, folder: "mipmap", defaultName: "ic_launcher" },
};

function hexToJimpColor(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 6 ? clean + "ff" : clean;
  return parseInt(full, 16) >>> 0;
}

function applyCircularMask(image) {
  const { width, height } = image;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2;
  image.scan(0, 0, width, height, function (x, y, idx) {
    const dx = x + 0.5 - cx;
    const dy = y + 0.5 - cy;
    if (dx * dx + dy * dy > r * r) {
      this.bitmap.data[idx + 3] = 0; // alpha = 0 outside the circle
    }
  });
  return image;
}

function toWhiteSilhouette(image) {
  image.scan(0, 0, image.width, image.height, function (x, y, idx) {
    this.bitmap.data[idx] = 255;
    this.bitmap.data[idx + 1] = 255;
    this.bitmap.data[idx + 2] = 255;
    // alpha channel (idx+3) is left as-is — that's what defines the silhouette
  });
  return image;
}

async function buildIconAtSize(source, size, { paddingPct, backgroundColor }) {
  const canvas = new Jimp({
    width: size,
    height: size,
    color: backgroundColor ? hexToJimpColor(backgroundColor) : 0x00000000,
  });

  const contentSize = Math.max(1, Math.round(size * (1 - paddingPct / 100)));
  const resized = source.clone().resize({ w: contentSize, h: contentSize });
  const offset = Math.round((size - contentSize) / 2);
  canvas.composite(resized, offset, offset);
  return canvas;
}

const ADAPTIVE_CANVAS_DP = 108;
const ADAPTIVE_SAFE_ZONE_DP = 66; // content should live within this centered circle

async function buildAdaptiveIcons(zip, foregroundSource, backgroundSource, opts) {
  const { fileName, backgroundColor, backgroundIsImage, roundVariant } = opts;
  const resFolder = zip.folder("res");

  // XML adaptive-icon definitions (density-independent, live in mipmap-anydpi-v26)
  const bgRef = backgroundIsImage ? `@mipmap/${fileName}_background` : `@color/${fileName}_background`;
  const xml = (roundSuffix = "") => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="${bgRef}" />
    <foreground android:drawable="@mipmap/${fileName}_foreground" />
</adaptive-icon>
`;
  const anydpi = resFolder.folder("mipmap-anydpi-v26");
  anydpi.file(`${fileName}.xml`, xml());
  if (roundVariant) anydpi.file(`${fileName}_round.xml`, xml());

  if (!backgroundIsImage) {
    resFolder.folder("values").file(`${fileName}_background.xml`, `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="${fileName}_background">${backgroundColor}</color>\n</resources>\n`);
  }

  for (const [densityName, scale] of DENSITIES) {
    const size = Math.round(ADAPTIVE_CANVAS_DP * scale);
    const folderName = `mipmap-${densityName}`;

    // Foreground: content padded to fit within the safe-zone circle.
    const contentSize = Math.round(size * (ADAPTIVE_SAFE_ZONE_DP / ADAPTIVE_CANVAS_DP));
    const fgCanvas = new Jimp({ width: size, height: size, color: 0x00000000 });
    const fgResized = foregroundSource.clone().resize({ w: contentSize, h: contentSize });
    const fgOffset = Math.round((size - contentSize) / 2);
    fgCanvas.composite(fgResized, fgOffset, fgOffset);
    resFolder.folder(folderName).file(`${fileName}_foreground.png`, await fgCanvas.getBuffer("image/png"));

    // Background: either a full-bleed image layer, or (default) a flat
    // color referenced from values/colors.xml — no PNG needed for that case.
    if (backgroundIsImage && backgroundSource) {
      const bgCanvas = backgroundSource.clone().resize({ w: size, h: size });
      resFolder.folder(folderName).file(`${fileName}_background.png`, await bgCanvas.getBuffer("image/png"));
    }

    // Legacy fallback (pre-API-26 devices don't understand adaptive icons):
    // flatten background + safe-zone-padded foreground into one square icon.
    const legacySize = Math.round(48 * scale);
    const legacyContent = Math.round(legacySize * (ADAPTIVE_SAFE_ZONE_DP / ADAPTIVE_CANVAS_DP));
    const legacy = new Jimp({
      width: legacySize,
      height: legacySize,
      color: backgroundIsImage ? 0x00000000 : hexToJimpColor(backgroundColor),
    });
    if (backgroundIsImage && backgroundSource) {
      legacy.composite(backgroundSource.clone().resize({ w: legacySize, h: legacySize }), 0, 0);
    }
    const legacyFg = foregroundSource.clone().resize({ w: legacyContent, h: legacyContent });
    const legacyOffset = Math.round((legacySize - legacyContent) / 2);
    legacy.composite(legacyFg, legacyOffset, legacyOffset);
    resFolder.folder(folderName).file(`${fileName}.png`, await legacy.getBuffer("image/png"));

    if (roundVariant) {
      const round = applyCircularMask(legacy.clone());
      resFolder.folder(folderName).file(`${fileName}_round.png`, await round.getBuffer("image/png"));
    }
  }
}

/**
 * body: {
 *   image: string (data URL),           // foreground artwork for adaptive icons
 *   type: "launcher" | "notification" | "generic" | "adaptive",
 *   name?: string,          // output filename without extension
 *   baseDp?: number,        // generic only — icon size in dp at mdpi baseline
 *   paddingPct?: number,    // 0-40, safe-zone padding around the artwork (launcher/notification/generic)
 *   backgroundColor?: string, // launcher: fills the square behind the icon. adaptive: flat background color (default) or fallback flatten color
 *   roundVariant?: boolean, // launcher/adaptive — also emit a circular-masked round icon
 *   backgroundImage?: string (data URL), // adaptive only — use an image background layer instead of a flat color
 * }
 * Returns a base64 zip mirroring an Android res/ folder structure — the
 * same shape Android Asset Studio's generators produced.
 */
export default async function androidIconGenerator(body = {}) {
  const {
    image = "",
    type = "launcher",
    name = "",
    baseDp,
    paddingPct = 0,
    backgroundColor = "",
    roundVariant = false,
    backgroundImage = "",
  } = body;

  if (!image.startsWith("data:image/")) return { ok: false, error: "Upload a foreground image first." };
  const preset = PRESETS[type];
  if (!preset) return { ok: false, error: "Unknown icon type." };

  const fileName = (name.trim() || preset.defaultName).replace(/[^a-zA-Z0-9_]/g, "_");

  if (type === "adaptive") {
    try {
      const fgBuffer = Buffer.from(image.split(",")[1], "base64");
      const foreground = await Jimp.fromBuffer(fgBuffer);

      const backgroundIsImage = backgroundImage.startsWith("data:image/");
      let background = null;
      if (backgroundIsImage) {
        const bgBuffer = Buffer.from(backgroundImage.split(",")[1], "base64");
        background = await Jimp.fromBuffer(bgBuffer);
      }
      const bgColor = backgroundColor || "#FFFFFF";

      const zip = new JSZip();
      await buildAdaptiveIcons(zip, foreground, background, {
        fileName,
        backgroundColor: bgColor,
        backgroundIsImage,
        roundVariant,
      });

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      return { ok: true, file: `data:application/zip;base64,${zipBuffer.toString("base64")}` };
    } catch (err) {
      return { ok: false, error: "Could not generate adaptive icons from that image." };
    }
  }

  const dp = type === "generic" ? Math.min(Math.max(Number(baseDp) || preset.baseDp, 16), 512) : preset.baseDp;
  const padding = Math.min(Math.max(Number(paddingPct) || 0, 0), 40);

  try {
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const source = await Jimp.fromBuffer(buffer);

    const zip = new JSZip();
    const resFolder = zip.folder("res");

    for (const [densityName, scale] of DENSITIES) {
      const size = Math.round(dp * scale);
      let icon = await buildIconAtSize(source, size, {
        paddingPct: padding,
        backgroundColor: type === "launcher" ? backgroundColor : "",
      });

      if (type === "notification") icon = toWhiteSilhouette(icon);

      const folderName = `${preset.folder}-${densityName}`;
      const pngBuffer = await icon.getBuffer("image/png");
      resFolder.folder(folderName).file(`${fileName}.png`, pngBuffer);

      if (type === "launcher" && roundVariant) {
        const round = applyCircularMask(icon.clone());
        const roundBuffer = await round.getBuffer("image/png");
        resFolder.folder(folderName).file(`${fileName}_round.png`, roundBuffer);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    return { ok: true, file: `data:application/zip;base64,${zipBuffer.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not generate icons from that image." };
  }
}
