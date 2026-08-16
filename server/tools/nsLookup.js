import dns from "node:dns/promises";

/**
 * body: { domain: string }
 */
export default async function nsLookup(body = {}) {
  const { domain = "" } = body;
  const host = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  if (!host) return { ok: false, error: "Enter a domain, e.g. example.com" };

  try {
    const records = await dns.resolveNs(host);
    return { ok: true, output: records.join("\n") };
  } catch (err) {
    return { ok: false, error: `Could not resolve nameservers for ${host}.` };
  }
}
