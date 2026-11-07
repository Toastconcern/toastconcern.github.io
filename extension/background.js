/* MetaDB Sign-in: the one part that can read Meta's cookies.

   oc_www_at and oc_ac_at are cookies on Meta's own domains, which no web page
   but Meta's can read. This worker reads them, and only ever hands them to a
   MetaDB tab that asked (content.js runs on MetaDB's pages and nowhere else).
   Nothing is sent anywhere: the tokens go from the browser's cookie jar to the
   MetaDB tab, which keeps them in its own settings, as if they were pasted. */

/* Cross-browser: Firefox exposes the promise-based WebExtension API as `browser`
   (its `chrome.*` is callback-only), while Chrome's `chrome.*` is promise-based in
   Manifest V3. Point `chrome` at `browser` where it exists so the `await chrome.*`
   calls below work in both. In Chrome `browser` is undefined and this is a no-op. */
if (typeof browser !== "undefined") globalThis.chrome = browser;

const LOGIN = "https://secure.oculus.com/my/profile/";

async function readTokens() {
  const find = async (name) => {
    const all = await chrome.cookies.getAll({ name });
    /* The newest wins, wherever Meta set it (oculus.com or meta.com). */
    all.sort((a, b) => (b.expirationDate ?? 0) - (a.expirationDate ?? 0));
    return all.find((c) => c.value)?.value ?? null;
  };
  return { token: await find("oc_www_at"), acToken: await find("oc_ac_at") };
}

/* A sign-in waiting on Meta's login: the MetaDB tab to answer, and the login
   tab opened for it. Kept in session storage, as the worker may sleep while
   the login is typed. */
async function pending() {
  return (await chrome.storage.session.get("pending")).pending ?? null;
}

async function deliver(p, tokens) {
  await chrome.storage.session.remove("pending");
  /* Mint the FRL token first, THEN re-read the oc tokens: the native-SSO flow can
     rotate the Meta session, so the oc_www_at read before it can be the stale one
     Meta then invalidates. Reading after the mint hands over the current ones.
     Best-effort: a mint failure never holds up the sign-in — it comes back as frlError. */
  let frlToken = null, frlError = null;
  try { frlToken = await getFrlToken(); } catch (e) { frlError = e.message; console.log("[FRL] failed:", e.message); }
  const fresh = await readTokens();
  const out = fresh.token && fresh.acToken ? fresh : tokens;
  try {
    await chrome.tabs.sendMessage(p.tab, { type: "tokens", ...out, frlToken, frlError });
    await chrome.tabs.update(p.tab, { active: true });
  } catch {}
  if (p.login) chrome.tabs.remove(p.login).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type === "status") {
    readTokens().then((t) => reply({ signedIn: Boolean(t.token && t.acToken) }));
    return true;
  }
  if (msg?.type !== "sign-in" || !sender.tab) return;
  (async () => {
    const tokens = await readTokens();
    if (tokens.token && tokens.acToken) {
      /* Already signed in — mint the FRL token first, then re-read the oc tokens, since
         the native-SSO flow can rotate the Meta session and stale the ones read before it. */
      let frlToken = null, frlError = null;
      try { frlToken = await getFrlToken(); } catch (e) { frlError = e.message; console.log("[FRL] failed:", e.message); }
      const fresh = await readTokens();
      const out = fresh.token && fresh.acToken ? fresh : tokens;
      return reply({ type: "tokens", ...out, frlToken, frlError });
    }
    /* Not logged in to Meta in this browser: open the login, and answer once it is done. */
    const login = await chrome.tabs.create({ url: LOGIN, index: sender.tab.index + 1 });
    await chrome.storage.session.set({ pending: { tab: sender.tab.id, login: login.id } });
    reply({ type: "login" });
  })();
  return true;
});

