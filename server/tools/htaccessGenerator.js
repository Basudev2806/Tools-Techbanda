/**
 * body: {
 *   forceHttps?: bool, forceWww?: bool, removeWww?: bool,
 *   customErrorPage?: string, gzipCompression?: bool,
 *   browserCaching?: bool
 * }
 */
export default function htaccessGenerator(body = {}) {
  const {
    forceHttps = false,
    forceWww = false,
    removeWww = false,
    customErrorPage = "",
    gzipCompression = false,
    browserCaching = false,
  } = body;

  if (forceWww && removeWww) {
    return { ok: false, error: "Choose either force-www or remove-www, not both." };
  }

  const lines = ["RewriteEngine On"];

  if (forceHttps) {
    lines.push(
      "RewriteCond %{HTTPS} off",
      "RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]"
    );
  }

  if (forceWww) {
    lines.push(
      "RewriteCond %{HTTP_HOST} !^www\\. [NC]",
      "RewriteRule ^(.*)$ https://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]"
    );
  }

  if (removeWww) {
    lines.push(
      "RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]",
      "RewriteRule ^(.*)$ https://%1%{REQUEST_URI} [L,R=301]"
    );
  }

  if (customErrorPage.trim()) {
    lines.push("", `ErrorDocument 404 ${customErrorPage.trim()}`);
  }

  if (gzipCompression) {
    lines.push(
      "",
      "<IfModule mod_deflate.c>",
      "  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json",
      "</IfModule>"
    );
  }

  if (browserCaching) {
    lines.push(
      "",
      "<IfModule mod_expires.c>",
      "  ExpiresActive On",
      "  ExpiresByType image/jpg \"access plus 1 year\"",
      "  ExpiresByType image/png \"access plus 1 year\"",
      "  ExpiresByType text/css \"access plus 1 month\"",
      "  ExpiresByType application/javascript \"access plus 1 month\"",
      "</IfModule>"
    );
  }

  if (lines.length === 1) {
    return { ok: false, error: "Pick at least one option to generate rules." };
  }

  return { ok: true, output: lines.join("\n") };
}
