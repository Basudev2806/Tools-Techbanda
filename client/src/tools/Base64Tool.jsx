import { useState } from "react";
import { runTool } from "../api";

export default function Base64Tool() {
  const [input, setInput] = useState("tools.techbanda.com");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(mode) {
    setBusy(true);
    setError(null);
    const result = await runTool("base64", { input, mode });
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
      <p className="tool__hint">Encode text to Base64, or decode a Base64 string back to text.</p>

      <label className="tool__label" htmlFor="b64-in">
        input
      </label>
      <textarea
        id="b64-in"
        className="tool__textarea mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={5}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={() => run("encode")}>
          Encode
        </button>
        <button className="btn" disabled={busy} onClick={() => run("decode")}>
          Decode
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="b64-out">
        output
      </label>
      <pre id="b64-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
