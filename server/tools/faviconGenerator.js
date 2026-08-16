import { Jimp } from "jimp";

const SIZES = [16, 32, 48];

// Builds a valid .ico file from PNG buffers (PNG-in-ICO, supported since
// Windows Vista — avoids needing a full BMP/ICO pixel encoder).
function packIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  pngBuffers.forEach((buf, i) => {
    const entry = Buffer.alloc(16);
    const size = sizes[i];
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buf.length, 8); // image data size
    entry.writeUInt32LE(offset, 12); // offset
    offset += buf.length;
    entries.push(entry);
  });

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

/**
 * body: { image: "data:image/...;base64,...." }
 */
export default async function faviconGenerator(body = {}) {
  const { image = "" } = body;

  if (!image.startsWith("data:image/")) {
    return { ok: false, error: "Upload an image first." };
  }

  try {
    const base64 = image.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    const source = await Jimp.fromBuffer(buffer);

    const pngBuffers = [];
    for (const size of SIZES) {
      const resized = source.clone().resize({ w: size, h: size });
      const png = await resized.getBuffer("image/png");
      pngBuffers.push(png);
    }

    const ico = packIco(pngBuffers, SIZES);
    return { ok: true, image: `data:image/x-icon;base64,${ico.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not process that image." };
  }
}
