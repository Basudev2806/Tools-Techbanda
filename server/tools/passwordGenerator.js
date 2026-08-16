import crypto from "node:crypto";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

/**
 * body: { length?: number, lower?: bool, upper?: bool, numbers?: bool, symbols?: bool }
 */
export default function passwordGenerator(body = {}) {
  const {
    length = 16,
    lower = true,
    upper = true,
    numbers = true,
    symbols = true,
  } = body;

  const len = Math.min(Math.max(Number(length) || 16, 4), 128);
  let pool = "";
  if (lower) pool += SETS.lower;
  if (upper) pool += SETS.upper;
  if (numbers) pool += SETS.numbers;
  if (symbols) pool += SETS.symbols;

  if (!pool) {
    return { ok: false, error: "Pick at least one character set." };
  }

  const bytes = crypto.randomBytes(len);
  let output = "";
  for (let i = 0; i < len; i++) {
    output += pool[bytes[i] % pool.length];
  }

  return { ok: true, output };
}
