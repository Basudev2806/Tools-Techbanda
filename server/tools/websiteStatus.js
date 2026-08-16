/**
 * body: { url: string }
 */
export default async function websiteStatus(body = {}) {
  const { url = "" } = body;
  const trimmed = url.trim();

  if (!trimmed) return { ok: false, error: "Enter a URL, e.g. https://example.com" };

  const target = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const started = Date.now();
    const res = await fetch(target, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(8000) });
    const elapsed = Date.now() - started;

    return {
      ok: true,
      output: [
        `URL: ${target}`,
        `Status: ${res.status} ${res.statusText}`,
        `Response time: ${elapsed} ms`,
        `Final URL: ${res.url}`,
      ].join("\n"),
    };
  } catch (err) {
    return { ok: false, error: "Could not reach that URL." };
  }
}
