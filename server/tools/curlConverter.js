// --- curl parsing (a pragmatic subset: -X, -H, -d/--data, url, -u) ---
function tokenizeShell(str) {
  const tokens = [];
  let cur = "";
  let quote = null;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if (quote) {
      if (c === quote) {
        quote = null;
      } else if (c === "\\" && quote === '"' && str[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        cur += c;
      }
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (/\s/.test(c)) {
      if (cur) {
        tokens.push(cur);
        cur = "";
      }
    } else if (c === "\\" && str[i + 1] === "\n") {
      i++; // line continuation
    } else {
      cur += c;
    }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function parseCurl(command) {
  const tokens = tokenizeShell(command.trim().replace(/^curl\s+/, ""));
  const result = { url: "", method: "GET", headers: {}, data: null };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") {
      result.method = tokens[++i];
    } else if (t === "-H" || t === "--header") {
      const header = tokens[++i];
      const idx = header.indexOf(":");
      if (idx !== -1) result.headers[header.slice(0, idx).trim()] = header.slice(idx + 1).trim();
    } else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary") {
      result.data = tokens[++i];
      if (result.method === "GET") result.method = "POST";
    } else if (t === "-u" || t === "--user") {
      const cred = tokens[++i];
      result.headers["Authorization"] = "Basic " + Buffer.from(cred).toString("base64");
    } else if (t === "-A" || t === "--user-agent") {
      result.headers["User-Agent"] = tokens[++i];
    } else if (t.startsWith("-")) {
      // skip unsupported flags (e.g. -s, -k, --compressed) — no argument assumed
    } else if (!result.url) {
      result.url = t;
    }
  }

  return result;
}

function toFetchCode(req) {
  const hasHeaders = Object.keys(req.headers).length > 0;
  const opts = [];
  if (req.method !== "GET") opts.push(`  method: "${req.method}",`);
  if (hasHeaders) {
    opts.push(`  headers: {\n${Object.entries(req.headers).map(([k, v]) => `    "${k}": "${v}",`).join("\n")}\n  },`);
  }
  if (req.data) opts.push(`  body: ${JSON.stringify(req.data)},`);

  const optsBlock = opts.length ? `, {\n${opts.join("\n")}\n}` : "";
  return `fetch("${req.url}"${optsBlock})\n  .then((res) => res.json())\n  .then((data) => console.log(data));`;
}

function toAxiosCode(req) {
  const lines = [`  url: "${req.url}",`, `  method: "${req.method.toLowerCase()}",`];
  if (Object.keys(req.headers).length) {
    lines.push(`  headers: {\n${Object.entries(req.headers).map(([k, v]) => `    "${k}": "${v}",`).join("\n")}\n  },`);
  }
  if (req.data) {
    try {
      const parsed = JSON.parse(req.data);
      lines.push(`  data: ${JSON.stringify(parsed, null, 2).replace(/\n/g, "\n  ")},`);
    } catch {
      lines.push(`  data: ${JSON.stringify(req.data)},`);
    }
  }
  return `axios({\n${lines.join("\n")}\n}).then((res) => console.log(res.data));`;
}

function toCurlCode(req) {
  const parts = ["curl"];
  if (req.method && req.method !== "GET") parts.push(`-X ${req.method}`);
  for (const [k, v] of Object.entries(req.headers)) parts.push(`-H "${k}: ${v}"`);
  if (req.data) parts.push(`-d '${req.data}'`);
  parts.push(`"${req.url}"`);
  return parts.join(" \\\n  ");
}

/**
 * body: { input: string, direction: "curl-to-fetch" | "curl-to-axios" | "to-curl" }
 * For "to-curl": input is JSON { url, method, headers, data }
 */
export default function curlConverter(body = {}) {
  const { input = "", direction = "curl-to-fetch" } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  try {
    if (direction === "to-curl") {
      const req = JSON.parse(input);
      return { ok: true, output: toCurlCode({ method: "GET", headers: {}, data: null, ...req }) };
    }

    if (!/^\s*curl\s/.test(input.trim())) {
      return { ok: false, error: "Input doesn't look like a curl command (should start with 'curl ')." };
    }

    const req = parseCurl(input);
    if (!req.url) return { ok: false, error: "Could not find a URL in that curl command." };

    const output = direction === "curl-to-axios" ? toAxiosCode(req) : toFetchCode(req);
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: "Could not parse that input." };
  }
}
