import GeneratorForm from "../components/GeneratorForm";

export default function GraphqlFormatter() {
  return (
    <GeneratorForm
      toolId="graphql-formatter"
      hint="Pretty-print a GraphQL query."
      initial={{ input: "query { user(id: 1) { name email posts { title } } }", indentSize: "2" }}
      actionLabel="Format"
      fields={[
        { key: "input", label: "query", type: "textarea", rows: 7 },
        { key: "indentSize", label: "indent size", type: "select", options: ["2", "4"] },
      ]}
    />
  );
}
