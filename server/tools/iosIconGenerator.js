import { Jimp } from "jimp";
import JSZip from "jszip";

// idiom, size (pt), scales — the standard set Xcode's asset catalog expects.
const SPECS = [
  { idiom: "iphone", size: 20, scales: [2, 3] },
  { idiom: "iphone", size: 29, scales: [2, 3] },
  { idiom: "iphone", size: 40, scales: [2, 3] },
  { idiom: "iphone", size: 60, scales: [2, 3] },
  { idiom: "ipad", size: 20, scales: [1, 2] },
  { idiom: "ipad", size: 29, scales: [1, 2] },
  { idiom: "ipad", size: 40, scales: [1, 2] },
  { idiom: "ipad", size: 76, scales: [1, 2] },
  { idiom: "ipad", size: 83.5, scales: [2] },
  { idiom: "ios-marketing", size: 1024, scales: [1] },
];

/**
 * body: { image: string (data URL) }
 * Returns a base64 zip containing AppIcon.appiconset/Contents.json plus
 * every PNG Xcode's asset catalog expects.
 */
export default async function iosIconGenerator(body = {}) {
  const { image = "" } = body;

  if (!image.startsWith("data:image/")) return { ok: false, error: "Upload an image first." };

  try {
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const source = await Jimp.fromBuffer(buffer);

    const zip = new JSZip();
    const folder = zip.folder("AppIcon.appiconset");
    const images = [];
    const seen = new Map(); // dedupe identical pixel sizes

    for (const spec of SPECS) {
      for (const scale of spec.scales) {
        const px = Math.round(spec.size * scale);
        const filename = `icon-${spec.size}x${spec.size}@${scale}x.png`;

        if (!seen.has(px)) {
          const resized = source.clone().resize({ w: px, h: px });
          const pngBuffer = await resized.getBuffer("image/png");
          folder.file(filename, pngBuffer);
          seen.set(px, filename);
        } else {
          // Reuse the already-generated PNG bytes for a duplicate pixel size
          // rather than re-encoding — Contents.json still lists every entry.
          const existing = await folder.file(seen.get(px)).async("nodebuffer");
          folder.file(filename, existing);
        }

        images.push({
          idiom: spec.idiom,
          size: `${spec.size}x${spec.size}`,
          scale: `${scale}x`,
          filename,
        });
      }
    }

    const contents = {
      images,
      info: { version: 1, author: "tools.techbanda.com" },
    };
    folder.file("Contents.json", JSON.stringify(contents, null, 2));

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    return { ok: true, file: `data:application/zip;base64,${zipBuffer.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not generate icons from that image." };
  }
}
