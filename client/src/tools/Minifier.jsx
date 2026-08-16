import { useState } from "react";
import { runTool } from "../api";

export default function Minifier() {
  const [lang, setLang] = useState("js");
  const [input, setInput] = useState("function add(a, b) {\n  return a + b;\n}");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("minifier", { input, lang });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  const savings = output ? Math.round((1 - output.length / input.length) * 100) : null;

  return (
    <div className="tool">
      <p className="tool__hint">Minify HTML, CSS, or JavaScript.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="min-lang">
            language
          </label>
          <select id="min-lang" className="tool__input mono" value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="js">JavaScript</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="min-in">
        input
      </label>
      <textarea
        id="min-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={7}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Minify
        </button>
        {savings !== null && <span className="tool__count">{savings}% smaller</span>}
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="min-out">
        output
      </label>
      <pre id="min-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
