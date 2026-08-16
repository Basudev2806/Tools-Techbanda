function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * body: { urls: string, changefreq?: string, priority?: string }
 * urls: one URL per line
 */
export default function sitemapGenerator(body = {}) {
  const { urls = "", changefreq = "", priority = "" } = body;

  const list = urls
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean);

  if (!list.length) return { ok: false, error: "Enter at least one URL, one per line." };

  const invalid = list.filter((u) => {
    try {
      new URL(u);
      return false;
    } catch {
      return true;
    }
  });
  if (invalid.length) {
    return { ok: false, error: `Not a valid URL: ${invalid[0]}` };
  }

  const today = new Date().toISOString().slice(0, 10);
  const entries = list
    .map((u) => {
      const parts = [`  <url>`, `    <loc>${esc(u)}</loc>`, `    <lastmod>${today}</lastmod>`];
      if (changefreq) parts.push(`    <changefreq>${esc(changefreq)}</changefreq>`);
      if (priority) parts.push(`    <priority>${esc(priority)}</priority>`);
      parts.push(`  </url>`);
      return parts.join("\n");
    })
    .join("\n");

  const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  return { ok: true, output };
}
