import LookupTool from "../components/LookupTool";

export default function PingIp() {
  return (
    <LookupTool
      toolId="ping-ip"
      hint="Check if a host is reachable and measure connect latency (TCP connect on 443/80 — works where ICMP is blocked)."
      fieldKey="host"
      fieldLabel="host or IP"
      placeholder="github.com"
      actionLabel="Ping"
    />
  );
}
