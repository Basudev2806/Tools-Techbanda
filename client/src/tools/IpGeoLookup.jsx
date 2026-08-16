import { useEffect, useState } from "react";
import { runTool } from "../api";

export default function IpGeoLookup() {
  const [ip, setIp] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [usedOwnIp, setUsedOwnIp] = useState(false);

  async function run(targetIp) {
    setBusy(true);
    setError(null);
    const result = await runTool("ip-geo-lookup", targetIp ? { ip: targetIp } : {});
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
      setUsedOwnIp(!!result.usedOwnIp);
    } else {
      setOutput("");
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
        Shows your IP's location automatically (as seen by the server), or look up any other IP/domain.
      </p>

      <label className="tool__label" htmlFor="ipg-in">
        ip or domain (leave blank for your own)
      </label>
      <input
        id="ipg-in"
        className="tool__input mono"
        spellCheck={false}
        placeholder="8.8.8.8 or example.com"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && run(ip)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={() => run(ip)}>
          Look up
        </button>
        <button className="btn" disabled={busy} onClick={() => { setIp(""); run(); }}>
          My IP
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      {usedOwnIp && !error && <p className="tool__hint">Showing your own IP.</p>}

      <label className="tool__label" htmlFor="ipg-out">
        result
      </label>
      <pre id="ipg-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
