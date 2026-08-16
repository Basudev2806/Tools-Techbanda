import GeneratorForm from "../components/GeneratorForm";

export default function JsonValidator() {
  return (
    <GeneratorForm
      toolId="json-validator"
      hint="Check whether text is valid JSON."
      initial={{ input: '{"name": "tools.techbanda.com"}' }}
      actionLabel="Validate"
      fields={[{ key: "input", label: "json", type: "textarea", rows: 8 }]}
    />
  );
}
