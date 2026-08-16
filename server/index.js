import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { listTools, getTool } from "./toolRegistry.js";
import { binExists, recordRequest } from "./requestBinStore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CLIENT_DIST_CANDIDATES = [
  path.join(__dirname, "..", "client", "dist"),
  path.join(__dirname, "..", "..", "client", "dist"),
];
const CLIENT_DIST = CLIENT_DIST_CANDIDATES.find((p) => fs.existsSync(p)) || CLIENT_DIST_CANDIDATES[0];

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json({ limit: "30mb" }));
app.use(express.text({ type: "*/*", limit: "30mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "tools-techbanda-api" });
});

app.get("/api/tools", (req, res) => {
  res.json(listTools());
});

app.all("/api/bin/:id", (req, res) => {
  if (!binExists(req.params.id)) {
    return res.status(404).json({ ok: false, error: "Unknown or expired bin." });
  }
  const entry = recordRequest(req.params.id, req);
  
  res.json({ ok: true, received: true, capturedAs: entry });
});

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

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));

  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, "index.html"));
  });
}

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`tools-techbanda API listening on http://0.0.0.0:${PORT}`);
});
