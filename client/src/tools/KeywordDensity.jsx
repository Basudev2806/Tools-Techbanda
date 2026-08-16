import { useState } from "react";

const STOPWORDS = new Set(
  "a an the and or but if of to in on for with is are was were be been being this that these those it its as at by from has have had not no do does did will would can could should may might i you he she we they his her their our your"
    .split(" ")
);

function analyze(text, minLength) {
  const words = (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter(
    (w) => w.length >= minLength && !STOPWORDS.has(w)
  );
  const total = words.length;
  const counts = new Map();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, count]) => ({ word, count, pct: total ? ((count / total) * 100).toFixed(1) : "0.0" }));
}

const SAMPLE =
  "SEO tools help you understand how search engines see your content. Good SEO means clear structure, relevant keywords, and fast pages. Keyword density is one small signal among many SEO factors.";

export default function KeywordDensity() {
  const [text, setText] = useState(SAMPLE);
  const [minLength, setMinLength] = useState(3);
  const rows = analyze(text, minLength);

  return (
    <div className="tool">
      <p className="tool__hint">Word frequency analysis, excluding common stopwords — updates as you type.</p>

      <label className="tool__label" htmlFor="kd-in">
        text
      </label>
      <textarea
        id="kd-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={7}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <label className="tool__label" htmlFor="kd-minlen">
        minimum word length: {minLength}
      </label>
      <input
        id="kd-minlen"
        type="range"
        min={2}
        max={8}
        value={minLength}
        onChange={(e) => setMinLength(Number(e.target.value))}
        className="tool__range"
      />

      <div className="tool__kd-list">
        {rows.map((r) => (
          <div key={r.word} className="tool__kd-row">
            <span className="tool__kd-word mono">{r.word}</span>
            <div className="tool__kd-bar-track">
              <div className="tool__kd-bar" style={{ width: `${Math.min(100, r.pct * 4)}%` }} />
            </div>
            <span className="tool__kd-pct mono">
              {r.count} · {r.pct}%
            </span>
          </div>
        ))}
        {!rows.length && <p className="tool__hint">No words to analyze.</p>}
      </div>
    </div>
  );
}
