const B32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer) {
  let bits = "";
  for (const byte of buffer) bits += byte.toString(2).padStart(8, "0");
  let output = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5).padEnd(5, "0");
    output += B32_ALPHABET[parseInt(chunk, 2)];
  }
  while (output.length % 8 !== 0) output += "=";
  return output;
}

function base32Decode(str) {
  const clean = str.replace(/=+$/, "").toUpperCase();
  let bits = "";
  for (const char of clean) {
    const idx = B32_ALPHABET.indexOf(char);
    if (idx === -1) throw new Error("Invalid base32 character: " + char);
    bits += idx.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

/**
 * body: { input: string, encoding: "base32" | "hex", mode: "encode" | "decode" }
 */
export default function base32HexConverter(body = {}) {
  const { input = "", encoding = "hex", mode = "encode" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    if (mode === "encode") {
      const buf = Buffer.from(input, "utf-8");
      const output = encoding === "base32" ? base32Encode(buf) : buf.toString("hex");
      return { ok: true, output };
    }

    const buf = encoding === "base32" ? base32Decode(input.trim()) : Buffer.from(input.trim(), "hex");
    return { ok: true, output: buf.toString("utf-8") };
  } catch (err) {
    return { ok: false, error: "Could not " + mode + " that input — check the format." };
  }
}
