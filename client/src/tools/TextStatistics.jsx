import { useState } from "react";

const SAMPLE = "The quick brown fox jumps over the lazy dog. This sentence is often used to test typography and fonts.";

function analyze(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || (trimmed ? 1 : 0) : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingMinutes = words / 200; // average adult reading speed
  const speakingMinutes = words / 130; // average speaking pace

  return { words, chars, charsNoSpaces, sentences, paragraphs, readingMinutes, speakingMinutes };
}

function formatMinutes(mins) {
  if (mins < 1) return `${Math.max(1, Math.round(mins * 60))} sec`;
  const whole = Math.floor(mins);
  const secs = Math.round((mins - whole) * 60);
  return secs ? `${whole} min ${secs} sec` : `${whole} min`;
}

export default function TextStatistics() {
  const [text, setText] = useState(SAMPLE);
  const stats = analyze(text);

  return (
    <div className="tool">
      <p className="tool__hint">Word/character/sentence counts and estimated reading time — updates as you type.</p>

      <label className="tool__label" htmlFor="ts-in">
        text
      </label>
      <textarea
        id="ts-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="tool__stats-grid">
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.words}</span>
          <span className="tool__stat-label">words</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.chars}</span>
          <span className="tool__stat-label">characters</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.charsNoSpaces}</span>
          <span className="tool__stat-label">chars (no spaces)</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.sentences}</span>
          <span className="tool__stat-label">sentences</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.paragraphs}</span>
          <span className="tool__stat-label">paragraphs</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{formatMinutes(stats.readingMinutes)}</span>
          <span className="tool__stat-label">reading time</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{formatMinutes(stats.speakingMinutes)}</span>
          <span className="tool__stat-label">speaking time</span>
        </div>
      </div>
    </div>
  );
}
