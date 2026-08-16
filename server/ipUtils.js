// Loopback and private-range addresses mean the request never left this
// machine (always true in local dev, where the browser hits localhost) —
// req.ip is technically correct there, but neither "what's my IP" nor a
// geolocation lookup can do anything useful with it. Both tools fall back
// to an external echo service in that case.
export function isLoopbackOrPrivate(ip) {
  const clean = (ip || "").replace(/^::ffff:/, "");
  if (clean === "::1" || clean === "127.0.0.1") return true;
  if (/^127\./.test(clean)) return true;
  if (/^10\./.test(clean)) return true;
  if (/^192\.168\./.test(clean)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(clean)) return true;
  return false;
}

export async function fetchExternalIp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    return data.ip || null;
  } catch {
    return null;
  }
}

// Best-effort real public IP for the caller: the request's own address if
// it's already public, otherwise an external echo lookup. Prefers IPv4
// since that's what most geolocation/WHOIS-style services expect.
export async function resolvePublicIp(ip) {
  if (!isLoopbackOrPrivate(ip)) return ip;
  const v4 = await fetchExternalIp("https://api.ipify.org?format=json");
  if (v4) return v4;
  return await fetchExternalIp("https://api6.ipify.org?format=json");
}
