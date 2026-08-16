import { useState } from "react";
import { runTool } from "../api";

export default function BinaryConverter() {
  const [input, setInput] = useState("techbanda");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(mode) {
    setBusy(true);
    setError(null);
    const result = await runTool("binary-converter", { input, mode });
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
      <p className="tool__hint">Convert text to binary, or space-separated 8-bit binary back to text.</p>

      <label className="tool__label" htmlFor="bin-in">
        input
      </label>
      <textarea
        id="bin-in"
        className="tool__textarea mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={() => run("text-to-binary")}>
          Text → Binary
        </button>
        <button className="btn" disabled={busy} onClick={() => run("binary-to-text")}>
          Binary → Text
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="bin-out">
        output
      </label>
      <pre id="bin-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
