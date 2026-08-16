import GeneratorForm from "../components/GeneratorForm";

export default function EnvGenerator() {
  return (
    <GeneratorForm
      toolId="env-generator"
      hint="Paste KEY=value pairs (one per line) and convert to .env, docker-compose, or shell export format."
      initial={{ input: "API_KEY=abc123\nDEBUG=true\nPORT=4000", format: "env" }}
      actionLabel="Generate"
      fields={[
        { key: "input", label: "key=value pairs", type: "textarea", rows: 6 },
        { key: "format", label: "output format", type: "select", options: ["env", "shell", "docker-compose"] },
      ]}
    />
  );
}
