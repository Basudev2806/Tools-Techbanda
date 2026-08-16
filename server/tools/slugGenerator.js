/**
 * body: { input: string, separator?: "-" | "_", lowercase?: boolean }
 */
export default function slugGenerator(body = {}) {
  const { input = "", separator = "-", lowercase = true } = body;

  if (!input.trim()) return { ok: false, error: "Input is empty." };

  const sep = separator === "_" ? "_" : "-";

  let slug = input
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/[\s_-]+/g, sep);

  if (lowercase) slug = slug.toLowerCase();

  return { ok: true, output: slug };
}
