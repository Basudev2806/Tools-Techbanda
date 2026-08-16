const TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_REQUESTS_PER_BIN = 50;

const bins = new Map(); // id -> { createdAt, requests: [] }

function prune() {
  const now = Date.now();
  for (const [id, bin] of bins) {
    if (now - bin.createdAt > TTL_MS) bins.delete(id);
  }
}

export function createBin(id) {
  prune();
  bins.set(id, { createdAt: Date.now(), requests: [] });
}

export function binExists(id) {
  prune();
  return bins.has(id);
}

export function recordRequest(id, req) {
  prune();
  const bin = bins.get(id);
  if (!bin) return null;
  const entry = {
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    receivedAt: new Date().toISOString(),
  };
  bin.requests.unshift(entry);
  if (bin.requests.length > MAX_REQUESTS_PER_BIN) bin.requests.length = MAX_REQUESTS_PER_BIN;
  return entry;
}

export function listRequests(id) {
  prune();
  return bins.get(id)?.requests || null;
}

export function clearBin(id) {
  prune();
  const bin = bins.get(id);
  if (!bin) return false;
  bin.requests = [];
  return true;
}
