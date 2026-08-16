import { useState } from "react";
import { runTool } from "../api";

export default function CronParser() {
  const [expression, setExpression] = useState("*/15 9-17 * * 1-5");
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("cron-parser", { expression, count });
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
      <p className="tool__hint">Explain a cron expression in plain English and see its next run times (UTC).</p>

      <label className="tool__label" htmlFor="cron-in">
        cron expression
      </label>
      <input
        id="cron-in"
        className="tool__input mono"
        spellCheck={false}
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
      />

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="cron-count">
            next runs: {count}
          </label>
          <input
            id="cron-count"
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="tool__range"
          />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Parse
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="cron-out">
        output
      </label>
      <pre id="cron-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
