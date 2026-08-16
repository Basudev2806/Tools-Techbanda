import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { listTools, getTool } from "./toolRegistry.js";
import { binExists, recordRequest } from "./requestBinStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// Generous limit: several tools accept images as base64 data URLs (which
// run ~33% larger than the original file), and some — the Android adaptive
// icon generator, for one — accept two images in a single request.
app.use(express.json({ limit: "30mb" }));
app.use(express.text({ type: "*/*", limit: "30mb" })); // fallback for non-JSON bodies on the bin route

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "tools-techbanda-api" });
});

// Metadata for every registered tool — the client renders its sidebar from this.
app.get("/api/tools", (req, res) => {
  res.json(listTools());
});

// Request Bin capture endpoint — accepts any method/body so people can point
// a webhook at it and see what arrives. Not part of the generic tool
// dispatch since it needs to accept arbitrary requests, not a fixed contract.
app.all("/api/bin/:id", (req, res) => {
  if (!binExists(req.params.id)) {
    return res.status(404).json({ ok: false, error: "Unknown or expired bin." });
  }
  const entry = recordRequest(req.params.id, req);
  // Echo the captured request straight back — useful when testing with curl
  // or a webhook sender directly, without needing the UI open to see it.
  res.json({ ok: true, received: true, capturedAs: entry });
});

// Generic execution route: POST /api/tools/:id/run
// Each tool owns its own input contract; this route just dispatches to it.
app.post("/api/tools/:id/run", async (req, res) => {
  const tool = getTool(req.params.id);

  if (!tool) {
    return res.status(404).json({ ok: false, error: "Unknown tool." });
  }

  try {
    const meta = { ip: req.ip, headers: req.headers };
    const result = await tool.handler(req.body, meta);
    res.json(result);
  } catch (err) {
    res.status(500).json({ ok: false, error: "Tool execution failed." });
  }
});

// Serve the built React app (client/dist) from the same process, so the
// whole site — API + frontend — runs as a single deployable Node app.
// Only kicks in once `npm run build` has produced client/dist; local API
// development without a build is unaffected.
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));

  // SPA fallback: any non-API, non-file GET falls through to index.html so
  // client-side routing (if added later) and direct URL loads both work.
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

// Every response from this API is expected to be JSON — including errors.
// Without this, body-parser failures (oversized upload, malformed JSON)
// fall through to Express's default HTML error page, which breaks any
// client that calls res.json() on the response. Must be registered last,
// after every route and the static/SPA middleware above.
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large" || err.status === 413) {
    return res.status(413).json({ ok: false, error: "That file is too large (limit: 30MB per request)." });
  }
  if (err.type === "entity.parse.failed" || err.status === 400) {
    return res.status(400).json({ ok: false, error: "Malformed request body." });
  }
  console.error(err);
  res.status(err.status || 500).json({ ok: false, error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`tools-techbanda API listening on http://localhost:${PORT}`);
});
