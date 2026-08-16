import { useState } from "react";

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

function verdict(ratio, large) {
  const aa = ratio >= (large ? 3 : 4.5);
  const aaa = ratio >= (large ? 4.5 : 7);
  return { aa, aaa };
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#3fb950");

  let ratio = 1;
  try {
    ratio = contrastRatio(fg, bg);
  } catch {
    ratio = 1;
  }

  const normal = verdict(ratio, false);
  const large = verdict(ratio, true);

  return (
    <div className="tool">
      <p className="tool__hint">WCAG contrast ratio between a text color and a background color \u2014 updates live.</p>

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="cc-fg">
            text color
          </label>
          <input id="cc-fg" type="color" className="tool__color" value={fg} onChange={(e) => setFg(e.target.value)} />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="cc-bg">
            background color
          </label>
          <input id="cc-bg" type="color" className="tool__color" value={bg} onChange={(e) => setBg(e.target.value)} />
        </div>
      </div>

      <div
        className="tool__contrast-preview"
        style={{ background: bg, color: fg }}
      >
        <span style={{ fontSize: 24, fontWeight: 700 }}>Large text preview</span>
        <span>Normal body text preview \u2014 the quick brown fox jumps over the lazy dog.</span>
      </div>

      <div className="tool__stats-grid">
        <div className="tool__stat">
          <span className="tool__stat-value">{ratio.toFixed(2)}:1</span>
          <span className="tool__stat-label">contrast ratio</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value" style={{ color: normal.aa ? "var(--accent)" : "var(--error)" }}>
            {normal.aa ? "Pass" : "Fail"}
          </span>
          <span className="tool__stat-label">AA \u2014 normal text (4.5:1)</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value" style={{ color: normal.aaa ? "var(--accent)" : "var(--error)" }}>
            {normal.aaa ? "Pass" : "Fail"}
          </span>
          <span className="tool__stat-label">AAA \u2014 normal text (7:1)</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value" style={{ color: large.aa ? "var(--accent)" : "var(--error)" }}>
            {large.aa ? "Pass" : "Fail"}
          </span>
          <span className="tool__stat-label">AA \u2014 large text (3:1)</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value" style={{ color: large.aaa ? "var(--accent)" : "var(--error)" }}>
            {large.aaa ? "Pass" : "Fail"}
          </span>
          <span className="tool__stat-label">AAA \u2014 large text (4.5:1)</span>
        </div>
      </div>
    </div>
  );
}
