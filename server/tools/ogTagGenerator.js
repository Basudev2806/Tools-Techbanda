function esc(s = "") {
  return String(s).replace(/"/g, "&quot;");
}

/**
 * body: { title, description, image, url, type, siteName }
 */
export default function ogTagGenerator(body = {}) {
  const { title = "", description = "", image = "", url = "", type = "website", siteName = "" } = body;

  if (!title.trim()) return { ok: false, error: "Title is required." };

  const lines = [`<meta property="og:title" content="${esc(title)}" />`];
  if (description.trim()) lines.push(`<meta property="og:description" content="${esc(description)}" />`);
  if (image.trim()) lines.push(`<meta property="og:image" content="${esc(image)}" />`);
  if (url.trim()) lines.push(`<meta property="og:url" content="${esc(url)}" />`);
  lines.push(`<meta property="og:type" content="${esc(type || "website")}" />`);
  if (siteName.trim()) lines.push(`<meta property="og:site_name" content="${esc(siteName)}" />`);

  return { ok: true, output: lines.join("\n") };
}
