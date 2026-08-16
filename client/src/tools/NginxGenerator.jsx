import GeneratorForm from "../components/GeneratorForm";

export default function NginxGenerator() {
  return (
    <GeneratorForm
      toolId="nginx-generator"
      hint="Generate an nginx server block. Enable reverse proxy for an app server, or set a static root for a plain site."
      initial={{ serverName: "example.com", reverseProxy: true, proxyTarget: "http://localhost:3000", forceHttps: true, gzipCompression: true, browserCaching: true }}
      actionLabel="Generate config"
      fields={[
        { key: "serverName", label: "server_name" },
        { key: "reverseProxy", label: "Reverse proxy to an app server", type: "checkbox" },
        { key: "proxyTarget", label: "proxy target (used when reverse proxy is on)", placeholder: "http://localhost:3000" },
        { key: "staticRoot", label: "static root path (used when reverse proxy is off)", placeholder: "/var/www/mysite" },
        { key: "forceHttps", label: "Redirect HTTP to HTTPS", type: "checkbox" },
        { key: "gzipCompression", label: "Enable gzip compression", type: "checkbox" },
        { key: "browserCaching", label: "Cache static assets (30 days)", type: "checkbox" },
        { key: "customErrorPage", label: "custom 404 page (optional)", placeholder: "/404.html" },
      ]}
    />
  );
}
