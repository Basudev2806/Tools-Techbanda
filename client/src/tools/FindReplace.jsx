import { useState } from "react";

export default function FindReplace() {
  const [text, setText] = useState("The Quick Brown Fox jumps over the lazy dog. The Fox runs fast.");
  const [find, setFind] = useState("Fox");
  const [replace, setReplace] = useState("Cat");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [global, setGlobal] = useState(true);

  let output = text;
  let matchCount = 0;
  let error = null;

  if (find) {
    try {
      const pattern = useRegex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const flags = (global ? "g" : "") + (caseSensitive ? "" : "i");
      const countFlags = "g" + (caseSensitive ? "" : "i");
      matchCount = (text.match(new RegExp(pattern, countFlags)) || []).length;
      output = text.replace(new RegExp(pattern, flags), replace);
    } catch (err) {
      error = "Invalid regex: " + err.message;
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Find and replace text, with optional regex and case sensitivity — updates live.</p>

      <label className="tool__label" htmlFor="fr-text">
        text
      </label>
      <textarea
        id="fr-text"
        className="tool__textarea mono"
        spellCheck={false}
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="fr-find">
            find
          </label>
          <input
            id="fr-find"
            className="tool__input mono"
            spellCheck={false}
            value={find}
            onChange={(e) => setFind(e.target.value)}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="fr-replace">
            replace with
          </label>
          <input
            id="fr-replace"
            className="tool__input mono"
            spellCheck={false}
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
          />
        </div>
      </div>

      <div className="tool__checks">
        <label className="tool__check">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} />
          regex
        </label>
        <label className="tool__check">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          case-sensitive
        </label>
        <label className="tool__check">
          <input type="checkbox" checked={global} onChange={(e) => setGlobal(e.target.checked)} />
          replace all
        </label>
      </div>

      {error && <p className="tool__error">{error}</p>}
      {!error && find && <p className="tool__hint">{matchCount} match{matchCount === 1 ? "" : "es"}</p>}

      <label className="tool__label" htmlFor="fr-out">
        result
      </label>
      <pre id="fr-out" className="tool__output mono">
        {output || " "}
      </pre>
    </div>
  );
}
