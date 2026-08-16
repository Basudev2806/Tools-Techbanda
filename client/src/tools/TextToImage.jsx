import { useState } from "react";
import { runTool } from "../api";

export default function TextToImage() {
  const [text, setText] = useState("tools.techbanda.com");
  const [bgColor, setBgColor] = useState("#0d1117");
  const [textColor, setTextColor] = useState("#3fb950");
  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("text-to-image", {
      text,
      bgColor,
      textColor,
      width: 600,
      height: 260,
      fontSize: 36,
    });
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
      <p className="tool__hint">Render text onto an image (SVG) you can download.</p>

      <label className="tool__label" htmlFor="t2i-in">
        text
      </label>
      <textarea
        id="t2i-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="t2i-bg">
            background
          </label>
          <input id="t2i-bg" type="color" className="tool__color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="t2i-fg">
            text color
          </label>
          <input id="t2i-fg" type="color" className="tool__color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
        </div>
      </div>

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          Generate
        </button>
        {image && (
          <a className="btn" href={image} download="text-image.svg">
            Download
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {image && (
        <div className="tool__image-frame">
          <img src={image} alt="Generated text image" className="tool__image" />
        </div>
      )}
    </div>
  );
}
