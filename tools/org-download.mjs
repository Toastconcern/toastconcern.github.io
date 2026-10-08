/* Download every build of every app an organization has published.
 *
 *   set OC_WWW_AT=...   (PowerShell: $env:OC_WWW_AT = "...")
 *   set OC_AC_AT=...
 *   node tools/org-download.mjs <orgID> [options]
 *
 * Options:
 *   --out <dir>     where to save (default: D:\MetaQuestFiles\org-<orgID>)
 *   --latest        only the newest matching build, per app
 *   --no-obb        skip OBB expansion files
 *   --dry-run       list what would be downloaded, fetch nothing big
 *   --token <t>     oc_www_at instead of OC_WWW_AT
 *   --ac-token <t>  oc_ac_at instead of OC_AC_AT
 *
 * Go and Rift apps are skipped; only Quest apps are downloaded. Only builds on
 * a channel other than LIVE are taken: anything on LIVE, and anything never
 * published to a channel, is skipped.
 *
 * Layout: one folder per app, one file (or, for Rift, one folder) per build,
 * with the build id last:
 *
 *   <out>/<App Name>/<App Name>_<version>_<buildId>.apk
 *   <out>/<App Name>/<App Name>_<version>_<buildId>.obb
 *   <out>/<App Name>/<App Name>_<version>_<buildId>/...      (PC / Rift builds)
 *   <out>/<App Name>/builds.json                              (the history + results)
 *
 * Meta checks entitlement on every download, so this only gets builds the
 * account is allowed to have; refused builds are logged and skipped. Re-running
 * skips anything already on disk, so an interrupted run picks up where it left
 * off. Same queries as js/check.js, but from Node, so no relay is needed.
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const ENDPOINT = "https://graph.oculus.com/graphql";
const HISTORY_DOC_ID = "2885322071572384";
const ORG_APPS_DOC_ID = "27915674441422265";
const CHANNEL_DOC_ID = "3973666182694273";
const RIFT_META_DOC_ID = "24830095600010314";

/* What the Oculus companion app on a Quest 3 sends when it pulls a binary —
   the CDN wants it. Same string as tools/relay.mjs. */
const DOWNLOAD_UA =
  "Dalvik/2.1.0 (Linux; U; Android 14; Quest 3 Build/UP1A.231005.007.A1) " +
  "[FBAN/OculusOCMS;FBAV/1048.0.0.0.870;FBCR/null;FBDV/Quest 3;FBHV/204;" +
  "FBLC/en_US;FBSV/14;FBSBT/user;FBBD/oculus;FBBV/582512031;" +
  "FBCA/arm64-v8a:armeabi-v7a:armeabi;FBMF/Oculus;FBPN/com.oculus.ocms;" +
  "FBDW/null;FBVM/null;]";

/* ---------- arguments ---------- */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 ? argv[i + 1] : undefined;
};

const orgID = argv.find((a, i) => /^\d+$/.test(a) && !argv[i - 1]?.startsWith("--"));
const token = option("--token") ?? process.env.OC_WWW_AT;
const acToken = option("--ac-token") ?? process.env.OC_AC_AT;
const latestOnly = flag("--latest");
const withObb = !flag("--no-obb");
const dryRun = flag("--dry-run");
const outDir = path.resolve(
  option("--out") ?? path.join("D:\\", "MetaQuestFiles", `org-${orgID}`)
);

if (!orgID || !token || (!acToken && !dryRun)) {
  console.error(
    "usage: node tools/org-download.mjs <orgID> [--out dir] [--latest] [--no-obb] [--dry-run]\n" +
      "needs OC_WWW_AT (oc_www_at) and OC_AC_AT (oc_ac_at) set, or --token / --ac-token"
  );
  process.exit(1);
}

/* ---------- helpers ---------- */

/** A name Windows will accept as a file or folder. */
const safe = (s) =>
  String(s)
    .replace(/[<>:"/\\|?*\x00-\x1f]+/g, "_")
    .replace(/[. ]+$/, "")
    .trim()
    .slice(0, 120) || "unnamed";

const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;

const exists = (p) => fs.existsSync(p) && fs.statSync(p).size > 0;

async function graphql(docId, variables) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      access_token: token,
      doc_id: docId,
      variables: JSON.stringify(variables),
    }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    /* Some replies are several objects back to back; the first holds the data. */
    try {
      json = JSON.parse(text.split("\n")[0]);
    } catch {
      throw new Error(`store returned ${res.status}: ${text.slice(0, 120)}`);
    }
  }
  if (json.errors?.length) throw new Error(json.errors[0].message ?? "query refused");
  if (json.error) throw new Error(json.error.message ?? "request rejected");
  return json;
}

