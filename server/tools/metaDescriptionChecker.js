/**
 * body: { url: string }
 */
export default async function metaDescriptionChecker(body = {}) {
  const { url = "" } = body;
  const trimmed = url.trim();

  if (!trimmed) return { ok: false, error: "Enter a URL, e.g. https://example.com" };

  const target = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(8000) });
    const html = await res.text();

    const match = html.match(
      /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i
    ) || html.match(/<meta\s+[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);

    if (!match) {
      return { ok: true, output: "No meta description tag found on this page." };
    }

    const description = match[1];
    const len = description.length;
    const verdict =
      len === 0
        ? "Empty description."
        : len < 50
        ? "Too short — aim for 50-160 characters."
        : len > 160
        ? "Too long — search engines usually truncate past ~160 characters."
        : "Good length.";

    return {
      ok: true,
      output: [`Description: ${description}`, `Length: ${len} characters`, verdict].join("\n"),
    };
  } catch (err) {
    return { ok: false, error: "Could not fetch or parse that page." };
  }
}
