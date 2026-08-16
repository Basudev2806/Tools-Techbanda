import { isLoopbackOrPrivate, resolvePublicIp } from "../ipUtils.js";

const BASE = "https://ipwho.is";

/**
 * body: { ip?: string }
 * meta.ip is the caller's address as seen by this server (same source
 * "What's My IP" uses) — used automatically when no ip is provided. If
 * that address is loopback/private (always true in local dev, where the
 * request never left this machine), it's resolved to the machine's real
 * public IP first — ipwho.is would otherwise correctly report a private
 * address as being in a reserved range, which isn't useful to see.
 */
export default async function ipGeoLookup(body = {}, meta = {}) {
  let target = (body.ip || "").trim();
  let usedOwnIp = false;

  if (!target) {
    usedOwnIp = true;
    target = meta.ip || "";
    if (isLoopbackOrPrivate(target)) {
      const resolved = await resolvePublicIp(target);
      if (!resolved || isLoopbackOrPrivate(resolved)) {
        return {
          ok: false,
          error: `Your connection is local/private (${target}) — the request never left this machine, which is normal in local dev, and an external lookup to find your real public IP didn't succeed. Try entering a specific IP or domain instead.`,
        };
      }
      target = resolved;
    }
  }

  if (!target) return { ok: false, error: "Could not determine an IP to look up." };

  // Strip IPv6-mapped-IPv4 prefix some Node setups report (::ffff:1.2.3.4)
  const clean = target.replace(/^::ffff:/, "");

  try {
    const res = await fetch(`${BASE}/${encodeURIComponent(clean)}`, { signal: AbortSignal.timeout(8000) });
    const data = await res.json();

    if (!data.success) {
      return { ok: false, error: data.message || "Could not locate that address (it may be private/local)." };
    }

    const lines = [
      `IP: ${data.ip}`,
      `Location: ${[data.city, data.region, data.country].filter(Boolean).join(", ")}`,
      `Postal code: ${data.postal || "\u2014"}`,
      `Coordinates: ${data.latitude}, ${data.longitude}`,
      `Timezone: ${data.timezone?.id || "\u2014"} (UTC${data.timezone?.utc || ""})`,
      `ISP / Org: ${data.connection?.isp || "\u2014"}`,
      `ASN: ${data.connection?.asn ?? "\u2014"}`,
      `Currency: ${data.currency?.name || "\u2014"}`,
    ];

    return { ok: true, output: lines.join("\n"), usedOwnIp };
  } catch (err) {
    return { ok: false, error: "Could not reach the IP lookup service." };
  }
}
