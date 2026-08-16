import { useState } from "react";
import { runTool } from "../api";

/**
 * A config-driven form for tools that take a set of labeled fields and
 * return a single text output. Used by every "generator" tool whose UI is
 * just inputs -> button -> text block (meta tags, robots.txt, legal
 * boilerplate, etc.) so we don't hand-write nine nearly identical files.
 *
 * fields: [{ key, label, type: "text"|"textarea"|"checkbox"|"select", options?, placeholder? }]
 */
export default function GeneratorForm({ toolId, hint, fields, initial = {}, actionLabel = "Generate" }) {
  const [values, setValues] = useState(() => {
    const base = {};
    fields.forEach((f) => {
      base[f.key] = initial[f.key] ?? (f.type === "checkbox" ? !!f.default : f.default ?? "");
    });
    return base;
  });
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function setField(key, value) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool(toolId, values);
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
      {hint && <p className="tool__hint">{hint}</p>}

      {fields.map((f) => (
        <div key={f.key}>
          {f.type !== "checkbox" && (
            <label className="tool__label" htmlFor={`${toolId}-${f.key}`}>
              {f.label}
            </label>
          )}

          {f.type === "textarea" && (
            <textarea
              id={`${toolId}-${f.key}`}
              className="tool__textarea mono"
              spellCheck={false}
              rows={f.rows || 4}
              placeholder={f.placeholder}
              value={values[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
            />
          )}

          {f.type === "select" && (
            <select
              id={`${toolId}-${f.key}`}
              className="tool__input mono"
              value={values[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
            >
              {f.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          )}

          {f.type === "checkbox" && (
            <label className="tool__check tool__check--block">
              <input
                type="checkbox"
                checked={values[f.key]}
                onChange={(e) => setField(f.key, e.target.checked)}
              />
              {f.label}
            </label>
          )}

          {(!f.type || f.type === "text") && (
            <input
              id={`${toolId}-${f.key}`}
              className="tool__input mono"
              spellCheck={false}
              placeholder={f.placeholder}
              value={values[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
            />
          )}
        </div>
      ))}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {actionLabel}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor={`${toolId}-out`}>
        output
      </label>
      <pre id={`${toolId}-out`} className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
