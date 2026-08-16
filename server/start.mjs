import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundlePath = path.join(__dirname, "dist", "index.js");

await import(
  fs.existsSync(bundlePath)
    ? "./dist/index.js"
    : "./index.js"
);