import { useState } from "react";
import { runTool } from "../api";

const SAMPLE = '{"name":"tools.techbanda.com","tools":["json","base64","regex"],"active":true}';

export default function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(mode) {
    setBusy(true);
    setError(null);
    const result = await runTool("json-formatter", { input, mode });
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
      <p className="tool__hint">
        Paste JSON, then pretty-print or minify it. Parsing runs on the server.
      </p>

      <label className="tool__label" htmlFor="json-in">
        input
      </label>
      <textarea
        id="json-in"
        className="tool__textarea mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={() => run("pretty")}>
          Pretty-print
        </button>
        <button className="btn" disabled={busy} onClick={() => run("minify")}>
          Minify
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="json-out">
        output
      </label>
      <pre id="json-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
