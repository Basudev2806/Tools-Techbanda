# tools.techbanda.com

A console of developer and SEO utilities. React frontend, Node/Express backend.
Ported from the tool lineup at [techbanda.com/tools/](https://techbanda.com/tools/).

## Structure

```
tools-techbanda/
├── server/            Express API
│   ├── index.js        entry point — /api/health, /api/tools, /api/tools/:id/run
│   ├── toolRegistry.js  metadata + handler for every tool
│   └── tools/           one file per tool's server-side logic
└── client/            React (Vite) console
    ├── src/App.jsx       layout + tool routing
    ├── src/api.js        fetch wrapper for the backend
    ├── src/components/   Sidebar, TerminalWindow shell, GeneratorForm, LookupTool
    └── src/tools/        one component per tool's UI
```

The sidebar and the `/api/tools` route both read from the same registry, so
the tool list never drifts out of sync between frontend and backend.

Two shared client components keep the many similar tools from becoming
near-duplicate files:
- **`GeneratorForm`** — config-driven form for tools that take labeled fields
  and return one text block (meta tags, robots.txt, legal boilerplate, etc.)
- **`LookupTool`** — one text field + action + report, for the network/lookup
  tools (SSL checker, DNS lookup, ping, website status, meta description)

## Included tools (71 server-backed + 15 browser-only)

**Format / encode / text**
JSON Formatter · Base64 Encode/Decode · Regex Tester · Case Converter ·
URL Encode/Decode · RGB/Hex Converter · Binary/Text Converter

**Generate**
Password Generator · MD5 Generator · Lorem Ipsum Generator ·
QR Code Generator (dot styles, gradients, custom colors/size, quiet zone,
error correction, center logo, border, PNG/SVG export) · Barcode Generator ·
Text to Image Generator · Image to Favicon Generator

**SEO**
Meta Tag Generator · Canonical Link Generator · Open Graph Tag Generator ·
Twitter Card Generator · Robots.txt Generator · .htaccess Generator ·
Meta Description Checker

**Legal**
Privacy Policy, Terms & Conditions, and Disclaimer generators (boilerplate —
review with a professional before publishing)

**Network**
What's My IP · User Agent Finder · SSL Checker · Domain Nameserver Lookup ·
Ping IP · Website Status Check

**Developer**
Cron Expression Parser · UUID / ULID Generator · Diff Checker · Code Diff
(within-line token highlighting) · CSV ↔ JSON Converter · XML ↔ JSON
Converter · Color Palette Generator (extract from image or generate a
scheme) · HTML/CSS/JS Minifier · XML/HTML/CSS/GraphQL Formatters ·
JSON Validator · JSON Schema Validator · Slug Generator ·
Env File Generator · Base32/Hex Converter · Passphrase Generator ·
Random Data Generator · Image Resizer/Compressor · Image Format Converter
· Sitemap Generator · Broken Link Checker · Schema.org/JSON-LD Generator ·
Semver Comparator/Bumper · cURL ↔ Fetch/Axios Converter ·
Webhook/Request Bin (temporary URL, logs incoming requests, 30-min TTL)

**Security/crypto**
HMAC Generator · Password Hash Generator/Checker (bcrypt or argon2id, hash
or verify) · Certificate Decoder (parse a PEM cert's fields) · SVG Optimizer

**Design**
Color Blindness Simulator (protanopia/deuteranopia/tritanopia preview) ·
Android Icon Generator (legacy launcher, adaptive foreground/background,
notification, action-bar — every density bucket, res/ folder zip) ·
iOS App Icon Generator (AppIcon.appiconset + Contents.json, every required
size) · Web/PWA Icon Generator (favicon.ico, PNG set, apple-touch-icon,
site.webmanifest, ready-to-paste head snippet) · Color Contrast Checker
(WCAG AA/AAA, live)

**Repo bootstrapping**
.gitignore Generator (13 language/framework templates, combinable) ·
License Generator (MIT, Apache-2.0, BSD-3-Clause, ISC, GPL-3.0, Unlicense)
· README Badge Generator (shields.io-style, live)

**More network**
IP Geolocation Lookup (your own IP's location automatically, or look up
any IP/domain, via ipwho.is) · Nginx Config Generator (sibling to
.htaccess Generator — reverse proxy, HTTPS redirect, gzip, caching)

**Third-party APIs**
Domain Intelligence — DNS records, WHOIS, domain age, subdomain finder,
TLD availability, SPF/DMARC/DKIM checks, built entirely on free, keyless
infrastructure: Cloudflare DNS-over-HTTPS, RDAP (the WHOIS successor, via
the public rdap.org bootstrap), and certificate transparency logs (crt.sh)
· PageSpeed Insights Audit — performance/SEO/accessibility via Google's
public API (runs Lighthouse on Google's servers)

**Runs entirely in the browser**
Voice to Text (Web Speech API) · JWT Decoder and JWT Encoder (signing key
never leaves the browser) · Markdown Previewer (live) · Timestamp Converter
(Unix ↔ human-readable, timezone-aware) · HTTP Status Code Reference ·
Regex Cheatsheet · Text Statistics · Keyword Density Analyzer ·
Grammar/Readability Checker (Flesch-Kincaid, passive voice, long sentences)
· Find & Replace with Regex · Emoji/Unicode Picker · README Badge Generator
· Color Contrast Checker · Identifier Case Converter

**Not included:** Google Search Console API (requires per-user OAuth against
a verified property — not something a public anonymous tool can call) and a
headless-Chromium/Puppeteer crawler (heavy to bundle; the Broken Link Checker
covers the practical "check my page's links" need without it). PageSpeed
Insights covers the Lighthouse row since PSI runs Lighthouse under the hood.

**Not ported:** the Online Web Editor (a full HTML/CSS/JS/Markdown editor at
editor.techbanda.com) is a separate application in its own right, not a
single-purpose utility — a good candidate for its own project rather than an
entry in this registry.

## Implementation notes

- **Ping IP** measures TCP-connect latency on ports 443/80 rather than
  shelling out to a system `ping` binary — ICMP and arbitrary raw sockets are
  commonly blocked in hosting environments, so this works portably.
- **Image to Favicon** hand-packs a valid `.ico` from PNG buffers generated by
  `jimp` (pure JS, no native image library required).
- **Text to Image** renders SVG rather than using a canvas library, for the
  same no-native-deps reason.
- **QR Code Generator** renders the QR matrix itself (via `QRCode.create()`)
  rather than relying on a pre-rasterized image, so it can support per-module
  dot styles (square/rounded/dots), a diagonal gradient fill, and both
  PNG and SVG export from the same renderer. A center logo gets a solid
  backing plate for contrast; error correction is force-upgraded to `H`
  whenever a logo is present so the code stays scannable despite the
  occlusion (verified by decoding generated codes with `pyzbar`). The three
  finder-pattern "eyes" always render as plain squares regardless of dot
  style, since scanners rely on their exact shape to locate the code.
- **SSL Checker**, **Domain Nameserver Lookup**, and **Website Status Check**
  make real outbound connections (TLS/DNS/HTTP) to whatever domain the user
  enters — expect these to need outbound network access wherever you deploy.
- **JWT Decoder** and **Markdown Previewer** run entirely client-side by
  design — a JWT can carry sensitive claims, and a live preview needs no
  round trip. **Timestamp Converter** is client-only for the same
  no-round-trip reason.
- **UUID/ULID Generator** implements ULID (Crockford base32, timestamp +
  randomness) by hand rather than adding a dependency for it.
- **Color Palette Generator**'s image-extraction mode downsamples and
  quantizes pixels with `jimp`; its scheme mode does the HSL math itself
  (complementary/analogous/triadic/monochromatic) with no color library.
- **Domain Intelligence** deliberately avoids any paid or key-gated API —
  DNS/SPF/DMARC/DKIM are all plain DNS TXT lookups via Cloudflare's
  DNS-over-HTTPS (SPF/DMARC/DKIM are just conventionally-located TXT
  records, no special API needed); WHOIS/domain-age comes from RDAP (the
  IETF/ICANN-mandated WHOIS successor) via the public rdap.org bootstrap;
  subdomain discovery searches certificate transparency logs via crt.sh.
  Domain availability is inferred from whether RDAP finds a record — a
  fast, reasonable signal, not a formal registrar check. All three
  services are free and keyless, but still need outbound network access
  to those specific domains wherever this is deployed.
- **PageSpeed Insights** calls Google's public API and likewise needs
  outbound access to googleapis.com from wherever this is deployed.
- **Broken Link Checker** fetches the page HTML directly and checks each
  `<a href>` with bounded concurrency — no headless browser, so it won't
  catch JS-rendered links, but needs no Chromium binary either.
- **XML Formatter / XML↔JSON Converter** use `fast-xml-parser`. **HTML** and
  **CSS Formatters** are lightweight regex/tokenizer-based beautifiers, not
  full parsers — good for typical markup, not guaranteed on edge cases.
- **JSON Schema Validator** uses `ajv`.
- **Webhook/Request Bin** keeps bins in an in-memory `Map` with a 30-minute
  TTL — fine for a personal tools console, but state is lost on server
  restart and won't scale across multiple server instances. A production
  version would want Redis or similar for shared, persistent storage.
- **Password Hash Generator/Checker** uses `bcryptjs` (pure JS) and
  `hash-wasm`'s argon2id (WebAssembly, so no native compilation needed at
  install time — unlike the `argon2` npm package, which requires a native
  build toolchain).
- **Certificate Decoder** uses Node's built-in `X509Certificate` — no
  dependency needed. Tested against a real self-signed cert.
- **Color Blindness Simulator** uses simplified linear RGB matrices (a
  commonly-circulated approximation), not a perceptually-calibrated model —
  expect more saturated/exaggerated shifts than tools like Coblis, though
  the direction of the color confusion is right.
- **cURL ↔ Fetch/Axios Converter** parses a pragmatic subset of curl flags
  (-X, -H, -d/--data, -u, -A) — enough for typical API-testing commands, not
  a full shell-argument parser.
- **Android Icon Generator** replicates the core of the (now-unmaintained)
  Android Asset Studio: resizes source art across the five standard density
  buckets (mdpi 1x → xxxhdpi 4x) and zips it into a real `res/mipmap-*` or
  `res/drawable-*` structure via `jszip`. Notification icons are converted
  to a white silhouette from the alpha channel (the Android status-bar
  requirement); launcher icons support an optional background fill and a
  circular-masked round variant. The adaptive icon mode builds a real
  `<adaptive-icon>` XML definition in `mipmap-anydpi-v26`, pads the
  foreground artwork to Google's 66dp safe zone within the 108dp canvas,
  and includes a flattened legacy fallback for pre-API-26 devices. Verified
  end-to-end — generated a zip via a live HTTP call, unzipped it, and
  confirmed exact pixel dimensions and real alpha transparency on the round
  mask.
- **iOS App Icon Generator** and **Web/PWA Icon Generator** round out an
  icon.kitchen-style workflow — AppIcon.appiconset with a correct
  Contents.json (verified against Apple's actual pt→px scale table), and a
  full web icon set (favicon.ico via the same ICO packer as the standalone
  favicon tool, PNG sizes, apple-touch-icon, site.webmanifest).
- **IP Geolocation Lookup** calls `ipwho.is` (free, no key) and defaults to
  looking up the caller's own address (the same source "What's My IP"
  reads) so it doubles as both "what's my IP" and "IP to location" in one
  tool.
- **Nginx Config Generator** is the nginx-flavored sibling to the existing
  .htaccess Generator.
- **.gitignore Generator** and **License Generator** are template
  libraries (13 stacks; MIT/Apache-2.0/BSD-3-Clause/ISC/GPL-3.0/Unlicense)
  with no external dependency.

## Running locally

```bash
npm install          # installs both workspaces
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev           # runs server (:4000) and client (:5173) together
```

Or run them separately: `npm run dev:server` / `npm run dev:client`.

Using pnpm instead of npm? `pnpm install` / `pnpm dev` work too —
`pnpm-workspace.yaml` at the root declares the workspace for pnpm (it
doesn't read the `workspaces` field in `package.json`; that field is there
for npm/yarn and both coexist fine). Copying the `.env.example` files is
optional either way — the client's Vite dev server proxies `/api/*` to
`localhost:4000` automatically (`client/vite.config.js`), so `client/.env`
is only needed if you're running the client dev server against an API on a
different host/port.

## Adding a new tool

1. Add a handler in `server/tools/<id>.js` — a function that takes the
   request body (and optional `{ ip, headers }` request metadata) and returns
   `{ ok, output }` or `{ ok, image }` or `{ ok: false, error }`.
2. Register it in `server/toolRegistry.js` (id, name, description, category,
   handler).
3. Add a matching UI component in `client/src/tools/<Name>.jsx` — reuse
   `GeneratorForm` or `LookupTool` if it fits that shape, otherwise write a
   small bespoke component.
4. Wire the id → component mapping in `client/src/App.jsx`'s
   `TOOL_COMPONENTS`.

No routing table to touch — the sidebar and API tool list are both
generated from the registry.

## Deploying

Two different deploy shapes live in this repo, for two different kinds of
host. Pick the one that matches what you have.

### Option A — Hostinger Business hosting (no Docker, single process)

Business hosting's Node.js Web App feature runs plain Node processes, not
containers — no Docker daemon available. For that host, `server/index.js`
serves the built client itself (`client/dist`) with an SPA fallback, so the
whole site — API and frontend — runs as **one Node process**, using **one**
of your Node.js app slots.

1. Push this repo to GitHub (see below if you haven't yet).
2. In hPanel: **Websites → Add Website → Node.js Web App → Import Git
   repository**, authorize GitHub, pick this repo.
3. Settings Hostinger should auto-detect from the root `package.json`
   (verify them):
   - **Build command:** `npm run build` (installs both workspaces, builds
     the client into `client/dist`)
   - **Start command / entry:** `npm run start` (runs `server/index.js`)
   - **Node version:** 20 LTS or newer
4. Add the domain/subdomain (e.g. `tools.techbanda.com`) to this Node app in
   hPanel — if `techbanda.com`'s DNS is already on Hostinger this is just a
   dropdown; if it's registered elsewhere, point an A/CNAME record at
   Hostinger first.
5. No environment variables are required for a same-origin deploy — leave
   `VITE_API_URL` unset.
6. Click **Deploy**. Future `git push`es to the connected branch trigger an
   automatic rebuild + redeploy (both services together — Hostinger doesn't
   do path-based partial deploys).

### Option B — Docker + registry + path-based CI/CD (needs a Docker-capable host)

This shape splits the app into **two independently-deployable images** — a
commit touching only `server/` rebuilds and pushes just the API image; a
commit touching only `client/` rebuilds and pushes just the client image.
Requires somewhere that can actually run containers (a VPS — Hostinger's own
VPS plans, DigitalOcean, etc. — Business hosting can't run Docker).

**Pieces:**
- `server/Dockerfile` — standalone API image, context is `./server` only
  (verified it installs and runs cleanly isolated from the workspace root —
  no phantom dependencies leaking in from hoisted `node_modules`)
- `client/Dockerfile` — multi-stage: Vite build, then served by nginx.
  nginx proxies `/api/*` to the API service at runtime via the
  `API_UPSTREAM` env var (`client/nginx.conf.template`) — same-origin from
  the browser's perspective, so there's no CORS to configure, and the image
  never needs rebuilding just because the API's location changed
- `docker-compose.yml` — runs both together, for local testing
  (`docker compose up --build`) and as the reference shape on a VPS
- `.github/workflows/api.yml` / `.github/workflows/client.yml` — GitHub
  Actions, each gated on `paths:` for its own folder, build and push to
  **GitHub Container Registry** (`ghcr.io`) using the built-in
  `GITHUB_TOKEN` — no extra registry account or secret needed for that part
- `Jenkinsfile` — an equivalent pipeline for self-hosted Jenkins, only
  needed if you end up running Jenkins yourself (e.g. on that same VPS)
  rather than using GitHub Actions; the two aren't meant to run together

**To actually deploy** (not just build+push), each workflow has a disabled
`Deploy to host` step at the bottom — SSHes into a host and runs
`docker pull` + `docker compose up -d` for just that one service. Once you
have a VPS: add `DEPLOY_HOST` / `DEPLOY_USER` / `DEPLOY_SSH_KEY` as GitHub
repo secrets (Settings → Secrets and variables → Actions), point the compose
path at wherever `docker-compose.yml` lives on that host, and flip
`if: false` to `if: true` in both workflow files.

**Local test run:**
```bash
docker compose up --build
# API:    http://localhost:4000
# Client: http://localhost:8080  (proxies /api to the api service)
```

### Pushing to GitHub for the first time

```bash
cd tools-techbanda
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/tools-techbanda.git
git push -u origin main
```

Create the empty repo on GitHub first (github.com/new) if it doesn't exist
yet, then run the commands above from inside the unzipped project folder.

### Other hosts

- `server/` — any Node host with outbound network access (set `PORT`, run
  `npm start`). The QR/barcode/favicon/icon tools need no special runtime
  deps beyond `npm install`.
- To split frontend/backend across hosts instead: `npm run build` in
  `client/` with `VITE_API_URL` set to the deployed API's URL, then deploy
  `client/dist` as a static site.
