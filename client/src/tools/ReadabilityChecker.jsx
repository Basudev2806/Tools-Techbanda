import { useState } from "react";

const SAMPLE =
  "The report was written by the team. It was reviewed carefully. The findings were presented at the meeting, and everyone was impressed by the thorough analysis that had been conducted over several weeks.";

function countSyllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  const matches = w.match(/[aeiouy]+/g);
  let count = matches ? matches.length : 1;
  if (w.endsWith("e") && count > 1) count--;
  return Math.max(1, count);
}

function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const PASSIVE_RE = /\b(is|are|was|were|be|been|being)\b\s+(\w+ed|written|done|made|seen|known|given|taken|shown|held|found|brought|sent|built|chosen)\b/gi;

function analyze(text) {
  const sentences = splitSentences(text);
  const words = (text.match(/[A-Za-z']+/g) || []);
  const wordCount = words.length;
  const sentenceCount = sentences.length || 1;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const fleschScore = wordCount && sentenceCount ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / wordCount) : 0;
  const gradeLevel = wordCount && sentenceCount ? 0.39 * (wordCount / sentenceCount) + 11.8 * (syllables / wordCount) - 15.59 : 0;

  const longSentences = sentences.filter((s) => (s.match(/[A-Za-z']+/g) || []).length > 25);

  const passiveMatches = [];
  let m;
  const re = new RegExp(PASSIVE_RE);
  while ((m = re.exec(text)) !== null) passiveMatches.push(m[0]);

  return {
    wordCount,
    sentenceCount: sentences.length,
    fleschScore: Math.max(0, Math.min(100, fleschScore)),
    gradeLevel: Math.max(0, gradeLevel),
    longSentences,
    passiveMatches,
  };
}

function readingLevel(score) {
  if (score >= 90) return "Very easy";
  if (score >= 70) return "Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

export default function ReadabilityChecker() {
  const [text, setText] = useState(SAMPLE);
  const stats = analyze(text);

  return (
    <div className="tool">
      <p className="tool__hint">
        Flesch-Kincaid readability, passive voice, and long-sentence flags — all computed locally, updates as you
        type.
      </p>

      <label className="tool__label" htmlFor="rc-in">
        text
      </label>
      <textarea
        id="rc-in"
        className="tool__textarea mono"
        spellCheck={false}
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="tool__stats-grid">
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.fleschScore.toFixed(1)}</span>
          <span className="tool__stat-label">Flesch reading ease</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{readingLevel(stats.fleschScore)}</span>
          <span className="tool__stat-label">reading level</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.gradeLevel.toFixed(1)}</span>
          <span className="tool__stat-label">grade level</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.passiveMatches.length}</span>
          <span className="tool__stat-label">passive phrases</span>
        </div>
        <div className="tool__stat">
          <span className="tool__stat-value">{stats.longSentences.length}</span>
          <span className="tool__stat-label">long sentences (25+ words)</span>
        </div>
      </div>

      {stats.passiveMatches.length > 0 && (
        <>
          <label className="tool__label" style={{ marginTop: 16 }}>
            passive voice found
          </label>
          <pre className="tool__output mono">{stats.passiveMatches.join("\n")}</pre>
        </>
      )}

      {stats.longSentences.length > 0 && (
        <>
          <label className="tool__label">long sentences</label>
          <pre className="tool__output mono">{stats.longSentences.join("\n\n")}</pre>
        </>
      )}
    </div>
  );
}
