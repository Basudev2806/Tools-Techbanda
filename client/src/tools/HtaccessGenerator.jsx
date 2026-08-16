import GeneratorForm from "../components/GeneratorForm";

export default function HtaccessGenerator() {
  return (
    <GeneratorForm
      toolId="htaccess-generator"
      hint="Generate common .htaccess rules. Pick any combination."
      fields={[
        { key: "forceHttps", label: "Force HTTPS", type: "checkbox" },
        { key: "forceWww", label: "Force www.", type: "checkbox" },
        { key: "removeWww", label: "Remove www.", type: "checkbox" },
        { key: "gzipCompression", label: "Enable gzip compression", type: "checkbox" },
        { key: "browserCaching", label: "Enable browser caching", type: "checkbox" },
        { key: "customErrorPage", label: "custom 404 page path", placeholder: "/404.html" },
      ]}
    />
  );
}
