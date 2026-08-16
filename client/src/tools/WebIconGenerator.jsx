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

export default function WebIconGenerator() {
  const [image, setImage] = useState("");
  const [appName, setAppName] = useState("My App");
  const [themeColor, setThemeColor] = useState("#3fb950");
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
      setError("Upload a square source image first.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await runTool("web-icon-generator", { image, appName, themeColor });
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
        Generate a full web/PWA icon set: favicon.ico, PNG sizes, apple-touch-icon, site.webmanifest, and a
        ready-to-paste &lt;head&gt; snippet.
      </p>

      <label className="tool__label" htmlFor="wi-file">
        source image
      </label>
      <input id="wi-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="wi-name">
            app name
          </label>
          <input id="wi-name" className="tool__input mono" value={appName} onChange={(e) => setAppName(e.target.value)} />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="wi-color">
            theme color
          </label>
          <input id="wi-color" type="color" className="tool__color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !image} onClick={run}>
          {busy ? "Generating\u2026" : "Generate icon set"}
        </button>
        {zipFile && (
          <a className="btn" href={zipFile} download="web-icons.zip">
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
