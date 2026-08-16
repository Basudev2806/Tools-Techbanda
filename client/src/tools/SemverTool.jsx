import { useState } from "react";
import { runTool } from "../api";

export default function SemverTool() {
  const [mode, setMode] = useState("compare");
  const [versionA, setVersionA] = useState("1.4.2");
  const [versionB, setVersionB] = useState("1.10.0");
  const [bumpType, setBumpType] = useState("patch");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("semver-tool", { mode, versionA, versionB, bumpType });
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
      <p className="tool__hint">Compare two semantic versions, or bump one.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="sv-mode">
            mode
          </label>
          <select id="sv-mode" className="tool__input mono" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="compare">Compare</option>
            <option value="bump">Bump</option>
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="sv-a">
        version
      </label>
      <input id="sv-a" className="tool__input mono" value={versionA} onChange={(e) => setVersionA(e.target.value)} />

      {mode === "compare" ? (
        <>
          <label className="tool__label" htmlFor="sv-b">
            compare against
          </label>
          <input id="sv-b" className="tool__input mono" value={versionB} onChange={(e) => setVersionB(e.target.value)} />
        </>
      ) : (
        <>
          <label className="tool__label" htmlFor="sv-bump">
            bump
          </label>
          <select id="sv-bump" className="tool__input mono" value={bumpType} onChange={(e) => setBumpType(e.target.value)}>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
            <option value="patch">Patch</option>
          </select>
        </>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {mode === "compare" ? "Compare" : "Bump"}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="sv-out">
        result
      </label>
      <pre id="sv-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
