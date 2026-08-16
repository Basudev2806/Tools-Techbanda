function esc(s = "") {
  return String(s).replace(/"/g, "&quot;");
}

/**
 * body: { title, description, keywords, author, viewport }
 */
export default function metaTagGenerator(body = {}) {
  const { title = "", description = "", keywords = "", author = "", viewport = true } = body;

  if (!title.trim() && !description.trim()) {
    return { ok: false, error: "Provide at least a title or a description." };
  }

  const lines = [];
  if (title.trim()) lines.push(`<title>${esc(title)}</title>`);
  if (description.trim()) lines.push(`<meta name="description" content="${esc(description)}" />`);
  if (keywords.trim()) lines.push(`<meta name="keywords" content="${esc(keywords)}" />`);
  if (author.trim()) lines.push(`<meta name="author" content="${esc(author)}" />`);
  if (viewport) lines.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`);

  return { ok: true, output: lines.join("\n") };
}
