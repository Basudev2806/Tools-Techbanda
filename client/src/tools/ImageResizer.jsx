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

export default function ImageResizer() {
  const [image, setImage] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(await fileToDataUrl(file));
    setResult("");
    setInfo("");
  }

  async function run() {
    if (!image) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await runTool("image-resizer", {
      image,
      width: width || undefined,
      height: height || undefined,
      quality,
    });
    setBusy(false);
    if (result.ok) {
      setResult(result.image);
      setInfo(result.output);
    } else {
      setResult("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Resize and compress an image. Leave width or height blank to preserve aspect ratio.</p>

      <label className="tool__label" htmlFor="ir-file">
        source image
      </label>
      <input id="ir-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="ir-width">
            width (px)
          </label>
          <input
            id="ir-width"
            type="number"
            className="tool__input mono"
            placeholder="auto"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="ir-height">
            height (px)
          </label>
          <input
            id="ir-height"
            type="number"
            className="tool__input mono"
            placeholder="auto"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ir-quality">
            quality: {quality}
          </label>
          <input
            id="ir-quality"
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="tool__range"
          />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !image} onClick={run}>
          {busy ? "Processing…" : "Resize / compress"}
        </button>
        {result && (
          <a className="btn" href={result} download="resized.jpg">
            Download
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}
      {info && <pre className="tool__output mono">{info}</pre>}

      {(image || result) && (
        <div className="tool__row" style={{ marginTop: 10 }}>
          {image && (
            <div>
              <label className="tool__label">source</label>
              <img src={image} alt="Source" className="tool__thumb" />
            </div>
          )}
          {result && (
            <div>
              <label className="tool__label">result</label>
              <img src={result} alt="Resized" className="tool__thumb" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
