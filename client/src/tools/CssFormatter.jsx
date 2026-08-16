import GeneratorForm from "../components/GeneratorForm";

export default function CssFormatter() {
  return (
    <GeneratorForm
      toolId="css-formatter"
      hint="Beautify minified or compact CSS."
      initial={{ input: "body{color:red;background:blue}.a{margin:0;padding:4px}", indentSize: "2" }}
      actionLabel="Format"
      fields={[
        { key: "input", label: "css", type: "textarea", rows: 7 },
        { key: "indentSize", label: "indent size", type: "select", options: ["2", "4"] },
      ]}
    />
  );
}
