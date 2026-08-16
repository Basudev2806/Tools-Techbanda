/**
 * body: { input: string, mode: "encode" | "decode" }
 */
export default function urlEncoder(body = {}) {
  const { input = "", mode = "encode" } = body;

  if (typeof input !== "string" || input === "") {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const output =
      mode === "decode" ? decodeURIComponent(input) : encodeURIComponent(input);
    return { ok: true, output };
  } catch {
    return { ok: false, error: "Could not decode that string." };
  }
}
