const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const INLINE_TAGS = new Set(["a", "b", "i", "em", "strong", "span", "small", "sub", "sup", "code", "abbr"]);

function tokenize(html) {
  return html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) || [];
}

/**
 * body: { input: string, indentSize?: number }
 */
export default function htmlFormatter(body = {}) {
  const { input = "", indentSize = 2 } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  const indentStr = " ".repeat(Math.min(Math.max(Number(indentSize) || 2, 1), 8));
  const tokens = tokenize(input.trim());
  const stack = []; // tracks whether each open tag added a depth level
  let depth = 0;
  const lines = [];

  for (const raw of tokens) {
    const token = raw.trim();
    if (!token) continue;

    if (token.startsWith("<!--")) {
      lines.push(indentStr.repeat(depth) + token);
      continue;
    }

    if (token.startsWith("</")) {
      if (stack.length && stack[stack.length - 1]) depth = Math.max(0, depth - 1);
      stack.pop();
      lines.push(indentStr.repeat(depth) + token);
      continue;
    }

    if (token.startsWith("<")) {
      const tagMatch = token.match(/^<([a-zA-Z0-9-]+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : "";
      const selfClosing = token.endsWith("/>") || VOID_TAGS.has(tagName);

      lines.push(indentStr.repeat(depth) + token);
      if (!selfClosing) {
        const addsDepth = !INLINE_TAGS.has(tagName);
        stack.push(addsDepth);
        if (addsDepth) depth++;
      }
      continue;
    }

    // plain text node
    lines.push(indentStr.repeat(depth) + token);
  }

  return { ok: true, output: lines.join("\n") };
}
