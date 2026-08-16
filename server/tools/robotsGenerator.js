/**
 * body: { rule: "all" | "none" | "custom", disallowPaths?: string, sitemapUrl?: string }
 */
export default function robotsGenerator(body = {}) {
  const { rule = "all", disallowPaths = "", sitemapUrl = "" } = body;

  const lines = ["User-agent: *"];

  if (rule === "none") {
    lines.push("Disallow: /");
  } else if (rule === "custom") {
    const paths = disallowPaths
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);
    if (!paths.length) {
      return { ok: false, error: "List at least one path to disallow, one per line." };
    }
    paths.forEach((p) => lines.push(`Disallow: ${p.startsWith("/") ? p : "/" + p}`));
  } else {
    lines.push("Disallow:");
  }

  if (sitemapUrl.trim()) {
    lines.push("", `Sitemap: ${sitemapUrl.trim()}`);
  }

  return { ok: true, output: lines.join("\n") };
}
