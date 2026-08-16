import GeneratorForm from "../components/GeneratorForm";

export default function RobotsGenerator() {
  return (
    <GeneratorForm
      toolId="robots-generator"
      hint="Generate a robots.txt file."
      initial={{ rule: "all" }}
      fields={[
        { key: "rule", label: "rule", type: "select", options: ["all", "none", "custom"] },
        { key: "disallowPaths", label: "disallow paths (one per line, used when rule = custom)", type: "textarea", rows: 3, placeholder: "/admin\n/private" },
        { key: "sitemapUrl", label: "sitemap url", placeholder: "https://example.com/sitemap.xml" },
      ]}
    />
  );
}
