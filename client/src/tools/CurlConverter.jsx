import { useState } from "react";
import { runTool } from "../api";

const SAMPLE_CURL = "curl -X POST https://api.example.com/users \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"Basu\"}'";
const SAMPLE_JSON = '{\n  "url": "https://api.example.com/users",\n  "method": "POST",\n  "headers": { "Content-Type": "application/json" },\n  "data": "{\\"name\\":\\"Basu\\"}"\n}';

export default function CurlConverter() {
  const [direction, setDirection] = useState("curl-to-fetch");
  const [input, setInput] = useState(SAMPLE_CURL);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function switchDirection(next) {
    setDirection(next);
    setInput(next === "to-curl" ? SAMPLE_JSON : SAMPLE_CURL);
    setOutput("");
    setError(null);
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("curl-converter", { input, direction });
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
      <p className="tool__hint">Convert a curl command to fetch or axios JS code, or a request description back to curl.</p>

      <label className="tool__label" htmlFor="cc-dir">
        direction
      </label>
      <select id="cc-dir" className="tool__input mono" value={direction} onChange={(e) => switchDirection(e.target.value)}>
        <option value="curl-to-fetch">curl → fetch()</option>
        <option value="curl-to-axios">curl → axios()</option>
        <option value="to-curl">JSON request → curl</option>
      </select>

      <label className="tool__label" htmlFor="cc-in">
        input
      </label>
      <textarea
        id="cc-in"
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

      <label className="tool__label" htmlFor="cc-out">
        output
      </label>
      <pre id="cc-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
