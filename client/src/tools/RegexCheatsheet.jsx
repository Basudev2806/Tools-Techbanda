import { useState } from "react";

const PATTERNS = [
  ["Email", "[\\w.+-]+@[\\w-]+\\.[\\w.-]+"],
  ["URL", "https?:\\/\\/[\\w.-]+\\.[a-zA-Z]{2,}(\\/\\S*)?"],
  ["IPv4 address", "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b"],
  ["Phone (loose, intl)", "\\+?\\d[\\d\\s-]{7,}\\d"],
  ["Hex color", "#(?:[0-9a-fA-F]{3}){1,2}\\b"],
  ["Date (YYYY-MM-DD)", "\\d{4}-\\d{2}-\\d{2}"],
  ["Time (HH:MM)", "([01]\\d|2[0-3]):[0-5]\\d"],
  ["Whitespace (2+)", "\\s{2,}"],
  ["Word boundary", "\\bword\\b"],
  ["HTML tag", "<[^>]+>"],
  ["Slug (lowercase-hyphen)", "^[a-z0-9]+(?:-[a-z0-9]+)*$"],
  ["Integer", "^-?\\d+$"],
  ["Decimal number", "^-?\\d+(\\.\\d+)?$"],
  ["UUID v4", "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}"],
  ["US zip code", "^\\d{5}(-\\d{4})?$"],
];

export default function RegexCheatsheet() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(null);

  const filtered = PATTERNS.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase()));

  async function copy(pattern, name) {
    try {
      await navigator.clipboard.writeText(pattern);
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard permission denied — silently ignore
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Common regex patterns, ready to copy into the Regex Tester or your own code.</p>

      <input
        className="tool__input mono"
        placeholder="Filter…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="tool__cheatsheet">
        {filtered.map(([name, pattern]) => (
          <div key={name} className="tool__cheatsheet-row">
            <span className="tool__cheatsheet-name">{name}</span>
            <code className="tool__cheatsheet-pattern mono">{pattern}</code>
            <button className="btn" onClick={() => copy(pattern, name)}>
              {copied === name ? "Copied" : "Copy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
