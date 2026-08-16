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

export default function FaviconGenerator() {
  const [sourceImage, setSourceImage] = useState("");
  const [favicon, setFavicon] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setSourceImage(dataUrl);
    setFavicon("");
    setError(null);
  }

  async function run() {
    if (!sourceImage) {
      setError("Choose an image first.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await runTool("favicon-generator", { image: sourceImage });
    setBusy(false);
    if (result.ok) {
      setFavicon(result.image);
    } else {
      setFavicon("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Upload an image and convert it into a 16/32/48px .ico favicon.</p>

      <label className="tool__label" htmlFor="fav-file">
        source image
      </label>
      <input id="fav-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !sourceImage} onClick={run}>
          Generate favicon
        </button>
        {favicon && (
          <a className="btn" href={favicon} download="favicon.ico">
            Download .ico
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      <div className="tool__row" style={{ marginTop: 14 }}>
        {sourceImage && (
          <div>
            <label className="tool__label">source</label>
            <img src={sourceImage} alt="Source" className="tool__thumb" />
          </div>
        )}
        {favicon && (
          <div>
            <label className="tool__label">favicon preview</label>
            <img src={favicon} alt="Favicon" className="tool__thumb tool__thumb--small" />
          </div>
        )}
      </div>
    </div>
  );
}
