/**
 * body: {
 *   type: "Article" | "Product" | "FAQPage",
 *   // Article: title, author, datePublished, image, description
 *   // Product: name, description, image, price, currency, availability
 *   // FAQPage: faqJson — JSON array of { question, answer }
 * }
 */
export default function schemaGenerator(body = {}) {
  const { type = "Article" } = body;

  let obj;

  if (type === "Product") {
    const { name = "", description = "", image = "", price = "", currency = "USD", availability = "InStock" } = body;
    if (!name.trim()) return { ok: false, error: "Product name is required." };
    obj = {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description: description || undefined,
      image: image || undefined,
      offers: {
        "@type": "Offer",
        price: price || undefined,
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
      },
    };
  } else if (type === "FAQPage") {
    const { faqJson = "[]" } = body;
    let items;
    try {
      items = JSON.parse(faqJson);
    } catch {
      return { ok: false, error: "FAQ list must be valid JSON, e.g. [{\"question\":\"...\",\"answer\":\"...\"}]" };
    }
    if (!Array.isArray(items) || !items.length) {
      return { ok: false, error: "Provide at least one { question, answer } pair." };
    }
    obj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question || "",
        acceptedAnswer: { "@type": "Answer", text: item.answer || "" },
      })),
    };
  } else {
    const { title = "", author = "", datePublished = "", image = "", description = "" } = body;
    if (!title.trim()) return { ok: false, error: "Title is required." };
    obj = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      author: author ? { "@type": "Person", name: author } : undefined,
      datePublished: datePublished || undefined,
      image: image || undefined,
      description: description || undefined,
    };
  }

  const clean = JSON.parse(JSON.stringify(obj)); // drop undefined keys
  const output = `<script type="application/ld+json">\n${JSON.stringify(clean, null, 2)}\n</script>`;
  return { ok: true, output };
}
