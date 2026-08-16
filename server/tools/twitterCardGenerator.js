function esc(s = "") {
  return String(s).replace(/"/g, "&quot;");
}

/**
 * body: { title, description, image, site, cardType }
 */
export default function twitterCardGenerator(body = {}) {
  const { title = "", description = "", image = "", site = "", cardType = "summary_large_image" } = body;

  if (!title.trim()) return { ok: false, error: "Title is required." };

  const lines = [
    `<meta name="twitter:card" content="${esc(cardType || "summary_large_image")}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
  ];
  if (description.trim()) lines.push(`<meta name="twitter:description" content="${esc(description)}" />`);
  if (image.trim()) lines.push(`<meta name="twitter:image" content="${esc(image)}" />`);
  if (site.trim()) lines.push(`<meta name="twitter:site" content="${esc(site)}" />`);

  return { ok: true, output: lines.join("\n") };
}
