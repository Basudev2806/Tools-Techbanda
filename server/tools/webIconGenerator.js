import { Jimp } from "jimp";
import JSZip from "jszip";
import { packIco } from "../icoUtils.js";

const PNG_SIZES = [16, 32, 48, 192, 512];
const APPLE_TOUCH_SIZE = 180;
const ICO_SIZES = [16, 32, 48];

/**
 * body: { image: string (data URL), appName?: string, themeColor?: string }
 */
export default async function webIconGenerator(body = {}) {
  const { image = "", appName = "My App", themeColor = "#3fb950" } = body;

  if (!image.startsWith("data:image/")) return { ok: false, error: "Upload an image first." };

  try {
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const source = await Jimp.fromBuffer(buffer);

    const zip = new JSZip();

    // favicon.ico (multi-resolution)
    const icoBuffers = [];
    for (const size of ICO_SIZES) {
      const resized = source.clone().resize({ w: size, h: size });
      icoBuffers.push(await resized.getBuffer("image/png"));
    }
    zip.file("favicon.ico", packIco(icoBuffers, ICO_SIZES));

    // Individual PNGs
    for (const size of PNG_SIZES) {
      const resized = source.clone().resize({ w: size, h: size });
      const pngBuffer = await resized.getBuffer("image/png");
      zip.file(`favicon-${size}x${size}.png`, pngBuffer);
    }

    // apple-touch-icon
    const appleTouch = source.clone().resize({ w: APPLE_TOUCH_SIZE, h: APPLE_TOUCH_SIZE });
    zip.file("apple-touch-icon.png", await appleTouch.getBuffer("image/png"));

    // site.webmanifest
    const manifest = {
      name: appName,
      short_name: appName,
      icons: [
        { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: themeColor,
      background_color: themeColor,
      display: "standalone",
    };
    zip.file("site.webmanifest", JSON.stringify(manifest, null, 2));

    // A ready-to-paste <head> snippet
    const htmlSnippet = [
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">',
      '<link rel="manifest" href="/site.webmanifest">',
      `<meta name="theme-color" content="${themeColor}">`,
    ].join("\n");
    zip.file("head-snippet.html", htmlSnippet);

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    return { ok: true, file: `data:application/zip;base64,${zipBuffer.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not generate icons from that image." };
  }
}
