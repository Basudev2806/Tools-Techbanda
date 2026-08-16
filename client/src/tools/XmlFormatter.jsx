import { useState } from "react";
import { runTool } from "../api";

export default function XmlFormatter() {
  const [input, setInput] = useState("<root><item id=\"1\">Hello</item><item id=\"2\">World</item></root>");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("xml-formatter", { input });
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
      <p className="tool__hint">Pretty-print and validate XML.</p>

      <label className="tool__label" htmlFor="xf-in">
        input
      </label>
      <textarea
        id="xf-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={7}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Format
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="xf-out">
        output
      </label>
      <pre id="xf-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
