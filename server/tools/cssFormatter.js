/**
 * body: { input: string, indentSize?: number }
 */
export default function cssFormatter(body = {}) {
  const { input = "", indentSize = 2 } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  const indent = " ".repeat(Math.min(Math.max(Number(indentSize) || 2, 1), 8));

  // Strip comments, then rebuild with newlines/indentation around braces and semicolons.
  const stripped = input.replace(/\/\*[\s\S]*?\*\//g, "");
  let depth = 0;
  let output = "";
  let buffer = "";

  const flush = () => {
    const text = buffer.trim();
    if (text) output += indent.repeat(depth) + text + "\n";
    buffer = "";
  };

  for (let i = 0; i < stripped.length; i++) {
    const c = stripped[i];
    if (c === "{") {
      const selector = buffer.trim();
      if (selector) output += indent.repeat(depth) + selector + " {\n";
      buffer = "";
      depth++;
    } else if (c === "}") {
      flush();
      depth = Math.max(0, depth - 1);
      output += indent.repeat(depth) + "}\n";
      buffer = "";
    } else if (c === ";") {
      buffer += ";";
      flush();
    } else {
      buffer += c;
    }
  }
  flush();

  return { ok: true, output: output.trim() };
}
