import { useEffect, useState } from "react";
import { runTool } from "../api";

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

export default function RequestBin() {
  const [binId, setBinId] = useState("");
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function createBin() {
    setBusy(true);
    setError(null);
    const result = await runTool("request-bin", { action: "create" });
    setBusy(false);
    if (result.ok) {
      setBinId(result.binId);
      setRequests([]);
    } else {
      setError(result.error);
    }
  }

  async function refresh() {
    if (!binId) return;
    const result = await runTool("request-bin", { action: "list", binId });
    if (result.ok) setRequests(result.requests);
  }

  async function clear() {
    if (!binId) return;
    const result = await runTool("request-bin", { action: "clear", binId });
    if (result.ok) setRequests([]);
  }

  useEffect(() => {
    if (!binId) return;
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [binId]);

  const binUrl = binId ? `${API_BASE}/api/bin/${binId}` : "";

  return (
    <div className="tool">
      <p className="tool__hint">
        Get a temporary URL that logs every request sent to it — point a webhook at it and watch what arrives.
        Bins expire after 30 minutes.
      </p>

      {!binId ? (
        <div className="tool__actions">
          <button className="btn btn--primary" disabled={busy} onClick={createBin}>
            Create a bin
          </button>
        </div>
      ) : (
        <>
          <label className="tool__label">your bin url</label>
          <pre className="tool__output mono" style={{ wordBreak: "break-all" }}>
            {binUrl}
          </pre>

          <div className="tool__actions">
            <button className="btn" onClick={refresh}>
              Refresh now
            </button>
            <button className="btn" onClick={clear}>
              Clear log
            </button>
            <button className="btn" onClick={createBin}>
              New bin
            </button>
            <span className="tool__count">auto-refreshes every 3s</span>
          </div>

          {error && <p className="tool__error">{error}</p>}

          <label className="tool__label">captured requests ({requests.length})</label>
          {requests.length === 0 && <p className="tool__hint">Nothing yet — send a request to the URL above.</p>}
          <div className="tool__bin-list">
            {requests.map((r, i) => (
              <div key={i} className="tool__bin-item">
                <div className="mono tool__bin-summary">
                  <span className="tool__bin-method">{r.method}</span> {r.path} — {r.receivedAt}
                </div>
                {r.body && Object.keys(r.body).length > 0 && (
                  <>
                    <label className="tool__label" style={{ marginTop: 8 }}>
                      body
                    </label>
                    <pre className="tool__output mono">{JSON.stringify(r.body, null, 2)}</pre>
                  </>
                )}
                <details>
                  <summary className="mono tool__bin-details-toggle">headers &amp; query</summary>
                  <pre className="tool__output mono">{JSON.stringify({ headers: r.headers, query: r.query }, null, 2)}</pre>
                </details>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
