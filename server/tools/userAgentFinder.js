/**
 * No input needed — reads the caller's User-Agent header from the request itself.
 */
export default function userAgentFinder(_body = {}, meta = {}) {
  const ua = meta.headers?.["user-agent"] || "unknown";
  return { ok: true, output: ua };
}
