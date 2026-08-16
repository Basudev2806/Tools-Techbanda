import { useState } from "react";
import { runTool } from "../api";

export default function Md5Generator() {
  const [input, setInput] = useState("tools.techbanda.com");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("md5-generator", { input });
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
      <p className="tool__hint">Hash text with MD5.</p>

      <label className="tool__label" htmlFor="md5-in">
        input
      </label>
      <textarea
        id="md5-in"
        className="tool__textarea mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Hash
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="md5-out">
        output
      </label>
      <pre id="md5-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
