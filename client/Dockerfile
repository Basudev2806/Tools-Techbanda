# Stage 1 — build the static React bundle. Uses only client/ as context
# (see the GitHub Actions workflow, context: ./client), so this never sees
# server/ at all.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 — serve the built files with nginx, proxying /api/* to the API
# service at runtime (API_UPSTREAM, set via docker-compose or `docker run
# -e`). Runtime-configurable on purpose: the same image works in any
# environment without a rebuild, and the browser only ever talks to one
# origin (this container), so there's no CORS to configure — matches the
# app's own client/src/api.js, which already defaults to relative paths.
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV API_UPSTREAM=http://api:4000
EXPOSE 80
