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

const DOT_STYLES = [
  { id: "square", label: "Square (classic)" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
];

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://tools.techbanda.com");
  const [size, setSize] = useState(320);
  const [margin, setMargin] = useState(2);
  const [dotStyle, setDotStyle] = useState("square");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [format, setFormat] = useState("png");

  const [gradient, setGradient] = useState(false);
  const [gradientColor, setGradientColor] = useState("#3fb950");

  const [logo, setLogo] = useState("");
  const [logoSizePercent, setLogoSizePercent] = useState(20);

  const [border, setBorder] = useState(false);
  const [borderWidth, setBorderWidth] = useState(12);
  const [borderColor, setBorderColor] = useState("#3fb950");

  const [image, setImage] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const logoDisabled = format === "svg";

  async function onLogoFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogo(await fileToDataUrl(file));
  }

  function onFormatChange(next) {
    setFormat(next);
    if (next === "svg") setLogo("");
  }

  async function run() {
    setBusy(true);
    setError(null);
    const result = await runTool("qr-code-generator", {
      text,
      size,
      margin,
      dotStyle,
      fgColor,
      bgColor,
      errorCorrection,
      format,
      gradient,
      gradientColor,
      logo: logoDisabled ? "" : logo,
      logoSizePercent,
      border,
      borderWidth,
      borderColor,
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
      <p className="tool__hint">
        Generate a QR code and customize its dot style, colors, size, an optional gradient,
        center logo, and a border.
      </p>

      <label className="tool__label" htmlFor="qr-text">
        text / url
      </label>
      <input
        id="qr-text"
        className="tool__input mono"
        spellCheck={false}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="qr-dotstyle">
            dot style
          </label>
          <select
            id="qr-dotstyle"
            className="tool__input mono"
            value={dotStyle}
            onChange={(e) => setDotStyle(e.target.value)}
          >
            {DOT_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="qr-format">
            export format
          </label>
          <select
            id="qr-format"
            className="tool__input mono"
            value={format}
            onChange={(e) => onFormatChange(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG (vector)</option>
          </select>
        </div>
      </div>

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="qr-size">
            size: {size}px
          </label>
          <input
            id="qr-size"
            type="range"
            min={150}
            max={800}
            step={10}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="tool__range"
          />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="qr-margin">
            quiet zone: {margin}
          </label>
          <input
            id="qr-margin"
            type="range"
            min={0}
            max={10}
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            className="tool__range"
          />
        </div>
      </div>

      <div className="tool__row">
        <div className="tool__field">
          <label className="tool__label" htmlFor="qr-fg">
            {gradient ? "gradient start" : "foreground"}
          </label>
          <input id="qr-fg" type="color" className="tool__color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} />
        </div>
        <div className="tool__field">
          <label className="tool__label" htmlFor="qr-bg">
            background
          </label>
          <input id="qr-bg" type="color" className="tool__color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
        </div>
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="qr-ec">
            error correction
          </label>
          <select
            id="qr-ec"
            className="tool__input mono"
            value={errorCorrection}
            onChange={(e) => setErrorCorrection(e.target.value)}
          >
            <option value="L">L — 7% (smallest)</option>
            <option value="M">M — 15%</option>
            <option value="Q">Q — 25%</option>
            <option value="H">H — 30% (best for logos)</option>
          </select>
        </div>
      </div>

      <label className="tool__check tool__check--block">
        <input type="checkbox" checked={gradient} onChange={(e) => setGradient(e.target.checked)} />
        Gradient fill
      </label>

      {gradient && (
        <div className="tool__row">
          <div className="tool__field">
            <label className="tool__label" htmlFor="qr-grad-color">
              gradient end
            </label>
            <input
              id="qr-grad-color"
              type="color"
              className="tool__color"
              value={gradientColor}
              onChange={(e) => setGradientColor(e.target.value)}
            />
          </div>
        </div>
      )}

      <label className="tool__label" htmlFor="qr-logo">
        center logo {logoDisabled ? "(PNG export only)" : "(optional — error correction is forced to H automatically)"}
      </label>
      <input
        id="qr-logo"
        type="file"
        accept="image/*"
        onChange={onLogoFile}
        className="tool__file"
        disabled={logoDisabled}
      />

      {logo && !logoDisabled && (
        <div className="tool__row" style={{ marginTop: 10, alignItems: "center" }}>
          <img src={logo} alt="Logo preview" className="tool__thumb" style={{ maxWidth: 60, maxHeight: 60 }} />
          <div className="tool__field tool__field--grow">
            <label className="tool__label" htmlFor="qr-logo-size">
              logo size: {logoSizePercent}%
            </label>
            <input
              id="qr-logo-size"
              type="range"
              min={10}
              max={30}
              value={logoSizePercent}
              onChange={(e) => setLogoSizePercent(Number(e.target.value))}
              className="tool__range"
            />
          </div>
          <button className="btn" onClick={() => setLogo("")}>
            Remove
          </button>
        </div>
      )}

      <label className="tool__check tool__check--block" style={{ marginTop: 16 }}>
        <input type="checkbox" checked={border} onChange={(e) => setBorder(e.target.checked)} />
        Add a border
      </label>

      {border && (
        <div className="tool__row">
          <div className="tool__field">
            <label className="tool__label" htmlFor="qr-border-width">
              border width: {borderWidth}px
            </label>
            <input
              id="qr-border-width"
              type="range"
              min={1}
              max={40}
              value={borderWidth}
              onChange={(e) => setBorderWidth(Number(e.target.value))}
              className="tool__range"
            />
          </div>
          <div className="tool__field">
            <label className="tool__label" htmlFor="qr-border-color">
              border color
            </label>
            <input
              id="qr-border-color"
              type="color"
              className="tool__color"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy} onClick={run}>
          {busy ? "Generating…" : "Generate"}
        </button>
        {image && (
          <a className="btn" href={image} download={`qr-code.${format}`}>
            Download
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {image && (
        <div className="tool__image-frame">
          <img src={image} alt="Generated QR code" className="tool__image" />
        </div>
      )}
    </div>
  );
}
