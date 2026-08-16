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

export default function ImageFormatConverter() {
  const [image, setImage] = useState("");
  const [format, setFormat] = useState("jpeg");
  const [quality, setQuality] = useState(90);
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
    const res = await runTool("image-format-converter", { image, format, quality });
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
      <p className="tool__hint">Convert an image between PNG, JPEG, BMP, GIF, and TIFF.</p>

      <label className="tool__label" htmlFor="ifc-file">
        source image
      </label>
      <input id="ifc-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ifc-format">
            convert to
          </label>
          <select id="ifc-format" className="tool__input mono" value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="bmp">BMP</option>
            <option value="gif">GIF</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>
        {format === "jpeg" && (
          <div className="tool__field tool__field--grow">
            <label className="tool__label" htmlFor="ifc-quality">
              quality: {quality}
            </label>
            <input
              id="ifc-quality"
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="tool__range"
            />
          </div>
        )}
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !image} onClick={run}>
          {busy ? "Converting…" : "Convert"}
        </button>
        {result && (
          <a className="btn" href={result} download={`converted.${format}`}>
            Download
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {result && (
        <div className="tool__image-frame">
          <img src={result} alt="Converted" className="tool__image" />
        </div>
      )}
    </div>
  );
}
