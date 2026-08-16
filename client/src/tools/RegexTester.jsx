import { useState } from "react";
import { runTool } from "../api";

const SAMPLE_TEXT = "Contact: dev@techbanda.com or hello@tools.techbanda.com";

function highlight(text, matches) {
  if (!matches.length) return text;
  const parts = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    parts.push(
      <mark key={i} className="tool__mark">
        {m.match || "\u200b"}
      </mark>
    );
    cursor = m.index + m.match.length;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("[\\w.+-]+@[\\w-]+\\.[\\w.-]+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState(SAMPLE_TEXT);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const res = await runTool("regex-tester", { pattern, flags, text });
    setBusy(false);
    if (res.ok) {
      setResult(res);
    } else {
      setResult(null);
      setError(res.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Test a pattern against sample text and see every match highlighted.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="re-pattern">
            pattern
          </label>
          <input
            id="re-pattern"
            className="tool__input mono"
            spellCheck={false}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="re-flags">
            flags
          </label>
          <input
            id="re-flags"
            className="tool__input mono tool__input--flags"
            spellCheck={false}
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
          />
        </div>
      </div>

      <label className="tool__label" htmlFor="re-text">
        test string
      </label>
      <textarea
        id="re-text"
        className="tool__textarea mono"
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Run
        </button>
        {result && (
          <span className="tool__count">
            {result.count} match{result.count === 1 ? "" : "es"}
          </span>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {result && (
        <>
          <span className="tool__label">matches</span>
          <pre className="tool__output mono">{highlight(text, result.matches)}</pre>
        </>
      )}
    </div>
  );
}
