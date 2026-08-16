import { useState } from "react";

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function strToBytes(str) {
  return new TextEncoder().encode(str);
}

async function signHS256(headerPayload, secret) {
  const key = await crypto.subtle.importKey("raw", strToBytes(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, strToBytes(headerPayload));
  return base64UrlEncode(new Uint8Array(sig));
}

const SAMPLE_PAYLOAD = '{\n  "sub": "1234567890",\n  "name": "Basu",\n  "iat": 1716239022\n}';

export default function JwtEncoder() {
  const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function encode() {
    setError(null);
    setToken("");

    let payloadObj;
    try {
      payloadObj = JSON.parse(payload);
    } catch {
      setError("Payload must be valid JSON.");
      return;
    }
    if (!secret) {
      setError("Enter a secret key.");
      return;
    }

    setBusy(true);
    try {
      const header = { alg: "HS256", typ: "JWT" };
      const headerB64 = base64UrlEncode(strToBytes(JSON.stringify(header)));
      const payloadB64 = base64UrlEncode(strToBytes(JSON.stringify(payloadObj)));
      const signature = await signHS256(`${headerB64}.${payloadB64}`, secret);
      setToken(`${headerB64}.${payloadB64}.${signature}`);
    } catch {
      setError("Could not sign that token.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">
        Builds and signs an HS256 JWT entirely in your browser via the Web Crypto API — the secret never leaves
        this page.
      </p>

      <label className="tool__label" htmlFor="je-payload">
        payload (JSON)
      </label>
      <textarea
        id="je-payload"
        className="tool__textarea mono"
        spellCheck={false}
        rows={7}
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />

      <label className="tool__label" htmlFor="je-secret">
        secret (HS256)
      </label>
      <input id="je-secret" className="tool__input mono" value={secret} onChange={(e) => setSecret(e.target.value)} />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={encode}>
          Sign token
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="je-out">
        token
      </label>
      <pre id="je-out" className="tool__output mono" style={{ wordBreak: "break-all" }}>
        {token || " "}
      </pre>
    </div>
  );
}
