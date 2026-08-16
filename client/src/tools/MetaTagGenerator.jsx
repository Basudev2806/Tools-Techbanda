import GeneratorForm from "../components/GeneratorForm";

export default function MetaTagGenerator() {
  return (
    <GeneratorForm
      toolId="meta-tag-generator"
      hint="Generate title, description, keyword, and viewport meta tags."
      initial={{ title: "tools.techbanda.com", description: "Developer utilities console.", viewport: true }}
      fields={[
        { key: "title", label: "title" },
        { key: "description", label: "description", type: "textarea", rows: 2 },
        { key: "keywords", label: "keywords (comma-separated)", placeholder: "dev tools, json, base64" },
        { key: "author", label: "author" },
        { key: "viewport", label: "include responsive viewport tag", type: "checkbox" },
      ]}
    />
  );
}
