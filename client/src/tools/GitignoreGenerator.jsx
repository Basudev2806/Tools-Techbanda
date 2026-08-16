import { useState } from "react";
import { runTool } from "../api";

const TEMPLATES = [
  ["node", "Node.js"],
  ["python", "Python"],
  ["java", "Java"],
  ["android", "Android"],
  ["ios", "Xcode / iOS"],
  ["flutter", "Flutter"],
  ["react", "React"],
  ["macos", "macOS"],
  ["windows", "Windows"],
  ["vscode", "VS Code"],
  ["intellij", "JetBrains IDEs"],
  ["terraform", "Terraform"],
  ["logs", "Logs"],
];

export default function GitignoreGenerator() {
  const [selected, setSelected] = useState(new Set(["node", "macos", "vscode"]));
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("gitignore-generator", { templates: [...selected] });
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
      <p className="tool__hint">Pick the languages/frameworks/tools your project uses.</p>

      <div className="tool__checks">
        {TEMPLATES.map(([id, label]) => (
          <label key={id} className="tool__check">
            <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} />
            {label}
          </label>
        ))}
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate .gitignore
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="gi-out">
        output
      </label>
      <pre id="gi-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