/** Fetch a CDN url signed with the account token, refusing error pages. */
async function cdn(url) {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}access_token=${encodeURIComponent(acToken)}`, {
    headers: { Accept: "*/*", "User-Agent": DOWNLOAD_UA },
  });
  const type = res.headers.get("content-type") ?? "";
  if (!res.ok || /json|html/.test(type)) {
    const body = await res.text().catch(() => "");
    let msg = `${res.status}`;
    try {
      msg = JSON.parse(body).error?.message ?? msg;
    } catch {}
    throw new Error(res.status >= 400 && res.status < 500 ? `refused (${msg})` : msg);
  }
  return res;
}

/* ---------- queries (mirrors of js/check.js) ---------- */

async function orgApps() {
  const out = new Map();
  let after = null;
  for (let page = 0; page < 40; page += 1) {
    const json = await graphql(ORG_APPS_DOC_ID, {
      after,
      display_name: null,
      exclude_hyperscapes: true,
      exclude_platforms: ["HORIZON_WORLD", "HORIZON_UNITY_WORLD"],
      first: 20,
      orderby: "DISPLAY_NAME",
      platform: null,
      id: String(orgID),
    });
    const conn =
      json.data?.node?.applications ?? json.data?.organization?.applications ?? {};
    for (const edge of conn.edges ?? []) {
      const n = edge?.node;
      if (!n?.id || out.has(String(n.id))) continue;
      out.set(String(n.id), {
        id: String(n.id),
        name: n.display_name || String(n.id),
        platform: n.platform ?? null,
      });
    }
    const pi = conn.page_info ?? {};
    if (!pi.has_next_page || !pi.end_cursor) break;
    after = pi.end_cursor;
  }
  return [...out.values()];
}

async function history(appId) {
  const json = await graphql(HISTORY_DOC_ID, { applicationID: String(appId) });
  const nodes = json?.data?.node?.primary_binaries?.nodes;
  if (!nodes) throw new Error("no build history in the reply");
  const channelIds = new Set();
  const builds = nodes
    .map((b) => {
      for (const c of b.binary_release_channels?.nodes ?? []) {
        if (c?.id) channelIds.add(String(c.id));
      }
      return {
        id: String(b.id),
        version: b.version ?? "",
        versionCode: b.version_code ?? null,
        createdAt: b.created_date ?? 0,
        fileName: b.file_name ?? "",
        channels: (b.binary_release_channels?.nodes ?? [])
          .map((c) => c.channel_name)
          .filter(Boolean),
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
  return { builds, channelIds: [...channelIds] };
}

/** Binary id -> OBB binary id, across every channel the app has. */
async function obbMap(channelIds) {
  const pairs = new Map();
  for (const id of channelIds) {
    try {
      const json = await graphql(CHANNEL_DOC_ID, { releaseChannelID: id });
      const node = json.data?.node;
      const take = (b) => {
        if (b?.id && b.obb_binary?.id) pairs.set(String(b.id), String(b.obb_binary.id));
      };
      for (const e of node?.application?.primary_binaries?.edges ?? []) take(e?.node);
      for (const e of node?.binaries?.edges ?? []) take(e?.node);
      take(node?.latest_supported_binary);
    } catch (err) {
      console.log(`    (OBB lookup for channel ${id} failed: ${err.message})`);
    }
  }
  return pairs;
}

async function riftMetadata(binaryId) {
  const json = await graphql(RIFT_META_DOC_ID, { binary_id: String(binaryId) });
  let manifestUri, segmentsBaseUri, platform;
  (function walk(n) {
    if (!n || typeof n !== "object") return;
    if (n.manifest_uri) manifestUri = n.manifest_uri;
    if (n.segments_base_uri) segmentsBaseUri = n.segments_base_uri;
    if (n.platform && platform == null) platform = n.platform;
    for (const k in n) walk(n[k]);
  })(json);
  return { manifestUri, segmentsBaseUri, platform };
}

/* ---------- downloads ---------- */

/** Stream one binary to disk via a .part file, so a half file never looks done. */
async function downloadBinary(binaryId, dest) {
  if (exists(dest)) return "already there";
  const res = await cdn(
    `https://securecdn.oculus.com/binaries/download/?id=${encodeURIComponent(binaryId)}`
  );
  const total = Number(res.headers.get("content-length")) || 0;
  const part = `${dest}.part`;
  let done = 0;
  let last = 0;
  const body = Readable.fromWeb(res.body);
  body.on("data", (chunk) => {
    done += chunk.length;
    const now = Date.now();
    if (now - last > 500) {
      last = now;
      process.stdout.write(
        `\r      ${mb(done)}${total ? ` of ${mb(total)} (${Math.round((done / total) * 100)}%)` : ""}   `
      );
    }
  });
  await pipeline(body, fs.createWriteStream(part));
  process.stdout.write("\r" + " ".repeat(60) + "\r");
  await fsp.rename(part, dest);
  return mb(done);
}

