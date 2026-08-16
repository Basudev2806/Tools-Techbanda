const MAX_LINKS = 30;
const CONCURRENCY = 6;

function extractLinks(html, baseUrl) {
  const hrefs = [...html.matchAll(/<a\s[^>]*href=["']([^"'#][^"']*)["']/gi)].map((m) => m[1]);
  const resolved = new Set();
  for (const href of hrefs) {
    try {
      const abs = new URL(href, baseUrl).toString();
      if (abs.startsWith("http")) resolved.add(abs);
    } catch {
      // skip unresolvable hrefs (mailto:, javascript:, etc.)
    }
  }
  return [...resolved];
}

async function checkLink(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(6000) });
    if (res.status === 405 || res.status === 501) {
      const getRes = await fetch(url, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(6000) });
      return { url, status: getRes.status, ok: getRes.ok };
    }
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: null, ok: false, error: "unreachable" };
  }
}

async function checkAll(urls) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const idx = i++;
      results[idx] = await checkLink(urls[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker));
  return results;
}

/**
 * body: { url: string }
 */
export default async function brokenLinkChecker(body = {}) {
  const { url = "" } = body;
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: "Enter a page URL to check." };

  const target = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(8000) });
    const html = await res.text();
    const links = extractLinks(html, target).slice(0, MAX_LINKS);

    if (!links.length) {
      return { ok: true, output: "No links found on that page." };
    }

    const results = await checkAll(links);
    const broken = results.filter((r) => !r.ok);
    const lines = [
      `Checked ${results.length} link${results.length === 1 ? "" : "s"} (max ${MAX_LINKS}) — ${broken.length} broken`,
      "",
      ...results.map((r) => `${r.ok ? "OK " : "FAIL"}  ${r.status ?? "—"}  ${r.url}`),
    ];
    return { ok: true, output: lines.join("\n") };
  } catch (err) {
    return { ok: false, error: "Could not fetch that page." };
  }
}
