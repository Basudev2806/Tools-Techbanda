import { useState } from "react";
import { runTool } from "../api";

const MODES = [
  { id: "upper", label: "UPPER" },
  { id: "lower", label: "lower" },
  { id: "title", label: "Title" },
  { id: "sentence", label: "Sentence" },
];

export default function CaseConverter() {
  const [input, setInput] = useState("tools.techbanda.com developer utilities");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(mode) {
    setBusy(true);
    setError(null);
    const result = await runTool("case-converter", { input, mode });
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
      <p className="tool__hint">Convert text between upper, lower, title, and sentence case.</p>

      <label className="tool__label" htmlFor="case-in">
        input
      </label>
      <textarea
        id="case-in"
        className="tool__textarea mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
      />

      <div className="tool__actions">
        {MODES.map((m) => (
          <button key={m.id} className="btn" disabled={busy} onClick={() => run(m.id)}>
            {m.label}
          </button>
        ))}
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="case-out">
        output
      </label>
      <pre id="case-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
