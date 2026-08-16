function clamp255(n) {
  return Math.min(255, Math.max(0, Math.round(n)));
}

/**
 * body: { input: string, mode: "rgb-to-hex" | "hex-to-rgb" }
 * rgb-to-hex input: "r,g,b" e.g. "63,185,80"
 * hex-to-rgb input: "#3fb950" or "3fb950"
 */
export default function colorConverter(body = {}) {
  const { input = "", mode = "rgb-to-hex" } = body;
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "Input is empty." };
  }

  if (mode === "hex-to-rgb") {
    const hex = trimmed.replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      return { ok: false, error: "Expected a 6-digit hex color, e.g. #3fb950." };
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { ok: true, output: `rgb(${r}, ${g}, ${b})` };
  }

  const parts = trimmed.split(",").map((p) => p.trim());
  if (parts.length !== 3 || parts.some((p) => p === "" || isNaN(Number(p)))) {
    return { ok: false, error: "Expected three numbers, e.g. 63,185,80." };
  }
  const [r, g, b] = parts.map(Number).map(clamp255);
  const hex =
    "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return { ok: true, output: hex };
}
