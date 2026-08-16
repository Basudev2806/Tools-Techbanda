function parsePairs(input) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"))
    .map((line) => {
      const eq = line.indexOf("=");
      const colon = line.indexOf(":");
      const sep = eq !== -1 && (colon === -1 || eq < colon) ? eq : colon;
      if (sep === -1) return null;
      return [line.slice(0, sep).trim(), line.slice(sep + 1).trim()];
    })
    .filter(Boolean);
}

function needsQuotes(value) {
  return /\s/.test(value) || value === "";
}

/**
 * body: { input: string, format: "env" | "docker-compose" | "shell" }
 * input: KEY=value or KEY: value pairs, one per line
 */
export default function envGenerator(body = {}) {
  const { input = "", format = "env" } = body;

  const pairs = parsePairs(input);
  if (!pairs.length) {
    return { ok: false, error: "Enter one KEY=value pair per line." };
  }

  let output;
  if (format === "docker-compose") {
    output = "environment:\n" + pairs.map(([k, v]) => `  ${k}: "${v}"`).join("\n");
  } else if (format === "shell") {
    output = pairs.map(([k, v]) => `export ${k}=${needsQuotes(v) ? `"${v}"` : v}`).join("\n");
  } else {
    output = pairs.map(([k, v]) => `${k}=${needsQuotes(v) ? `"${v}"` : v}`).join("\n");
  }

  return { ok: true, output };
}
