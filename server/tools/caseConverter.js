/**
 * body: { input: string, mode: "upper" | "lower" | "title" | "sentence" }
 */
export default function caseConverter(body = {}) {
  const { input = "", mode = "upper" } = body;

  if (typeof input !== "string" || input === "") {
    return { ok: false, error: "Input is empty." };
  }

  let output;
  switch (mode) {
    case "lower":
      output = input.toLowerCase();
      break;
    case "title":
      output = input
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    case "sentence":
      output = input
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      break;
    case "upper":
    default:
      output = input.toUpperCase();
  }

  return { ok: true, output };
}
