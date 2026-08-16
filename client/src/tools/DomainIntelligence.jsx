import { useState } from "react";
import { runTool } from "../api";

const ENDPOINTS = [
  { id: "dns", label: "DNS Records" },
  { id: "whois", label: "WHOIS" },
  { id: "age", label: "Domain Age" },
  { id: "subdomains", label: "Subdomain Finder" },
  { id: "availability", label: "Availability (across TLDs)" },
  { id: "spf", label: "SPF Record" },
  { id: "dmarc", label: "DMARC Record" },
  { id: "dkim", label: "DKIM Record" },
];

export default function DomainIntelligence() {
  const [endpoint, setEndpoint] = useState("dns");
  const [domain, setDomain] = useState("github.com");
  const [recordType, setRecordType] = useState("");
  const [selector, setSelector] = useState("google");
  const [name, setName] = useState("mybrand");
  const [tlds, setTlds] = useState("com,io,dev");
  const [output, setOutput] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    setOutput("");
    const result = await runTool("domain-intelligence", { endpoint, domain, recordType, selector, name, tlds });
    setBusy(false);
    if (result.ok) {
      setOutput(result.output);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">
        DNS, WHOIS, domain age, subdomains, TLD availability, and email-auth (SPF/DMARC/DKIM) lookups —
        built on free, keyless public infrastructure: Cloudflare DNS-over-HTTPS, RDAP
        (the WHOIS successor), and certificate transparency logs. No API key, no rate-limit surprises
        from a third-party paid tier.
      </p>

      <label className="tool__label" htmlFor="di-endpoint">
        lookup type
      </label>
      <select id="di-endpoint" className="tool__input mono" value={endpoint} onChange={(e) => setEndpoint(e.target.value)}>
        {ENDPOINTS.map((e) => (
          <option key={e.id} value={e.id}>
            {e.label}
          </option>
        ))}
      </select>

      {endpoint === "availability" ? (
        <div className="tool__row">
          <div className="tool__field tool__field--grow">
            <label className="tool__label" htmlFor="di-name">
              name (without TLD)
            </label>
            <input id="di-name" className="tool__input mono" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="tool__field tool__field--grow">
            <label className="tool__label" htmlFor="di-tlds">
              tlds (comma-separated)
            </label>
            <input id="di-tlds" className="tool__input mono" value={tlds} onChange={(e) => setTlds(e.target.value)} />
          </div>
        </div>
      ) : (
        <>
          <label className="tool__label" htmlFor="di-domain">
            domain
          </label>
          <input id="di-domain" className="tool__input mono" value={domain} onChange={(e) => setDomain(e.target.value)} />
        </>
      )}

      {endpoint === "dns" && (
        <>
          <label className="tool__label" htmlFor="di-type">
            record type (optional)
          </label>
          <select id="di-type" className="tool__input mono" value={recordType} onChange={(e) => setRecordType(e.target.value)}>
            <option value="">All common types</option>
            {["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </>
      )}

      {endpoint === "dkim" && (
        <>
          <label className="tool__label" htmlFor="di-selector">
            DKIM selector
          </label>
          <input
            id="di-selector"
            className="tool__input mono"
            placeholder="google"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
          />
        </>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {busy ? "Looking up…" : "Look up"}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      <label className="tool__label" htmlFor="di-out">
        result
      </label>
      <pre id="di-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
