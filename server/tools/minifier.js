import { minify as minifyJs } from "terser";
import CleanCSS from "clean-css";

function minifyHtml(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * body: { input: string, lang: "html" | "css" | "js" }
 */
export default async function minifier(body = {}) {
  const { input = "", lang = "js" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    if (lang === "css") {
      const result = new CleanCSS({}).minify(input);
      if (result.errors.length) return { ok: false, error: result.errors[0] };
      return { ok: true, output: result.styles };
    }

    if (lang === "html") {
      return { ok: true, output: minifyHtml(input) };
    }

    const result = await minifyJs(input, { mangle: true, compress: true });
    if (!result.code) return { ok: false, error: "Could not minify that JavaScript." };
    return { ok: true, output: result.code };
  } catch (err) {
    return { ok: false, error: err.message || "Could not minify that input — check for syntax errors." };
  }
}
