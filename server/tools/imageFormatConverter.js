import { Jimp } from "jimp";

const MIME_BY_FORMAT = {
  png: "image/png",
  jpeg: "image/jpeg",
  bmp: "image/bmp",
  gif: "image/gif",
  tiff: "image/tiff",
};

/**
 * body: { image: string (data URL), format: "png"|"jpeg"|"bmp"|"gif"|"tiff", quality?: number }
 */
export default async function imageFormatConverter(body = {}) {
  const { image = "", format = "png", quality = 90 } = body;

  if (!image.startsWith("data:image/")) {
    return { ok: false, error: "Upload an image first." };
  }
  const mime = MIME_BY_FORMAT[format];
  if (!mime) return { ok: false, error: "Unsupported target format." };

  try {
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const source = await Jimp.fromBuffer(buffer);
    const q = Math.min(Math.max(Number(quality) || 90, 10), 100);

    const outBuffer =
      format === "jpeg" ? await source.getBuffer(mime, { quality: q }) : await source.getBuffer(mime);

    return { ok: true, image: `data:${mime};base64,${outBuffer.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not convert that image." };
  }
}
