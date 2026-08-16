import GeneratorForm from "../components/GeneratorForm";

export default function SlugGenerator() {
  return (
    <GeneratorForm
      toolId="slug-generator"
      hint="Turn a title into a URL-friendly slug."
      initial={{ separator: "-", lowercase: true }}
      actionLabel="Generate slug"
      fields={[
        { key: "input", label: "title", placeholder: "10 Tips for Better Sleep!" },
        { key: "separator", label: "separator", type: "select", options: ["-", "_"] },
        { key: "lowercase", label: "lowercase", type: "checkbox" },
      ]}
    />
  );
}
