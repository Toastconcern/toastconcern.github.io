/* Can the site's store queries go to meta.graph.meta.com with the FRL token?
 *
 *   node tools/meta-graph-test.mjs [appId]
 *
 * graph.oculus.com only lets facebook.com read its replies, so every store query
 * goes through a relay (/api). meta.graph.meta.com lets any site read them, so a
 * query that works there could go straight from the browser and cost no Cloudflare
 * request. This runs the site's own js/check.js functions twice each:
 *
 *   oculus  graph.oculus.com with the access token (oc_www_at), as the relay does now
 *   meta    meta.graph.meta.com with the FRL token, as the browser would send it
 *
 * and says, per function, whether each worked and whether the answers match. It
 * prints no store data and never prints a token.
 *
 * Tokens are read from %USERPROFILE%/.metadb/test-tokens.json (outside the repo):
 *   { "token": "<oc_www_at>", "frl": "<FRL token from Settings>" }
 * Delete that file when done. Only read-only queries are run: nothing is claimed,
 * changed or deleted.
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const TOKENS_FILE = process.env.METADB_TOKENS_FILE || join(homedir(), ".metadb", "test-tokens.json");
let tokens;
try {
  tokens = JSON.parse(readFileSync(TOKENS_FILE, "utf8"));
} catch (err) {
  console.error(`Put your tokens in ${TOKENS_FILE} first:\n  { "token": "<oc_www_at>", "frl": "<FRL token>" }\n(${err.message})`);
  process.exit(1);
}
if (!tokens.token || !tokens.frl) {
  console.error(`${TOKENS_FILE} needs both "token" (oc_www_at) and "frl".`);
  process.exit(1);
}

const OCMS = JSON.parse(readFileSync(new URL("../data/ocms-headers.json", import.meta.url), "utf8"));
const RELAY = "http://relay.invalid/?url=";
const SITE = "https://metadb.toastconcern.dev";

/* What check.js needs from a browser: storage holding the access token and a relay
   it can address. Requests are caught below rather than sent to that relay. */
const store = new Map([
  ["metadb.token", tokens.token],
  ["metadb.relay", `${RELAY}{url}`],
]);
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
globalThis.document = { cookie: "", baseURI: `${SITE}/` };

const realFetch = globalThis.fetch;
let mode = "oculus";
const corsMissing = new Set();
let current = "";

/* Every request check.js makes, sent either the relay's way or the direct way. */
globalThis.fetch = async (input, init = {}) => {
  const href = String(input);
  if (!href.startsWith(RELAY)) return realFetch(input, init);
  const target = new URL(new URL(href).searchParams.get("url"));
  const oculusGraph = /^(graph|realitylabs-graph)\.oculus\.com$/.test(target.hostname);

  if (mode === "oculus" || !oculusGraph) {
    return realFetch(target, { ...init, headers: { ...OCMS, ...init.headers } });
  }

  /* meta: the browser's view — another host, the FRL token, an Origin, no OCMS headers. */
  target.hostname = "meta.graph.meta.com";
  if (target.searchParams.has("access_token")) target.searchParams.set("access_token", tokens.frl);
  let body = init.body;
  if (typeof body === "string") {
    const form = new URLSearchParams(body);
    if (form.has("access_token")) form.set("access_token", tokens.frl);
    body = form.toString();
  }
  const res = await realFetch(target, { ...init, body, headers: { ...init.headers, Origin: SITE } });
  const acao = res.headers.get("access-control-allow-origin");
  if (acao !== "*" && acao !== SITE) corsMissing.add(current);
  return res;
};

/* Two copies of check.js, so caches filled by one mode (viewer id, settings) never
   answer for the other. */
const oculus = await import("../js/check.js?mode=oculus");
const meta = await import("../js/check.js?mode=meta");

const scrub = (s) =>
  String(s ?? "")
    .split(tokens.token).join("<token>")
    .split(tokens.frl).join("<frl>")
    .replace(/\s+/g, " ")
    .slice(0, 90);

async function attempt(m, lib, fn) {
  mode = m;
  try {
    return { ok: true, value: await fn(lib) };
  } catch (err) {
    return { ok: false, error: scrub(err?.message ?? err) };
  }
}

