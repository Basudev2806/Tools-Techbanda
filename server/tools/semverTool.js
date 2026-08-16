function parseSemver(v) {
  const m = v.trim().replace(/^v/, "").match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] || "", build: m[5] || "" };
}

function comparePre(a, b) {
  if (!a && !b) return 0;
  if (!a) return 1; // no prerelease > has prerelease
  if (!b) return -1;
  const pa = a.split(".");
  const pb = b.split(".");
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    if (pa[i] === undefined) return -1;
    if (pb[i] === undefined) return 1;
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    const bothNum = !isNaN(na) && !isNaN(nb);
    if (bothNum) {
      if (na !== nb) return na - nb;
    } else {
      if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
    }
  }
  return 0;
}

function compareSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;
  return comparePre(a.pre, b.pre);
}

function bump(v, type) {
  const out = { ...v, pre: "", build: "" };
  if (type === "major") {
    out.major += 1;
    out.minor = 0;
    out.patch = 0;
  } else if (type === "minor") {
    out.minor += 1;
    out.patch = 0;
  } else {
    out.patch += 1;
  }
  return out;
}

function format(v) {
  let s = `${v.major}.${v.minor}.${v.patch}`;
  if (v.pre) s += `-${v.pre}`;
  if (v.build) s += `+${v.build}`;
  return s;
}

/**
 * body: { mode: "compare" | "bump", versionA: string, versionB?: string, bumpType?: "major"|"minor"|"patch" }
 */
export default function semverTool(body = {}) {
  const { mode = "compare", versionA = "", versionB = "", bumpType = "patch" } = body;

  const a = parseSemver(versionA);
  if (!a) return { ok: false, error: `"${versionA}" is not valid semver, e.g. 1.4.2` };

  if (mode === "bump") {
    const bumped = format(bump(a, bumpType));
    return { ok: true, output: bumped };
  }

  const b = parseSemver(versionB);
  if (!b) return { ok: false, error: `"${versionB}" is not valid semver, e.g. 1.4.2` };

  const cmp = compareSemver(a, b);
  const verdict = cmp === 0 ? `${versionA} equals ${versionB}` : cmp > 0 ? `${versionA} is greater than ${versionB}` : `${versionA} is less than ${versionB}`;

  return { ok: true, output: verdict };
}