/* Meta's login sets the cookies; the moment both are there, the waiting tab gets them. */
chrome.cookies.onChanged.addListener(async ({ cookie, removed }) => {
  if (removed || !["oc_www_at", "oc_ac_at"].includes(cookie.name)) return;
  const p = await pending();
  if (!p) return;
  const tokens = await readTokens();
  if (tokens.token && tokens.acToken) deliver(p, tokens);
});

/* The login tab closed by hand: the MetaDB tab stops waiting. */
chrome.tabs.onRemoved.addListener(async (id) => {
  const p = await pending();
  if (!p || p.login !== id) return;
  await chrome.storage.session.remove("pending");
  chrome.tabs.sendMessage(p.tab, { type: "cancelled" }).catch(() => {});
});

/* ---------- update check ----------
   Added by hand (Load unpacked), the extension is never updated by the browser,
   so it looks for itself: the site publishes the newest version beside the zip,
   in downloads/MetaDB-extension.json. Asked when the browser starts and every
   six hours, only while "Check for updates" is on (the popup's switch). A newer
   one puts a badge on the toolbar button; the popup says what changed and how to
   put it in, and MetaDB's Settings mentions it too. That one request to the site
   is the only thing the check sends, and it carries nothing but the address. */
const UPDATE_URL = "https://metadb.toastconcern.dev/downloads/MetaDB-extension.json";

/* Where updates come from, and who signs them — both fixed here, in the extension.
   The version file must carry a signature that verifies with this public key; only
   the developer holds the private half (tools/extension-release.mjs signs with it).
   A file that does not verify is treated as no update at all, so not even someone in
   control of the site can put an update in front of this extension. The signed part
   also carries the zip's SHA-256 and size, which popup.js checks before saving it. */
const UPDATE_ZIP = "https://metadb.toastconcern.dev/downloads/MetaDB-extension.zip";
const SIGNING_KEY =
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE/G5zsdMHo72ELmhZMhD82ZHSufLVDKyU5SsmazIojMDh/dc6BTmwXlxPfX2v428BVg1GKO7wFaRfEj94T+6buw==";

const fromBase64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

/** The signed payload of a version file, or null when it is missing or does not verify. */
async function verified(info) {
  const { payload, signature } = info?.signed ?? {};
  if (typeof payload !== "string" || typeof signature !== "string") return null;
  try {
    const key = await crypto.subtle.importKey("spki", fromBase64(SIGNING_KEY), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, key, fromBase64(signature), new TextEncoder().encode(payload));
    return ok ? JSON.parse(payload) : null;
  } catch {
    return null;
  }
}

/** "1.10" > "1.9": compared number by number. */
function newer(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  }
  return false;
}

async function showBadge(update) {
  await chrome.action.setBadgeText({ text: update ? "1" : "" });
  if (update) await chrome.action.setBadgeBackgroundColor({ color: "#2f6fe0" });
  await chrome.action.setTitle({ title: update ? `MetaDB Sign-in — ${update.version} is out` : "MetaDB Sign-in" });
}

/** Resolves to { update, checked, failed }; update is null when this is the newest. */
async function checkUpdate() {
  const { updates } = await chrome.storage.sync.get({ updates: true });
  if (!updates) {
    await chrome.storage.local.remove(["update", "checked"]);
    await showBadge(null);
    return { off: true };
  }
  try {
    const res = await fetch(UPDATE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`the site answered ${res.status}`);
    if (!/json/.test(res.headers.get("content-type") ?? "")) throw new Error("the site has no version file");
    /* Only the signed part is believed; the plain copy beside it is for older versions. */
    const info = await verified(await res.json());
    if (!info) throw new Error("the update file failed its signature check, so it was ignored");
    const update = newer(info.version, chrome.runtime.getManifest().version)
      ? {
          version: String(info.version),
          changes: Array.isArray(info.changes) ? info.changes.map(String) : [],
          sha256: String(info.sha256 ?? ""),
          size: Number(info.size) || 0,
          url: UPDATE_ZIP,
        }
      : null;
    const checked = Date.now();
    await chrome.storage.local.set({ update, checked });
    await showBadge(update);
    return { update, checked };
  } catch (err) {
    return { failed: err.message, ...(await chrome.storage.local.get(["update", "checked"])) };
  }
}

