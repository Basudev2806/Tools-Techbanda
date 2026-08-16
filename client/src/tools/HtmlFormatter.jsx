import GeneratorForm from "../components/GeneratorForm";

export default function HtmlFormatter() {
  return (
    <GeneratorForm
      toolId="html-formatter"
      hint="Pretty-print HTML."
      initial={{ input: "<div><p>Hello <b>world</b></p><img src=\"x.png\"></div>", indentSize: "2" }}
      actionLabel="Format"
      fields={[
        { key: "input", label: "html", type: "textarea", rows: 7 },
        { key: "indentSize", label: "indent size", type: "select", options: ["2", "4"] },
      ]}
    />
  );
}
