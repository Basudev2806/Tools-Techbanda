import { useEffect, useState } from "react";
import { runTool } from "../api";

export default function WhatsMyIp() {
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("whats-my-ip", {});
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
      <p className="tool__hint">
        Shows the IP address the API server sees for this request. In local dev, that's usually a
        loopback address (your browser and the server are the same machine) — falls back to an
        external lookup to show your actual public IP in that case.
      </p>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Refresh
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="ip-out">
        your ip
      </label>
      <pre id="ip-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
