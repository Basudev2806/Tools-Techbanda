import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

/**
 * body: { expression: string, count?: number, tz?: string }
 */
export default function cronParserTool(body = {}) {
  const { expression = "", count = 5, tz = "UTC" } = body;

  if (!expression.trim()) {
    return { ok: false, error: "Enter a cron expression, e.g. */15 9-17 * * 1-5" };
  }

  const n = Math.min(Math.max(Number(count) || 5, 1), 20);

  let description;
  try {
    description = cronstrue.toString(expression.trim());
  } catch (err) {
    return { ok: false, error: "Could not parse that expression: " + err.message };
  }

  try {
    const interval = CronExpressionParser.parse(expression.trim(), { tz: tz || "UTC" });
    const runs = [];
    for (let i = 0; i < n; i++) {
      runs.push(interval.next().toString());
    }
    return { ok: true, output: [description, "", "Next runs:", ...runs].join("\n") };
  } catch (err) {
    return { ok: false, error: "Could not compute run times: " + err.message };
  }
}
