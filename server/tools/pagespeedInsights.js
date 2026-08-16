/**
 * body: { url: string, strategy?: "mobile"|"desktop", apiKey?: string }
 * Calls Google's PageSpeed Insights API (runs Lighthouse under the hood).
 * Works without a key at low volume; an API key raises the rate limit.
 */
export default async function pagespeedInsights(body = {}) {
  const { url = "", strategy = "mobile", apiKey = "" } = body;
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: "Enter a URL to audit." };

  const target = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  const params = new URLSearchParams({ url: target, strategy: strategy === "desktop" ? "desktop" : "mobile" });
  ["performance", "seo", "accessibility", "best-practices"].forEach((c) => params.append("category", c));
  if (apiKey.trim()) params.set("key", apiKey.trim());

  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`, {
      signal: AbortSignal.timeout(30000),
    });
    const json = await res.json();

    if (!res.ok) {
      return { ok: false, error: json.error?.message || "PageSpeed Insights request failed." };
    }

    const categories = json.lighthouseResult?.categories || {};
    const scoreLines = Object.values(categories).map(
      (c) => `${c.title}: ${Math.round((c.score ?? 0) * 100)}/100`
    );

    const audits = json.lighthouseResult?.audits || {};
    const metrics = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]
      .filter((id) => audits[id])
      .map((id) => `${audits[id].title}: ${audits[id].displayValue || "—"}`);

    const output = [`Audited: ${target} (${strategy})`, "", "Scores:", ...scoreLines, "", "Core metrics:", ...metrics].join("\n");
    return { ok: true, output };
  } catch (err) {
    return { ok: false, error: "Could not reach PageSpeed Insights." };
  }
}
