import GeneratorForm from "../components/GeneratorForm";

export default function SitemapGenerator() {
  return (
    <GeneratorForm
      toolId="sitemap-generator"
      hint="Build a sitemap.xml from a list of URLs (one per line)."
      initial={{ urls: "https://tools.techbanda.com\nhttps://tools.techbanda.com/about", changefreq: "weekly", priority: "0.8" }}
      actionLabel="Generate sitemap"
      fields={[
        { key: "urls", label: "urls (one per line)", type: "textarea", rows: 6 },
        { key: "changefreq", label: "change frequency (optional)", type: "select", options: ["", "always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] },
        { key: "priority", label: "priority (optional, 0.0-1.0)", placeholder: "0.8" },
      ]}
    />
  );
}
