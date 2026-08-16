import { useState } from "react";

function splitWords(input) {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[\s_\-.]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

function toCamel(words) {
  return words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join("");
}
function toPascal(words) {
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
}
function toSnake(words) {
  return words.join("_");
}
function toKebab(words) {
  return words.join("-");
}
function toConstant(words) {
  return words.join("_").toUpperCase();
}
function toDot(words) {
  return words.join(".");
}

const FORMATS = [
  ["camelCase", toCamel],
  ["PascalCase", toPascal],
  ["snake_case", toSnake],
  ["kebab-case", toKebab],
  ["CONSTANT_CASE", toConstant],
  ["dot.case", toDot],
];

export default function IdentifierCaseConverter() {
  const [input, setInput] = useState("user_profile_settings");

  const words = splitWords(input);

  return (
    <div className="tool">
      <p className="tool__hint">Convert an identifier between camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE \u2014 live.</p>

      <label className="tool__label" htmlFor="icc-in">
        identifier
      </label>
      <input
        id="icc-in"
        className="tool__input mono"
        spellCheck={false}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="tool__id-list">
        {FORMATS.map(([label, fn]) => (
          <div key={label} className="tool__id-row">
            <span className="tool__id-label">{label}</span>
            <code className="tool__id-value mono">{words.length ? fn(words) : ""}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
