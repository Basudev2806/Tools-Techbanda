/**
 * body: { input: string, mode: "encode" | "decode" }
 */
export default function base64(body = {}) {
  const { input = "", mode = "encode" } = body;

  if (typeof input !== "string" || input === "") {
    return { ok: false, error: "Input is empty." };
  }

  try {
    const output =
      mode === "decode"
        ? Buffer.from(input, "base64").toString("utf-8")
        : Buffer.from(input, "utf-8").toString("base64");

    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: "Could not " + mode + " that input." };
  }
}
