import { useState } from "react";
import { runTool } from "../api";

const SAMPLE_CSV = "name,age,city\nAlice,30,Kolkata\nBob,25,Mumbai";
const SAMPLE_JSON = '[\n  { "name": "Alice", "age": 30, "city": "Kolkata" },\n  { "name": "Bob", "age": 25, "city": "Mumbai" }\n]';

export default function CsvJsonConverter() {
  const [mode, setMode] = useState("csv-to-json");
  const [input, setInput] = useState(SAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function switchMode(next) {
    setMode(next);
    setInput(next === "csv-to-json" ? SAMPLE_CSV : SAMPLE_JSON);
    setOutput("");
    setError(null);
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("csv-json-converter", { input, mode });
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
      <p className="tool__hint">Convert between CSV and JSON.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="cj-mode">
            direction
          </label>
          <select id="cj-mode" className="tool__input mono" value={mode} onChange={(e) => switchMode(e.target.value)}>
            <option value="csv-to-json">CSV → JSON</option>
            <option value="json-to-csv">JSON → CSV</option>
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="cj-in">
        input
      </label>
      <textarea
        id="cj-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={7}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Convert
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="cj-out">
        output
      </label>
      <pre id="cj-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
