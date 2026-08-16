/**
 * body: { input: string }
 */
export default function jsonValidator(body = {}) {
  const { input = "" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    const parsed = JSON.parse(input);
    const type = Array.isArray(parsed) ? "array" : typeof parsed;
    const size = type === "object" ? Object.keys(parsed).length : Array.isArray(parsed) ? parsed.length : null;
    const summary = ["Valid JSON \u2713", `Type: ${type}`];
    if (size !== null) summary.push(`${type === "array" ? "Items" : "Keys"}: ${size}`);
    return { ok: true, output: summary.join("\n") };
  } catch (err) {
    return { ok: true, output: `Invalid JSON \u2717\n${err.message}` };
  }
}