/* The size of an answer, for "differs" lines — a count, never the content. */
const size = (v) =>
  Array.isArray(v) ? `${v.length} items`
    : v instanceof Map ? `${v.size} entries`
    : v && typeof v === "object" ? `${Object.keys(v).length} fields`
    : typeof v;

const stable = (v) =>
  JSON.stringify(v, (k, x) => (x instanceof Map ? Object.fromEntries(x) : x));

const results = [];
async function check(name, fn) {
  current = name;
  const a = await attempt("oculus", oculus, fn);
  const b = await attempt("meta", meta, fn);
  let verdict;
  if (a.ok && b.ok) verdict = stable(a.value) === stable(b.value) ? "SAME" : `DIFFERS (oculus ${size(a.value)}, meta ${size(b.value)})`;
  else if (!a.ok && b.ok) verdict = "META ONLY";
  else if (a.ok && !b.ok) verdict = `META FAILS: ${b.error}`;
  else verdict = `BOTH FAIL: oculus "${a.error}" / meta "${b.error}"`;
  if (corsMissing.has(name)) verdict += "  [no CORS header from meta.graph]";
  results.push([name, verdict, a.ok && b.ok]);
  console.log(`${name.padEnd(26)} ${verdict}`);
  return a.ok ? a.value : b.ok ? b.value : null;
}

/* An app to look at: the one named, or the first store search result. */
let appId = process.argv[2];
if (!appId) {
  mode = "oculus";
  const found = await oculus.searchStore("vr", { limit: 1 }).catch(() => []);
  appId = found[0]?.id;
}
if (!appId) {
  console.error("Could not pick an app — pass an app ID: node tools/meta-graph-test.mjs <appId>");
  process.exit(1);
}
console.log(`Comparing graph.oculus.com (access token) with meta.graph.meta.com (FRL token)\n`);

await check("viewerId", (c) => c.viewerId());
await check("searchStore", (c) => c.searchStore("racing", { limit: 5 }));
await check("fetchHistory", (c) => c.fetchHistory(appId));
const listing = await check("storeListing", (c) => c.storeListing(appId));
await check("appPage", (c) => c.appPage(appId));
await check("appDetails", (c) => c.appDetails(appId));
await check("lookupApp (node API)", (c) => c.lookupApp(appId));
await check("storeNames (node API)", (c) => c.storeNames([appId]));
await check("appReviewSummary", (c) => c.appReviewSummary(appId));
await check("appReviews", (c) => c.appReviews(appId));
await check("releaseNotes", (c) => c.releaseNotes(appId));
await check("appAddons", (c) => c.appAddons(appId));
await check("appAchievements", (c) => c.appAchievements(appId));
await check("appDevPosts", (c) => c.appDevPosts(appId));
await check("myReleaseChannels", (c) => c.myReleaseChannels(appId));
if (listing?.orgId) await check("orgApps", (c) => c.orgApps(listing.orgId));
await check("defaultApps", (c) => c.defaultApps());
await check("storeFront", (c) => c.storeFront());
await check("topCharts", (c) => c.topCharts());
await check("wishlist", (c) => c.wishlist());
await check("horizonPlus", (c) => c.horizonPlus());
await check("worldShelf", (c) => c.worldShelf(c.WORLD_SHELVES[0][0]));
await check("savedWorlds", (c) => c.savedWorlds());
await check("myEntitlements quest", (c) => c.myEntitlements("quest"));
await check("myEntitlements pc", (c) => c.myEntitlements("pc"));
await check("ownedIaps", (c) => c.ownedIaps());
await check("purchaseHistory", (c) => c.purchaseHistory());
await check("accountDevices", (c) => c.accountDevices());
await check("recentPresence", (c) => c.recentPresence());
await check("avatarInfo", (c) => c.avatarInfo());

const both = results.filter((r) => r[2]).length;
const same = results.filter((r) => r[1].startsWith("SAME")).length;
console.log(`\n${results.length} checked: ${same} same, ${both - same} differ, ${results.length - both} failed on one side or both.`);
console.log(`Remember to delete ${TOKENS_FILE}.`);
