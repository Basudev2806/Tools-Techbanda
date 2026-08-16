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

const TYPE_INFO = {
  launcher: { label: "Launcher Icon (legacy)", defaultName: "ic_launcher", folder: "mipmap-*", hint: "48dp baseline \u2192 48/72/96/144/192px" },
  adaptive: { label: "Adaptive Icon (Android 8+)", defaultName: "ic_launcher", folder: "mipmap-*", hint: "108dp canvas, foreground padded to the 66dp safe zone, plus a flattened legacy fallback" },
  notification: { label: "Notification Icon", defaultName: "ic_stat_notify", folder: "drawable-*", hint: "24dp baseline, converted to a white silhouette (status bar requirement)" },
  generic: { label: "Generic / Action Bar Icon", defaultName: "ic_action_item", folder: "drawable-*", hint: "custom dp baseline, keeps original colors" },
};

export default function AndroidIconGenerator() {
  const [image, setImage] = useState("");
  const [type, setType] = useState("launcher");
  const [name, setName] = useState("");
  const [paddingPct, setPaddingPct] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("");
  const [useBackground, setUseBackground] = useState(false);
  const [roundVariant, setRoundVariant] = useState(true);
  const [baseDp, setBaseDp] = useState(24);

  // adaptive-only
  const [adaptiveBgMode, setAdaptiveBgMode] = useState("color");
  const [adaptiveBgColor, setAdaptiveBgColor] = useState("#FFFFFF");
  const [backgroundImage, setBackgroundImage] = useState("");

  const [zipFile, setZipFile] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(await fileToDataUrl(file));
    setZipFile("");
  }

  async function onBgFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackgroundImage(await fileToDataUrl(file));
  }

  async function run() {
    if (!image) {
      setError("Upload a source image first — a large square PNG with transparency works best.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await runTool("android-icon-generator", {
      image,
      type,
      name: name || TYPE_INFO[type].defaultName,
      paddingPct,
      backgroundColor: type === "adaptive" ? adaptiveBgColor : useBackground ? backgroundColor : "",
      roundVariant,
      baseDp,
      backgroundImage: type === "adaptive" && adaptiveBgMode === "image" ? backgroundImage : "",
    });
    setBusy(false);
    if (result.ok) {
      setZipFile(result.file);
    } else {
      setZipFile("");
      setError(result.error);
    }
  }

  const info = TYPE_INFO[type];

  return (
    <div className="tool">
      <p className="tool__hint">
        Generate Android icon assets across every density bucket (mdpi \u2192 xxxhdpi), packaged as a res/ folder
        zip you can drop straight into an Android project. Modeled on the classic Android Asset Studio generators.
      </p>

      <label className="tool__label" htmlFor="aig-file">
        {type === "adaptive" ? "foreground image" : "source image"}
      </label>
      <input id="aig-file" type="file" accept="image/*" onChange={onFile} className="tool__file" />

      <label className="tool__label" htmlFor="aig-type">
        icon type
      </label>
      <select id="aig-type" className="tool__input mono" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="launcher">Launcher Icon (legacy)</option>
        <option value="adaptive">Adaptive Icon (Android 8+)</option>
        <option value="notification">Notification Icon</option>
        <option value="generic">Generic / Action Bar Icon</option>
      </select>
      <p className="tool__hint" style={{ marginTop: 4 }}>
        {info.hint} — output in <code className="mono">res/{info.folder}/</code>
      </p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="aig-name">
            output filename
          </label>
          <input
            id="aig-name"
            className="tool__input mono"
            placeholder={info.defaultName}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {type !== "adaptive" && (
          <div className="tool__field">
            <label className="tool__label" htmlFor="aig-padding">
              padding: {paddingPct}%
            </label>
            <input
              id="aig-padding"
              type="range"
              min={0}
              max={40}
              value={paddingPct}
              onChange={(e) => setPaddingPct(Number(e.target.value))}
              className="tool__range"
            />
          </div>
        )}
      </div>

      {type === "generic" && (
        <>
          <label className="tool__label" htmlFor="aig-basedp">
            baseline size: {baseDp}dp
          </label>
          <input
            id="aig-basedp"
            type="range"
            min={16}
            max={96}
            value={baseDp}
            onChange={(e) => setBaseDp(Number(e.target.value))}
            className="tool__range"
          />
        </>
      )}

      {type === "launcher" && (
        <>
          <label className="tool__check tool__check--block">
            <input type="checkbox" checked={useBackground} onChange={(e) => setUseBackground(e.target.checked)} />
            Fill background color
          </label>
          {useBackground && (
            <input
              type="color"
              className="tool__color"
              value={backgroundColor || "#ffffff"}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
          )}
        </>
      )}

      {type === "adaptive" && (
        <>
          <label className="tool__label" htmlFor="aig-bgmode">
            background layer
          </label>
          <select
            id="aig-bgmode"
            className="tool__input mono"
            value={adaptiveBgMode}
            onChange={(e) => setAdaptiveBgMode(e.target.value)}
          >
            <option value="color">Flat color</option>
            <option value="image">Image</option>
          </select>

          {adaptiveBgMode === "color" ? (
            <input
              type="color"
              className="tool__color"
              value={adaptiveBgColor}
              onChange={(e) => setAdaptiveBgColor(e.target.value)}
              style={{ marginTop: 8 }}
            />
          ) : (
            <input type="file" accept="image/*" onChange={onBgFile} className="tool__file" style={{ marginTop: 8 }} />
          )}
        </>
      )}

      {(type === "launcher" || type === "adaptive") && (
        <label className="tool__check tool__check--block">
          <input type="checkbox" checked={roundVariant} onChange={(e) => setRoundVariant(e.target.checked)} />
          Also generate circular (round) variant
        </label>
      )}

      <div className="tool__actions">
        <button className="btn btn--primary" disabled={busy || !image} onClick={run}>
          {busy ? "Generating\u2026" : "Generate icon set"}
        </button>
        {zipFile && (
          <a className="btn" href={zipFile} download={`${name || info.defaultName}-android-icons.zip`}>
            Download zip
          </a>
        )}
      </div>

      {error && <p className="tool__error">{error}</p>}

      {image && (
        <div className="tool__row" style={{ marginTop: 10 }}>
          <div>
            <label className="tool__label">{type === "adaptive" ? "foreground" : "source"}</label>
            <img src={image} alt="Source" className="tool__thumb" />
          </div>
          {type === "adaptive" && adaptiveBgMode === "image" && backgroundImage && (
            <div>
              <label className="tool__label">background</label>
              <img src={backgroundImage} alt="Background" className="tool__thumb" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
