import { useState } from "react";
import { runTool } from "../api";

export default function UrlEncoder() {
  const [input, setInput] = useState("https://tools.techbanda.com/?q=hello world");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(mode) {
    setBusy(true);
    setError(null);
    const result = await runTool("url-encoder", { input, mode });
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
      <p className="tool__hint">Encode or decode URL components.</p>

      <label className="tool__label" htmlFor="url-in">
        input
      </label>
      <textarea
        id="url-in"
        className="tool__textarea mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
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

      <label className="tool__label" htmlFor="url-out">
        output
      </label>
      <pre id="url-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
