import { useEffect, useState } from "react";

const COMMON_ZONES = [
  "UTC",
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

function formatInZone(date, zone) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "long",
      timeZone: zone,
    }).format(date);
  } catch {
    return "Invalid timezone";
  }
}

export default function TimestampConverter() {
  const [unixInput, setUnixInput] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [humanInput, setHumanInput] = useState(() => new Date().toISOString().slice(0, 16));
  const [zone, setZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const unixDate = (() => {
    const n = Number(unixInput);
    if (!Number.isFinite(n)) return null;
    // accept both seconds and milliseconds
    return new Date(unixInput.length > 10 ? n : n * 1000);
  })();

  const humanDate = (() => {
    const d = new Date(humanInput);
    return isNaN(d.getTime()) ? null : d;
  })();

  return (
    <div className="tool">
      <p className="tool__hint">Convert between Unix timestamps and human-readable dates — runs locally in your browser.</p>

      <div className="tool__row">
        <div className="tool__field tool__field--grow">
          <label className="tool__label" htmlFor="ts-zone">
            timezone
          </label>
          <select id="ts-zone" className="tool__input mono" value={zone} onChange={(e) => setZone(e.target.value)}>
            {[...new Set([zone, ...COMMON_ZONES])].map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="tool__label" htmlFor="ts-unix">
        unix timestamp (seconds or ms)
      </label>
      <input
        id="ts-unix"
        className="tool__input mono"
        spellCheck={false}
        value={unixInput}
        onChange={(e) => setUnixInput(e.target.value)}
      />
      <pre className="tool__output mono">{unixDate ? formatInZone(unixDate, zone) : "Invalid timestamp"}</pre>

      <label className="tool__label" htmlFor="ts-human">
        human-readable (local input)
      </label>
      <input
        id="ts-human"
        type="datetime-local"
        className="tool__input mono"
        value={humanInput}
        onChange={(e) => setHumanInput(e.target.value)}
      />
      <pre className="tool__output mono">
        {humanDate ? `${Math.floor(humanDate.getTime() / 1000)} (seconds)\n${humanDate.getTime()} (ms)` : "Invalid date"}
      </pre>

      <div className="tool__actions">
        <button className="btn" onClick={() => setUnixInput(Math.floor(now / 1000).toString())}>
          Use current time
        </button>
      </div>
      <p className="tool__hint" style={{ marginTop: 10 }}>
        Right now: {formatInZone(new Date(now), zone)}
      </p>
    </div>
  );
}
