import { useState } from "react";

const COLORS = ["brightgreen", "green", "yellowgreen", "yellow", "orange", "red", "blue", "lightgrey", "blueviolet"];

const PRESETS = [
  { label: "License", left: "license", right: "MIT" },
  { label: "npm version", left: "npm", right: "v1.0.0" },
  { label: "Build", left: "build", right: "passing" },
  { label: "Tests", left: "tests", right: "passing" },
  { label: "Coverage", left: "coverage", right: "92%" },
  { label: "Version", left: "version", right: "1.0.0" },
  { label: "PRs Welcome", left: "PRs", right: "welcome" },
  { label: "Maintained", left: "maintained", right: "yes" },
];

function buildUrl(left, right, color) {
  const enc = (s) => encodeURIComponent(s).replace(/-/g, "--").replace(/_/g, "__");
  return `https://img.shields.io/badge/${enc(left)}-${enc(right)}-${color}`;
}

export default function BadgeGenerator() {
  const [left, setLeft] = useState("license");
  const [right, setRight] = useState("MIT");
  const [color, setColor] = useState("brightgreen");
  const [link, setLink] = useState("");

  const url = buildUrl(left, right, color);
  const markdown = link ? `[![${left}](${url})](${link})` : `![${left}](${url})`;
  const html = link
    ? `<a href="${link}"><img src="${url}" alt="${left}"></a>`
    : `<img src="${url}" alt="${left}">`;

  return (
    <div className="tool">
      <p className="tool__hint">Build a shields.io-style badge for your README \u2014 updates live as you type.</p>

      <div className="tool__checks">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className="btn"
            onClick={() => {
              setLeft(p.left);
              setRight(p.right);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="bg-left">
            label
          </label>
          <input id="bg-left" className="tool__input mono" value={left} onChange={(e) => setLeft(e.target.value)} />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="bg-right">
            message
          </label>
          <input id="bg-right" className="tool__input mono" value={right} onChange={(e) => setRight(e.target.value)} />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="bg-color">
            color
          </label>
          <select id="bg-color" className="tool__input mono" value={color} onChange={(e) => setColor(e.target.value)}>
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="bg-link">
        link url (optional \u2014 wraps the badge in a link)
      </label>
      <input id="bg-link" className="tool__input mono" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />

      <div className="tool__image-frame">
        <img src={url} alt={left} />
      </div>

      <label className="tool__label">markdown</label>
      <pre className="tool__output mono">{markdown}</pre>

      <label className="tool__label">html</label>
      <pre className="tool__output mono">{html}</pre>
    </div>
  );
}
