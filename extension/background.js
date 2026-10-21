/* MetaDB Sign-in: the one part that can read Meta's cookies.

   oc_www_at and oc_ac_at are cookies on Meta's own domains, which no web page
   but Meta's can read. This worker reads them, and only ever hands them to a
   MetaDB tab that asked (content.js runs on MetaDB's pages and nowhere else).
   Nothing is sent anywhere: the tokens go from the browser's cookie jar to the
   MetaDB tab, which keeps them in its own settings, as if they were pasted. */

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
  try {
    await chrome.tabs.sendMessage(p.tab, { type: "tokens", ...tokens });
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
    if (tokens.token && tokens.acToken) return reply({ type: "tokens", ...tokens });
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
