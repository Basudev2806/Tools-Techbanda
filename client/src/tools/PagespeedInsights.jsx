import { useState } from "react";
import { runTool } from "../api";

export default function PagespeedInsights() {
  const [url, setUrl] = useState("https://github.com");
  const [strategy, setStrategy] = useState("mobile");
  const [apiKey, setApiKey] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    setOutput("");

    try {
      const body = {
        url: url.trim(),
        strategy,
      };

      if (apiKey.trim()) {
        body.apiKey = apiKey.trim();
      }

      const result = await runTool("pagespeed-insights", body);

      if (result.ok) {
        setOutput(result.output);
      } else {
        setError(result.error || "PageSpeed audit failed.");
      }
    } catch (err) {
      setError("Unable to run PageSpeed audit.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p>
        Performance, SEO, and accessibility audit via Google PageSpeed
        Insights (runs Lighthouse on Google's servers). Audits can take
        15–30 seconds.
      </p>

      <label className="tool__label" htmlFor="ps-url">
        url
      </label>

      <input
        id="ps-url"
        className="tool__input mono"
        spellCheck={false}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
      />

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ps-strategy">
            strategy
          </label>

          <select
            id="ps-strategy"
            className="tool__input mono"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          >
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </div>

        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ps-key">
            API key (optional)
          </label>

          <input
            id="ps-key"
            type="password"
            className="tool__input mono"
            spellCheck={false}
            placeholder="Leave empty to use server API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </div>

      <div className="tool__actions">
        <button
          className="btn btn--primary"
          disabled={busy || !url.trim()}
          onClick={run}
        >
          {busy ? "Auditing…" : "Run audit"}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="ps-out">
        result
      </label>

      <pre id="ps-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}