import { Jimp } from "jimp";

/**
 * body: { image: string (data URL), width?: number, height?: number, quality?: number }
 * If only one of width/height is given, aspect ratio is preserved.
 */
export default async function imageResizer(body = {}) {
  const { image = "", width, height, quality = 80 } = body;

  if (!image.startsWith("data:image/")) {
    return { ok: false, error: "Upload an image first." };
  }

  const q = Math.min(Math.max(Number(quality) || 80, 10), 100);

  try {
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const source = await Jimp.fromBuffer(buffer);
    const originalSize = buffer.length;

    let w = width ? Number(width) : undefined;
    let h = height ? Number(height) : undefined;
    if (w && !h) h = Math.round(source.height * (w / source.width));
    if (h && !w) w = Math.round(source.width * (h / source.height));
    if (!w && !h) {
      w = source.width;
      h = source.height;
    }

    const resized = source.resize({ w: Math.max(1, w), h: Math.max(1, h) });
    const outBuffer = await resized.getBuffer("image/jpeg", { quality: q });

    return {
      ok: true,
      image: `data:image/jpeg;base64,${outBuffer.toString("base64")}`,
      output: `Original: ${(originalSize / 1024).toFixed(1)} KB\nResized: ${(outBuffer.length / 1024).toFixed(1)} KB (${w}\u00d7${h}, quality ${q})\nSaved: ${Math.round((1 - outBuffer.length / originalSize) * 100)}%`,
    };
  } catch (err) {
    return { ok: false, error: "Could not process that image." };
  }
}
