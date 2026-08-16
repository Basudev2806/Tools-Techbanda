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

export default function IosIconGenerator() {
  const [image, setImage] = useState("");
  const [zipFile, setZipFile] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(await fileToDataUrl(file));
    setZipFile("");
  }

  async function run() {
    if (!image) {
      setError("Upload a 1024\u00d71024 (or larger) square source image first.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await runTool("ios-icon-generator", { image });
    setBusy(false);
    if (result.ok) {
      setZipFile(result.file);
    } else {
      setZipFile("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">
        Generate a complete AppIcon.appiconset for Xcode \u2014 every required size (20pt \u2192 1024pt marketing icon)
        plus a matching Contents.json. Drop the folder straight into your asset catalog.
      </p>

      <label className="tool__label" htmlFor="ios-file">
        source image (square, 1024\u00d71024 recommended, no transparency for the App Store icon)
      </label>
      <input id="ios-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !image} onClick={run}>
          {busy ? "Generating\u2026" : "Generate icon set"}
        </button>
        {zipFile && (
          <a className="btn" href={zipFile} download="AppIcon.appiconset.zip">
            Download zip
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {image && (
        <div className="tool__row" style={{ marginTop: 10 }}>
          <div>
            <label className="tool__label">source</label>
            <img src={image} alt="Source" className="tool__thumb" />
          </div>
        </div>
      )}
    </div>
  );
}
