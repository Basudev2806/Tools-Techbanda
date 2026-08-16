/**
 * body: { input: string, indentSize?: number }
 */
export default function graphqlFormatter(body = {}) {
  const { input = "", indentSize = 2 } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  const indent = " ".repeat(Math.min(Math.max(Number(indentSize) || 2, 1), 8));

  // Strip comments, then tokenize on structural characters.
  const stripped = input.replace(/#.*$/gm, "");
  const tokens = stripped.match(/[{}()]|"(?:[^"\\]|\\.)*"|[^\s{}()]+/g) || [];

  let depth = 0;
  let argDepth = 0;
  let output = "";
  let lineBuffer = "";

  const flushLine = () => {
    const text = lineBuffer.trim();
    if (text) output += indent.repeat(depth) + text + "\n";
    lineBuffer = "";
  };

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok === "{") {
      lineBuffer += lineBuffer ? " {" : "{";
      flushLine();
      depth++;
    } else if (tok === "}") {
      flushLine();
      depth = Math.max(0, depth - 1);
      output += indent.repeat(depth) + "}\n";
    } else if (tok === "(") {
      argDepth++;
      lineBuffer += "(";
    } else if (tok === ")") {
      argDepth = Math.max(0, argDepth - 1);
      lineBuffer += ")";
    } else if (argDepth === 0 && lineBuffer) {
      // A new bare token at field level (not inside parens) starts the
      // next field/fragment/directive on its own line.
      flushLine();
      lineBuffer = tok;
    } else {
      lineBuffer += (lineBuffer && !lineBuffer.endsWith("(") ? " " : "") + tok;
    }
  }
  flushLine();

  return { ok: true, output: output.trim() };
}
