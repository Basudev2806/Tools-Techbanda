import bcrypt from "bcryptjs";
import { argon2id, argon2Verify } from "hash-wasm";
import crypto from "node:crypto";

async function argon2Hash(password) {
  const salt = crypto.randomBytes(16);
  return argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 3,
    memorySize: 19456, // ~19 MB, OWASP-recommended minimum
    hashLength: 32,
    outputType: "encoded",
  });
}

/**
 * body: {
 *   mode: "hash" | "verify",
 *   algorithm: "bcrypt" | "argon2id",
 *   password: string,
 *   hash?: string,   // required for verify
 *   rounds?: number, // bcrypt only, 4-14
 * }
 */
export default async function passwordHasher(body = {}) {
  const { mode = "hash", algorithm = "bcrypt", password = "", hash = "", rounds = 10 } = body;

  if (!password) return { ok: false, error: "Enter a password." };

  try {
    if (mode === "verify") {
      if (!hash.trim()) return { ok: false, error: "Enter a hash to verify against." };
      const matches =
        algorithm === "argon2id" ? await argon2Verify({ password, hash: hash.trim() }) : await bcrypt.compare(password, hash.trim());
      return { ok: true, output: matches ? "Match \u2713 — password is correct." : "No match \u2717 — password is incorrect." };
    }

    if (algorithm === "argon2id") {
      const output = await argon2Hash(password);
      return { ok: true, output };
    }

    const r = Math.min(Math.max(Number(rounds) || 10, 4), 14);
    const output = await bcrypt.hash(password, r);
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: "Could not process that request — check the hash format." };
  }
}
