import GeneratorForm from "../components/GeneratorForm";

export default function PassphraseGenerator() {
  return (
    <GeneratorForm
      toolId="passphrase-generator"
      hint="Generate a word-based passphrase (correct-horse-battery-staple style)."
      initial={{ wordCount: "4", separator: "-", capitalize: true, appendNumber: true }}
      actionLabel="Generate"
      fields={[
        { key: "wordCount", label: "word count", type: "select", options: ["3", "4", "5", "6", "7", "8"] },
        { key: "separator", label: "separator", type: "select", options: ["-", "_", " ", "."] },
        { key: "capitalize", label: "capitalize each word", type: "checkbox" },
        { key: "appendNumber", label: "append a random number", type: "checkbox" },
      ]}
    />
  );
}
