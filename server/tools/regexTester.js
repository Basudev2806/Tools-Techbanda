/**
 * body: { pattern: string, flags?: string, text: string }
 */
export default function regexTester(body = {}) {
  const { pattern = "", flags = "g", text = "" } = body;

  if (!pattern) {
    return { ok: false, error: "Pattern is empty." };
  }

  let re;
  try {
    re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  } catch (err) {
    return { ok: false, error: err.message };
  }

  const matches = [];
  let match;
  let guard = 0;

  while ((match = re.exec(text)) !== null && guard < 1000) {
    matches.push({
      match: match[0],
      index: match.index,
      groups: match.groups ?? null,
    });
    if (match[0] === "") re.lastIndex += 1; // avoid infinite loop on empty matches
    guard += 1;
  }

  return { ok: true, count: matches.length, matches };
}
