import { useState } from "react";
import { runTool } from "../api";

const SAMPLE = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">\n  <!-- a red square -->\n  <rect x="0" y="0" width="50" height="50" fill="red"/>\n</svg>';

function toBase64Utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

export default function SvgOptimizer() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("svg-optimizer", { input });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
      setInfo(result.info);
    } else {
      setOutput("");
      setInfo("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Strip unnecessary metadata, comments, and whitespace from SVG.</p>

      <label className="tool__label" htmlFor="svgopt-in">
        input
      </label>
      <textarea
        id="svgopt-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Optimize
        </button>
        {info && <span className="tool__count">{info}</span>}
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="svgopt-out">
        output
      </label>
      <pre id="svgopt-out" className="tool__output mono">
        {output || " "}
      </pre>

      {output && (
        <div className="tool__image-frame">
          <img src={`data:image/svg+xml;base64,${toBase64Utf8(output)}`} alt="Optimized SVG preview" className="tool__image" />
        </div>
      )}
    </div>
  );
}
