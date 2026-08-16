import { useState } from "react";
import { runTool } from "../api";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [sets, setSets] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  function toggle(key) {
    setSets((s) => ({ ...s, [key]: !s[key] }));
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("password-generator", { length, ...sets });
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
      <p className="tool__hint">Generate a random password from the character sets you pick.</p>

      <label className="tool__label" htmlFor="pw-length">
        length: {length}
      </label>
      <input
        id="pw-length"
        type="range"
        min={4}
        max={64}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
        className="tool__range"
      />

      <div className="tool__checks">
        {Object.keys(sets).map((key) => (
          <label key={key} className="tool__check">
            <input type="checkbox" checked={sets[key]} onChange={() => toggle(key)} />
            {key}
          </label>
        ))}
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="pw-out">
        output
      </label>
      <pre id="pw-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
