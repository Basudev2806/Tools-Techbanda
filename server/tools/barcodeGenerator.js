import bwipjs from "bwip-js";

/**
 * body: { text: string }
 */
export default async function barcodeGenerator(body = {}) {
  const { text = "" } = body;

  if (!text.trim()) {
    return { ok: false, error: "Enter some text to encode." };
  }

  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: text.trim(),
      scale: 3,
      height: 12,
      includetext: true,
      textxalign: "center",
    });
    return { ok: true, image: `data:image/png;base64,${png.toString("base64")}` };
  } catch (err) {
    return { ok: false, error: "Could not generate a barcode for that text." };
  }
}
