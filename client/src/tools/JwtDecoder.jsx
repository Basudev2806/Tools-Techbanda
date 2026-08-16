import { useState } from "react";

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const decoded = atob(padded);
  try {
    return decodeURIComponent(
      decoded
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
  } catch {
    return decoded;
  }
}

function formatSection(json) {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState(null);

  function decode(value) {
    setToken(value);
    setError(null);
    setHeader("");
    setPayload("");
    setSignature("");

    const trimmed = value.trim();
    if (!trimmed) return;

    const parts = trimmed.split(".");
    if (parts.length !== 3) {
      setError("A JWT has three dot-separated parts: header.payload.signature");
      return;
    }

    try {
      setHeader(formatSection(base64UrlDecode(parts[0])));
      setPayload(formatSection(base64UrlDecode(parts[1])));
      setSignature(parts[2]);
    } catch {
      setError("Could not decode that token — check it's valid base64url.");
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">
        Decodes a JWT's header and payload — entirely in your browser, nothing is sent anywhere.
        This does not verify the signature.
      </p>

      <label className="tool__label" htmlFor="jwt-in">
        token
      </label>
      <textarea
        id="jwt-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={4}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
        value={token}
        onChange={(e) => decode(e.target.value)}
      />

      {error && <p className="tool__error">{error}</p>}

      {header && (
        <>
          <label className="tool__label">header</label>
          <pre className="tool__output mono">{header}</pre>
        </>
      )}

      {payload && (
        <>
          <label className="tool__label">payload</label>
          <pre className="tool__output mono">{payload}</pre>
        </>
      )}

      {signature && (
        <>
          <label className="tool__label">signature (raw, unverified)</label>
          <pre className="tool__output mono" style={{ wordBreak: "break-all" }}>
            {signature}
          </pre>
        </>
      )}
    </div>
  );
}