function schedule() {
  chrome.alarms.create("update-check", { delayInMinutes: 1, periodInMinutes: 360 });
}

chrome.runtime.onInstalled.addListener(() => {
  schedule();
  checkUpdate();
});
chrome.runtime.onStartup.addListener(() => {
  schedule();
  checkUpdate();
});
chrome.alarms.onAlarm.addListener((a) => {
  if (a.name === "update-check") checkUpdate();
});
/* The switch turned on asks at once; turned off clears the badge. */
chrome.storage.onChanged.addListener((c, area) => {
  if (area === "sync" && c.updates) checkUpdate();
});
chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type !== "update-check" || sender.tab) return;
  checkUpdate().then(reply);
  return true;
});

/* ---------- store pages meta.com does not draw ----------
   store.js runs on meta.com's /experiences/ pages. When meta.com says
   an app is not available (or leaves the page blank) it asks here for the app,
   and this reads it the way the Meta Horizon phone app does: the app's product-page query
   (OCProductDetailSurfaceQuery, out of the phone app's JS bundle), asked of each
   headset's store in turn — the store only answers for the headsets an app is
   sold for, and a page for the wrong one is what meta.com leaves blank. The
   request goes to Meta's own API with the oc_www_at token meta.com itself is
   signed in with; nothing goes anywhere else. */
const GRAPHQL = "https://graph.oculus.com/graphql";
const PDP_DOC_ID = "28952468254442061";
/* meta.com's own app-page query: the large hero, screenshots and trailer still. */
const PAGE_DOC_ID = "27653348084360166";

const HMD_LABEL = {
  EUREKA: "Quest 3", PANTHER: "Quest 3S", HOLLYWOOD: "Quest 2", SEACLIFF: "Quest Pro",
  MONTEREY: "Quest", LOMA: "VR Glasses", RIFT: "Rift", LAGUNA: "Rift S", PACIFIC: "Go",
};
const QUEST = ["EUREKA", "PANTHER", "HOLLYWOOD", "SEACLIFF", "MONTEREY", "LOMA"];
const PC = ["RIFT", "LAGUNA"];
/* The store the page's address names first, then the rest: an app linked under
   the wrong store's path is one more page that never draws. */
const HMD_ORDER = {
  quest: [...QUEST, ...PC, "PACIFIC"],
  pcvr: [...PC, ...QUEST, "PACIFIC"],
  go: ["PACIFIC", ...QUEST, ...PC],
};

/* Replies with @defer/@stream arrive as several JSON objects back to back; each
   later one names where it goes (`path`). Put back together into one. */
function parts(text) {
  const out = [];
  let depth = 0, start = -1, inString = false, escaped = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === "{") {
      if (depth++ === 0) start = i;
    } else if (c === "}" && --depth === 0 && start >= 0) {
      try {
        out.push(JSON.parse(text.slice(start, i + 1)));
      } catch {
        return out;
      }
      start = -1;
    }
  }
  return out;
}

function stitch(text) {
  const all = parts(text);
  const root = all.find((p) => p.data || p.errors || p.error) ?? null;
  if (!root?.data) return root;
  for (const p of all) {
    if (p === root || !Array.isArray(p.path)) continue;
    if (Array.isArray(p.items)) {
      let list = root.data;
      for (const step of p.path.slice(0, -1)) list = list?.[step];
      const at = p.path[p.path.length - 1];
      if (Array.isArray(list) && Number.isInteger(at)) list.splice(at, p.items.length, ...p.items);
      continue;
    }
    if (!p.data) continue;
    let node = root.data;
    for (const step of p.path) node = node?.[step];
    if (node && typeof node === "object") Object.assign(node, p.data);
  }
  return root;
}

