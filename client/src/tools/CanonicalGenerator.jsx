import GeneratorForm from "../components/GeneratorForm";

export default function CanonicalGenerator() {
  return (
    <GeneratorForm
      toolId="canonical-generator"
      hint="Generate a canonical <link> tag for a URL."
      initial={{ url: "https://tools.techbanda.com/json-formatter" }}
      fields={[{ key: "url", label: "url", placeholder: "https://example.com/page" }]}
    />
  );
}
