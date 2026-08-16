function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && next === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

function csvField(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function jsonToCsv(data) {
  const rows = Array.isArray(data) ? data : [data];
  if (!rows.length) return "";

  const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const lines = [headers.map(csvField).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvField(row[h])).join(","));
  }
  return lines.join("\n");
}

/**
 * body: { input: string, mode: "csv-to-json" | "json-to-csv" }
 */
export default function csvJsonConverter(body = {}) {
  const { input = "", mode = "csv-to-json" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    if (mode === "json-to-csv") {
      const data = JSON.parse(input);
      return { ok: true, output: jsonToCsv(data) };
    }

    const rows = parseCsv(input.trim());
    if (!rows.length) return { ok: false, error: "No rows found." };

    const [header, ...body_] = rows;
    const objects = body_.map((row) => {
      const obj = {};
      header.forEach((key, i) => {
        obj[key] = row[i] ?? "";
      });
      return obj;
    });

    return { ok: true, output: JSON.stringify(objects, null, 2) };
  } catch (err) {
    return { ok: false, error: mode === "json-to-csv" ? "Invalid JSON." : "Could not parse that CSV." };
  }
}