async function graphql(docId, name, variables, token) {
  const res = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      access_token: token,
      doc_id: docId,
      fb_api_req_friendly_name: name,
      variables: JSON.stringify(variables),
    }),
  });
  const json = stitch(await res.text());
  if (!json) throw new Error(`the store answered ${res.status} with something that is not JSON`);
  return json;
}

/* The phone app's product-page variables, as its product-page route fills them
   (OCProductDetailRoute's preload). Two are fixed values in the app and the
   store refuses the query without them ("missing_required_variable_value"):
   the library window is -1 (any time) and the Meta Store catalog is
   517700695939066. No headset is paired here, so the serials the app leaves
   out when it has none are left out too, and so are the referral and UTM
   values it only sends when a link carried them. */
const pdpVariables = (appID, hmdType) => ({
  appID,
  hmdType,
  encode: "JPEG",
  LIBRARY_INFO_LAST_ACTIVE_WINDOW: -1,
  SELECTED_DEVICE_SERIAL: null,
  metaStoreCatalogID: "517700695939066",
  shouldShowNewPostPurchaseCTAs: false,
  shouldRenderRelatedItemsSubsection: false,
  shouldShowUninstallAction: false,
  __relay_internal__pv__loggingPriceTyperelayprovider: false,
  __relay_internal__pv__showPremiumBundlerelayprovider: false,
  __relay_internal__pv__showPreOrderBundlerelayprovider: false,
  __relay_internal__pv__showExclusiveIapForBundlesrelayprovider: false,
  __relay_internal__pv__horizonPlusBadgerelayprovider: false,
  __relay_internal__pv__shouldEnableMetaCreditrelayprovider: false,
});

const gb = (bytes) => (Number(bytes) ? `${(Number(bytes) / 1024 ** 3).toFixed(2)} GB` : null);
const words = (s) => String(s).toLowerCase().replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
const PLAYER_MODES = { SITTING: "Sitting", STANDING: "Standing", ROOM_SCALE: "Roomscale" };
const names = (list) => (Array.isArray(list) ? list.map((x) => (typeof x === "string" ? x : x?.name)).filter(Boolean) : []);

/** The product-page item, as the plain fields store.js draws. */
function storeItem(it, hmdType) {
  const offer = it.current_offer ?? {};
  const bin = it.latest_supported_binary ?? {};
  const released = it.release_info?.display_date
    ?? (it.release_date ? new Date(it.release_date * 1000).toISOString().slice(0, 10) : null);
  return {
    id: String(it.id),
    name: it.display_name ?? String(it.id),
    short: it.display_short_description ?? null,
    long: it.display_long_description ?? null,
    markdown: Boolean(it.long_description_uses_markdown),
    publisher: it.publisher_name ?? null,
    developer: it.developer_name && it.developer_name !== it.publisher_name ? it.developer_name : null,
    category: it.category_name ?? null,
    genres: it.genre_names_ranked ?? it.genre_names ?? [],
    rating: it.quality_rating_i18n_score_string ?? null,
    ratingCount: it.quality_rating_i18n_count_string && it.quality_rating_i18n_count_string !== "0" ? it.quality_rating_i18n_count_string : null,
    comfort: it.comfort_rating_name ?? (it.comfort_rating ? words(it.comfort_rating) : null),
    modes: it.user_interaction_mode_names ?? [],
    playerModes: (it.supported_player_modes ?? []).map((m) => PLAYER_MODES[m] ?? words(m)),
    controllers: names(it.supported_input_devices_list),
    platforms: it.supported_platforms_i18n ?? [],
    languages: names(it.supported_in_app_languages),
    internet: it.internet_connection_name ?? null,
    website: it.website_url ?? null,
    privacyUrl: it.developer_privacy_policy_url ?? null,
    termsUrl: it.developer_terms_of_service_url ?? null,
    version: bin.version ?? null,
    size: gb(bin.total_installed_space),
    released,
    ageImage: it.content_rating?.ageRatingImage?.uri ?? null,
    ageText: it.content_rating?.age_rating_text ?? null,
    price: it.price_or_status_display?.text || offer.price?.formatted || null,
    was: offer.strikethrough_price?.formatted ?? null,
    free: Boolean(it.is_free) || offer.price?.offset_amount === "0",
    owned: Boolean(it.is_viewer_entitled),
    preorder: Boolean(it.is_preorder),
    comingSoon: Boolean(it.is_coming_soon),
    landscape: it.coverLandscape?.uri ?? it.flag_app_img?.uri ?? null,
    square: it.coverSquare?.uri ?? null,
    screenshots: (it.screenshotsHighRes ?? it.screenshots ?? []).map((s) => s?.uri).filter(Boolean),
    trailer: it.video_trailer?.uri ?? null,
    hero: null,
    hmd: hmdType,
    hmdLabel: HMD_LABEL[hmdType] ?? hmdType,
    kind: PC.includes(hmdType) ? "pcvr" : hmdType === "PACIFIC" ? "go" : "quest",
  };
}

