import { diffLines, diffWordsWithSpace } from "diff";

/**
 * body: { left: string, right: string }
 * Returns line-level diff; for lines that were modified (a removed line
 * immediately followed by an added line), also computes a token-level
 * diff so the client can highlight just the changed tokens within the line.
 */
export default function codeDiff(body = {}) {
  const { left = "", right = "" } = body;

  if (!left && !right) {
    return { ok: false, error: "Enter code in at least one side." };
  }

  const parts = diffLines(left, right);
  const blocks = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const next = parts[i + 1];

    // A removed block immediately followed by an added block of the same
    // line count is treated as "modified" — diff within each line pair.
    if (part.removed && next?.added) {
      const oldLines = part.value.replace(/\n$/, "").split("\n");
      const newLines = next.value.replace(/\n$/, "").split("\n");
      const pairCount = Math.min(oldLines.length, newLines.length);

      for (let j = 0; j < pairCount; j++) {
        const tokens = diffWordsWithSpace(oldLines[j], newLines[j]);
        blocks.push({ type: "modified", tokens });
      }
      // leftover unpaired lines are pure removals/additions
      for (let j = pairCount; j < oldLines.length; j++) {
        blocks.push({ type: "removed", value: oldLines[j] });
      }
      for (let j = pairCount; j < newLines.length; j++) {
        blocks.push({ type: "added", value: newLines[j] });
      }
      i++; // consumed `next`
      continue;
    }

    const lines = part.value.replace(/\n$/, "").split("\n");
    const type = part.added ? "added" : part.removed ? "removed" : "unchanged";
    for (const line of lines) {
      blocks.push({ type, value: line });
    }
  }

  return { ok: true, blocks };
}
