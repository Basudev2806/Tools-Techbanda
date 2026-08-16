import { useState } from "react";
import { runTool } from "../api";

export default function BarcodeGenerator() {
  const [text, setText] = useState("TECHBANDA123");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("barcode-generator", { text });
    setBusy(false);
    if (result.ok) {
      setImage(result.image);
    } else {
      setImage("");
      setError(result.error);
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Generate a Code 128 barcode image from text.</p>

      <label className="tool__label" htmlFor="bc-in">
        text
      </label>
      <input
        id="bc-in"
        className="tool__input mono"
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate
        </button>
        {image && (
          <a className="btn" href={image} download="barcode.png">
            Download
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {image && (
        <div className="tool__image-frame">
          <img src={image} alt="Generated barcode" className="tool__image" />
        </div>
      )}
    </div>
  );
}
