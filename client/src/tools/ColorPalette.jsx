import { useState } from "react";
import { runTool } from "../api";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ColorPalette() {
  const [mode, setMode] = useState("scheme");
  const [baseColor, setBaseColor] = useState("#3fb950");
  const [schemeType, setSchemeType] = useState("complementary");
  const [image, setImage] = useState("");
  const [count, setCount] = useState(6);
  const [colors, setColors] = useState([]);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(await fileToDataUrl(file));
  }

  async function run() {
    if (mode === "extract" && !image) {
      setError("Upload an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await runTool("color-palette", { mode, image, count, baseColor, schemeType });
    setBusy(false);
    if (result.ok) {
      setColors(result.colors);
    } else {
      setColors([]);
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Extract dominant colors from an image, or generate a scheme from one base color.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="cp-mode">
            source
          </label>
          <select id="cp-mode" className="tool__input mono" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="scheme">Generate from a color</option>
            <option value="extract">Extract from an image</option>
          </select>
        </div>
      </div>

      {mode === "scheme" ? (
        <div className="tool__row">
          <div className="tool__field">
            <label className="tool__label" htmlFor="cp-base">
              base color
            </label>
            <input id="cp-base" type="color" className="tool__color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
          </div>
          <div className="tool__field tool__field--grow">
            <label className="tool__label" htmlFor="cp-scheme">
              scheme
            </label>
            <select id="cp-scheme" className="tool__input mono" value={schemeType} onChange={(e) => setSchemeType(e.target.value)}>
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="monochromatic">Monochromatic</option>
            </select>
          </div>
        </div>
      ) : (
        <>
          <label className="tool__label" htmlFor="cp-file">
            source image
          </label>
          <input id="cp-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />
          <div className="tool__row" style={{ marginTop: 10 }}>
            <div className="tool__field">
              <label className="tool__label" htmlFor="cp-count">
                colors: {count}
              </label>
              <input
                id="cp-count"
                type="range"
                min={3}
                max={10}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="tool__range"
              />
            </div>
          </div>
        </>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {mode === "extract" ? "Extract palette" : "Generate palette"}
        </button>
      </div>

      {error && <p className="tool__error">{error}</p>}

      {colors.length > 0 && (
        <div className="tool__palette">
          {colors.map((c) => (
            <div key={c} className="tool__swatch-card">
              <div className="tool__swatch-block" style={{ background: c }} />
              <span className="mono">{c}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
