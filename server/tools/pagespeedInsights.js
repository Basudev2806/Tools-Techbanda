/**
 * body: {
 *   url: string,
 *   strategy?: "mobile" | "desktop",
 *   apiKey?: string
 * }
 */
export default async function pagespeedInsights(body = {}) {
  const {
    url = "",
    strategy = "mobile",
    apiKey: providedApiKey = "",
  } = body;

  const trimmed = String(url).trim();

  if (!trimmed) {
    return {
      ok: false,
      error: "Enter a URL to audit.",
    };
  }

  const target = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    new URL(target);
  } catch {
    return {
      ok: false,
      error: "Please enter a valid URL.",
    };
  }

  // Use provided API key if available,
  // otherwise use the key from .env
  const apiKey =
    String(providedApiKey).trim() ||
    process.env.PAGESPEED_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error: "PageSpeed API key is not configured.",
    };
  }

  const normalizedStrategy =
    strategy === "desktop" ? "desktop" : "mobile";

  const params = new URLSearchParams({
    url: target,
    strategy: normalizedStrategy,
  });

  [
    "performance",
    "seo",
    "accessibility",
    "best-practices",
  ].forEach((category) => {
    params.append("category", category);
  });

  params.set("key", apiKey);

  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(60000),
      }
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error:
          json?.error?.message ||
          `PageSpeed Insights request failed (${res.status}).`,
        reason:
          json?.error?.errors?.[0]?.reason ||
          json?.error?.status ||
          null,
      };
    }

    const categories =
      json?.lighthouseResult?.categories || {};

    const audits =
      json?.lighthouseResult?.audits || {};

    const scoreLines = Object.values(categories)
      .filter(Boolean)
      .map((category) => {
        const score =
          typeof category.score === "number"
            ? Math.round(category.score * 100)
            : null;

        return `${category.title}: ${
          score !== null ? `${score}/100` : "N/A"
        }`;
      });

    const metricIds = [
      "first-contentful-paint",
      "largest-contentful-paint",
      "total-blocking-time",
      "cumulative-layout-shift",
      "speed-index",
    ];

    const metrics = metricIds
      .filter((id) => audits[id])
      .map((id) => {
        const audit = audits[id];

        return `${audit.title}: ${
          audit.displayValue || "—"
        }`;
      });

    const output = [
      `Audited: ${target} (${normalizedStrategy})`,
      "",
      "Scores:",
      ...scoreLines,
      "",
      "Core metrics:",
      ...metrics,
    ].join("\n");

    return {
      ok: true,
      output,
    };
  } catch (err) {
    console.error("PageSpeed Insights error:", err);

    return {
      ok: false,
      error:
        err?.name === "TimeoutError"
          ? "PageSpeed Insights request timed out."
          : "Could not reach PageSpeed Insights.",
    };
  }
}