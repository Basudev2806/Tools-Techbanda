import GeneratorForm from "../components/GeneratorForm";

export default function PrivacyPolicyGenerator() {
  return (
    <GeneratorForm
      toolId="privacy-policy-generator"
      hint="Generate a boilerplate privacy policy. Review with a professional before publishing."
      initial={{ collectsCookies: true, collectsAnalytics: true }}
      fields={[
        { key: "siteName", label: "site name", placeholder: "Techbanda Tools" },
        { key: "siteUrl", label: "site url", placeholder: "https://tools.techbanda.com" },
        { key: "contactEmail", label: "contact email", placeholder: "info@techbanda.com" },
        { key: "collectsCookies", label: "site uses cookies", type: "checkbox" },
        { key: "collectsAnalytics", label: "site uses analytics", type: "checkbox" },
        { key: "effectiveDate", label: "effective date (optional)", placeholder: "YYYY-MM-DD" },
      ]}
    />
  );
}
