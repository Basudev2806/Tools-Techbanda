/**
 * body: { input: string, mode: "pretty" | "minify", indent?: number }
 */
export default function jsonFormatter(body = {}) {
  const { input = "", mode = "pretty", indent = 2 } = body;

  if (typeof input !== "string" || input.trim() === "") {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const parsed = JSON.parse(input);
    const output =
      mode === "minify"
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, indent);

    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
