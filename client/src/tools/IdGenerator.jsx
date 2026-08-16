import { useState } from "react";
import { runTool } from "../api";

export default function IdGenerator() {
  const [type, setType] = useState("uuid");
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("id-generator", { type, count });
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
      <p className="tool__hint">Generate one or many UUID v4s or ULIDs.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="id-type">
            type
          </label>
          <select id="id-type" className="tool__input mono" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="uuid">UUID v4</option>
            <option value="ulid">ULID</option>
          </select>
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="id-count">
            count: {count}
          </label>
          <input
            id="id-count"
            type="range"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="tool__range"
          />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="id-out">
        output
      </label>
      <pre id="id-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
