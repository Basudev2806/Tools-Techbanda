import crypto from "node:crypto";

const ALGORITHMS = ["sha1", "sha256", "sha384", "sha512", "md5"];

/**
 * body: { message: string, secret: string, algorithm?: string, encoding?: "hex" | "base64" }
 */
export default function hmacGenerator(body = {}) {
  const { message = "", secret = "", algorithm = "sha256", encoding = "hex" } = body;

  if (!message) return { ok: false, error: "Enter a message to sign." };
  if (!secret) return { ok: false, error: "Enter a secret key." };
  if (!ALGORITHMS.includes(algorithm)) return { ok: false, error: "Unsupported algorithm." };

  try {
    const hmac = crypto.createHmac(algorithm, secret).update(message, "utf-8");
    const output = hmac.digest(encoding === "base64" ? "base64" : "hex");
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: "Could not compute HMAC." };
  }
}
