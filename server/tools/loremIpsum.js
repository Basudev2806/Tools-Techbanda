const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua ut enim ad minim " +
  "veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea " +
  "commodo consequat duis aute irure dolor in reprehenderit voluptate velit " +
  "esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat " +
  "cupidatat non proident sunt in culpa qui officia deserunt mollit anim " +
  "id est laborum"
).split(" ");

function makeSentence(minWords = 6, maxWords = 14) {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords));
  const words = [];
  for (let i = 0; i < len; i++) {
    words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  const sentence = words.join(" ");
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
}

function makeParagraph(sentences = 4) {
  const out = [];
  for (let i = 0; i < sentences; i++) out.push(makeSentence());
  return out.join(" ");
}

/**
 * body: { count?: number, unit: "words" | "sentences" | "paragraphs" }
 */
export default function loremIpsum(body = {}) {
  const { count = 3, unit = "paragraphs" } = body;
  const n = Math.min(Math.max(Number(count) || 1, 1), 50);

  let output;
  if (unit === "words") {
    const words = [];
    for (let i = 0; i < n; i++) words.push(WORDS[i % WORDS.length]);
    output = words.join(" ");
  } else if (unit === "sentences") {
    const sentences = [];
    for (let i = 0; i < n; i++) sentences.push(makeSentence());
    output = sentences.join(" ");
  } else {
    const paragraphs = [];
    for (let i = 0; i < n; i++) paragraphs.push(makeParagraph());
    output = paragraphs.join("\n\n");
  }

  return { ok: true, output };
}
