// Bundles server/index.js + all its dependencies into one self-contained
// file (server/dist/index.js) with no node_modules needed at runtime.
//
// Why: some hosting platforms' deploy pipelines don't reliably carry
// node_modules into the actual runtime execution folder for every
// configuration (seen in practice on Hostinger with an npm-workspaces
// monorepo) — bundling sidesteps that entirely, since there's nothing to
// carry except one file.
import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Several packages in the dependency tree (css-tree and csso, both pulled
// in transitively via svgo) load JSON/package.json data at runtime via
// `const require = createRequire(import.meta.url); require('<relative
// path>')` — a pattern that breaks once bundled into one file, since
// import.meta.url then points at the bundle itself, not the original
// package's location. Fix: for any file using this pattern, rewrite each
// require(...) call into a proper static import (computed here, at build
// time, from the file's real on-disk location) that esbuild can bundle
// like any other import.
const fixRuntimeRelativeRequires = {
  name: "fix-runtime-relative-requires",
  setup(build) {
    build.onLoad({ filter: /node_modules[\\/](css-tree|csso)[\\/].*\.js$/ }, async (args) => {
      const fs = await import("node:fs/promises");
      let contents = await fs.readFile(args.path, "utf-8");

      if (!contents.includes("createRequire(import.meta.url)")) return null;

      const requirePaths = [...contents.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)].map((m) => m[1]);
      if (!requirePaths.length) return null;

      const uniquePaths = [...new Set(requirePaths)];
      const imports = uniquePaths
        .map((p, i) => `import __req_${i} from ${JSON.stringify(p)};`)
        .join("\n");

      let rewritten = contents;
      uniquePaths.forEach((p, i) => {
        const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        rewritten = rewritten.replace(
          new RegExp(`require\\(\\s*['"]${escaped}['"]\\s*\\)`, "g"),
          `__req_${i}`
        );
      });

      return {
        contents: `${imports}\n${rewritten}`,
        loader: "js",
        resolveDir: path.dirname(args.path),
      };
    });
  },
};

await build({
  entryPoints: [path.join(__dirname, "index.js")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.join(__dirname, "dist", "index.js"),
  banner: {
    js: "import { createRequire as __createRequireShim } from 'module'; const require = __createRequireShim(import.meta.url);",
  },
  plugins: [fixRuntimeRelativeRequires],
  logLevel: "info",
});
