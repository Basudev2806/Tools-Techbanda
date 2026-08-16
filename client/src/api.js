// In production (this repo's default deploy shape), the client is served
// by the same Express process as the API, so relative paths just work.
// Local dev with the client and server as separate processes (npm run dev)
// sets VITE_API_URL in client/.env to point at the standalone API port.
const API_URL = import.meta.env.VITE_API_URL || "";

export async function fetchTools() {
  const res = await fetch(`${API_URL}/api/tools`);
  if (!res.ok) throw new Error("Could not load the tool list.");
  return res.json();
}

export async function runTool(id, payload) {
  const res = await fetch(`${API_URL}/api/tools/${id}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
