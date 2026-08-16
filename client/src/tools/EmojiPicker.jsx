import { useState } from "react";

const ITEMS = [
  ["😀", "grinning face"], ["😂", "tears of joy"], ["😍", "heart eyes"], ["😎", "sunglasses"],
  ["🥳", "party face"], ["😢", "crying"], ["😡", "angry"], ["🤔", "thinking"],
  ["👍", "thumbs up"], ["👎", "thumbs down"], ["👏", "clapping"], ["🙏", "folded hands"],
  ["🔥", "fire"], ["✨", "sparkles"], ["🎉", "party popper"], ["💯", "hundred points"],
  ["❤️", "red heart"], ["💔", "broken heart"], ["⭐", "star"], ["✅", "check mark"],
  ["❌", "cross mark"], ["⚠️", "warning"], ["🚀", "rocket"], ["💡", "light bulb"],
  ["📌", "pushpin"], ["📎", "paperclip"], ["🔗", "link"], ["🔒", "lock"],
  ["🔑", "key"], ["⚙️", "gear"], ["🐛", "bug"], ["💻", "laptop"],
  ["📱", "mobile phone"], ["🌐", "globe"], ["☕", "coffee"], ["🍕", "pizza"],
  ["🐍", "snake"], ["🐘", "elephant"], ["🦀", "crab"], ["🐳", "whale"],
  ["→", "right arrow"], ["←", "left arrow"], ["↑", "up arrow"], ["↓", "down arrow"],
  ["✓", "check"], ["✗", "cross"], ["★", "star (filled)"], ["☆", "star (outline)"],
  ["©", "copyright"], ["®", "registered"], ["™", "trademark"], ["§", "section"],
  ["¶", "pilcrow"], ["†", "dagger"], ["‡", "double dagger"], ["•", "bullet"],
  ["…", "ellipsis"], ["–", "en dash"], ["—", "em dash"], ["°", "degree"],
  ["±", "plus-minus"], ["×", "multiplication"], ["÷", "division"], ["≈", "approximately"],
  ["≠", "not equal"], ["≤", "less or equal"], ["≥", "greater or equal"], ["∞", "infinity"],
  ["√", "square root"], ["π", "pi"], ["Σ", "sigma"], ["Ω", "omega"],
  ["€", "euro"], ["£", "pound"], ["¥", "yen"], ["₹", "rupee"],
];

export default function EmojiPicker() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(null);

  const filtered = ITEMS.filter(([, name]) => name.toLowerCase().includes(query.trim().toLowerCase()));

  async function copy(char) {
    try {
      await navigator.clipboard.writeText(char);
      setCopied(char);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // clipboard permission denied — silently ignore
    }
  }

  return (
    <div className="tool">
      <p className="tool__hint">Searchable emoji and Unicode symbols — click to copy.</p>

      <input
        className="tool__input mono"
        placeholder="Search by name…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="tool__emoji-grid">
        {filtered.map(([char, name]) => (
          <button key={char + name} className="tool__emoji-cell" title={name} onClick={() => copy(char)}>
            <span className="tool__emoji-char">{char}</span>
            {copied === char && <span className="tool__emoji-copied">Copied</span>}
          </button>
        ))}
        {!filtered.length && <p className="tool__hint">No matches.</p>}
      </div>
    </div>
  );
}
