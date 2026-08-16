const DOH_BASE = "https://cloudflare-dns.com/dns-query";
const RDAP_BASE = "https://rdap.org/domain";
const CRTSH_BASE = "https://crt.sh";

// Standard DNS RR type numbers, as returned by Cloudflare's DoH JSON API.
const RECORD_TYPE_NAMES = {
  1: "A", 2: "NS", 5: "CNAME", 6: "SOA", 15: "MX", 16: "TXT", 28: "AAAA", 33: "SRV", 257: "CAA",
};

async function dohQuery(name, type) {
  const params = new URLSearchParams({ name, type });
  const res = await fetch(`${DOH_BASE}?${params}`, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`DNS lookup failed (HTTP ${res.status}).`);
  return res.json();
}

function formatDohAnswers(json) {
  if (json.Status !== 0 || !json.Answer?.length) return null;
  return json.Answer.map((a) => `${a.name}  ${RECORD_TYPE_NAMES[a.type] || a.type}  ${a.data}`);
}

async function rdapLookup(domain) {
  const res = await fetch(`${RDAP_BASE}/${encodeURIComponent(domain)}`, { signal: AbortSignal.timeout(8000) });
  if (res.status === 404) return { found: false };
  if (!res.ok) throw new Error(`RDAP lookup failed (HTTP ${res.status}).`);
  const data = await res.json();
  return { found: true, data };
}

function formatRdap(data) {
  const events = data.events || [];
  const findEvent = (action) => events.find((e) => e.eventAction === action)?.eventDate;
  const registered = findEvent("registration");
  const expires = findEvent("expiration");
  const updated = findEvent("last changed") || findEvent("last update of RDAP database");
  const registrar = data.entities?.find((e) => e.roles?.includes("registrar"));
  const registrarName = registrar?.vcardArray?.[1]?.find((f) => f[0] === "fn")?.[3] || registrar?.handle || "\u2014";
  const nameservers = (data.nameservers || []).map((ns) => ns.ldhName).filter(Boolean);
  const status = data.status || [];

  const lines = [
    `Domain: ${(data.ldhName || "").toLowerCase()}`,
    `Registrar: ${registrarName}`,
    `Registered: ${registered || "\u2014"}`,
    `Expires: ${expires || "\u2014"}`,
    `Last updated: ${updated || "\u2014"}`,
  ];

  if (registered) {
    const ageMs = Date.now() - new Date(registered).getTime();
    const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
    lines.push(`Age: ${ageYears >= 1 ? `${ageYears.toFixed(1)} years` : `${Math.round(ageYears * 365)} days`}`);
  }

  if (nameservers.length) lines.push(`Nameservers: ${nameservers.join(", ")}`);
  if (status.length) lines.push(`Status: ${status.join(", ")}`);

  return lines.join("\n");
}

function parseCrtShSubdomains(json, domain) {
  const names = new Set();
  for (const entry of json) {
    (entry.name_value || "").split("\n").forEach((n) => {
      const clean = n.trim().toLowerCase().replace(/^\*\./, "");
      if (clean.endsWith(domain) && clean !== domain) names.add(clean);
    });
  }
  return [...names].sort();
}

/**
 * body: {
 *   endpoint: "dns" | "whois" | "age" | "subdomains" | "availability" | "spf" | "dmarc" | "dkim",
 *   domain?: string,
 *   recordType?: string,   // dns only: A|AAAA|CNAME|MX|TXT|NS|SOA
 *   selector?: string,     // dkim only
 *   name?: string,         // availability only — bare name without TLD
 *   tlds?: string,         // availability only — comma-separated, e.g. "com,io,dev"
 * }
 * Built entirely on free, keyless infrastructure: Cloudflare DNS-over-HTTPS
 * for DNS/SPF/DMARC/DKIM (plain DNS TXT lookups — SPF/DMARC/DKIM are just
 * conventionally-located TXT records, no special API needed), RDAP (the
 * IETF/ICANN-mandated WHOIS successor, via the public rdap.org bootstrap)
 * for registration data and domain age, and crt.sh (certificate
 * transparency log search) for subdomain discovery.
 */
