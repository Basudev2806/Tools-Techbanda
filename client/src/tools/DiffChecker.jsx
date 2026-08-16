import { useState } from "react";
import { runTool } from "../api";

export default function DiffChecker() {
  const [left, setLeft] = useState("hello\nworld\nfoo");
  const [right, setRight] = useState("hello\nthere\nfoo\nbar");
  const [diff, setDiff] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("diff-checker", { left, right });
    setBusy(false);
    if (result.ok) {
      setDiff(result.diff);
      setStats(result.stats);
    } else {
      setDiff(null);
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Compare two blocks of text line by line.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="diff-left">
            original
          </label>
          <textarea
            id="diff-left"
            className="tool__textarea mono"
            spellCheck={false}
            rows={7}
            value={left}
            onChange={(e) => setLeft(e.target.value)}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="diff-right">
            changed
          </label>
          <textarea
            id="diff-right"
            className="tool__textarea mono"
            spellCheck={false}
            rows={7}
            value={right}
            onChange={(e) => setRight(e.target.value)}
          />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Compare
        </button>
        {stats && (
          <span className="tool__count">
            +{stats.added} / -{stats.removed}
          </span>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {diff && (
        <pre className="tool__output mono tool__diff">
          {diff.map((part, i) => (
            <span
              key={i}
              className={part.added ? "tool__diff-added" : part.removed ? "tool__diff-removed" : ""}
            >
              {part.value}
            </span>
          ))}
        </pre>
      )}
    </div>
  );
}
