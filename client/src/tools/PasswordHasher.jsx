import { useState } from "react";
import { runTool } from "../api";

export default function PasswordHasher() {
  const [mode, setMode] = useState("hash");
  const [algorithm, setAlgorithm] = useState("bcrypt");
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [rounds, setRounds] = useState(10);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("password-hasher", { mode, algorithm, password, hash, rounds });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setOutput("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Hash a password with bcrypt or argon2id, or verify a password against an existing hash.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ph-mode">
            mode
          </label>
          <select id="ph-mode" className="tool__input mono" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="hash">Hash</option>
            <option value="verify">Verify</option>
          </select>
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ph-algo">
            algorithm
          </label>
          <select id="ph-algo" className="tool__input mono" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="bcrypt">bcrypt</option>
            <option value="argon2id">argon2id</option>
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="ph-pw">
        password
      </label>
      <input id="ph-pw" className="tool__input mono" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />

      {mode === "hash" && algorithm === "bcrypt" && (
        <>
          <label className="tool__label" htmlFor="ph-rounds">
            rounds: {rounds}
          </label>
          <input
            id="ph-rounds"
            type="range"
            min={4}
            max={14}
            value={rounds}
            onChange={(e) => setRounds(Number(e.target.value))}
            className="tool__range"
          />
        </>
      )}

      {mode === "verify" && (
        <>
          <label className="tool__label" htmlFor="ph-hash">
            hash to verify against
          </label>
          <input id="ph-hash" className="tool__input mono" value={hash} onChange={(e) => setHash(e.target.value)} />
        </>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {busy ? "Working…" : mode === "hash" ? "Hash" : "Verify"}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="ph-out">
        result
      </label>
      <pre id="ph-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
