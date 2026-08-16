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

export default function ColorBlindnessSimulator() {
  const [image, setImage] = useState("");
  const [type, setType] = useState("deuteranopia");
  const [result, setResult] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(await fileToDataUrl(file));
    setResult("");
  }

  async function run() {
    if (!image) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await runTool("color-blindness-simulator", { image, type });
    setBusy(false);
    if (res.ok) {
      setResult(res.image);
    } else {
      setResult("");
      setError(res.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">
        Preview an image under a simplified linear simulation of protanopia, deuteranopia, or tritanopia. This
        approximation tends to look more saturated than perceptually-calibrated simulators — useful for spotting
        confusable colors, not a precise clinical rendering.
      </p>

      <label className="tool__label" htmlFor="cbs-file">
        source image
      </label>
      <input id="cbs-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <label className="tool__label" htmlFor="cbs-type">
        deficiency type
      </label>
      <select id="cbs-type" className="tool__input mono" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="protanopia">Protanopia (red-weak)</option>
        <option value="deuteranopia">Deuteranopia (green-weak)</option>
        <option value="tritanopia">Tritanopia (blue-weak)</option>
      </select>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !image} onClick={run}>
          {busy ? "Processing…" : "Simulate"}
        </button>
        {result && (
          <a className="btn" href={result} download="simulated.png">
            Download
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      <div className="tool__row" style={{ marginTop: 10 }}>
        {image && (
          <div>
            <label className="tool__label">original</label>
            <img src={image} alt="Original" className="tool__thumb" />
          </div>
        )}
        {result && (
          <div>
            <label className="tool__label">simulated</label>
            <img src={result} alt="Simulated" className="tool__thumb" />
          </div>
        )}
      </div>
    </div>
  );
}
