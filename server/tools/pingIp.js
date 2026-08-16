import net from "node:net";

const PORTS_TO_TRY = [443, 80];

function tcpPing(host, port, timeout = 5000) {
  return new Promise((resolve) => {
    const started = Date.now();
    const socket = new net.Socket();
    let done = false;

    const finish = (alive) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve({ alive, time: Date.now() - started });
    };

    socket.setTimeout(timeout);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
    socket.connect(port, host);
  });
}

/**
 * body: { host: string }
 * Note: this measures TCP connect latency (port 443/80), not ICMP echo —
 * it works in hosting environments that block raw sockets/ICMP.
 */
export default async function pingIp(body = {}) {
  const { host = "" } = body;
  const target = host.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  if (!target) return { ok: false, error: "Enter an IP address or hostname." };

  for (const port of PORTS_TO_TRY) {
    const result = await tcpPing(target, port);
    if (result.alive) {
      return {
        ok: true,
        output: [`Host: ${target}`, `Reached on port: ${port}`, `Time: ${result.time} ms`].join("\n"),
      };
    }
  }

  return { ok: true, output: `${target} did not respond on ports 443 or 80.` };
}
