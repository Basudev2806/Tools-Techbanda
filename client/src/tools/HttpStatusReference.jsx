import { useState } from "react";

const CODES = [
  [100, "Continue", "The server has received the request headers and the client should proceed to send the body."],
  [101, "Switching Protocols", "The server is switching protocols as requested by the client."],
  [200, "OK", "The request succeeded."],
  [201, "Created", "The request succeeded and a new resource was created."],
  [202, "Accepted", "The request has been accepted for processing, but processing isn't complete."],
  [204, "No Content", "The request succeeded but there's no content to return."],
  [206, "Partial Content", "Delivering only part of the resource, per a Range header."],
  [301, "Moved Permanently", "The resource has moved to a new URL permanently."],
  [302, "Found", "The resource temporarily resides at a different URL."],
  [304, "Not Modified", "The cached version is still valid; no need to resend."],
  [307, "Temporary Redirect", "Like 302, but the method and body must not change."],
  [308, "Permanent Redirect", "Like 301, but the method and body must not change."],
  [400, "Bad Request", "The server couldn't understand the request due to invalid syntax."],
  [401, "Unauthorized", "Authentication is required and has failed or not been provided."],
  [402, "Payment Required", "Reserved for future use."],
  [403, "Forbidden", "The client doesn't have access rights to the content."],
  [404, "Not Found", "The server can't find the requested resource."],
  [405, "Method Not Allowed", "The request method isn't supported for this resource."],
  [408, "Request Timeout", "The server timed out waiting for the request."],
  [409, "Conflict", "The request conflicts with the current state of the resource."],
  [410, "Gone", "The resource is permanently gone and won't come back."],
  [413, "Payload Too Large", "The request body is larger than the server can handle."],
  [415, "Unsupported Media Type", "The media format isn't supported."],
  [418, "I'm a Teapot", "An April Fools' RFC joke — the server refuses to brew coffee in a teapot."],
  [422, "Unprocessable Entity", "The request is well-formed but semantically invalid."],
  [429, "Too Many Requests", "The client has sent too many requests in a given time."],
  [500, "Internal Server Error", "The server encountered an unexpected condition."],
  [501, "Not Implemented", "The server doesn't support the functionality required."],
  [502, "Bad Gateway", "The server, acting as a gateway, got an invalid response."],
  [503, "Service Unavailable", "The server isn't ready to handle the request (overload/maintenance)."],
  [504, "Gateway Timeout", "The gateway didn't get a response in time."],
];

function groupColor(code) {
  if (code < 200) return "var(--text-dim)";
  if (code < 300) return "var(--accent)";
  if (code < 400) return "var(--warn)";
  return "var(--error)";
}

export default function HttpStatusReference() {
  const [query, setQuery] = useState("");

  const filtered = CODES.filter(([code, title, desc]) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return String(code).includes(q) || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div className="tool">
      <p className="tool__hint">Searchable reference for common HTTP status codes.</p>

      <input
        className="tool__input mono"
        placeholder="Search by code or keyword…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="tool__status-list">
        {filtered.map(([code, title, desc]) => (
          <div key={code} className="tool__status-row">
            <span className="tool__status-code mono" style={{ color: groupColor(code) }}>
              {code}
            </span>
            <div>
              <div className="tool__status-title">{title}</div>
              <div className="tool__status-desc">{desc}</div>
            </div>
          </div>
        ))}
        {!filtered.length && <p className="tool__hint">No matches.</p>}
      </div>
    </div>
  );
}