async function storePage(id, kind) {
  /* The phone app's query is refused to a signed-out request ("Unauthorized
     logged out query"), so without a login nothing is asked. */
  const { token } = await readTokens();
  if (!token) return { error: "Log in to Meta to see this app.", login: true };

  let found = null;
  let refusal = null;
  for (const hmdType of HMD_ORDER[kind] ?? HMD_ORDER.quest) {
    try {
      const json = await graphql(PDP_DOC_ID, "OCProductDetailSurfaceQuery", pdpVariables(id, hmdType), token);
      const it = json?.data?.item;
      if (it?.display_name) {
        found = storeItem(it, hmdType);
        break;
      }
      refusal ??= json?.errors?.[0]?.message ?? json?.error?.message ?? null;
    } catch (err) {
      refusal ??= err.message;
    }
  }
  if (!found) {
    return {
      error: refusal
        ? `The store would not show this app on any headset (${refusal}).`
        : "The store has no listing for this app on any headset — it may be unpublished or removed.",
      login: /log(ged)? ?in|auth|token|session/i.test(refusal ?? ""),
    };
  }

  /* The bigger artwork, from meta.com's own page query for the headset that
     answered. A miss here only leaves the smaller pictures. */
  try {
    const page = (await graphql(PAGE_DOC_ID, "AppPage", { itemId: id, hmdType: found.hmd }, token))?.data?.app_store_item;
    if (page) {
      found.hero = page.hero_image?.uri ?? null;
      const big = (page.screenshots ?? []).map((s) => s?.uri).filter(Boolean);
      if (big.length) found.screenshots = big;
      found.trailer ??= page.trailer?.uri ?? null;
    }
  } catch {}

  return { item: found };
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type !== "store-item" || !sender.tab || !/^https:\/\/www\.meta\.com\//.test(sender.url ?? "")) return;
  if (!/^\d{6,}$/.test(String(msg.id))) return reply({ error: "That is not an app ID." });
  storePage(String(msg.id), msg.kind).then(reply, (err) => reply({ error: err.message || "Could not read this app." }));
  return true;
});

/* ---------- FRL profile token: the Meta Horizon native-SSO flow ----------
   Mints the app-scoped FRL token the Meta Horizon app uses:
   webview_tokens_query -> native_sso confirm/approved -> webview_blobs_decrypt ->
   xfr_create_profile_token. Minted alongside the sign-in tokens, and the MetaDB
   tab can also ask for it on its own. Values recovered from com.oculus.twilight.

   The graph steps (tokens_query, blobs_decrypt, graphql) are token-authed and run in
   this worker. The native_sso confirm/approved step needs the meta.com session AND a
   same-origin request: Meta's approval rejects a foreign Origin (error 1357004), and
   the browser won't attach the SameSite session cookies to a worker's cross-site fetch,
   so confirm comes back logged out. Running it in a brief background tab on auth.meta.com
   sidesteps both — the page sends its own cookies and Origin. (A worker-only path via
   declarativeNetRequest header rewriting works in plain Chromium but not reliably in
   Brave, so the one tab stays.) */
