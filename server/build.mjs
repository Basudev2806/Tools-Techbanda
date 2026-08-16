import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");
const outfile = path.join(distDir, "index.js");

fs.mkdirSync(distDir, { recursive: true });

const fixRuntimeRelativeRequires = {
  name: "fix-runtime-relative-requires",

  setup(build) {
    build.onLoad(
      {
        filter: /node_modules[\\/](css-tree|csso)[\\/].*\.js$/,
      },
      async (args) => {
        const fsPromises = await import("node:fs/promises");
        let contents = await fsPromises.readFile(args.path, "utf8");

        if (!contents.includes("createRequire(import.meta.url)")) {
          return null;
        }

        const requirePaths = [
          ...contents.matchAll(
            /require\(\s*['"]([^'"]+)['"]\s*\)/g
          ),
        ].map((match) => match[1]);

        if (!requirePaths.length) {
          return null;
        }

        const uniquePaths = [...new Set(requirePaths)];

        const imports = uniquePaths
          .map(
            (p, i) =>
              `import __req_${i} from ${JSON.stringify(p)};`
          )
          .join("\n");

        let rewritten = contents;

        uniquePaths.forEach((p, i) => {
          const escaped = p.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );

          rewritten = rewritten.replace(
            new RegExp(
              `require\\(\\s*['"]${escaped}['"]\\s*\\)`,
              "g"
            ),
            `__req_${i}`
          );
        });

        return {
          contents: `${imports}\n${rewritten}`,
          loader: "js",
          resolveDir: path.dirname(args.path),
        };
      }
    );
  },
};

console.log("Building server...");
console.log(`Output: ${outfile}`);

await build({
  entryPoints: [path.join(__dirname, "index.js")],

  bundle: true,

  platform: "node",
  target: "node22",
  format: "esm",

  outfile,

  banner: {
    js: "import { createRequire as __createRequireShim } from 'module'; const require = __createRequireShim(import.meta.url);",
  },

  plugins: [fixRuntimeRelativeRequires],

  logLevel: "info",
});

console.log("Server build completed successfully.");