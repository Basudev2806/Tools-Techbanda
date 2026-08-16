/**
 * body: { url: string }
 */
export default function canonicalGenerator(body = {}) {
  const { url = "" } = body;
  if (!url.trim()) return { ok: false, error: "URL is required." };

  try {
    new URL(url);
  } catch {
    return { ok: false, error: "Enter a full URL, e.g. https://example.com/page" };
  }

  return { ok: true, output: `<link rel="canonical" href="${url.trim()}" />` };
}
