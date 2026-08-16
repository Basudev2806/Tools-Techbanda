import GeneratorForm from "../components/GeneratorForm";

export default function OgTagGenerator() {
  return (
    <GeneratorForm
      toolId="og-tag-generator"
      hint="Generate Open Graph tags for social sharing previews."
      initial={{ title: "tools.techbanda.com", type: "website" }}
      fields={[
        { key: "title", label: "title" },
        { key: "description", label: "description", type: "textarea", rows: 2 },
        { key: "image", label: "image url", placeholder: "https://example.com/og.png" },
        { key: "url", label: "page url", placeholder: "https://example.com/page" },
        { key: "type", label: "type", type: "select", options: ["website", "article", "product", "video"] },
        { key: "siteName", label: "site name" },
      ]}
    />
  );
}
