import { useEffect, useState } from "react";
import { runTool } from "../api";

export default function UserAgentFinder() {
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("user-agent-finder", {});
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setError(result.error);
    }
  }

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tool">
      <p className="tool__hint">Shows the User-Agent header your browser sent with this request.</p>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Refresh
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="ua-out">
        user agent
      </label>
      <pre id="ua-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
