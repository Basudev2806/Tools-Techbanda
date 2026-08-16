import { X509Certificate } from "node:crypto";

/**
 * body: { pem: string }
 */
export default function certificateDecoder(body = {}) {
  const { pem = "" } = body;

  if (!pem.includes("BEGIN CERTIFICATE")) {
    return { ok: false, error: "Paste a PEM certificate, including the -----BEGIN CERTIFICATE----- header." };
  }

  try {
    const cert = new X509Certificate(pem.trim());
    const now = new Date();
    const validTo = new Date(cert.validTo);
    const expired = validTo < now;

    const lines = [
      `Subject: ${cert.subject.replace(/\n/g, ", ")}`,
      `Issuer: ${cert.issuer.replace(/\n/g, ", ")}`,
      `Valid from: ${cert.validFrom}`,
      `Valid to: ${cert.validTo}${expired ? "  (EXPIRED)" : ""}`,
      `Serial number: ${cert.serialNumber}`,
      `Fingerprint (SHA-256): ${cert.fingerprint256}`,
      `Key usage: ${cert.keyUsage?.join(", ") || "—"}`,
    ];

    if (cert.subjectAltName) lines.push(`Subject alt names: ${cert.subjectAltName}`);
    lines.push(`CA: ${cert.ca ? "yes" : "no"}`);

    return { ok: true, output: lines.join("\n") };
  } catch (err) {
    return { ok: false, error: "Could not parse that certificate — check it's valid PEM." };
  }
}
