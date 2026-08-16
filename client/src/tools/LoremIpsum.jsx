import { useState } from "react";
import { runTool } from "../api";

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState("paragraphs");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("lorem-ipsum", { count, unit });
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
      <p className="tool__hint">Generate placeholder text by words, sentences, or paragraphs.</p>

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="li-count">
            count
          </label>
          <input
            id="li-count"
            type="number"
            min={1}
            max={50}
            className="tool__input mono tool__input--flags"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="li-unit">
            unit
          </label>
          <select
            id="li-unit"
            className="tool__input mono"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="words">words</option>
            <option value="sentences">sentences</option>
            <option value="paragraphs">paragraphs</option>
          </select>
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="li-out">
        output
      </label>
      <pre id="li-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
