import { optimize } from "svgo";

/**
 * body: { input: string }
 */
export default function svgOptimizer(body = {}) {
  const { input = "" } = body;

  if (!input.trim()) return { ok: false, error: "Paste some SVG markup." };
  if (!input.includes("<svg")) return { ok: false, error: "That doesn't look like SVG — missing an <svg> tag." };

  try {
    const originalSize = Buffer.byteLength(input, "utf-8");
    const result = optimize(input, { multipass: true });
    const optimizedSize = Buffer.byteLength(result.data, "utf-8");
    const saved = originalSize > 0 ? Math.round((1 - optimizedSize / originalSize) * 100) : 0;

    return {
      ok: true,
      output: result.data,
      info: `Original: ${originalSize} bytes \u2192 Optimized: ${optimizedSize} bytes (${saved}% smaller)`,
    };
  } catch (err) {
    return { ok: false, error: "Could not optimize that SVG — check it's well-formed." };
  }
}
