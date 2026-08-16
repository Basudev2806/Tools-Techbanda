import { XMLParser, XMLBuilder } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const builder = new XMLBuilder({ ignoreAttributes: false, attributeNamePrefix: "@_", format: true, indentBy: "  " });

/**
 * body: { input: string, mode: "xml-to-json" | "json-to-xml" }
 */
export default function xmlJsonConverter(body = {}) {
  const { input = "", mode = "xml-to-json" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    if (mode === "json-to-xml") {
      const data = JSON.parse(input);
      return { ok: true, output: builder.build(data) };
    }

    const data = parser.parse(input);
    return { ok: true, output: JSON.stringify(data, null, 2) };
  } catch (err) {
    return { ok: false, error: mode === "json-to-xml" ? "Invalid JSON." : "Could not parse that XML." };
  }
}