const FRL_CLIENT_TOKEN = "FRL|512466987071624|01d4a1f7fd0682aea7ee8ae987704d63";
const FRL_NATIVE_APP_ID = "512466987071624";
const FRL_PROFILE_APP_ID = 826037204154824; // the profile the combined-token mutations accept
const FRL_CREATE_DOC_ID = "5787825127910775";

/* The three steps. Each takes a plain args object and returns a result or { error }.
   They must stay self-contained (no outside references) so step2 can be serialized by
   chrome.scripting.executeScript to run inside the auth.meta.com tab. */
async function frlStep1(a) { // graph origin: client token -> native-SSO etoken
  try {
    const r = await fetch("https://meta.graph.meta.com/webview_tokens_query", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({ access_token: a.client }),
    });
    const j = await r.json();
    return { etoken: j.native_sso_etoken, reqtoken: j.native_sso_token };
  } catch (e) { return { error: "webview_tokens_query: " + e.message }; }
}
async function frlStep2(a) { // auth origin: confirm, then approve with dtsg + jazoest + lsd
  const form = (o) => new URLSearchParams(o);
  const scrape = (html, term) => {
    const m = html.match(new RegExp('"' + term + '"\\s*,\\s*\\[\\]\\s*,\\s*\\{"token":"([^"]+)"'))
           || html.match(new RegExp('"' + term + '"[\\s\\S]{0,40}?"token":"([^"]+)"'));
    return m ? m[1] : null;
  };
  try {
    const confirmUrl = "https://auth.meta.com/native_sso/confirm?" + form({ native_app_id: a.native, native_sso_etoken: a.etoken, utm_source: "skyline_splash" });
    const html = await (await fetch(confirmUrl, { credentials: "include" })).text();
    const dtsg = scrape(html, "DTSGInitialData"), lsd = scrape(html, "LSD");
    if (!dtsg || !lsd) return { error: "not signed in to Meta in this browser (no dtsg/lsd)" };
    // jazoest = "2" + sum of the dtsg char codes; Meta's CSRF layer wants it with fb_dtsg.
    const jazoest = "2" + [...dtsg].reduce((s, c) => s + c.charCodeAt(0), 0);
    const body = { __a: "1", fb_dtsg: dtsg, jazoest, lsd, native_app_id: a.native, native_sso_etoken: a.etoken };
    if (a.kabob) body.access_token = a.kabob;
    const r = await fetch("https://auth.meta.com/api/native_sso/approved/", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "x-fb-lsd": lsd },
      body: form(body),
    });
    const bt = await r.text();
    const blob = new URL(JSON.parse(bt.replace("for (;;);", "")).payload.uri).searchParams.get("blob");
    return blob ? { blob } : { error: "native_sso/approved: " + bt.slice(0, 200) };
  } catch (e) { return { error: "native_sso/approved: " + e.message }; }
}
async function frlStep3(a) { // graph origin: decrypt blob, then mint the profile token
  const form = (o) => new URLSearchParams(o);
  const opt = (b) => ({ method: "POST", credentials: "include", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: b });
  try {
    let j = await (await fetch("https://meta.graph.meta.com/webview_blobs_decrypt", opt(form({ access_token: a.client, blob: a.blob, request_token: a.reqtoken })))).json();
    const first = j.access_token;
    if (!first) return { error: "webview_blobs_decrypt: " + JSON.stringify(j).slice(0, 180) };
    j = await (await fetch("https://meta.graph.meta.com/graphql", opt(form({ doc_id: a.doc, variables: JSON.stringify({ app_id: a.appId }), access_token: first })))).json();
    const tkn = j?.data?.xfr_create_profile_token?.profile_tokens?.[0]?.access_token;
    return tkn ? { frlToken: tkn } : { error: "xfr_create_profile_token: " + JSON.stringify(j).slice(0, 180) };
  } catch (e) { return { error: "blobs_decrypt/create: " + e.message }; }
}

