import { useState } from "react";
import { runTool } from "../api";

export default function ColorConverter() {
  const [input, setInput] = useState("63,185,80");
  const [mode, setMode] = useState("rgb-to-hex");
  const [output, setOutput] = useState("");
  const [swatch, setSwatch] = useState("#3fb950");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("color-converter", { input, mode });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
      setSwatch(mode === "hex-to-rgb" ? "#" + input.trim().replace("#", "") : result.output);
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  function swap() {
    setMode((m) => (m === "rgb-to-hex" ? "hex-to-rgb" : "rgb-to-hex"));
    setInput(output || input);
    setOutput("");
  }

  return (
    <div className="tool">
      <p className="tool__hint">Convert colors between RGB and hex.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="color-in">
            {mode === "rgb-to-hex" ? "rgb (r,g,b)" : "hex"}
          </label>
          <input
            id="color-in"
            className="tool__input mono"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="tool__swatch" style={{ background: swatch }} aria-hidden="true" />
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Convert
        </button>
        <button className="btn" onClick={swap}>
          Swap direction
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="color-out">
        output
      </label>
      <pre id="color-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
