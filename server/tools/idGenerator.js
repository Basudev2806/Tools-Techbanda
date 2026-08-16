import crypto from "node:crypto";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function encodeTime(time, len) {
  let str = "";
  for (let i = len - 1; i >= 0; i--) {
    str = CROCKFORD[time % 32] + str;
    time = Math.floor(time / 32);
  }
  return str;
}

function encodeRandom(len) {
  const bytes = crypto.randomBytes(len);
  let str = "";
  for (let i = 0; i < len; i++) {
    str += CROCKFORD[bytes[i] % 32];
  }
  return str;
}

function ulid() {
  return encodeTime(Date.now(), 10) + encodeRandom(16);
}

/**
 * body: { type: "uuid" | "ulid", count?: number }
 */
export default function idGenerator(body = {}) {
  const { type = "uuid", count = 1 } = body;
  const n = Math.min(Math.max(Number(count) || 1, 1), 100);

  if (!["uuid", "ulid"].includes(type)) {
    return { ok: false, error: "Type must be 'uuid' or 'ulid'." };
  }

  const ids = [];
  for (let i = 0; i < n; i++) {
    ids.push(type === "ulid" ? ulid() : crypto.randomUUID());
  }

  return { ok: true, output: ids.join("\n") };
}