// Open a background tab on `url`, run `func(args)` in its page (MAIN world) so its
// fetches are same-origin and carry the page's own Meta cookies + Origin, return the
// result, and close the tab. active:false keeps it in the background (no focus steal).
async function frlRunInTab(url, func, args) {
  const tab = await chrome.tabs.create({ url, active: false });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { cleanup(); reject(new Error("timed out loading " + new URL(url).host)); }, 30000);
      const onUpdated = (id, info) => { if (id === tab.id && info.status === "complete") { cleanup(); resolve(); } };
      const onRemoved = (id) => { if (id === tab.id) { cleanup(); reject(new Error("tab closed")); } };
      function cleanup() { clearTimeout(timer); chrome.tabs.onUpdated.removeListener(onUpdated); chrome.tabs.onRemoved.removeListener(onRemoved); }
      chrome.tabs.onUpdated.addListener(onUpdated);
      chrome.tabs.onRemoved.addListener(onRemoved);
    });
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, world: "MAIN", func, args: [args] });
    return result;
  } finally {
    chrome.tabs.remove(tab.id).catch(() => {});
  }
}

// A dead meta.com session (password change, or Meta security) shows up mid-flow as
// "The session has been invalidated…" / "Error validating access token" (code 190).
// No token can be minted from a dead session, so say plainly what to do rather than
// surfacing Meta's raw text.
function frlSessionDead(msg) {
  return /session has been invalidated|validating access token|\(#?190\)|\bcode"?:?\s*190\b/i.test(msg || "");
}

// Graph steps run here in the worker (token-authed, no cookies needed). The login-gated
// confirm/approved step runs in a brief background auth.meta.com tab so it carries the
// page's own cookies and Origin — the only reliable way in Brave. Logs each step.
async function getFrlToken(kabob) {
  try {
    return await frlMint(kabob);
  } catch (e) {
    if (frlSessionDead(e.message)) {
      throw new Error("Your meta.com login has been invalidated (a password change, or Meta ended the session for security). Open meta.com, sign out and sign back in, then try again.");
    }
    throw e;
  }
}

async function frlMint(kabob) {
  const s1 = await frlStep1({ client: FRL_CLIENT_TOKEN });
  console.log("[FRL] step1 tokens_query:", s1.etoken ? "ok" : JSON.stringify(s1).slice(0, 300));
  if (s1.error || !s1.etoken) throw new Error("step1 " + (s1.error || "no etoken"));

  const s2 = await frlRunInTab("https://auth.meta.com/language", frlStep2,
    { native: FRL_NATIVE_APP_ID, etoken: s1.etoken, kabob: kabob || "" });
  console.log("[FRL] step2 confirm+approved:", s2.blob ? "ok (got blob)" : JSON.stringify(s2).slice(0, 300));
  if (s2.error || !s2.blob) {
    if (/no dtsg\/lsd/.test(s2.error || "")) {
      throw new Error("not logged in to meta.com — open https://www.meta.com in this browser and sign in there (separate from the Oculus sign-in), then press Refresh tokens");
    }
    throw new Error("step2 " + (s2.error || "no blob"));
  }

  const s3 = await frlStep3({ client: FRL_CLIENT_TOKEN, blob: s2.blob, reqtoken: s1.reqtoken, doc: FRL_CREATE_DOC_ID, appId: FRL_PROFILE_APP_ID });
  console.log("[FRL] step3 decrypt+create:", s3.frlToken ? "ok (got token)" : JSON.stringify(s3).slice(0, 300));
  if (s3.error || !s3.frlToken) throw new Error("step3 " + (s3.error || "no token"));
  return s3.frlToken;
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type !== "frl-token" || !sender.tab) return;
  getFrlToken(msg.token).then((frlToken) => reply({ type: "frl-token", frlToken }), (err) => reply({ type: "error", message: err.message }));
  return true;
});
