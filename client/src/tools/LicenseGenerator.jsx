import GeneratorForm from "../components/GeneratorForm";

export default function LicenseGenerator() {
  return (
    <GeneratorForm
      toolId="license-generator"
      hint="Generate open-source license text with your name and year filled in."
      initial={{ license: "mit", author: "", year: "" }}
      actionLabel="Generate"
      fields={[
        { key: "license", label: "license", type: "select", options: ["mit", "apache-2.0", "bsd-3-clause", "isc", "gpl-3.0", "unlicense"] },
        { key: "author", label: "author / organization" },
        { key: "year", label: "year (optional, defaults to current year)" },
      ]}
    />
  );
}
