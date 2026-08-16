/**
 * body: {
 *   serverName?: string,
 *   reverseProxy?: bool, proxyTarget?: string,
 *   forceHttps?: bool,
 *   gzipCompression?: bool,
 *   browserCaching?: bool,
 *   customErrorPage?: string,
 *   staticRoot?: string,
 * }
 */
export default function nginxGenerator(body = {}) {
  const {
    serverName = "example.com",
    reverseProxy = false,
    proxyTarget = "http://localhost:3000",
    forceHttps = false,
    gzipCompression = false,
    browserCaching = false,
    customErrorPage = "",
    staticRoot = "",
  } = body;

  if (!reverseProxy && !staticRoot.trim()) {
    return { ok: false, error: "Enable reverse proxy or provide a static root path." };
  }

  const blocks = [];

  if (forceHttps) {
    blocks.push(`server {
    listen 80;
    server_name ${serverName};
    return 301 https://$host$request_uri;
}
`);
  }

  const lines = [`server {`, `    listen ${forceHttps ? "443 ssl" : "80"};`, `    server_name ${serverName};`, ""];

  if (staticRoot.trim()) {
    lines.push(`    root ${staticRoot.trim()};`, `    index index.html;`, "");
  }

  if (reverseProxy) {
    lines.push(
      `    location / {`,
      `        proxy_pass ${proxyTarget};`,
      `        proxy_http_version 1.1;`,
      `        proxy_set_header Upgrade $http_upgrade;`,
      `        proxy_set_header Connection 'upgrade';`,
      `        proxy_set_header Host $host;`,
      `        proxy_set_header X-Real-IP $remote_addr;`,
      `        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`,
      `        proxy_cache_bypass $http_upgrade;`,
      `    }`,
      ""
    );
  } else {
    lines.push(`    location / {`, `        try_files $uri $uri/ =404;`, `    }`, "");
  }

  if (gzipCompression) {
    lines.push(
      `    gzip on;`,
      `    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;`,
      `    gzip_min_length 1000;`,
      ""
    );
  }

  if (browserCaching) {
    lines.push(
      `    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff2?)$ {`,
      `        expires 30d;`,
      `        add_header Cache-Control "public, immutable";`,
      `    }`,
      ""
    );
  }

  if (customErrorPage.trim()) {
    lines.push(`    error_page 404 ${customErrorPage.trim()};`, "");
  }

  lines.push(`}`);
  blocks.push(lines.join("\n"));

  return { ok: true, output: blocks.join("\n") };
}
