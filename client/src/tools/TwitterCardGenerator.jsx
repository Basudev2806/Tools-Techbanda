import GeneratorForm from "../components/GeneratorForm";

export default function TwitterCardGenerator() {
  return (
    <GeneratorForm
      toolId="twitter-card-generator"
      hint="Generate Twitter Card meta tags."
      initial={{ title: "tools.techbanda.com", cardType: "summary_large_image" }}
      fields={[
        { key: "title", label: "title" },
        { key: "description", label: "description", type: "textarea", rows: 2 },
        { key: "image", label: "image url", placeholder: "https://example.com/card.png" },
        { key: "site", label: "@site handle", placeholder: "@techbanda" },
        { key: "cardType", label: "card type", type: "select", options: ["summary", "summary_large_image"] },
      ]}
    />
  );
}
