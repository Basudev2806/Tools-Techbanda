import GeneratorForm from "../components/GeneratorForm";

export default function RandomDataGenerator() {
  return (
    <GeneratorForm
      toolId="random-data-generator"
      hint="Generate fake names, emails, addresses, and phone numbers for testing."
      initial={{ count: "5" }}
      actionLabel="Generate"
      fields={[{ key: "count", label: "rows", type: "select", options: ["1", "5", "10", "20", "50"] }]}
    />
  );
}
