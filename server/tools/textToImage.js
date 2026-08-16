function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * body: { text, bgColor?, textColor?, width?, height?, fontSize? }
 */
export default function textToImage(body = {}) {
  const {
    text = "",
    bgColor = "#0d1117",
    textColor = "#3fb950",
    width = 600,
    height = 300,
    fontSize = 32,
  } = body;

  if (!text.trim()) {
    return { ok: false, error: "Enter some text to render." };
  }

  const w = Math.min(Math.max(Number(width) || 600, 100), 1600);
  const h = Math.min(Math.max(Number(height) || 300, 100), 1600);
  const fs = Math.min(Math.max(Number(fontSize) || 32, 8), 200);

  const maxChars = Math.floor((w - 40) / (fs * 0.6));
  const lines = wrapText(text.trim(), Math.max(maxChars, 4));
  const lineHeight = fs * 1.3;
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;

  const tspans = lines
    .map(
      (line, i) =>
        `<tspan x="50%" y="${startY + i * lineHeight}">${esc(line)}</tspan>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${esc(bgColor)}" />
  <text text-anchor="middle" dominant-baseline="middle" font-family="IBM Plex Mono, monospace" font-size="${fs}" fill="${esc(textColor)}">${tspans}</text>
</svg>`;

  const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return { ok: true, image: dataUrl };
}
