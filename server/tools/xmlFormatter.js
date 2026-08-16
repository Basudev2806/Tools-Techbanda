import { XMLParser, XMLBuilder } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", preserveOrder: true });
const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", preserveOrder: true, format: true, indentBy: "  " });

/**
 * body: { input: string }
 */
export default function xmlFormatter(body = {}) {
  const { input = "" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    const parsed = parser.parse(input);
    const output = builder.build(parsed);
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: "Could not parse that XML — check it's well-formed." };
  }
}
