import { useState } from "react";
import { runTool } from "../api";

const SAMPLE_SCHEMA = '{\n  "type": "object",\n  "required": ["name"],\n  "properties": {\n    "name": { "type": "string" },\n    "age": { "type": "number" }\n  }\n}';
const SAMPLE_DATA = '{\n  "name": "Basu",\n  "age": 30\n}';

export default function JsonSchemaValidator() {
  const [schema, setSchema] = useState(SAMPLE_SCHEMA);
  const [data, setData] = useState(SAMPLE_DATA);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    setOutput("");
    const result = await runTool("json-schema-validator", { schema, data });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Validate JSON data against a JSON Schema.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="jsv-schema">
            schema
          </label>
          <textarea
            id="jsv-schema"
            className="tool__textarea mono"
            spellCheck={false}
            rows={9}
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="jsv-data">
            data
          </label>
          <textarea
            id="jsv-data"
            className="tool__textarea mono"
            spellCheck={false}
            rows={9}
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Validate
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="jsv-out">
        result
      </label>
      <pre id="jsv-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
