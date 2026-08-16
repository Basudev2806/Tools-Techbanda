/**
 * body: { input: string, mode: "text-to-binary" | "binary-to-text" }
 */
export default function binaryConverter(body = {}) {
  const { input = "", mode = "text-to-binary" } = body;

  if (typeof input !== "string" || input.trim() === "") {
    return { ok: false, error: "Input is empty." };
  }

  if (mode === "binary-to-text") {
    const clean = input.trim().split(/\s+/);
    if (clean.some((chunk) => !/^[01]{1,8}$/.test(chunk))) {
      return { ok: false, error: "Expected space-separated 8-bit binary values." };
    }
    const output = clean.map((chunk) => String.fromCharCode(parseInt(chunk, 2))).join("");
    return { ok: true, output };
  }

  const output = Array.from(input)
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
  return { ok: true, output };
}
