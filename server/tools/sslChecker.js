import tls from "node:tls";

/**
 * body: { domain: string }
 */
export default function sslChecker(body = {}) {
  const { domain = "" } = body;
  const host = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  if (!host) return Promise.resolve({ ok: false, error: "Enter a domain, e.g. example.com" });

  return new Promise((resolve) => {
    const socket = tls.connect(
      { host, port: 443, servername: host, timeout: 8000 },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();

        if (!cert || !cert.subject) {
          resolve({ ok: false, error: "No certificate returned by that host." });
          return;
        }

        resolve({
          ok: true,
          output: [
            `Subject: ${cert.subject.CN || host}`,
            `Issuer: ${cert.issuer?.O || cert.issuer?.CN || "unknown"}`,
            `Valid from: ${cert.valid_from}`,
            `Valid to: ${cert.valid_to}`,
            `Protocol: ${socket.getProtocol?.() || "unknown"}`,
          ].join("\n"),
        });
      }
    );

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ ok: false, error: "Connection timed out." });
    });

    socket.on("error", (err) => {
      resolve({ ok: false, error: err.message });
    });
  });
}
