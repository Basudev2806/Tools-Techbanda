import GeneratorForm from "../components/GeneratorForm";

export default function TermsGenerator() {
  return (
    <GeneratorForm
      toolId="terms-generator"
      hint="Generate boilerplate terms & conditions. Review with a professional before publishing."
      fields={[
        { key: "siteName", label: "site name", placeholder: "Techbanda Tools" },
        { key: "siteUrl", label: "site url", placeholder: "https://tools.techbanda.com" },
        { key: "contactEmail", label: "contact email", placeholder: "info@techbanda.com" },
        { key: "governingLaw", label: "governing law (optional)", placeholder: "India" },
        { key: "effectiveDate", label: "effective date (optional)", placeholder: "YYYY-MM-DD" },
      ]}
    />
  );
}
