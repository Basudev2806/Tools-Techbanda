import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundlePath = path.join(__dirname, "dist", "index.js");

// Prefer the bundled build (self-contained, no node_modules needed at
// runtime) when it exists — that's the production/deploy path, produced by
// `npm run build`. Falls back to running the source directly against real
// node_modules for local dev, where nobody wants to rebuild on every change.
await import(fs.existsSync(bundlePath) ? "./dist/index.js" : "./index.js");
