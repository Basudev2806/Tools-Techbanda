import GeneratorForm from "../components/GeneratorForm";

export default function DisclaimerGenerator() {
  return (
    <GeneratorForm
      toolId="disclaimer-generator"
      hint="Generate a boilerplate disclaimer. Review with a professional before publishing."
      fields={[
        { key: "siteName", label: "site name", placeholder: "Techbanda Tools" },
        { key: "siteUrl", label: "site url", placeholder: "https://tools.techbanda.com" },
        { key: "contactEmail", label: "contact email", placeholder: "info@techbanda.com" },
        { key: "isProfessionalAdvice", label: "content could be read as professional advice", type: "checkbox" },
        { key: "effectiveDate", label: "effective date (optional)", placeholder: "YYYY-MM-DD" },
      ]}
    />
  );
}
