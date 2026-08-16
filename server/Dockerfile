# Builds the API image using only server/ as context (see the GitHub Actions
# workflow, which points the build context at ./server so this Dockerfile
# never sees client/ at all). No lockfile lives in this subfolder — the
# workspace root's lockfile pins the same versions when you run `npm install`
# at the repo root; this standalone `npm install` resolves the same
# dependency graph from server/package.json.
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=4000
EXPOSE 4000

CMD ["node", "index.js"]
