import crypto from "node:crypto";

/**
 * body: { input: string }
 */
export default function md5Generator(body = {}) {
  const { input = "" } = body;

  if (typeof input !== "string" || input === "") {
    return { ok: false, error: "Input is empty." };
  }

  const output = crypto.createHash("md5").update(input, "utf-8").digest("hex");
  return { ok: true, output };
}
