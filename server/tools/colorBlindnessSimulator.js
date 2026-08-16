import { Jimp } from "jimp";

// Standard simplified simulation matrices (commonly used approximations
// for dichromatic color vision deficiency simulation).
const MATRICES = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
};

function applyMatrix([r, g, b], m) {
  return [
    Math.round(m[0][0] * r + m[0][1] * g + m[0][2] * b),
    Math.round(m[1][0] * r + m[1][1] * g + m[1][2] * b),
    Math.round(m[2][0] * r + m[2][1] * g + m[2][2] * b),
  ].map((v) => Math.min(255, Math.max(0, v)));
}

/**
 * body: { image: string (data URL), type: "protanopia"|"deuteranopia"|"tritanopia" }
 */
export default async function colorBlindnessSimulator(body = {}) {
  const { image = "", type = "deuteranopia" } = body;

  if (!image.startsWith("data:image/")) return { ok: false, error: "Upload an image first." };
  const matrix = MATRICES[type];
  if (!matrix) return { ok: false, error: "Unknown color vision deficiency type." };

  try {
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const img = await Jimp.fromBuffer(buffer);

    img.scan(0, 0, img.width, img.height, function (x, y, idx) {
      const [r, g, b] = applyMatrix(
        [this.bitmap.data[idx], this.bitmap.data[idx + 1], this.bitmap.data[idx + 2]],
        matrix
      );
      this.bitmap.data[idx] = r;
      this.bitmap.data[idx + 1] = g;
      this.bitmap.data[idx + 2] = b;
    });

    const outBuffer = await img.getBuffer("image/png");
    return { ok: true, image: `data:image/png;base64,${outBuffer.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not process that image." };
  }
}