/** The one manifest.json inside a zip, read off the central directory. */
function unzipManifest(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i -= 1) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) throw new Error("not a zip");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i += 1) {
    const method = buf.readUInt16LE(p + 10);
    const csize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    if (name === "manifest.json" || name.endsWith("/manifest.json")) {
      const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
      const data = buf.subarray(start, start + csize);
      return (method === 8 ? zlib.inflateRawSync(data) : data).toString("utf8");
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("no manifest.json in the archive");
}

const inflate = (raw) => {
  try {
    return zlib.inflateSync(raw);
  } catch {
    try {
      return zlib.gunzipSync(raw);
    } catch {
      return zlib.inflateRawSync(raw);
    }
  }
};

/** A Rift build: fetch the manifest, then stitch every file from its segments. */
async function downloadRift(binaryId, destDir) {
  const { manifestUri, segmentsBaseUri, platform } = await riftMetadata(binaryId);
  if (platform === "ANDROID") return null; // a Quest build after all
  if (!manifestUri || !segmentsBaseUri) throw new Error("no PC manifest for this build");

  const zipped = Buffer.from(await (await cdn(manifestUri)).arrayBuffer());
  let text;
  try {
    text = unzipManifest(zipped);
  } catch {
    try {
      text = zlib.gunzipSync(zipped).toString("utf8");
    } catch {
      text = zipped.toString("utf8");
    }
  }
  const files = JSON.parse(text).files ?? {};
  const names = Object.keys(files);
  if (!names.length) throw new Error("the manifest listed no files");
  const totalBytes = names.reduce((s, n) => s + (files[n].size || 0), 0) || 1;

  let doneBytes = 0;
  for (const name of names) {
    const file = files[name];
    const dest = path.join(destDir, ...name.split(/[\\/]/).map(safe));
    if (fs.existsSync(dest) && fs.statSync(dest).size === file.size) {
      doneBytes += file.size;
      continue;
    }
    await fsp.mkdir(path.dirname(dest), { recursive: true });
    const part = `${dest}.part`;
    const fh = await fsp.open(part, "w");
    try {
      let offset = 0;
      for (const seg of file.segments ?? []) {
        const sha = Array.isArray(seg) ? seg[1] : seg.sha256 ?? seg;
        const raw = Buffer.from(
          await (await cdn(`${segmentsBaseUri}${segmentsBaseUri.includes("?") ? "&" : "?"}segment_sha256=${encodeURIComponent(sha)}`)).arrayBuffer()
        );
        const data = inflate(raw);
        await fh.write(data, 0, data.length, offset);
        offset += file.segmentSize;
      }
    } finally {
      await fh.close();
    }
    await fsp.rename(part, dest);
    doneBytes += file.size;
    process.stdout.write(
      `\r      ${Math.round((doneBytes / totalBytes) * 100)}% — ${names.indexOf(name) + 1}/${names.length} files   `
    );
  }
  process.stdout.write("\r" + " ".repeat(60) + "\r");
  return `${names.length} files, ${mb(totalBytes)}`;
}

/* ---------- main ---------- */

const isRift = (app) => app.platform === "PC" || app.platform === "RIFT";

console.log(`Organization ${orgID} -> ${outDir}${dryRun ? "  (dry run)" : ""}`);
const listed = await orgApps();
if (!listed.length) {
  console.log("Nothing listed — the access token (oc_www_at) is probably missing or expired.");
  process.exit(1);
}

/* Quest only: Go apps report "ANDROID" or "ANDROID_3DOF", Rift apps "PC" or
   "RIFT" (the same split js/app.js uses). */
const SKIP = { ANDROID: "Go", ANDROID_3DOF: "Go", PC: "Rift", RIFT: "Rift" };
const apps = listed.filter((a) => !SKIP[a.platform]);
const skipped = listed.filter((a) => SKIP[a.platform]);
console.log(`${listed.length} apps, ${apps.length} for Quest`);
for (const a of skipped) console.log(`  skipping ${a.name} (${SKIP[a.platform]})`);
console.log("");

/* Two apps can share a display name; those folders get the app id too. */
const nameCount = new Map();
for (const a of apps) nameCount.set(safe(a.name), (nameCount.get(safe(a.name)) ?? 0) + 1);

const totals = { ok: 0, skipped: 0, failed: 0 };

for (const [i, app] of apps.entries()) {
  const base = safe(app.name);
  const folder = nameCount.get(base) > 1 ? `${base} (${app.id})` : base;
  const appDir = path.join(outDir, folder);
  console.log(`[${i + 1}/${apps.length}] ${app.name}  (${app.id}, ${app.platform ?? "?"})`);

  let builds, channelIds;
  try {
    ({ builds, channelIds } = await history(app.id));
  } catch (err) {
    console.log(`    no build history: ${err.message}\n`);
    totals.failed += 1;
    continue;
  }

  /* Only builds on some channel, and none on LIVE. */
  const live = builds.filter((b) => b.channels.includes("LIVE")).length;
  const noChannel = builds.filter((b) => !b.channels.length).length;
  let wanted = builds.filter((b) => b.channels.length && !b.channels.includes("LIVE"));
  if (latestOnly) wanted = wanted.slice(0, 1);
  console.log(
    `    ${builds.length} builds in history, ${live} on LIVE and ${noChannel} with no channel (skipped), ${wanted.length} to fetch`
  );
  if (!wanted.length) {
    console.log("");
    continue;
  }

  const obbs = withObb && !isRift(app) && !dryRun ? await obbMap(channelIds) : new Map();
  const log = [];

  if (!dryRun) await fsp.mkdir(appDir, { recursive: true });

  for (const b of wanted) {
    const stem = `${base}_${safe(b.version || b.versionCode || "unknown")}_${b.id}`;
    const tag = `${b.version || "?"} [${b.channels.join(", ") || "no channel"}] ${b.id}`;
    const entry = { ...b, result: null, obb: obbs.get(b.id) ?? null };
    log.push(entry);

    if (dryRun) {
      console.log(`    - ${tag}`);
      continue;
    }

    try {
      let result = null;
      if (isRift(app)) result = await downloadRift(b.id, path.join(appDir, stem));
      if (result === null) {
        const ext = path.extname(b.fileName) || ".apk";
        result = await downloadBinary(b.id, path.join(appDir, `${stem}${ext}`));
      }
      entry.result = result;
      console.log(`    ok   ${tag}  ${result}`);
      totals[result === "already there" ? "skipped" : "ok"] += 1;
    } catch (err) {
      entry.result = `failed: ${err.message}`;
      console.log(`    fail ${tag}  ${err.message}`);
      totals.failed += 1;
      continue;
    }

    if (entry.obb) {
      try {
        const r = await downloadBinary(entry.obb, path.join(appDir, `${stem}.obb`));
        entry.obbResult = r;
        console.log(`    obb  ${tag}  ${r}`);
      } catch (err) {
        entry.obbResult = `failed: ${err.message}`;
        console.log(`    obb  ${tag}  failed: ${err.message}`);
      }
    }
  }

  if (!dryRun) {
    await fsp.writeFile(
      path.join(appDir, "builds.json"),
      JSON.stringify({ app, builds: log }, null, 2)
    );
  }
  console.log("");
}

console.log(
  `Done. ${totals.ok} downloaded, ${totals.skipped} already on disk, ${totals.failed} failed or refused.`
);
