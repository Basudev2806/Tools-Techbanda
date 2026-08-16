import { useState } from "react";
import { runTool } from "../api";

const SAMPLE_XML = "<root>\n  <item id=\"1\">Hello</item>\n  <item id=\"2\">World</item>\n</root>";
const SAMPLE_JSON = '{\n  "root": {\n    "item": [\n      { "@_id": "1", "#text": "Hello" },\n      { "@_id": "2", "#text": "World" }\n    ]\n  }\n}';

export default function XmlJsonConverter() {
  const [mode, setMode] = useState("xml-to-json");
  const [input, setInput] = useState(SAMPLE_XML);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function switchMode(next) {
    setMode(next);
    setInput(next === "xml-to-json" ? SAMPLE_XML : SAMPLE_JSON);
    setOutput("");
    setError(null);
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("xml-json-converter", { input, mode });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Convert between XML and JSON. Attributes map to @_ prefixed keys.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="xj-mode">
            direction
          </label>
          <select id="xj-mode" className="tool__input mono" value={mode} onChange={(e) => switchMode(e.target.value)}>
            <option value="xml-to-json">XML → JSON</option>
            <option value="json-to-xml">JSON → XML</option>
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="xj-in">
        input
      </label>
      <textarea
        id="xj-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Convert
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="xj-out">
        output
      </label>
      <pre id="xj-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