export default async function domainIntelligence(body = {}) {
  const { endpoint = "dns", domain = "", recordType = "", selector = "", name = "", tlds = "" } = body;
  const cleanDomain = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();

  try {
    switch (endpoint) {
      case "whois":
      case "age": {
        if (!cleanDomain) return { ok: false, error: "Enter a domain." };
        const { found, data } = await rdapLookup(cleanDomain);
        if (!found) return { ok: true, output: `No RDAP record found for ${cleanDomain} — it may be unregistered, or its registry doesn't support RDAP yet.` };
        return { ok: true, output: formatRdap(data) };
      }

      case "subdomains": {
        if (!cleanDomain) return { ok: false, error: "Enter a domain." };
        const res = await fetch(`${CRTSH_BASE}/?q=${encodeURIComponent("%." + cleanDomain)}&output=json`, {
          signal: AbortSignal.timeout(12000),
        });
        if (!res.ok) throw new Error(`crt.sh lookup failed (HTTP ${res.status}).`);
        const json = await res.json();
        const subs = parseCrtShSubdomains(json, cleanDomain).slice(0, 50);
        if (!subs.length) return { ok: true, output: "No subdomains found in certificate transparency logs." };
        return { ok: true, output: `${subs.length} subdomain(s) found (via certificate transparency logs, capped at 50):\n\n${subs.join("\n")}` };
      }

      case "availability": {
        if (!name.trim()) return { ok: false, error: "Enter a bare name, e.g. mybrand." };
        const tldList = tlds.split(",").map((t) => t.trim().replace(/^\./, "")).filter(Boolean);
        const targets = tldList.length ? tldList : ["com", "io", "dev"];

        const results = await Promise.all(
          targets.map(async (tld) => {
            const full = `${name.trim().toLowerCase()}.${tld}`;
            try {
              const { found } = await rdapLookup(full);
              return `${full}: ${found ? "Taken" : "Likely available"}`;
            } catch {
              return `${full}: Unknown (lookup failed)`;
            }
          })
        );
        return {
          ok: true,
          output: `${results.join("\n")}\n\n(Based on RDAP registry records — a fast, reasonable signal, but not a substitute for checking with a registrar before buying.)`,
        };
      }

      case "spf": {
        if (!cleanDomain) return { ok: false, error: "Enter a domain." };
        const json = await dohQuery(cleanDomain, "TXT");
        const answers = formatDohAnswers(json) || [];
        const spf = answers.filter((a) => a.includes("v=spf1"));
        return { ok: true, output: spf.length ? spf.join("\n") : `No SPF record found at ${cleanDomain}.` };
      }

      case "dmarc": {
        if (!cleanDomain) return { ok: false, error: "Enter a domain." };
        const json = await dohQuery(`_dmarc.${cleanDomain}`, "TXT");
        const answers = formatDohAnswers(json) || [];
        const dmarc = answers.filter((a) => a.includes("v=DMARC1"));
        return { ok: true, output: dmarc.length ? dmarc.join("\n") : `No DMARC record found at _dmarc.${cleanDomain}.` };
      }

      case "dkim": {
        if (!cleanDomain) return { ok: false, error: "Enter a domain." };
        if (!selector.trim()) return { ok: false, error: "Enter a DKIM selector, e.g. google." };
        const dkimHost = `${selector.trim()}._domainkey.${cleanDomain}`;
        const json = await dohQuery(dkimHost, "TXT");
        const answers = formatDohAnswers(json);
        return { ok: true, output: answers ? answers.join("\n") : `No DKIM record found at ${dkimHost}.` };
      }

      case "dns":
      default: {
        if (!cleanDomain) return { ok: false, error: "Enter a domain." };
        const types = recordType ? [recordType] : ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];
        const results = await Promise.all(types.map((t) => dohQuery(cleanDomain, t).then((j) => ({ type: t, answers: formatDohAnswers(j) }))));
        const lines = results.flatMap((r) => r.answers || []);
        return { ok: true, output: lines.length ? lines.join("\n") : `No records found for ${cleanDomain}.` };
      }
    }
  } catch (err) {
    return { ok: false, error: err.message || "Lookup failed." };
  }
}
