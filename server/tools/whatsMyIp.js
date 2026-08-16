import { isLoopbackOrPrivate, fetchExternalIp } from "../ipUtils.js";

/**
 * No input needed — reads the caller's address from the request itself,
 * falling back to an external lookup (ipify) when that address is
 * loopback/private (i.e. the request never left this machine, as in local
 * dev).
 */
export default async function whatsMyIp(_body = {}, meta = {}) {
  const ip = meta.ip || "unknown";

  if (!isLoopbackOrPrivate(ip)) {
    return { ok: true, output: ip };
  }

  const [v4, v6] = await Promise.all([
    fetchExternalIp("https://api.ipify.org?format=json"),
    fetchExternalIp("https://api6.ipify.org?format=json"),
  ]);

  if (!v4 && !v6) {
    return {
      ok: true,
      output: `${ip}\n\n(This looks like a local/private connection — the request never left this machine, which is normal in local dev. Couldn't reach an external lookup to show your public IP instead.)`,
    };
  }

  const lines = ["Public IP (via external lookup, since this request originated locally):"];
  if (v4) lines.push(`IPv4: ${v4}`);
  if (v6 && v6 !== v4) lines.push(`IPv6: ${v6}`);

  return { ok: true, output: lines.join("\n") };
}
