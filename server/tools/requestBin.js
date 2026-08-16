import crypto from "node:crypto";
import { createBin, binExists, listRequests, clearBin } from "../requestBinStore.js";

/**
 * body: { action: "create" | "list" | "clear", binId?: string }
 * The actual capture endpoint lives at /api/bin/:id in index.js — this
 * handler only manages bin lifecycle and reads the captured log.
 */
export default function requestBin(body = {}) {
  const { action = "create", binId = "" } = body;

  if (action === "create") {
    const id = crypto.randomBytes(5).toString("hex");
    createBin(id);
    return { ok: true, binId: id };
  }

  if (!binId.trim()) return { ok: false, error: "No bin selected." };
  if (!binExists(binId)) return { ok: false, error: "That bin has expired (bins last 30 minutes) or doesn't exist." };

  if (action === "clear") {
    clearBin(binId);
    return { ok: true, requests: [] };
  }

  // list
  const requests = listRequests(binId) || [];
  return { ok: true, requests };
}
