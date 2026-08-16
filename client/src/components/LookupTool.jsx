import { useState } from "react";
import { runTool } from "../api";

/**
 * Shared UI for tools with one text input -> one action -> a text report.
 * Used by the network/lookup tools (SSL checker, DNS lookup, ping,
 * website status, meta description checker).
 */
export default function LookupTool({ toolId, hint, fieldKey, fieldLabel, placeholder, actionLabel = "Check" }) {
  const [value, setValue] = useState(placeholder || "");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    setOutput("");
    const result = await runTool(toolId, { [fieldKey]: value });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      {hint && <p className="tool__hint">{hint}</p>}

      <label className="tool__label" htmlFor={`${toolId}-field`}>
        {fieldLabel}
      </label>
      <input
        id={`${toolId}-field`}
        className="tool__input mono"
        spellCheck={false}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && run()}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {busy ? "Checking…" : actionLabel}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor={`${toolId}-out`}>
        result
      </label>
      <pre id={`${toolId}-out`} className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
