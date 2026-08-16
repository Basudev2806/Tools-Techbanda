import crypto from "node:crypto";

// A compact, curated word list — short, common, unambiguous words. Not the
// full EFF list, but combined with 4-6 words and a random separator/number
// it gives solid entropy for a passphrase (word list size ^ word count).
const WORDS = (
  "apple beach cloud dance eagle flame grape house island jungle kite " +
  "lemon mango night ocean piano queen river stone tiger unity valley " +
  "whale xenon yield zebra amber bronze coral desert ember forest " +
  "garden harbor ivory jasper kernel lagoon marble nectar onyx pearl " +
  "quartz ripple summit timber umbra velvet willow marble copper granite " +
  "canyon meadow prairie tundra glacier volcano comet meteor nebula " +
  "orbit planet rocket satellite shuttle falcon otter panda rabbit " +
  "walrus badger beaver camel dolphin gecko hedgehog iguana jaguar " +
  "koala lynx mongoose narwhal octopus penguin quail raven sparrow " +
  "toucan urchin viper wombat yak anchor bridge candle drum engine " +
  "fabric guitar hammer inkwell jacket kettle lantern mirror needle " +
  "oyster pencil quilt ribbon saddle teapot umbrella vase wagon "
).split(" ").filter(Boolean);

function randomInt(max) {
  return crypto.randomInt(0, max);
}

/**
 * body: { wordCount?: number, separator?: string, capitalize?: boolean, appendNumber?: boolean }
 */
export default function passphraseGenerator(body = {}) {
  const { wordCount = 4, separator = "-", capitalize = true, appendNumber = true } = body;

  const n = Math.min(Math.max(Number(wordCount) || 4, 3), 8);
  const sep = typeof separator === "string" ? separator.slice(0, 3) : "-";

  const words = [];
  for (let i = 0; i < n; i++) {
    let word = WORDS[randomInt(WORDS.length)];
    if (capitalize) word = word[0].toUpperCase() + word.slice(1);
    words.push(word);
  }

  let output = words.join(sep);
  if (appendNumber) output += sep + randomInt(100).toString().padStart(2, "0");

  return { ok: true, output };
}
