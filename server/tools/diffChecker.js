import { diffLines } from "diff";

/**
 * body: { left: string, right: string }
 * returns structured diff parts so the client can render side-by-side/inline.
 */
export default function diffChecker(body = {}) {
  const { left = "", right = "" } = body;

  if (!left && !right) {
    return { ok: false, error: "Enter text in at least one side." };
  }

  const parts = diffLines(left, right);
  const diff = parts.map((part) => ({
    added: !!part.added,
    removed: !!part.removed,
    value: part.value,
  }));

  const stats = diff.reduce(
    (acc, p) => {
      const lines = p.value.split("\n").filter((l, i, arr) => !(i === arr.length - 1 && l === "")).length;
      if (p.added) acc.added += lines;
      else if (p.removed) acc.removed += lines;
      return acc;
    },
    { added: 0, removed: 0 }
  );

  return { ok: true, diff, stats };
}
