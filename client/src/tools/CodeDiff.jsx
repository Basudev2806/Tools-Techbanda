import { useState } from "react";
import { runTool } from "../api";

function Line({ block }) {
  if (block.type === "modified") {
    return (
      <div className="tool__diff-line tool__diff-line--modified">
        {block.tokens.map((t, i) => (
          <span
            key={i}
            className={t.added ? "tool__diff-token-added" : t.removed ? "tool__diff-token-removed" : ""}
          >
            {t.value}
          </span>
        ))}
      </div>
    );
  }

  const cls =
    block.type === "added" ? "tool__diff-line tool__diff-line--added" : block.type === "removed" ? "tool__diff-line tool__diff-line--removed" : "tool__diff-line";
  const prefix = block.type === "added" ? "+ " : block.type === "removed" ? "- " : "  ";
  return (
    <div className={cls}>
      {prefix}
      {block.value}
    </div>
  );
}

export default function CodeDiff() {
  const [left, setLeft] = useState('function add(a, b) {\n  return a + b;\n}');
  const [right, setRight] = useState('function add(a, b) {\n  return a - b;\n}');
  const [blocks, setBlocks] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("code-diff", { left, right });
    setBusy(false);
    if (result.ok) {
      setBlocks(result.blocks);
    } else {
      setBlocks(null);
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Compare two code blocks — modified lines show which tokens actually changed.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="cd-left">
            before
          </label>
          <textarea
            id="cd-left"
            className="tool__textarea mono"
            spellCheck={false}
            rows={8}
            value={left}
            onChange={(e) => setLeft(e.target.value)}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="cd-right">
            after
          </label>
          <textarea
            id="cd-right"
            className="tool__textarea mono"
            spellCheck={false}
            rows={8}
            value={right}
            onChange={(e) => setRight(e.target.value)}
          />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Compare
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      {blocks && (
        <pre className="tool__output mono tool__diff">
          {blocks.map((b, i) => (
            <Line key={i} block={b} />
          ))}
        </pre>
      )}
    </div>
  );
}
